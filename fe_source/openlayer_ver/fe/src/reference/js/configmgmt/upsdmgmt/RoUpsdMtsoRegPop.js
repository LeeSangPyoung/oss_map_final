/**
 * MtsoReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var paramData = null;
	this.init = function(id, param) {

		setSelectCode();
		setEventListener();

//        paramData = param[0];
//        $('#mtsoRegArea').setData(param[0]);
//        $('#dtlAddr').val(param[0].dtlAddr);

    }

    function setRegDataSet(data) {

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

    function setEventListener() {
    	$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdAreaCd'); // 본사 코드
		});

    	$('#btnSave').on('click', function(e) {
    		var mtsoId = $('#mtsoId').val();
    		var demdAreaCd 			= $('#demdAreaCd').val();
    		var bldMgmtTypCd	= $('#bldMgmtTypCd').val();
    		var dntnYn				= $('#dntnYn').val();
    		var bldOwnDivVal	= $('#bldOwnDivVal').val();
    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
    		} else if (bldMgmtTypCd == undefined || bldMgmtTypCd == "" || bldMgmtTypCd == null) {
    			callMsgBox('','W', "건물관리 구분을 선택하세요.", function(msgId, msgRst){});
    		} else if (demdAreaCd == undefined || demdAreaCd == "" || demdAreaCd == null) {
    			callMsgBox('','W', "본부/지역을 선택하세요.", function(msgId, msgRst){});
    		} else if (dntnYn == undefined || dntnYn == "" || dntnYn == null) {
    			callMsgBox('','W', "도심/외곽을 선택하세요.", function(msgId, msgRst){});
    		} else if (bldOwnDivVal == undefined || bldOwnDivVal == "" || bldOwnDivVal == null) {
    			callMsgBox('','W', "소유구분을 선택하세요.", function(msgId, msgRst){});
    		} else {
    			callMsgBox('','C', "투자 국사를 등록하시겠습니까?", function(msgId, msgRst){
     		        if (msgRst == 'Y') {
     		        	var data = $('#mtsoRegForm').getData();
     		        	var userId = $('#userId').val();
     		        	var latVal = $('#latVal').val();
     		        	var lngVal = $('#lngVal').val();
     		        	var dtlAddr = $('#dtlAddr').val();
     		        	//var bldMgmtTypCd = $('#bldMgmtTypCd').val();
     		        	var repMtsoId = $('#mtsoId').val();
     		        	var bldFlorNo	= $('#bldFlorNo').val();
     		        	var siteKeyVal	= $('#siteKeyVal').val();
     		        	//var bldOwnDivVal	= $('#bldOwnDivVal').val();
     		        	data.siteKeyVal 	= siteKeyVal;
     		        	data.userId 	= userId;
     		        	data.latVal		= latVal;
     		        	data.lngVal		= lngVal;
     		        	data.dtlAddr	= dtlAddr;
     		        	data.bldMgmtTypCd	= bldMgmtTypCd;
     		        	data.repMtsoId	= repMtsoId;
     		        	data.bldFlorCnt = "0";
     		        	data.bldFlorNo	= bldFlorNo;
     		        	data.bldOwnDivVal = bldOwnDivVal;
     		        	//console.log(data);
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setInsertRoUpsdDemdInf', data, 'POST', 'setInsertRoUpsdDemdInf');
     		        }
    		     });
    		}
    	});

    	$('#btnCncl').on('click', function(e) {
     		 $a.close();
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
   	           	height : 680,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	                var param = {mtsoId : data.mtsoId}
   	                httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoMtsoInf', param, 'GET', 'roMtsoInf'); // 본사 코드

   	           	}
   	      });
        });
	}


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'slfCd'){
			$('#bldOwnDivVal').clear();
			var option_data = [{comCd: '', comCdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#bldOwnDivVal').setData({ data : option_data, option_selected: '' });
		}
    	if(flag == 'bldMgmt'){
			$('#bldMgmtTypCd').clear();
			var option_data = [{comCd: '', comCdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#bldMgmtTypCd').setData({ data : option_data, option_selected: '' });
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
//    		var pageNo = $("#pageNo", parent.document).val();
//    		var rowPerPage = $("#rowPerPage", parent.document).val();
//            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
            $a.close();
		}


    	if(flag == 'roMtsoInf'){
    		if (response.RoMtsoInf[0].upsdDemdCount == "0") {
    			$('#mtsoRegArea').setData(response.RoMtsoInf[0]);
    			$('#repMtsoId').setData(response.RoMtsoInf[0].mtsoId);
    			$('#siteKeyVal').setData(response.RoMtsoInf[0].siteCd);
    			$('#dtlAddr').setData(response.RoMtsoInf[0].bldAddr);
    			$('#repIntgFcltsCd').setData(response.RoMtsoInf[0].repIntgFcltsCd);



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