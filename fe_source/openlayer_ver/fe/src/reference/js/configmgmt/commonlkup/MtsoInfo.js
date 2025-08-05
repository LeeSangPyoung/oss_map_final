/**
 * MtsoDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var cifTakeAprvStatCd = "";
var cifTakeRlesStatCd = "";
var aprvA = ""; //A망 권한
var aprvT = ""; //T망 권한
var adtnAttrVal = "";
var gridModel = null;

var comMtso = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGrid';
	var paramData = null;

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();

    	paramData = param;

        $('#mtsoDtlLkupForm').progress();
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', param, 'GET', 'search');

        param.pageNo = '1';
        param.rowPerPage = '100';
		gridModel.get({
    		data: param
    	}).done(function(response,status,xhr,flag){})
    	.fail(function(response,status,xhr,flag){});


        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#mtsoDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function initGrid() {

    	var mapping =  [{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
		{/* 관리그룹--숨김데이터            */
			key : 'mgmtGrpNm', align:'center', title : configMsgArray['managementGroup'], width: '70px'},
		{/* 본부			 */
			key : 'orgNm', align:'center', title : configMsgArray['hdofc'], width: '100px'},
		{/* 본부ID	--숨김데이터	 */
			key : 'orgId', align:'center', title : configMsgArray['headOfficeIdentification'], width: '100px', hidden:true},
		{/* 팀	 */
			key : 'teamNm', align:'center', title : configMsgArray['team'], width: '100px'},
		{/* 팀ID--숨김데이터			 */
			key : 'teamId', align:'center', title : configMsgArray['teamIdentification'], width: '100px', hidden:true},
		{/* 전송실 	--숨김데이터	 */
			key : 'tmof', align:'center', title : configMsgArray['transmissionOffice'], width: '150px', hidden:true},
		{/* 전송실 		 */
			key : 'tmofNm', align:'center', title : configMsgArray['transmissionOffice'], width: '150px'},
		{/* 국사ID	 */
			key : 'mtsoId', align:'center', title : "국사ID", width: '130px'},
		{/* 국사명		 */
			key : 'mtsoNm', align:'left', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '200px'},
		{/* 국사약어명		 */
			key : 'mtsoAbbrNm', align:'center', title : '국사약어명', width: '80px', hidden:true},
		{/* 공대코드    */
			key : 'shrRepFcltsCd', align:'center', title : '공대코드', width: '100px', hidden:true},
		{/* ERP통시명    */
			key : 'shrRepFcltsNm', align:'center', title : 'ERP통시명', width: '200px', hidden:true},
		{/* 국사유형		 */
			key : 'mtsoTyp', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeType'], width: '80px'},
		{/* 국사상태		 */
			key : 'mtsoStat', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'], width: '80px'},
		{/* 후보대상 현재상태		 */
			key : 'cifTakeAprvStatNm', align:'center', title : '후보대상상태', width: '100px', hidden:true},
		{/* 해제대상 현재상태		 */
			key : 'cifTakeRlesStatNm', align:'center', title : '해제대상상태', width: '100px', hidden:true},
		{/* 건물주소		 */
			key : 'bldAddr', align:'left', title : configMsgArray['buildingAddress'], width: '200px'},

    	{/* 건물명		 */
			key : 'bldNm', align:'center', title : '건물명', width: '130px'},
		{/* 건물동		 */
			key : 'bldblkNm', align:'center', title : configMsgArray['buildingBlock'], width: '100px'},
		{/* 건물층값		 */
			key : 'bldFlorCnt', align:'center', title : configMsgArray['buildingFloorValue'], width: '100px'},
		{/* 건물기준국사		 */
			key : 'eqpMgmtUmtsoNm', align:'center', title : '건물기준국사', width: '200px', hidden:true},
		{/* 관리그룹코드--숨김데이터        */
			key : 'mgmtGrpCd', align:'center', title : configMsgArray['managementGroupCode'], width: '100px', hidden:true},
		{/* 국사ID	--숨김데이터	 */
			key : 'mtsoId', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'], width: '120px', hidden:true
		},
		{/* 통합국사ID	--숨김데이터	 */
			key : 'intgMtsoId', align:'center', title : '통합국사ID', width: '120px', hidden:true
		},
		{/* 국사유형코드--숨김데이터	 */
			key : 'mtsoTypCd', align:'center', title : '국사유형코드', width: '120px', hidden:true
		}];


    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsobld"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	    }
        });

