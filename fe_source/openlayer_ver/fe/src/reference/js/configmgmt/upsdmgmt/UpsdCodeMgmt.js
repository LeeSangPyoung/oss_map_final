/**
 * UpsdCodeMgmt.js
 *
 * @author Administrator
 * @date 2017. 10. 16.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var userId = '';
	var cdChk = true;
	var cnclVali = false;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
        main.setGrid(1,100);
    };

	//Grid 초기화
    function initGrid() {
		$('#'+gridId).alopexGrid({
			height: 700,
    		fitTableWidth : true,
    		autoResize : true,
    		autoColumnIndex: true,
    		rowSelectOption:{
    			clickSelect: true,
    			singleSelect: true,
    			disableSelectByKey: true
    		},
    		columnMapping : [
    			{
    				align : 'left',
    				key : 'name',
    				title : '코드명',
    				width : '150px',
    				treeColumn : true,
    				editable: {
    					type:'text',
    					attr: {style: 'width: 200px; min-width: 170px;'}
    				},
    				valid : function(value, data){
    					if(!cnclVali){
    						if(value == ''){
    							return false;
    						}
    					}
    				}
    			}, {
    				align : 'center',
    				key : 'cdId',
    				title : '코드',
    				width : '60px',
    				editable : true,
    				valid : function(value, data){
    					if(value == ''){
    						return false;
    					}else if(value != data.cdId && !cdChk){
    						return false;
    					}
    				}
    			}, {
    				align : 'center',
    				key : 'useYn',
    				title : '사용여부',
    				width : '40px',
    				editable: {
    					type:'select',
    					rule: [
    						{value:'Y', text:'Y'},
    						{value:'N', text:'N'}
    						],
    					attr: {style: 'width: 70px; min-width: 70px;'}
    				},
    			}, {
    				align : 'left',
    				key : 'cdDesc',
    				title : '설명',
    				width : '150px',
    				editable : true
    			}, {
    				align : 'center',
    				key : 'rgstrId',
    				title : '등록자',
    				width : '50px'
    			}, {
    				align : 'center',
    				key : 'rgstDtm',
    				title : '등록일시',
    				width : '100px'
    			}, {
    				align : 'center',
    				key : 'chgrId',
    				title : '변경자',
    				width : '50px'
    			}, {
    				align : 'center',
    				key : 'chgDtm',
    				title : '변경일시',
    				width : '100px'
    			}
    			],
    			tree:{
    				useTree : true,
    				idKey : 'id',
    				parentIdKey : 'parentId',
    				expandedKey : 'expandedKey'
    			},
    		message: {
    			nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
    	});

	}

    function setEventListener() {

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid();
         });

/*    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid();
       		}
     	 });
*/
    	//등록
    	 $('#btnSave').on('click', function(e) {
    		var vail = $('#'+gridId).alopexGrid('dataGet', {_state : {editing: true, added:true}});
			if(vail.length > 0){
				var curId = AlopexGrid.currentData(vail[0]).cdId;
				codeIdChk(curId)
			}else{
				$('#'+gridId).alopexGrid('endEdit');
			}
			vail = $('#'+gridId).alopexGrid('dataGet', {_state : {editing: true}});
			if(vail.length <= 0){
				var param = $('#'+gridId).alopexGrid("dataGet", {_state : {edited : true }});
	         	if (param.length <= 0) {
	         		//필수 선택 항목입니다.[ 지역본부 ]
	         		callMsgBox('','W', '변경하신 코드가 없습니다.', function(msgId, msgRst){});
	         		return;
	         	}
	         	callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
	         		//저장한다고 하였을 경우
	         		if (msgRst == 'Y') {
	         			codeSave(param);30
	         		}
	         	});
			}
         });

         // 취소
         $('#btnCncl').on('click', function(e){
        	 cnclVali = true;
        	 callMsgBox('','C', '변경 사항을 취소하시겠습니까?', function(msgId, msgRst){
        		 if (msgRst == 'Y') {
        			 $('#'+gridId).alopexGrid('dataDelete', {_state: {added: true}});
        			 $('#'+gridId).alopexGrid('endEdit');
        			 $('#'+gridId).alopexGrid('dataRestore');
        			 cnclVali = false;
        		 }
        	 });
         });

         //추가
         $('#btnAdd').on('click', function(e){
        	 var selData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}},{_state: {editing:true}})[0];
        	 if(selData == null) {
        		 callMsgBox('','I', '추가할 코드의 부모코드를 선택해 주세요.', function(msgId, msgRst){});
        		 return;
        	 }
        	 var editingData = AlopexGrid.currentData($('#'+gridId).alopexGrid('dataGet', {_state: {editing: true, added: true}}));
        	 if(editingData.length > 0) {
        		 var chkId= editingData[0].cdId;
        		 if(chkId != ""){
        			 codeIdChk(chkId);
        		 }else{
        			 $('#'+gridId).alopexGrid('endEdit');
        		 }

        	 }else{
        		 $('#'+gridId).alopexGrid('endEdit');
        	 }
        	 editingData = AlopexGrid.currentData($('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}}));
        	 if(editingData.length <= 0){
        		 var curIdx = selData._index.data;
        		 $('#'+gridId).alopexGrid("dataAdd",$.extend({_state : {editing: true}},{"useYn": "Y", "supCd": selData.cdId}), {parentQuery : {_index:{data: curIdx}}});
        		 $('#'+gridId).alopexGrid('expandTreeNode', {_index:{data:curIdx}});
        		 $('#'+gridId).alopexGrid('rowSelect', {_state: {editing: true}}, true);
        	 }
         });

         //더블클릭시 편집모드
         $('#'+gridId).on('dblclick','.bodycell', function(e){
        	 var selData = AlopexGrid.parseEvent(e).data;
        	 $('#'+gridId).alopexGrid('startEdit', {_index: {row: selData._index.row}});
        	 if(!selData._state.added){
        		 $('#'+gridId).alopexGrid('endCellEdit',{_state: {editing: true}}, 'cdId');
        	 }

         });

  		//편집 종료시 코드 중복체크 여부 확인
          $('#'+gridId).on('click','.bodycell', function(e){
         	 var selData = AlopexGrid.parseEvent(e).data;
         	 var vail = $('#'+gridId).alopexGrid('dataGet', {_state : {editing: true}});
         	 if (vail.length > 0 && selData._index.data != vail[0]._index.data) {
         		 var chkId = AlopexGrid.currentData(vail[0]).cdId;
         		 if(chkId != vail[0].cdId){
             		 codeIdChk(chkId);
         		 }else{
         			$('#'+gridId).alopexGrid('endEdit');
         		 }
         	 }
          });

         //편집 종료시 유효성체크
         $('#'+gridId).on('cellEdit',function(e){
        	 var data = AlopexGrid.parseEvent(e).data;
        	 var mapping = AlopexGrid.parseEvent(e).mapping;
        	 var value = AlopexGrid.parseEvent(e).value;
        	 var prevValue = AlopexGrid.parseEvent(e).prevValue;
        	 if(!cnclVali){
        		 if(mapping.key == 'cdId'){
            		  if(value != prevValue&& !checked){
                		 if(!cdChk){
                			 codeIdChk(value);
                		 }else {
                			 return true;
                		 }

                	 }
            	 }
        	 }
         });
         $('#'+gridId).on('cellEditInvalid',function(e){
        	 var data = AlopexGrid.parseEvent(e).data;
        	 var mapping = AlopexGrid.parseEvent(e).mapping;
        	 var value = AlopexGrid.parseEvent(e).value;
        	 var prevValue = AlopexGrid.parseEvent(e).prevValue;
        	 if(mapping.key == 'name'){
    			 if(value == ''){
    				 callMsgBox('','W', makeArgConfigMsg('requiredOption', '코드명') , function(msgId, msgRst){});
            	 }
    		 }
        	 if(mapping.key == 'cdId'){
        		 if(value == ''){
        			 callMsgBox('','W', makeArgConfigMsg('requiredOption', '코드') , function(msgId, msgRst){});
        			 $('#'+gridId).alopexGrid('startEdit', {_index: {row: data._index.row}});
        		 }else if(!cdChk){
        			 callMsgBox('','W', '코드값이 중복되었습니다.', function(msgId, msgRst){});
        			 $('#'+gridId).alopexGrid('startEdit', {_index: {row: data._index.row}});
        			 cdChk = true;
        		 }
        	 }
         });

         //편집 데이터 status
         $('#'+gridId).on('cellEditEnd',function(e){
        	 var data = AlopexGrid.parseEvent(e).data;
        	 if(data._state.added){
        		 $('#'+gridId).alopexGrid("dataEdit", {status: 'I'}, {_index: {row: data._index.row}});
        	 }else if(data._state.edited){
        		 $('#'+gridId).alopexGrid("dataEdit", {status: 'U'}, {_index: {row: data._index.row}});
        	 }
         });
         $('#'+gridId).on('rowInlineEditEnd',function(e){
        	 var data = AlopexGrid.parseEvent(e).data;
        	 checked = false;
         });
    };

	function successCallback(response, status, jqxhr, flag){
    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response.codeList);
    	}
    	//코드중복 체크
    	if(flag == 'codeChk'){
    		if(response.codeIdChk > 0) {
    			cdChk = false;
    			$('#'+gridId).alopexGrid('endEdit');
    		} else {
    			cdChk = true;
    			$('#'+gridId).alopexGrid('endEdit');
    		}
    	}
    	//코드 등록
    	if(flag == 'codeSave'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    			main.setGrid()
    		}
    	}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    this.setGrid = function(){
 		 var param =  $("#searchForm").serialize();
 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCodeList', param, 'GET', 'search');
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
    var httpRequestAsync = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag,
    		async : false,
    	}).done(successCallback)
    	.fail(failCallback);
    }
    //저장
    function codeSave(param) {
    	for(var i = 0; i<param.length; i++) {
    		param[i].loginId = userId;
    		}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveCodeList', param, 'POST', 'codeSave');

    }
    function codeIdChk(chkCode){
    	if(chkCode != ""){
    		httpRequestAsync('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCodeIdChk', {cdId: chkCode}, 'GET', 'codeChk');
		}
		else{
			$('#'+gridId).alopexGrid('endEdit', {_state: {editing: true, added:true}});
		}
    }
    function setSPGrid(GridID, Data) {
	       	$('#'+GridID).alopexGrid('dataSet', Data);
	}

});