/**
 * EqpDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var rackInArr = [];
	var rackInTmpArr = [];

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$("#itemId").val(param.itemId);
		$("#unitSize").val(param.unitSize);
        setEventListener();
        setRegDataSet(param);

    };

    function setRegDataSet(data) {
    	var itemId = data.itemId;
    	var unitSize = data.unitSize;
    	$('#mytable > tbody > tr').remove();
    	var param = {rackId:itemId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');

    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackAttrInfoList', data, 'GET', 'eqpView');

    	//$('#eqpDtlLkupArea').setData(data);
    }

    function setEventListener() {

//    	 $('#btnEqp').on('click', function(e) {
//    		 var data = {itemId : "2C057309-B91C-2468-82D4-0BDD7B9D3DE5", sPos : "1"};
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackAttrInfoList', data, 'GET', 'eqpView');
//            });
    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });



    	 $(document).on('click', '[id^="tdRack-datasA"]', function(e){
 			var trKey = $(this).attr('value');
 			if ($(this).hasClass("td_on")) {
 				var itemId = $("#itemId").val();
 				var eqpId = trKey;
 				var data = {itemId : itemId, eqpId : eqpId};
 				var tmpEqp = eqpId.substring(0,2);
 				if (tmpEqp == "SE") {
 					var tmpGubun = eqpId.substr(2,1);
 					switch(tmpGubun) {
	 		     	 	case 'E':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtEtcDtlLkup.do?sbeqpId="+eqpId, '부대장비기타장비상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'R':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDtlLkup.do?sbeqpId="+eqpId, '부대장비정류기상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'M':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfMdulDtlLkup.do?sbeqpId="+eqpId, '부대장비정류기모듈상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'B':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryDtlLkup.do?sbeqpId="+eqpId, '부대장비배터리상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'A':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtArcnDtlLkup.do?sbeqpId="+eqpId, '부대장비냉방기상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'F':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnDtlLkup.do?sbeqpId="+eqpId, '부대장비소화설비상세정보',eqpId);
	 		     	 		break;
	 		     	 	case 'N':
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGntDtlLkup.do?sbeqpId="+eqpId, '부대장비발전기상세정보',eqpId);
	 		     	 		break;
	 		     	 	case "L" :
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtCbplDtlLkup.do?sbeqpId="+eqpId, '부대장비분전반상세정보',eqpId);
	 		     		 	break;
	 		     	 	case "S" :
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtExstrDtlLkup.do?sbeqpId="+eqpId, '부대장비배풍기상세정보',eqpId);
	 		     		 	break;
	 		     	 	case "I" :
	 		     	 		popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIvtrDtlLkup.do?sbeqpId="+eqpId, '부대장비인버터상세정보',eqpId);
	 		     		 	break;
	 		     	 	case "C" :
	 		     			popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtContrDtlLkup.do?sbeqpId="+eqpId, '부대장비컨버터상세정보',eqpId);
	 		     		 	break;
	 		     		case "T" :
	 		     			popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtTvssDtlLkup.do?sbeqpId="+eqpId, '부대장비TVSS상세정보',eqpId);
	 		     		 	break;
	 		     		case "P" :
	 		     			popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIpdDtlLkup.do?sbeqpId="+eqpId, '부대장비IPD상세정보',eqpId);
	 		     		 	break;
	 		     		case "G" :
	 		     			popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGageDtlLkup.do?sbeqpId="+eqpId, '부대장비계량기함상세정보',eqpId);
	 		     		 	break;
	 		     	 	default :
	 	     	 		break;
	 	     	 	}
 				} else {
 					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackAttrInfoList', data, 'GET', 'eqpView');
 				}
 			} else {
 				alert("해당 장비는 이관 또는 임시저장된 장비입니다.");
 				$('#searchForm')[0].reset();
 			}
 		});


	};

	function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: '',
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
        }

	function RackInMapping() {
		$('#mytable > tbody > tr').remove();
		var unitSize = $('#unitSize').val();
		var tmpi = 0;
		var strAppend = '';
		var tmpCkFlag = false;
		var frstPos = 10000;
		rackInTmpArr = [];
		for (var i = 0; i < unitSize; i++) {
			tmpi = i+1;
			tmpri = unitSize - tmpi + 1;
			for (var j = 0; j < rackInArr.length; j++) {

				var strRackIn = rackInArr[j].split(":");
				var sPos = strRackIn[0];
				var ePos =  strRackIn[1];
				var label =  strRackIn[2];
				var lastPos = parseInt(ePos);
				var eqpId=  strRackIn[3];
				var classNm = "button_td_off";
				var classNm2 = "td_off"
				if (eqpId != "" && eqpId != null && eqpId != undefined && eqpId != "undefined") {
					classNm = "button_td_on";
					classNm2 = "td_on";
				}
				if (tmpri == lastPos) {
					rackInTmpArr.push(sPos);
					var rowHeight = (parseInt(ePos) - parseInt(sPos)+1) * 25;


					strAppend = '<tr style="border: 1px solid #ffffff;">';
					strAppend += '<td id="tdRack-datasA'+sPos+'" value="'+eqpId+'" class="'+classNm2+'">';
					strAppend += '	<table style="width:100%;border-style:ridge; border-width:1px;"><tr>';
					strAppend += '	<td  class="'+classNm+'" style="text-align:center;width:100%;height:'+rowHeight+'px;" id="subTdRackA" value="'+eqpId+'">';
					strAppend += '        <div id="RackTitleA'+sPos+'" style="display:table;position:relative;width:100%;height:100%;">';
					strAppend += '            <div style="display:table-cell;vertical-align:middle;"><div style="display:block;margin:0 auto;">'+label+'</div></div>';
					strAppend += '        </div>';
					strAppend += '    </td>';
					strAppend += '</tr></table></td><td  style="width:30px;text-align:center;">&nbsp;</span></td>';

					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					frstPos = sPos;
					tmpCkFlag = true;
					break;
				}

			}
			if (!tmpCkFlag) {
				strAppend = '<tr style="border: 1px solid #ffffff;">';
				strAppend += '<td >';
				strAppend += '	<table style="width:100%;border-style:ridge; border-width:1px;"><tr>';
				strAppend += '	<td style="text-align:center;height:20px;" id="subTdRackA" value="'+tmpri+'"><span id="RackTitleA'+tmpri+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
				strAppend += '</tr></table></td><td  style="width:30px;text-align:center;">&#172;&nbsp;'+tmpri+'</span></td>';

				strAppend += '</tr>';
				$('#mytable > tbody:last').append(strAppend);
				frstPos = 10000;
				tmpCkFlag = false;
			} else {
				if (frstPos == tmpri) {
					tmpCkFlag = false;
				}
			}

		}
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == "RackInList") {
    		rackInArr = [];
			$.each(response.rackInList, function(i, item){
				var sPos = response.rackInList[i].sPos;
				var ePos = response.rackInList[i].ePos;
				var systemNm = response.rackInList[i].systemNm;
				var eqpId = response.rackInList[i].eqpId;
				rackInArr.push(sPos+":"+ePos+":"+systemNm+":"+eqpId);
			});
			RackInMapping();
    	}
    	if(flag == 'eqpView') {
    		$('#searchForm').setData(response.rackAttrInfoList[0]);
    	}

      /* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */
      if(flag == 'eqpPortPveRegIsolYn'){
          if(response.Result == 'Y'){
              $('#btnPortInfCopy').setEnabled(false);
          }
      }
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpDel() {
   	 	var eqpId =  $("#eqpId").val();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/deleteEqpInf/'+eqpId, null, 'GET', 'eqpDel');

   }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9

              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7

              });
        }

   /* var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

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