//    	var mapping = [];
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
            }, columnMapping : mapping
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

    	if(data.mtsoLatVal != null){
    		$('#mtsoLatValT').val(dd2dms(data.mtsoLatVal));
    	}
    	if(data.mtsoLngVal != null){
    		$('#mtsoLngValT').val(dd2dms(data.mtsoLngVal));
    	}

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
    		var param =  $("#mtsoDtlLkupForm").getData();

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


    		//중심국 수정은 불가능하도록
    		// 국사세부유형이 T_RN인 경우에는 수정 불가 처리 - 서영응 2019-02-13
    		if(data.mtsoTypCd == "1" || data.mtsoTypCd == "2"){
    			$('#btnModLkup').hide();
    			if(aprvA == "Y"){
	    			$('#btnModLkup').show();
    			}
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
//    		$("#cifMtso1").hide();
//			$("#cifMtso2").hide();

    		$("#trCifMtso").hide();

//			$("#cifMtso1_1").hide();
//			$("#cifSlfLesNm").hide();
//
//			$("#cifMtso1_2").hide();
//			$("#rcuIpVal").hide();
//
//			$("#cifMtso2_1").hide();
//			$("#cifMtsoCntrTypNm").hide();

			$("#btnCifAdtnInf").hide();
    	}
    }


    function setEventListener() {

	$('#'+gridId).on('dblclick', '.bodycell', function(e){
		var dataObj = null;
 	 	dataObj = AlopexGrid.parseEvent(e).data;
 	 	dataObj.regYn = "Y";

 	 	//2023 통합국사 고도화 추가 - 국사상세 페이지에 통합국사 탭의 활성화를 위해서
 	 	var linkTab = "tab_Mtso";
 	 	var mtsoGubun = "mtso";

 	 	if(dataObj.intgMtsoId != undefined){
  	 		if(dataObj.mgmtGrpCd == "0001" //SKT only
  	 			&& dataObj.mtsoTypCd == "2" //중심국사
  	 				&& dataObj.intgMtsoId != "" //통합국사ID가 존재하는
  	 		){
  	 			mtsoGubun = "intgmtso";
  	 		}
  	 	}

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
// 	 	var data = {mtsoEqpGubun : "0", mtsoEqpId : dataObj.mtsoId, mtsoEqpNm : dataObj.mtsoNm}; // mtsoEqpGubun : 0(국사), 1(장비)
		parent.top.comMain.popURL(data);
 	});
    	//ERP정보
  	 $('#btnErpAcptCurstLkup').on('click', function(e) {
  		var param =  $("#mtsoDtlLkupForm").getData();
  		popupList('ErpCurstLkup', '/tango-transmission-web/configmgmt/common/ErpAcptCurst.do', 'ERP정보', param);
  	 });


     //중복국사관리
   	 $('#btnDupMtso').on('click', function(e) {
   		 var param =  $("#mtsoDtlLkupForm").getData();
   		 param.regYn = "Y";

			$a.popup({
	          	popid: 'DupMtsoMgmt',
	          	title: configMsgArray['findEquipment'],
	            url: '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do',
	            data: param,
	            modal: true,
		        windowpopup : true,
	            movable:true,
	            width : 1200,
	           	height : 600,
	      });

     });

   	 //현장사진관리
  	 $('#btnFildPic').on('click', function(e) {
  		 var param =  $("#mtsoDtlLkupForm").getData();
  		 param.mtsoId = $('#mtsoId').val();

		$a.popup({
          	popid: 'FildPicMgmt',
          	title: configMsgArray['findEquipment'],
            url: '/tango-transmission-web/configmgmt/common/FildPicMgmt.do',
            data: param,
            modal: true,
	        windowpopup : true,
            movable:true,
            width : 1200,
           	height : 700,
	      });
  	 });

  	 //중통집추가정보
  	 $('#btnCifAdtnInf').on('click', function(e) {
  		var mtsoId = $('#eqpMgmtUmtsoId').val();
  		var param =  {"mtsoId" : mtsoId, "autoSearchYn": "Y"}
  		$a.popup({
		  	popid: 'CifMtsoAdtnDtlLkup',
		  	title: '중통집 추가 정보',
		      url: '/tango-transmission-web/configmgmt/common/CifMtsoAdtnDtlLkup.do',
		      data: param,
		      windowpopup : true,
		      modal: true,
		      movable:true,
		      width : 830,
		      height : 820
		  });
	 });



   	 //수정
   	 $('#btnModLkup').on('click', function(e) {
   		 var mtsoTypCd = $("#mtsoTypCd").val();
   		 var mtsoTyp = $("#mtsoTyp").val();
   		 if(mtsoTypCd == "1"){
   			 callMsgBox('','I', "국사유형이 [ "+mtsoTyp+" ]인 장비는 수정할 수 없습니다." , function(msgId, msgRst){});
   		 }else{
   			 var param =  $("#mtsoDtlLkupForm").getData();
   			 param.regYn = "Y";
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
   			    	  if(data != null){
   			    		paramData.mtsoTypCd = data.mtsoTypCd;
   			    	  }else{
   			    		paramData.mtsoTypCd = $("#mtsoTypCd").val();
   			    	  }

   			    	  // 수정시 중심국사로 변경된 경우 팝업을 닫고 재조회 한다
   			    	  if (data.mtsoTypCd == '2' && data.beforMtsoTypCd > 2) {
   			    		  parent.top.comMain.thisPopUpClose();
   			    	  }

   			        $('#mtsoDtlLkupForm').progress();

   			        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', paramData, 'GET', 'search');
   			        parent.top.comMain.mtsoMod(paramData);

   			      }
   			  });
   		 }
     });

   	 $('#btnClose').on('click', function(e) {
     		 $a.close();
          });

	};



	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		$('#mtsoDtlLkupArea').find(':input').each(function(){
				switch(this.type) {
				case 'text' :
					$(this).val('');
				break;
				}
			});

    		$('#mtsoDtlLkupArea').setData(response.mtsoInfoList[0]);
    		$('#mtsoDtlLkupForm').progress().remove();
    		setRegDataSet(response.mtsoInfoList[0]);

    	}

    	if(flag == 'eqpDtlInf') {

    		$('#mtsoDtlLkupArea').setData(response.mtsoMgmtList[0]);
    	}

    	if(flag == 'reqemail') {

    		if(response.Result == "Success"){
    			//승인요청을 완료 하였습니다.
	    		callMsgBox('','I', '정상적으로 완료 되었습니다.' , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           //$a.close("AprvReq");
	    		       }
	    		});
    		}else{
    			callMsgBox('','I', response.Msg , function(msgId, msgRst){
    				if (msgRst == 'Y') {
	    		           //$a.close("RlesAprvReq");
	    		       }
    			});


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