/**
 * DrawMstoFloor.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var drawUpsdLoadPop = $a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	initGrid();
        setEventListener();

        drawUpsdLoadPop.setGrid();
    };

    function initGrid() {
    	//그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 600,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [
    		{/* 본부 */
    			align:'center',
				key : 'orgIdNm',
				title : '본부',
				width: '100'
			}, {/* 국사코드 */
    			align:'center',
				key : 'sisulCd',
				title : '국사코드',
				width: '100'
			}, {/* 국사명 */
    			align:'center',
				key : 'sisulNm',
				title : '국사명',
				width: '100'
			}, {/* 층명 */
    			align:'center',
				key : 'floorLabel',
				title : '층명',
				width: '100'
			}, {/* 층구분 */
    			align:'center',
				key : 'floorName',
				title : '층구분',
				width: '100'
			}, {/* 버전 */
    			align:'center',
				key : 'version',
				title : '버전',
				width: '100'
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
    	var hideColList = ['version'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	};

    function setSelectCode() {
    	//본부
    	var searchOrgName = {supCd : '007000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchOrgName, 'GET', 'searchOrgName');

		//레이어 선택
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawUpsdLayersList', '', 'GET', 'layerCheckBox');
    };

	function setEventListener() {
        // 조회
        $('#btnSearch').on('click', function(e) {
        	drawUpsdLoadPop.setGrid();
        });

        $('#btnSave').on('click', function(e) {
        	var dataObj = null;
        	var layerArr = [];
     		dataObj = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}})[0];
    		$('#layerCheckBox').find('input:checked').each(function(){
    			layerArr.push(this.value);
    		});
    		dataObj.layerId = layerArr;
     		if(dataObj != undefined) {
     			$a.close(dataObj);
        	} else {
     			callMsgBox('','I', '층을 선택하세요' , function(msgId, msgRst){});
     		}
        });

        //취소
        $('#btnCncl').on('click', function(e) {
        	$a.close();
        });
	};

	function successCallback(response, status, jqxhr, flag){
		//본부 콤보박스
		if(flag == 'searchOrgName'){
			var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}
		// 레이어 선택
		if(flag == 'layerCheckBox'){
			var arr = response.drawUpsdLayersList;
			var str = '';
			for(var i=0; i < arr.length; i++) {
				if(i == 0) {
					str = '<div class="checkLabel"><label><input type="checkbox" id="layerId'+ i +'" name="layerId" value="'+ arr[i].layerId +'" checked disabled class="Checkbox"> <span style="vertical-align: middle;">'+ arr[i].layerName +'</span></label></div>';
				} else {
					str += '<div class="checkLabel"><label><input type="checkbox" id="layerId'+ i +'" name="layerId" value="'+ arr[i].layerId +'" class="Checkbox"> <span style="vertical-align: middle;">'+ arr[i].layerName +'</span></label></div>';
				}
			}
			$('#layerCheckBox').append(str);
		}

    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response.drawUpsdLoadList);
    	}
	};

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    };

    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    };

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

    this.setGrid = function(){
 		 var param = $("#drawform").serialize();

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawUpsdLoadList', param, 'GET', 'search');
    };

    function setSPGrid(GridID, Data) {
	     $('#'+GridID).alopexGrid('dataSet', Data);
	};

});