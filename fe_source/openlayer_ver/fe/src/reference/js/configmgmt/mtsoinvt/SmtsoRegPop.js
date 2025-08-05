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

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MTSOUSG', null, 'GET', 'mtsousg');	// 층 용도 코드

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
				{ key : 'bldFlorCnt', align:'center', title : "층", width: '50px'},

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
     	 	var param = {mtsoId : dataObj.mtsoId, repMtsoYn : 'N'};

     	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMtsoInfPop', param, 'GET', 'mtsoInf');

     	});

    	$('#btnCncl').on('click', function(e) {
      		 $a.close();
    	});


    	$('#btnS_mtsoReg').on('click', function(e) {

    		var repMtsoId = $('#repMtsoId').val();
    		var repMtsoNm = $('#repMtsoNm').val();
    		var param = {mtsoId : repMtsoId, repMtsoYn : 'N'};
         	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMtsoInfPop', param, 'GET', 'mtsoInf');
        });

    	$('#btnMtsoSearch').on('click', function(e) {
   		 $a.popup({
   	          	popid: 'MtsoLkup',
   	          	title: configMsgArray['findMtso'],
   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
   	            windowpopup : true,
   	            modal: true,
                movable:true,
   	            width : 950,
   	           	height : 650,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	           		var param = {mtsoId : data.mtsoId, repMtsoYn : 'N'};
   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMtsoInfPop', param, 'GET', 'mtsoInf');
   	           	}
   	      });
        });

    	$('#btnSave').on('click', function(e) {
    		var mtsoId = $('#mtsoId').val();
    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
    		} else {
    			callMsgBox('','C', "국사를 등록하시겠습니까?", function(msgId, msgRst){
    				var mtsoId 			= $('#mtsoId').val();
 		    		var repMtsoId 		= $('#repMtsoId').val();
 		    		var repMtsoYn 		= 'N';
 		    		var usgTypCd 		= $('#usgTypCd').val();
 		    		if (usgTypCd != null && usgTypCd != undefined && usgTypCd != "") {
 		    			usgTypCd = usgTypCd.toString();
 		    			usgTypCd = $.trim(usgTypCd.replace(/,/gi,''));
 		    		}
 		    		var userId			= $('#userId').val();
 		    		if (usgTypCd == null || usgTypCd == undefined || usgTypCd == "") {
	 		    			if (msgRst == 'Y') {
 	 	     		    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
 	 	     		    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
 	 	     		    		} else {
 	 	     		    			callMsgBox('','C', "국사를 등록하시겠습니까?", function(msgId, msgRst){
 	 	     		     		        if (msgRst == 'Y') {
 	 	     		     		        	var saveParam = {mtsoId: mtsoId, repMtsoId : repMtsoId, repMtsoYn : repMtsoYn, usgTypCd : usgTypCd, delYn : 'N', userId : userId};
 	 	     		     		        	//console.log(saveParam);
 	 	     		     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMtsoInf', saveParam, 'POST', 'saveMtsoInf');
 	 	     		     		        }
 	 	     		    		     });
 	 	     		    		}
 	 	     		        }
 		    		} else {
 		    			if (usgTypCd.length > 4) {
 	 		    			callMsgBox('','W', "층 용도 항목이 너무 많습니다.(최대 4개 선택 가능)", function(msgId, msgRst){});
 	 		    		} else {
 	 		    			if (msgRst == 'Y') {

 	 	     		    		if (mtsoId == undefined || mtsoId == "" || mtsoId == null) {
 	 	     		    			callMsgBox('','W', "국사를 선택하세요.", function(msgId, msgRst){});
 	 	     		    		} else {
 	 	     		    			callMsgBox('','C', "국사를 등록하시겠습니까?", function(msgId, msgRst){
 	 	     		     		        if (msgRst == 'Y') {
 	 	     		     		        	var saveParam = {mtsoId: mtsoId, repMtsoId : repMtsoId, repMtsoYn : repMtsoYn, usgTypCd : usgTypCd, delYn : 'N', userId : userId};
 	 	     		     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMtsoInf', saveParam, 'POST', 'saveMtsoInf');
 	 	     		     		        }
 	 	     		    		     });
 	 	     		    		}
 	 	     		        }
 	 		    		}
 		    		}


    		     });
    		}
    	});
	}


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'mtsousg'){
			$('#usgTypCd').clear();
			var option_data = [];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#usgTypCd').setData({ data : option_data, option_selected: '' });
		}

    	if(flag == 'mtsoInf'){
    		if (response.mtsoInfList[0].mtsoDemdCount == "0") {
    			$('#bldblkNo').val('');
    			$('#bldFlorNo').val('');
    			$('#siteKeyVal').val('');
    			$('#bldCd').val('');
    			$('#bldNm').val('');
    			$('#mtsoLatValT').val('');
    			$('#mtsoLngValT').val('');
    			$('#sidoNm').val('');
    			$('#sggNm').val('');
    			$('#emdNm').val('');
    			$('#riNm').val('');
    			$('#addrBunjiVal').val('');
    			$('#dtlAddr').val('');
    			$('#sMtsoRegArea').setData(response.mtsoInfList[0]);
//    			console.log(response.mtsoInfList[0].mtsoId);
//    			$('#repMtsoId').setData(response.mtsoInfList[0].mtsoId);
//    			$('#siteKeyVal').setData(response.mtsoInfList[0].siteCd);
//    			$('#dtlAddr').setData(response.mtsoInfList[0].bldAddr);
//    			$('#repIntgFcltsCd').setData(response.mtsoInfList[0].repIntgFcltsCd);
//    			$('#addrBunjiVal').setData(response.mtsoInfList[0].addrBunjiVal);
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
    	// 주변국사
		if(flag == 'distancecnt'){
			$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.distance);
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