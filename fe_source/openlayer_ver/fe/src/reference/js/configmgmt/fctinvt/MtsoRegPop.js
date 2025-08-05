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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdHdofcCd'); 	// 본사 코드

		var option_data = [{cd: '', cdNm: '전체'}];																		// 지역 코드
		$('#demdAreaCd').setData({ data : option_data, option_selected: '' });

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'laraCd');	// 권역 코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DNTNYN', null, 'GET', 'dntnYn');	// 도심여부 코드
    }

    function setEventListener() {
    	$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdAreaCd'); // 본사 코드
		});

    	$('#btnSave').on('click', function(e) {
    		var mtsoId 			= $('#mtsoId').val();
    		var repMtsoId 		= mtsoId;
    		var repMtsoYn 		= 'N';
    		var demdHdofcCd 	= $('#demdHdofcCd').val();
    		var demdAreaCd		= $('#demdAreaCd').val();
    		var laraCd			= $('#laraCd').val();
    		var dntnYn			= $('#dntnYn').val();
    		if(dntnYn == '' || dntnYn == undefined || dntnYn == null) {dntnYn = 'N';}
    		var delYn			= 'N';
    		var userId			= $('#userId').val();
    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
    		} else {
    			callMsgBox('','C', "국사를 등록하시겠습니까?", function(msgId, msgRst){
     		        if (msgRst == 'Y') {
     		        	var saveParam = {mtsoId: mtsoId, repMtsoId : repMtsoId, repMtsoYn : repMtsoYn, demdHdofcCd : demdHdofcCd, demdAreaCd : demdAreaCd, laraCd : laraCd, dntnYn : dntnYn, delYn: delYn, userId : userId};
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/setMtsoInf', saveParam, 'POST', 'saveMtsoInf');
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
   	                httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getMtsoInfPop', param, 'GET', 'mtsoInf');

   	           	}
   	      });
        });
	}


	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	// 본부
    	if(flag == 'demdHdofcCd'){
			$('#demdHdofcCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdHdofcCd').setData({ data : option_data, option_selected: '' });
		}
    	// 지역
		if(flag == 'demdAreaCd'){
			$('#demdAreaCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdAreaCd').setData({ data : option_data, option_selected: '' });
		}
		// 권역
    	if(flag == 'laraCd'){
			$('#laraCd').clear();
			var option_data = [{comCd: '', comCdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			console.log(option_data);
			$('#laraCd').setData({ data : option_data, option_selected: '' });
		}
    	// 도심/외곽 여부
    	if(flag == 'dntnYn'){
			$('#dntnYn').clear();
			var option_data = [{comCd: '', comCdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#dntnYn').setData({ data : option_data, option_selected: '' });
		}

    	// 국사정보 팝업
    	if(flag == 'mtsoInf'){
    		if (response.mtsoInfList[0].mtsoDemdCount == "0") {
    			$('#mtsoRegArea').setData(response.mtsoInfList[0]);
    			$('#repMtsoId').setData(response.mtsoInfList[0].mtsoId);
    			$('#siteKeyVal').setData(response.mtsoInfList[0].siteCd);
    			$('#dtlAddr').setData(response.mtsoInfList[0].bldAddr);
    			$('#repIntgFcltsCd').setData(response.mtsoInfList[0].repIntgFcltsCd);
    			$('#addrBunjiVal').setData(response.mtsoInfList[0].addrBunjiVal);
    			var data = {bldCd : response.mtsoInfList[0].bldCd};
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getBldInfPop', data, 'GET', 'bldInf'); // 본사 코드
    		} else {
    			callMsgBox('','W', '등록된 국사가 있습니다. 다시 검색해 주시기 바랍니다.' , function(msgId, msgRst){});
    		}
		}
    	// 주소정보
    	if(flag == 'bldInf'){
			$('#sidoNm').val(response.bldInfList[0].sidoNm);
			$('#sggNm').val(response.bldInfList[0].sggNm);
			$('#emdNm').val(response.bldInfList[0].emdNm);
			$('#riNm').val(response.bldInfList[0].riNm);
		}
    	// 저장
    	if(flag == 'saveMtsoInf'){
            $a.close();
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