/**
 * KepcoBranchOfficeInfomationManagementGrid2.js
 * 한전지사정보관리 DataGrid정의 New Sample
 *
 * @author 김윤진
 * @date 2016. 8. 09. 오후 3:50:00
 * @version 1.0
 */
var KepcoGrid = (function($, Tango, _){
	var options = {};
	
	function renderFlag(value, data, mapping){
		var val = '';
		
		if (data._state.added) {
			val = 'A';
		}else{
			if (data._state.deleted) {
				val = 'D';
			}else if (data._state.edited) {
				val = 'U';
			}
		}
		
		return val;
	}
	
	function allowEditKepcoCd(value, data, mapping){
		if (data._state.added) {
			return true;
		}
		return false;
	}
	
	// 한전지사별 협력업체 정보 Grid option
	options.defineBusinessPartnerGrid = {
		rowClickSelect : false,
		cellInlineEdit: true,
		cellSelectable: true,
		autoColumnIndex: true,
		fullCompareForEditedState:true,
				
		defaultColumnMapping:{
			defaultValue : '',
			align : 'left',
			sorting: false
		},
				
		renderRuleOption : {
	        "valueKey" : "codeId",
	        "textKey" : "codeName"
	    },
	    
		columnMapping: [
	        {key : 'flag', width :'10px', align : 'center', editable:false, render: renderFlag, hidden : true}, 
	        {key : 'kepboCd', width :'100px', title : '<em class="color_red">*</em>' + '지점코드'
	        	, align : 'center'
        		,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "4"}
		               , styleclass : 'num_editing-in-grid'}
	        	, allowEdit: allowEditKepcoCd},
	        	{key : 'kephdCd',width :'100px', title : '한전본부코드', hidden : true},
			{key : 'kephdNm', width :'100px',title : '<em class="color_red">*</em>' + '한전본부', allowPaste : false},
			{key : 'kepboNm', width :'100px',title : '<em class="color_red">*</em>' + '한전지사'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "25"}}
				, allowPaste : false},
				{key : 'mgmtOrgId', width :'100px',title : '한전본부코드', hidden : true},
			{key : 'mgmtTeamOrgNm', width :'100px',title : '<em class="color_red">*</em>' + '한전본부', allowPaste : false},
			{key : 'frstRegDate', width :'100px',title : '등록일자'},
			{key : 'frstRegUserNm', width :'100px',title : '등록자'},
			{key : 'lastChgDate', width :'100px',title : '수정일자'},
			{key : 'lastChgUserNm', width :'100px',title : '수정자'}
		]
	};
	
	
	//한전 지사별 건설담당자 Grid option
	options.defineBuildChargerGrid =  {		
		rowClickSelect : false,
		rowSingleSelect : false,
		cellInlineEdit: true,
		cellSelectable: true,
		autoColumnIndex: true,
		fullCompareForEditedState:true,

		defaultColumnMapping:{
			defaultValue : '',
			align : 'left',
			sorting: false
		},
		
		renderRuleOption : {
	        "valueKey" : "codeId",
	        "textKey" : "codeName"
	    },
			
		columnMapping: [
	        {key : 'check', width : '40px', align : 'center', selectorColumn : true},
	        {key : 'flag', width : '20px', align : 'center', editable:false, render : renderFlag, hidden : true},
	        {key : 'kepboCd', width : '70px', title : '<em class="color_red">*</em>' + '지점코드'
	        	, align : 'center'
	        	, allowEdit: allowEditKepcoCd
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "4"}
		               , styleclass : 'num_editing-in-grid'}
	        },
				{key : 'kephdCd', width : '100px', title : '한전본부코드', hidden : true},
			{key : 'kephdNm', width :'200px',title : '<em class="color_red">*</em>' + '한전본부', allowPaste : false},
			{key : 'kepboNm', width : '150px', title : '<em class="color_red">*</em>' + '한전지사'
				, editable : {  type: 'text'
						, attr : {"maxlength" : "25"}}
				, allowPaste : false},
				{key : 'mgmtOrgId', width : '140px', title : '관리본부', hidden:true},
			{key : 'mgmtTeamOrgNm', width : '200px', title : '<em class="color_red">*</em>' + '관리본부', allowPaste : false},
				{key : 'bpId', width : '160px', title : '시공업체', hidden:true
					, render : function(value, data) {
						if(nullToEmpty(value) == ""){
							return (nullToEmpty(data.bpId) == "") ? "" : data.bpId;
						}else{  
							return value;
						}
					}
				},
			{key : 'bpNm', width : '200px', title : '시공업체', allowPaste : false
					,render : function(value, data) {
						var celStr = "";
						if(nullToEmpty(value) == ""){
							celStr = (nullToEmpty(data.bpNm) == "") ? "" : data.bpNm;
						}else{  
							celStr = value;
						}
						celStr =  '<div style="width:100%"><button class="grid_search_icon Valign-md" id="btnBpIdGridSch" type="button"></button><span class="Valign-md">' + celStr +'</span>';
						
						if(nullToEmpty(data.bpNm) != ""){
							celStr +=  '<button class="cursor_p Valign-md" id="btnBpIdInit" type="button">X</button>';
						}
						
						celStr += '</div>';  
						
						return celStr;
					}
			
			
			},
			{key : 'skBuldBrnchZpcd', width : '75px', title : '우편번호'
				, editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "6"}
		               , styleclass : 'num_editing-in-grid'}
			},
			{key : 'skBuldBrnchAddr', width : '220px', title : '주소', width : '300px', editable : true},
			{key : 'skBuldBrnchRepTlno', width :'150px',title : '대표 전화번호'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "20"}
		               , styleclass : 'num_editing-in-grid'}
			},
			{key : 'skBuldBrnchRepFaxno', width :'100px',title : '대표 FAX번호'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "20"}
		               , styleclass : 'num_editing-in-grid'}
			},
			{key : 'skBuldChrrNm', width :'100px',title : '건설담당자'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "10"}}
				, allowPaste : false},
			{key : 'skBuldChrrTlno', width :'150px',title : '건설담당자 전화번호'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "20"}
		               , styleclass : 'num_editing-in-grid'}
			},
			{key : 'managerId', width :'100px',title : '담당매니저 ID'
				, editable : {  type: 'text'
			           , attr : {"maxlength" : "20"}}
				, allowPaste : false},
			{key : 'managerNm', width :'100px',title : '담당 매니저명'
				, editable : false
			},
			{key : 'frstRegDate', width :'100px',title : '입력일자'},
			{key : 'frstRegUserNm', width :'100px',title : '입력자'},
			{key : 'lastChgDate', width :'100px',title : '수정일자'},
			{key : 'lastChgUserNm', width :'100px',title : '수정자'}
		]
	};
	
	return options;
}(jQuery, Tango, _));
