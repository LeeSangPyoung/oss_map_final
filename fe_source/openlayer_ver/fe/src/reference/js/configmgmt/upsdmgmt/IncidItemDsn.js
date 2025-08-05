/**
 * IncidItemDsn.js
 *
 * @author Administrator
 * @date 2017. 9. 20.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'incidItemDsnGrid';
	var paramData = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setSelectCode();
    	initGrid();
        setEventListener();
        main.setGrid();
    };

	//Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 750,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup: [
    			{fromIndex:6, toIndex:9, title:'수요'}
    			,{fromIndex:10, toIndex:14, title:'사업반영'}
    		],
    		paging : {
    			pagerTotal: false,
        	},
    		rowInlineEdit: true,
    		rowOption: {
    			styleclass : function(data, rowOption){
    				if(data._state.edited){
    					return 'row-highlight'
    				}
	    		}
    		},
    		columnMapping: [{
				align:'center',
				width: '50',
				numberingColumn: true
    		}, {
				key : 'categoryNm', align:'center',
				title : '품명',
				width: '70'
			}, {
				key : 'itemNm', align : 'center',
				title : 'Item명',
				width : '200'
			},{
				key : 'itemCd', align : 'center',
				title : 'Item Code',
				width : '100'
			}, {
				key : 'qtyJo', align : 'center',
				title : '수량/조',
				width : '50'
			}, {
				key : 'qty', align : 'center',
				title : '수량',
				width : '50'
			}, {
				key : 'chargeInventoryQty', align : 'center',
				title : '재고',
				width : '70',
				editable : true,
				valid : function(value, data) {
					if(/[a-zA-Z]+/.test(value)) {
						return false;
					}
					return true;
				},
				defaultValue: ""
			}, {
				key : 'chargeQty', align : 'center',
				title : '신규',
				width : '70',
				editable : true,
				valid : function(value, data) {
					if(/[a-zA-Z]+/.test(value)) {
						return false;
					}
					return true;
				},
				defaultValue: ""
			}, {
				key : 'chargePrice', align : 'center',
				title : '물자비',
				width : '70'
			}, {
				key : 'chargeConstructPrice', align : 'center',
				title : '공사비',
				width : '70'
			}, {
				key : 'planInventoryQty', align : 'center',
				title : '재고',
				width : '70'
			}, {
				key : 'planQty', align : 'center',
				title : '신규',
				width : '70'
			}, {
				key : 'planPrice', align : 'center',
				title : '물자비',
				width : '70'
			}, {
				key : 'planConstructPrice', align : 'center',
				title : '공사비',
				width : '70'
			},],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	var searchFloorId = {supCd : paramData.sisulCd};
    	$('#childSisulCd').val(paramData.childSisulCd);
    	$('#affairNm').val(paramData.affairNm);
		//층 구분 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/floorId', searchFloorId, 'GET', 'searchFloorID');

    }

    function setEventListener() {
    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid();
         });

    	//엔터키로 조회
//         $('#searchForm').on('keydown', function(e){
//     		if (e.which == 13  ){
//     			main.setGrid();
//       		}
//     	 });

         $('#'+gridId).on("rowInlineEditEnd", function(e){
        	 var evObj = AlopexGrid.parseEvent(e).data;

        	 var chrgPrc = null;
        	 var chrgCnstPrc = null;
        	 if(evObj._state.edited && ((evObj.chargeQty != evObj._original.chargeQty) || (evObj.chargeInventoryQty != evObj._original.chargeInventoryQty))) {
        		 var chrgQty = replaceNaVal(evObj.chargeQty);
            	 var chrgInveQty = replaceNaVal(evObj.chargeInventoryQty);

        		 var chrgPrc = eval(chrgQty) * eval(evObj.realPriceCellNum);
            	 var chrgCnstPrc = (eval(chrgQty) + eval(chrgInveQty)) * eval(evObj.constructPriceCellNum);
            	 $('#'+gridId).alopexGrid("dataEdit", {chargePrice: chrgPrc, chargeConstructPrice: chrgCnstPrc}, {_index: {data: (evObj.num)-1}});
        	 } else {

        		 $('#'+gridId).alopexGrid("dataEdit", {chargePrice: evObj._original.chargePrice, chargeConstructPrice: evObj._original.chargeConstructPrice}, {_index: {data: (evObj.num)-1}});
        		 $('#'+gridId).alopexGrid("dataEdit", {_state: {edited: false}}, {_index: {data: (evObj.num)-1}});
        	 }
         });

         $('#'+gridId).on("cellEditInvalid", function(e){
        	 callMsgBox('','I', '숫자 입력만 가능합니다.', function(msgId, msgRst){});
         });
    	//저장
    	 $('#btnReg').on('click', function(e) {
    		var param = $('#'+gridId).alopexGrid("dataGet", {_state : {edited : true }});
    		if (param.length == 0) {
    			//필수 선택 항목입니다.[ 지역본부 ]
    			callMsgBox('','I', '변경하신 지역수요 입력 내용이 없습니다.', function(msgId, msgRst){});
    			return;
    		}
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	ItemReg(param, paramData);
		        }
		     });
         });
	};

	function successCallback(response, status, jqxhr, flag){
		//본부 콤보박스
		if(flag == 'searchFloorID'){
			var option_data = [{cd: response[0].cd, cdNm: response[0].cdNm}];
    		for(var i=1; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}
    	//조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		var serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt		//총 데이터 길이
        	}
    	      		$('#'+gridId).alopexGrid('dataSet', response.incidItemDsnList, serverPageinfo);
    	}
    	if(flag == 'itemReg'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    			main.setGrid()
    		} else if( response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
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
    	$("#searchOrgPID").val(paramData.orgIdL1);
    	$("#searchOrgID").val(paramData.sisulCd);
    	if($("#searchFloorID").val() == '' || $("#searchFloorID").val() == null) {
    		var param =  $("#searchForm").serialize()+"&searchFloorID="+paramData.floorId;
    	} else {
    		var param =  $("#searchForm").serialize();
    	}

 		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getIncidItemDsnList', param, 'GET', 'search');
    }

    function replaceNaVal(orgVal) {
    	var returnVal;

    	if(orgVal == "" || orgVal == null) {
    		returnVal = 0;
    	} else {
    		returnVal = orgVal;
    	}
    	return returnVal;

    }

	function ItemReg(param, paramData){
		for(var i = 0; i<param.length; i++) {
		param[i].sisulCd = paramData.sisulCd;
		param[i].orgPId = paramData.orgIdL1;
		param[i].eqpYear = $("#searchYear").val();
		param[i].floorId = $("#searchFloorID").val()
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveIncidItemDsnList', AlopexGrid.trimData(param), 'POST', 'itemReg');
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