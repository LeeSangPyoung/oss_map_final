/**
 * MtsoReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var paramData = null;
	this.init = function(id, param) {


    	setEventListener();
    	setSelectCode();
        initGrid();
        paramData = param;
        $('#sMtsoRegArea').setData(param);
        var data = {mtsoId : param.repMtsoId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsodistance', data, 'GET', 'distancecnt');
    }

	function setSelectCode() {
    	var param = {supCd : 'T10000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdHdofcCd'); // 본사 코드

		var option_data = [{cd: '', cdNm: '전체'}];
		$('#demdAreaCd').setData({ data : option_data, option_selected: '' });

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BLDMGMT', null, 'GET', 'bldMgmt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DNTNYN', null, 'GET', 'dntnYn');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/SLFCD', null, 'GET', 'slfCd');
    }

    function initGrid() {
        $('#'+gridId).alopexGrid({
			width : 'parent',
			height : '3row',
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : false,
			paging : {
				pagerTotal: false,
			},
			rowSelectOption : {
				clickSelect : true,
				singleSelect : true,
				disableSelectByKey : true
			},
			defaultColumnMapping : {
				resizing : true,
			},
			columnMapping : [
				{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
				{ key : 'mtsoDistance', align:'center', title : "거리", width: '50px'},
				{ key : 'tmofNm', align:'center', title : "전송실", width: '140px'},
				//{ key : 'mtsoId', align:'center', title : "국사ID", width: '110px'},
				{ key : 'mtsoNm', align:'left', title : "국사", width: '220px'},
				{ key : 'bldBlkNm', align:'center', title : "건물명", width: '100px'},
				{ key : 'bldblkNo', align:'center', title : "동", width: '50px'},
				{ key : 'bldFlorNo', align:'center', title : "층", width: '50px'},

				{ key : 'bldAddr', align:'left', title : "주소", width: '250px'},
				{ key : 'mtsoTyp', align:'center', title : "유형", width: '70px'},
				{ key : 'mtsoStat', align:'center', title : "상태", width: '50px'}
				//{ key : 'tnetEqpCnt', align:'center', title : "T망장비", width: '70px'},
				//{ key : 'anetEqpCnt', align:'center', title : "A망장비", width: '70px'}

				],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
		});

    }


    function setEventListener() {

    	$('#'+gridId).on('click', '.bodycell', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
     	 	var param = {mtsoId : dataObj.mtsoId}
            httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoMtsoInf', param, 'GET', 'roMtsoInf'); // 본사 코드
     	});

    	$('#btnCncl').on('click', function(e) {
      		 $a.close();
    	});
    	$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdAreaCd'); // 본사 코드
		});

    	$('#btnMtsoSearch').on('click', function(e) {
   		 $a.popup({
   	          	popid: 'MtsoLkup',
   	          	title: configMsgArray['findMtso'],
   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
//   	            data: {autoSearchYn : "Y"},
   	            windowpopup : true,
   	            modal: true,
                movable:true,
   	            width : 950,
   	           	height : window.innerHeight * 0.8,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	           		var param = {mtsoId : data.mtsoId}
	                httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoMtsoInf', param, 'GET', 'roMtsoInf'); // 본사 코드

   	           	}
   	      });
        });

    	$('#btnSave').on('click', function(e) {
    		var mtsoId = $('#mtsoId').val();
    		var bldFlorNo= $('#bldFlorNo').val();
    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
    		} else if (bldFlorNo == undefined || bldFlorNo == "" || bldFlorNo == null) {
    			callMsgBox('','W', "층 정보가 없습니다. 국사 정보 수정 후 등록 하여 주시기 바랍니다.", function(msgId, msgRst){});
    		} else {
    			callMsgBox('','C', "국사를 등록하시겠습니까?", function(msgId, msgRst){
     		        if (msgRst == 'Y') {
     		        	var data = $('#sMtsoRegForm').getData();
     		        	var userId = $('#userId').val();
     		        	var repMtsoId	= $('#repMtsoId').val();
     		        	var latVal = $('#latVal').val();
     		        	var lngVal = $('#lngVal').val();
     		        	var dtlAddr = $('#dtlAddr').val();
     		        	var bldFlorNo	= $('#bldFlorNo').val();
     		        	var siteKeyVal	= $('#siteKeyVal').val();
     		        	data.siteKeyVal 	= siteKeyVal;
     		        	data.userId 	= userId;
     		        	data.latVal		= latVal;
     		        	data.lngVal		= lngVal;
     		        	data.dtlAddr	= dtlAddr;
     		        	//data.mtsoTypCd	= mtsoTypCd;
     		        	data.repMtsoId	= repMtsoId;
     		        	data.bldFlorCnt = "0";
     		        	data.bldFlorNo	= bldFlorNo;
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setInsertRoUpsdDemdInf', data, 'POST', 'setInsertRoUpsdDemdInf');
     		        }
    		     });
    		}
    	});
	}


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'slfCd'){
			$('#slfLesCd').clear();
			var option_data = [{comCd: '', comCdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#slfLesCd').setData({ data : option_data, option_selected: '' });
		}
    	if(flag == 'bldMgmt'){
			$('#mtsoCntrTypCdList').clear();
			var option_data = [{comCd: '', comCdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#mtsoCntrTypCdList').setData({ data : option_data, option_selected: '' });
		}
    	if(flag == 'dntnYn'){
			$('#dntnYn').clear();
			var option_data = [{comCd: '', comCdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#dntnYn').setData({ data : option_data, option_selected: '' });
		}
    	if(flag == 'setInsertRoUpsdDemdInf'){
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
            $a.close();
		}

    	if(flag == 'roMtsoInf'){
    		if (response.RoMtsoInf[0].upsdDemdCount == "0") {

    			$('#bldFlorNo').val('');
    			$('#sMtsoRegArea').setData(response.RoMtsoInf[0]);
    			var data = {bldCd : response.RoMtsoInf[0].bldCd};
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoBldInf', data, 'GET', 'roBldInf'); // 본사 코드
    		} else {
    			callMsgBox('','W', '등록된 국사가 있습니다. 다시 검색해 주시기 바랍니다.' , function(msgId, msgRst){});
    		}
		}
    	if(flag == 'roBldInf'){
			$('#sidoNm').val(response.RoBldInf[0].sidoNm);
			$('#sggNm').val(response.RoBldInf[0].sggNm);
			$('#emdNm').val(response.RoBldInf[0].emdNm);
		}
    	if(flag == 'demdHdofcCd'){
			$('#demdHdofcCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdHdofcCd').setData({ data : option_data, option_selected: '' });
		}
		if(flag == 'demdAreaCd'){
			$('#demdAreaCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdAreaCd').setData({ data : option_data, option_selected: '' });
		}
		if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();
    		var option_data =  [{comCd: '', comCdNm : '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#mtsoCntrTypCdList').setData({ data:option_data });
    	}

		if(flag == 'distancecnt'){
			$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.distance);
		}
		if(flag == 'mtsos'){
			if (response.mtsoInfoList.length > 0) {
				$("#repMtsoNm").val(response.mtsoInfoList[0].mtsoNm);
			}
    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

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


    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : 550

              });
        }

    function popup(pidData, urlData, titleData, paramData) {

     $a.popup({
           	popid: pidData,
           	title: titleData,
               url: urlData,
               data: paramData,
               iframe: true,
               modal: true,
               movable:true,
               width : 1200,
               height : window.innerHeight * 0.9

           });
     }
});