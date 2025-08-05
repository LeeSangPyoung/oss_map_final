/**
 * IntgMtsoInfo.js
 *
 * @author Administrator
 * @date 2023. 04. 24.
 * @version 1.0
 */
var cifTakeAprvStatCd = "";
var cifTakeRlesStatCd = "";
var aprvA = ""; //A망 권한
var aprvT = ""; //T망 권한
var adtnAttrVal = "";
var gridModel = null;

var comIntgMtso = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGrid1';
	var paramData = null;

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();

    	paramData = param;
    	paramData.intgMtsoYn = "Y"; //통합국사 추가 필드

        $('#intgMtsoDtlLkupForm').progress();
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/intgmtso', param, 'GET', 'search');

        param.pageNo = '1';
        param.rowPerPage = '100';
		gridModel.get({
    		data: param
    	}).done(function(response,status,xhr,flag){})
    	.fail(function(response,status,xhr,flag){});


        resizeContents();
    };

    this.popURL = function(mtsoId) {
    	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
//    	var paramData = {mtsoEqpGubun :'intgmtso', mtsoEqpId : param.mtsoId, parentWinYn : 'Y'};
		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpId='+mtsoId+'&mtsoEqpGubun=intgmtso&parentWinYn=Y',
//			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 900,
			height : window.innerHeight
		});
    };

    function resizeContents(){
    	var contentHeight = $("#intgMtsoDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function initGrid() {
    	var intgColumnMapping =  [{align:'center', title : configMsgArray['sequence'], width: '40px', numberingColumn: true },
									{/* 관리그룹--숨김데이터            */
										key : 'mgmtGrpNm', align:'center', title : configMsgArray['managementGroup'], width: '70px', hidden:true},
									{/* 본부			 */
										key : 'orgNm', align:'center', title : configMsgArray['hdofc'], width: '100px', hidden:true},
									{/* 본부ID	--숨김데이터	 */
										key : 'orgId', align:'center', title : configMsgArray['headOfficeIdentification'], width: '100px', hidden:true},
									{/* 팀	 */
										key : 'teamNm', align:'center', title : configMsgArray['team'], width: '100px', hidden:true},
									{/* 팀ID--숨김데이터			 */
										key : 'teamId', align:'center', title : configMsgArray['teamIdentification'], width: '100px', hidden:true},
									{/* 전송실 	--숨김데이터	 */
										key : 'tmof', align:'center', title : configMsgArray['transmissionOffice'], width: '150px', hidden:true},
									{/* 전송실 		 */
										key : 'tmofNm', align:'center', title : configMsgArray['transmissionOffice'], width: '150px', hidden:true},
									{/* 국사ID	 */
										key : 'mtsoId', align:'center', title : "국사ID", width: '110px'},
									{/* 국사명		 */
										key : 'mtsoNm', align:'left', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '130px'},
									{/* 국사약어명		 */
										key : 'mtsoAbbrNm', align:'center', title : '국사약어명', width: '80px', hidden:true},
									{/* 공대코드    */
										key : 'shrRepFcltsCd', align:'center', title : '공대코드', width: '100px', hidden:true},
									{/* ERP통시명    */
										key : 'shrRepFcltsNm', align:'center', title : 'ERP통시명', width: '200px', hidden:true},
									{/* 국사유형		 */
										key : 'mtsoTyp', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeType'], width: '80px', hidden:true},
									{/* 통합국구분		 */
										key : 'mtsoCntrTypNm', align:'center', title : '통합국구분', width: '80px'},
									{/* 통합국용도		 */
										key : 'intgMtsoTypCdVal', align:'left', title : '통합국용도', width: '140px'},
									{/* 국사상태		 */
										key : 'mtsoStat', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'], width: '70px'},
									{/* 후보대상 현재상태		 */
										key : 'cifTakeAprvStatNm', align:'center', title : '후보대상상태', width: '100px', hidden:true},
									{/* 해제대상 현재상태		 */
										key : 'cifTakeRlesStatNm', align:'center', title : '해제대상상태', width: '100px', hidden:true},
									{/* 건물주소		 */
										key : 'bldAddr', align:'left', title : configMsgArray['buildingAddress'], width: '180px'},

							    	{/* 건물명		 */
										key : 'bldNm', align:'center', title : '건물명', width: '100px'},
									{/* 건물동		 */
										key : 'bldblkNm', align:'center', title : configMsgArray['buildingBlock'], width: '60px'},
									{/* 건물기준국사		 */
										key : 'eqpMgmtUmtsoNm', align:'center', title : '건물기준국사', width: '200px', hidden:true},
									{/* 건물층값		 */
										key : 'bldFlorCnt', align:'center', title : configMsgArray['buildingFloorValue'], width: '60px'},
									{/* 관리그룹코드--숨김데이터        */
										key : 'mgmtGrpCd', align:'center', title : configMsgArray['managementGroupCode'], width: '100px', hidden:true},
									{/* 국사ID	--숨김데이터	 */
										key : 'intgMtsoId', align:'center', title : '통합국사ID', width: '120px', hidden:true}
								];


    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsobld"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	        intgMtsoYn: "Y"
    	    }
        });

    	//그리드 생성
        $('#'+gridId).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : false,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:false,
         	   //pagerSelect:false,
         	   //hidePageList:true
            }, columnMapping : intgColumnMapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			ajax: {model: gridModel, scroll: true },
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "4row"
        });
    }

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

    function setRegDataSet(data) {
//    	console.log("setRegDataSet : ", data);
    	if(data.mtsoAbbrNm == null){
    		$('#mtsoAbbrNmDtl').val(data.mtsoNm);
    	}

    	if(data.fromMtsoDemd == "Y"){
    		$('#btnModLkup').hide();
    		$('#btnDupMtso').hide();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', data, 'GET', 'eqpDtlInf');
    	}

    	if(data.mgmtGrpNm == "SKB"){
    		$('#mtsoAbbrNmDtlLabel').html("GIS국사명") ;
    		$('#btnErpAcptCurstLkup').hide();	// SKB 일 경우에는 ERP정보 숨김
    	}


    	if(data.mgmtGrpNm == "SKT"){

    		var param =  $("#intgMtsoDtlLkupForm").getData();

    		var adtnAttrVal = param.adtnAttrVal;

    		if(adtnAttrVal.indexOf('CIF_MTSO_APRV_A') > 0){
    			aprvA = "Y";
    		}

    		if(data.cifTakeAprvStatCd != "" && data.cifTakeAprvStatCd != null){
    			$("#trCifMtso").show();

    			$("#cifMtso1_1").show();
    			$("#cifSlfLesNm").show();

    			$("#cifMtso1_2").show();
    			$("#rcuIpVal").show();

    			$("#cifMtso2_1").hide();
    			$("#cifMtsoCntrTypNm").hide();



    		} else {
    			$("#trCifMtso").hide();

//    			$("#cifMtso1_1").hide();
//    			$("#cifSlfLesNm").hide();
//
//    			$("#cifMtso1_2").hide();
//    			$("#rcuIpVal").hide();
//
//    			$("#cifMtso2_1").hide();
//    			$("#cifMtsoCntrTypNm").hide();
    		}

    		if(data.mtsoTypCd == "2"){
    			$("#trCifMtso").show();

    			$("#cifMtso1_1").show();
    			$("#cifSlfLesNm").show();
    			$("#cifMtso1_2").show();
    			$("#rcuIpVal").show();


    			$("#cifMtso2_1").hide();
    			$("#cifMtsoCntrTypNm").hide();

    			$("#btnCifAdtnInf").show();
//
    		}else{
    			$("#trCifMtso").hide();

    			$("#cifMtso1_1").hide();
    			$("#cifSlfLesNm").hide();
    			$("#cifMtso1_2").hide();
    			$("#rcuIpVal").hide();

    			$("#cifMtso2_1").hide();
    			$("#cifMtsoCntrTypNm").hide();

    			$("#btnCifAdtnInf").hide();
    		}

    		if(data.mtsoDetlTypCd == "017") {
    			$('#bldNmLabel').html("GIS 설치위치") ;
    			$('#bldblkNoLabel').html("한전전산번호") ;
    			$('#bldFlorNoLabel').html("") ;


    			$('#btnModLkup').hide();
    			$('#bldNm').val(data.instlLocNm);
    			$('#bldblkNm').val(data.fildTlplItNo);

    		}

    	}else{

    		$("#trCifMtso").hide();

			$("#btnCifAdtnInf").hide();
    	}
    }


    function setEventListener() {

		$('#'+gridId).on('dblclick', '.bodycell', function(e){
			var dataObj = null;
	 	 	dataObj = AlopexGrid.parseEvent(e).data;
	 	 	dataObj.regYn = "Y";

	 	 	//국사상세 페이지에 통합국사 탭의 활성화를 위해서
	 	 	var linkTab = "tab_IntgMtso";
	 	 	var mtsoGubun = "intgmtso"; //통합국사 탭 활성화를 위해서

	  	 	var data = {
					mtsoEqpGubun :"0",
					mtsoEqpId : dataObj.mtsoId,
					mtsoEqpNm : dataObj.mtsoNm,
					/*2023 통합국사 고도화 추가 필드*/
					intgMtsoId : dataObj.intgMtsoId,	//통합국사ID
					mtsoTypCd : dataObj.mtsoTypCd,		//국사유형
					linkTab : linkTab,					//국사상세 탭선택 옵션
					mtsoGubun : mtsoGubun
				};
//			console.log("intgMtsoInfo data : ", JSON.stringify(data));
			parent.top.comMain.popURL(data);
	 	});

	   	 //국사(층) 추가
	   	 $('#btnMtsoAdd').on('click', function(e) {
	   		 var mtsoTypCd = $("#mtsoTypCd").val();
	   		 var mtsoTyp = $("#mtsoTyp").val();
	   		 if(mtsoTypCd == "1"){
	   			 callMsgBox('','I', "국사유형이 [ "+mtsoTyp+" ]인 장비는 수정할 수 없습니다." , function(msgId, msgRst){});
	   		 }else{
	   			 var param =  $("#intgMtsoDtlLkupForm").getData();
	   			 param.regYn = "";
	   			 param.intgRegYn = "Y";
	   			 param.mtsoId = "MO***********";
	   			 param.bldblkNm = ""; //건물동 초기화
	   			 param.bldblkNo = ""; //건물동 초기화
	   			 param.bldFlorCnt = ""; //층값 초기화

	   			 param.mtsoNm = param.intgMtsoNm;
	   			 param.mtsoAbbrNm = param.intgMtsoNm;
//	   			 console.log("btnMtsoAdd param : ", param);
	   			$a.popup({
	   			  	popid: 'CifMtsoAdtnDtlLkup',
	   			  	title: '국사 수정',
	   			      url: '/tango-transmission-web/configmgmt/common/MtsoRegPop.do',
	   			      data: param,
	   			      windowpopup : true,
	   			      modal: true,
	   			      movable:true,
	   			      width : 1050,
	   			      height : 875,
	   			      callback : function(data) { // 팝업창을 닫을 때 실행

	   			    	  $('#intgMtsoDtlLkupForm').progress();

	   			    	  httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/intgmtso', paramData, 'GET', 'search');
	   			    	  parent.top.comMain.intgMtsoMod(paramData);

	   			    	  gridModel.get({
	   			    		  data: paramData
	   			    	  }).done(function(response,status,xhr,flag){})
		   			    	.fail(function(response,status,xhr,flag){});

	   			      }
	   			  });
	   		 }
	     });

	   	 //통합국사 제외
	   	 $('#btnMtsoDel').on('click', function(e) {
	   		 var msg = "통합국에서 제외시키겠습니까? \n제외시키면 해당 국사(층)은 기지국으로 변경됩니다.";
	   		 var conFirm = confirm(msg);

	   		 if(conFirm) {
   				var param =  $("#intgMtsoDtlLkupForm").getData();

   				var userId;
   				if($("#userId").val() == ""){
   					userId = "SYSTEM";
   				}else{
   					userId = $("#userId").val();
   				}
   				param.frstRegUserId = userId;
   				param.lastChgUserId = userId;

   				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/deleteIntgMtso', param, 'POST', 'deleteIntgMtso');
   			 }
	   	 });

	   	 //통합국사 수정
	   	 $('#btnIntgModLkup').on('click', function(e) {
	   		 var mtsoTypCd = $("#mtsoTypCd").val();
	   		 var mtsoTyp = $("#mtsoTyp").val();
	   		 if(mtsoTypCd == "1"){
	   			 callMsgBox('','I', "국사유형이 [ "+mtsoTyp+" ]인 장비는 수정할 수 없습니다." , function(msgId, msgRst){});
	   		 }else{
	   			 var param =  $("#intgMtsoDtlLkupForm").getData();
	   			 param.regYn = "Y";
	   			 param.intgRegYn = "Y";
	   			$a.popup({
	   			  	popid: 'IntgMtsoMod',
	   			  	title: '통합국사국사 수정',
	   			      url: '/tango-transmission-web/configmgmt/common/IntgMtsoRegPop.do',
	   			      data: param,
	   			      windowpopup : true,
	   			      modal: true,
	   			      movable:true,
	   			      width : 950,
	   			      height : 900,
	   			      callback : function(data) { // 팝업창을 닫을 때 실행
	   			        $('#intgMtsoDtlLkupForm').progress();
	   			        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/intgmtso', paramData, 'GET', 'search');
	   			        parent.top.comMain.intgMtsoMod(paramData);
	   			      }
	   			  });
	   		 }
	     });

	   	 $('#btnClose').on('click', function(e) {
     		 $a.close();
	   	 });

	   	 //2023 통합국사 고도화 - 통합국사 관리권한 소유자만  등록/수정 가능
	   	 if($("#adtnAttrVal").val().indexOf('CIF_MTSO_APRV_A') > 0){
	   		 $("#btnIntgModLkup").show();
	   		 $("#btnMtsoAdd").show(); //층국사 추가버튼
	   		 $("#btnMtsoDel").show(); //통합국 제외버튼
	   	 }else{
	   		 $("#btnIntgModLkup").hide();
	   		 $("#btnMtsoAdd").hide(); //층국사 추가버튼
	   		 $("#btnMtsoDel").hide(); //통합국 제외버튼
	   	 }
	};



	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		$('#intgMtsoDtlLkupArea').find(':input').each(function(){
				switch(this.type) {
				case 'text' :
					$(this).val('');
				break;
				}
			});

    		$('#intgMtsoDtlLkupArea').setData(response.intgMtsoInfoList[0]);
    		$('#intgMtsoDtlLkupForm').progress().remove();
    		setRegDataSet(response.intgMtsoInfoList[0]);

    	}

    	if(flag == 'eqpDtlInf') {

    		$('#intgMtsoDtlLkupArea').setData(response.mtsoMgmtList[0]);
    	}

    	if(flag == 'deleteIntgMtso'){
    		if(response.Result == "Success"){
    			alert(configMsgArray['saveSuccess']);
    			parent.top.comMain.thisPopUpClose();

    		}else{
    			alert("통합국 제외작업에 실패하였습니다.");
//    			callMsgBox('','I', "통합국 제외작업에 실패하였습니다." , function(msgId, msgRst){});
    		}
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    function dd2dms(v){
		var d, m, sign = '', str;

		d = Math.floor(v);
//		d = v.substring(0,2);
		v = (v - d) * 60;
		m = Math.floor(v);
//		m = v.substring(0,2);
		v = (v - m) * 60;
		x = Math.round(v * Math.pow(10, 2)) / Math.pow(10, 2)
		str = d.toString() + '° ' + m.toString() + "' " + x.toString() + '"';

		return str;
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