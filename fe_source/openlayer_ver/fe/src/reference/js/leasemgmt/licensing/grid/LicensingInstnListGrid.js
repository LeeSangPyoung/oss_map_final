/**
 * LicensingInstnListGrid.js
 * 인허가 기관 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 10. 04. 오후 15:15:00
 * @version 1.0
 */
//인허가 기관 조회 LicensingInstnList.jsp

function fieldCheck(data,lt){
	var reg = /^\w{8}$/;
	var reg1 = /^\w{0,10}$/;
	var reg2 = /^\w{0,20}$/;
	var reg3 = /^\w{1,50}$/;
	
	if(lt === 0){
		if(!reg.test(data))
			return false;
	}
	else if(lt === 1){
		if(!reg1.test(data))
			return false;
	}
	else if(lt === 2){
		if(!reg2.test(data))
			return false;
	}
	else if(lt === 3){
		if(!reg3.test(data))
			return false;
	}
	return true;
}

function validateCell(value, data, mapping, type){
		
		var rStr = '';
		
		if(mapping.key === 'mcpNm' || mapping.key === 'sggNm' || mapping.key === 'lcenInstnNm'){
			if (!fieldCheck(value,0)){
				if(type === 'tooltip'){
					rStr = '필수 입력항목입니다. ' + value;	
					return rStr; 
				}
				else if(type === 'bg'){
					rStr = '#FF0000'
				
					return rStr;
				}
			}
			else{
				if(type === 'bg')
					return '#FFFFFF';
				else if(type === 'tooltip')
					return value;
				}

		}
		return true;
	}

//flag 값 세팅
function renderFlag(value, data, mapping){
	var val = '';
	
	if (data._state.added) {
		val = 'I';
	}else{
		if (data._state.deleted) {
			val = 'D';
		}else if (data._state.edited) {
			val = 'U';
		}
	}
	
	return val;
}



var LicensingInstnListGrid = (function($, Tango, _){
	var options = {};
	//인허가 기관 관리
	options.defineDataGridInstnMgmt = {
		message: {
			nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noInquiryData'/></div>",
			filterNodata : 'No data'
		},
		
		columnMapping: [
		{key : 'check', align : 'center',
			selectorColumn : true, hidden : true,
			width : '30px'
		}, {
			key : 'flag', align:'center',
			title : 'flag', render: renderFlag,
			width: '80px',hidden : true
		}, {
			key : 'instnMgmtNo', align:'center',
			title : '관리번호',
			width: '80px'
		}, {
			key : 'mcpNm', align:'center',
			title : '시도', 
			width: '80px'
		}, {
			key : 'sggNm', align:'center',
			title : '구군', 
			width: '80px'							
		}, {
			key : 'lcenInstnNm', align:'center',
			title : '인허가기관명', 
			width: '150px'							
		}, {
			key : 'frstRegDate', align:'center',
			title : '입력일자',
			width: '80px'
		}, {
			key : 'frstRegUserId', align:'center',
			title : '입력자',
			width: '80px'
		},{
			key : 'lastChgDate', align:'center',
			title : '수정일자',
			width: '80px'
		},{
			key : 'lastChgUserId', align:'center',
			title : '수정자',
			width: '80px'
		}],
		paging:{
			pagerSelect:false
		}
	}
	
	//임차 관할부서 및 담당자 조회
	options.defineDataGridChrrMgmt = {
		defaultColumnMapping:{
			sorting: true
		},message: {
			nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noInquiryData'/></div>",
			filterNodata : 'No data'
		},
		columnMapping: [
		{key : 'check', align : 'center',
			selectorColumn : true, hidden : true,
			width : '30px'
		}, {
			key : 'instnMgmtNo', align:'center',
			title : '관리번호',
			width: '90px'
		}, {
			key : 'instnChrrSrno', align:'center',
			title : '순번',
			width: '90px'
		}, {
			key : 'lcenInstnDeptNm', align:'center',
			title : '관할부서',
			width: '90px'
		}, {
			key : 'lcenInstnChrrNm', align:'center',
			title : '담당자',
			width: '90px'
		}, {
			key : 'lcenInstnChrrTlno', align:'center',
			title : '전화번호',
			width: '150px'
		}, {
			key : 'lcenInstnUserRmk', align:'center',
			title : '비고',
			width: '150px'
		}, {
			key : 'frstRegDate', align:'center',
			title : '입력일자',
			width: '100px'
		}, {
			key : 'frstRegUserId', align:'center',
			title : '입력자',
			width: '100px'
		}, {
			key : 'lastChgDate', align:'center',
			title : '수정일자',
			width: '100px'
		}, {
			key : 'lastChgUserId', align:'center',
			title : '수정자',
			width: '100px'
		}]
	}
	return options;
	
}(jQuery, Tango, _));