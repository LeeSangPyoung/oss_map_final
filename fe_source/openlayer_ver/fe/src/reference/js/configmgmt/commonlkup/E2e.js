
	//링크정보팝업
	function tnBdgmLinkInfPop(e, obj){

		var dataParam = {"lftEqpId" : obj.part.data.lftEqpId.replace("DU","DV").replace("RN","DV"), "rghtEqpId" : obj.part.data.rghtEqpId.replace("DU","DV").replace("RN","DV")};
		popup('TnBdgmLinkInfPop', '/tango-transmission-web/configmgmt/tnbdgm/TnBdgmLinkInfPop.do', '링크 정보', dataParam);
	}



	//연동정보팝업
	function eqpLnkgInfPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		$a.popup({
          	popid: 'EqpLnkgInfReg',
          	title: configMsgArray['equipmentLinkageInfReg'],
	        url: '/tango-transmission-web/configmgmt/equipment/EqpLnkgInfRegWinPop.do',
	        data: param,
	        windowpopup : true,
	        modal: true,
	        movable:true,
	        width : 865,
	        height : 800
	     });
	}

	//장비정보팝업
	function eqpDtlLkupPop(e, obj){
		if (obj.part.data.eqpId != "DV00000000000") {
			var eqpId = obj.part.data.eqpId;
	 	 	var eqpNm = obj.part.data.name;
	 	 	var data = {mtsoEqpGubun : "1", mtsoEqpId : eqpId, mtsoEqpNm : eqpNm}; // mtsoEqpGubun : 0(국사), 1(장비)
			parent.top.comMain.popURL(data);
		}
	}

	function eqpNtwkLineAcptCurstPop(e, obj){

		if (obj.part.data.eqpId != "DV00000000000") {
			var eqpId = obj.part.data.eqpId;
	 	 	var eqpNm = obj.part.data.name;
	 	 	var data = {mtsoEqpGubun : "1", mtsoEqpId : eqpId, mtsoEqpNm : eqpNm, linkTab : "tab_EqpLine"}; // mtsoEqpGubun : 0(국사), 1(장비)
			parent.top.comMain.popURL(data);
		}
	}
	//형상정보팝업
	function shpInfPop(e, obj){

		if (obj.part.data.eqpId != "DV00000000000") {
			var eqpId = obj.part.data.eqpId;
	 	 	var eqpNm = obj.part.data.name;
	 	 	var data = {mtsoEqpGubun : "1", mtsoEqpId : eqpId, mtsoEqpNm : eqpNm, linkTab : "tab_Shp"}; // mtsoEqpGubun : 0(국사), 1(장비)
			parent.top.comMain.popURL(data);
		}
	}

	//포트현황팝업
	function portInfMgmtPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		var data = {mtsoEqpGubun : "1", mtsoEqpId : eqpId, mtsoEqpNm : eqpNm, linkTab : "tab_EqpPort"}; // mtsoEqpGubun : 0(국사), 1(장비)
		parent.top.comMain.popURL(data);
//		param.dumyPortYn = "N";  linkTab = splitValue[0];
//		 $a.popup({
//	         	popid: 'PortInfMgmtPop',
//	         	/* 포트현황		 */
//	         	title: configMsgArray['portCurrentState'],
//	           url: '/tango-transmission-web/configmgmt/portmgmt/PortInfMgmtWinPop.do',
//	           data: param,
//	           windowpopup : true,
//	           modal: true,
//	           movable:true,
//	           width : 1200,
//	           height : window.innerHeight * 0.7
//	  	});
	}

	//포트복사팝업
	function portInfCopyPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var mgmtGrpNm = obj.part.data.mgmtGrpNm;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm, "mgmtGrpNm" : mgmtGrpNm};
		 popupList('PortInfCopyReg', '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do', '포트정보복사', param);
	}

	//구간현황팝업
	function eqpSctnAcptCurstPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		popupList('EqpSctnAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSctnAcptCurst.do', configMsgArray['equipmentSectionCurrentState'], param);
	}

	//네트워크정보팝업


	//회선정보팝업
	function eqpSrvcLineAcptCurstPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		popupList('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
	}

	//변경이력팝업
	function eqpChgHstLkupPop(e, obj){

		var eqpId = obj.part.data.eqpId;
		var eqpNm = obj.part.data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		popupList('EqpChgHstLkup', '/tango-transmission-web/configmgmt/equipment/EqpChgHstLkup.do', configMsgArray['changeHistoryReg'], param);
	}

	// 서비스 회선 정보 팝업
	function showServiceLIneInfoPop( gridId, dataObj, sFlag) {
		var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
		var width = 1400;
		var height = 780;

		if(dataObj.svlnLclCd =="001" && dataObj.svlnSclCd == "020"){
			url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineIpTransLineInfoPop.do';
			width = 1000;
			height = 300;
		}
		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno =null;
		}
		$a.popup({
			popid: "ServiceLIneInfoPop",
			title: "서비스회선상세정보" /*서비스회선상세정보*/,
			url: url,
			data: {"gridId":gridId,"ntwkLineNo":dataObj.svlnNo,"svlnLclCd":dataObj.svlnLclCd,"svlnSclCd":dataObj.svlnSclCd,"sFlag":sFlag, "ntwkLnoGrpSrno": lineLnoGrpSrno, "mgmtGrpCd":dataObj.mgmtGrpCd },
			iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
			height : height
			,callback:function(data){
				if(data != null){
				}
			}
		});
    }

	function lowEqpPop(data){

		var eqpId = data.eqpId;
		var eqpNm = data.name;
		var param = {"eqpId" : eqpId, "eqpNm" : eqpNm};
		 $a.popup({
	         	popid: 'LowEqpPop',
	         	/* 하위경로	 */
	         	title: "하위경로",
	           url: '/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopoLowEqpCurst.do',
	           data: param,
	           windowpopup : true,
	           modal: true,
	           movable:true,
	           width : 800,
	           height : 600
	  	});
	}

	//링 시각화 편집 팝업
	function ringInfoPopNew(e, obj){
		var param;

		if(obj != undefined){
			var data = obj.part.data;
			param = data;
			param.ntwkLineNo = data.ringNtwkLineNo;
			param.ntwkLnoGrpSrno = data.ringNtwkLnoGrpSrno;
			param.topoLclCd = data.ringTopoLclCd;
			param.topoSclCd = data.ringTopoSclCd;

			if(searchData == "serviceLineData"){
				var subParam = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});
				param.mgmtGrpCd = subParam[0].mgmtGrpCd;
			}else if(searchData == "ringLineData"){
				param.mgmtGrpCd = $("#ringInfForm").getData().mgmtGrpCd;
			}else{
				param.mgmtGrpCd = $("#trunkInfForm").getData().mgmtGrpCd;
			}
		}else{
			param = $("#ringInfForm").getData();
			param.ntwkLnoGrpSrno = "1";
			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
		}

		if(gridId != "" && gridId != undefined){
			param.gridId = gridId;
		}else{
			param.gridId = "dataGridWork";
		}

		param.sFlag = "Y";

		$a.popup({
		  	popid: "RingInfoPopNew",
		  	title: '링 시각화',
		  	url: '/tango-transmission-web/configmgmt/cfline/RingInfoPopNew.do',
			data: param,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1400,
			height : 940,
			callback:function(data){

			}

		});
	}

	//링 선번 편집 팝업
	function ringInfoPop(){
		var param =  $("#ringInfForm").getData();

			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
			if(gridId != "" && gridId != undefined){
				param.gridId = gridId;
			}else{
				param.gridId = "dataGridWork";
			}

			param.ntwkLnoGrpSrno = "1";
			param.sFlag = "Y";

			$a.popup({
			  	popid: "RingInfoPop",
			  	title: '링 선번 편집',
			  	url: '/tango-transmission-web/configmgmt/cfline/RingInfoPop.do',
				data: param,
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1400,
				height : 940,
				callback:function(data){

				}

			});
	}

	//링 구성도 조회 팝업
	function ringInfoDiagramPop(){
		var param =  $("#ringInfForm").getData();

			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
			if(gridId != "" && gridId != undefined){
				param.gridId = gridId;
			}else{
				param.gridId = "dataGridWork";
			}

			param.ntwkLnoGrpSrno = "1";
			param.sFlag = "Y";

			$a.popup({
			  	popid: "RingInfoDiagramPop",
			  	title: '링 구성도 조회',
			  	url: '/tango-transmission-web/configmgmt/cfline/RingInfoDiagramPop.do',
				data: param,
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1400,
				height : 940,
				callback:function(data){

				}

			});
	}

	//트렁크/WDM트렁크 시각화 편집 팝업
	function trunkInfoPopNew(e, obj){
		var param;

		if(obj != undefined){
			var data = obj.part.data;
			param = data;
			param.ntwkLineNo = data.trkNtwkLineNo;
			param.ntwkLnoGrpSrno = data.trkNtwkLnoGrpSrno;
			param.topoLclCd = data.trkTopoLclCd;
			param.topoSclCd = data.trkTopoSclCd;

			if(searchData == "serviceLineData"){
				var subParam = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});
				param.mgmtGrpCd = subParam[0].mgmtGrpCd;
			}else if(searchData == "ringLineData"){
				param.mgmtGrpCd = $("#ringInfForm").getData().mgmtGrpCd;
			}else{
				param.mgmtGrpCd = $("#trunkInfForm").getData().mgmtGrpCd;
			}
		}else{
			param = $("#trunkInfForm").getData();
			param.ntwkLnoGrpSrno = "1";
			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
		}

		if(gridId != "" && gridId != undefined){
			param.gridId = gridId;
		}else{
			param.gridId = "dataGridWork";
		}

		param.sFlag = "Y";

		if(param.topoSclCd=='101'){

			$a.popup({
			  	popid: "WdmInfoPopNew",
			  	title: 'WDM 트렁크',
			  	url: '/tango-transmission-web/configmgmt/cfline/WdmTrunkDetailModPop.do',
				data: param,
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1400,
				height : 940,
				callback:function(data){

				}
			})
		} else{

			$a.popup({
	        	popid: 'TrunkInfoPopNew',
	        	title: '트렁크 시각화',
	            url: '/tango-transmission-web/configmgmt/cfline/TrunkInfoPopNew.do',
	            data: param,
			    modal: true,
			    movable: true,
			    windowpopup : true,
			    width : 1400,
			    height : 940,
	            callback: 	function (data) {
	            	if(data !== null ){

  		            }
  				}
	        });
		}
	}

	//WDM트렁크 시각화 편집 팝업
	function wdmTrunkInfoPopNew(e, obj){
		var param;

		var data = obj.part.data;
		param = data;
		param.ntwkLineNo = data.wdmTrkNtwkLineNo;
		param.ntwkLnoGrpSrno = data.wdmTrkNtwkLnoGrpSrno;
		param.topoLclCd = data.wdmTrkTopoLclCd;
		param.topoSclCd = data.wdmTrkTopoSclCd;

		if(searchData == "serviceLineData"){
			var subParam = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});
			param.mgmtGrpCd = subParam[0].mgmtGrpCd;
		}else if(searchData == "ringLineData"){
			param.mgmtGrpCd = $("#ringInfForm").getData().mgmtGrpCd;
		}else{
			param.mgmtGrpCd = $("#trunkInfForm").getData().mgmtGrpCd;
		}

		if(gridId != "" && gridId != undefined){
			param.gridId = gridId;
		}else{
			param.gridId = "dataGridWork";
		}

		param.sFlag = "Y";

		$a.popup({
		  	popid: "WdmInfoPopNew",
		  	title: 'WDM 트렁크 시각화',
		  	url: '/tango-transmission-web/configmgmt/cfline/WdmTrunkDetailModPop.do',
			data: param,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1400,
			height : 940,
			callback:function(data){

			}
		})
	}

	//트렁크/WDM트렁크 선번 편집 팝업
	function trunkInfoPop(){
		var param =  $("#trunkInfForm").getData();

			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
			if(gridId != "" && gridId != undefined){
				param.gridId = gridId;
			}else{
				param.gridId = "dataGridWork";
			}

			param.ntwkLnoGrpSrno = "1";
			param.sFlag = "Y";

				if(param.topoSclCd=='101'){

					$a.popup({
					  	popid: "WdmInfoPop",
					  	title: 'WDM 트렁크 편집',
					  	url: '/tango-transmission-web/configmgmt/cfline/WdmTrunkDetailModPop.do',
						data: param,
						modal: true,
						movable:true,
						windowpopup : true,
						width : 1400,
						height : 940,
						callback:function(data){

						}
					})
				} else{

	 				$a.popup({
	 		        	popid: 'TrunkInfoPop',
	 		        	title: '트렁크 편집',
	 		            url: '/tango-transmission-web/configmgmt/cfline/TrunkInfoPop.do',
	 		            data: param,
	 				    modal: true,
	 				    movable: true,
	 				    windowpopup : true,
	 				    width : 1400,
	 				    height : 940,
	 		            callback: 	function (data) {
	 		            	if(data !== null ){

	 	  		            }
	 	  				}
	 		        });
				}
	}

	//트렁크/WDM트렁크 시각화 조회 팝업
	function trunkInfoDiagramPop(){
		var param =  $("#trunkInfForm").getData();

			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
				param.mgmtGrpCd = mgmtGrpCd;
			}
			if(gridId != "" && gridId != undefined){
				param.gridId = gridId;
			}else{
				param.gridId = "dataGridWork";
			}

			param.ntwkLnoGrpSrno = "1";
			param.sFlag = "Y";

				if(param.topoSclCd=='101'){

					$a.popup({
					  	popid: "WdmTrunkInfoDiagramPop",
					  	title: 'WDM 트렁크 조회',
					  	//url: '/tango-transmission-web/configmgmt/cfline/WdmTrunkInfoDiagramPop.do',
					  	url: '/tango-transmission-web/configmgmt/cfline/WdmTrunkDetailPop.do',
						data: param,
						modal: true,
						movable:true,
						windowpopup : true,
						width : 1400,
						height : 940,
						callback:function(data){

						}
					})
				} else{

	 				$a.popup({
	 		        	popid: 'TrunkInfoDiagramPop',
	 		        	title: '트렁크 편집 시각화 조회',
	 		            url: '/tango-transmission-web/configmgmt/cfline/TrunkInfoDiagramPop.do',
	 		            data: param,
	 				    modal: true,
	 				    movable: true,
	 				    windowpopup : true,
	 				    width : 1400,
	 				    height : 940,
	 		            callback: 	function (data) {
	 		            	if(data !== null ){

	 	  		            }
	 	  				}
	 		        });
				}
	}

	function searchLineInf(e, obj){
		var param = null;
		if(obj != undefined){
			var data = obj.part.data;
			param = data;
		}else{
			var n = myDiagram.selection.first();
			if(n != null){
				param = n.data;
			}
		}

		 if(param != null){
			 if(param.eqpSctnId != undefined){

				 $a.popup({
					 popid: 'IntgE2ETopoLineLkup',
					 title: 'E2E 토폴로지 선호 조회',
					 url: '/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopoLineLkup.do',
					 data: param,
					 windowpopup : true,
					 modal: true,
					 movable:true,
					 width : 900,
					 height : 750
				 });
			 }else{
				 callMsgBox('','I', "조회 할 링크를 선택하십시오.", function(msgId, msgRst){
					 return;
				 });
			 }
		 }else{
			 callMsgBox('','I', "조회 할 링크를 선택하십시오.", function(msgId, msgRst){
				 return;
			 });
		 }
	}

	// 국사 통합 정보 팝업
	function mtsoDtlComLkupPop(e, obj){
		console.log("mtsoDtlComLkupPop data : ", obj.part.data);

		var mtsoGubun, linkTab = "";

  	 	//국사상세 페이지에 통합국사 탭의 활성화를 위해서
  	 	if(obj.part.data.category == "topGroup"){
  	 		linkTab = "tab_IntgMtso";
  	 		mtsoGubun = "intgmtso";
  	 	}else if(obj.part.data.category == "newGroup"){
  	 		linkTab = "tab_mtso";
  	 		mtsoGubun = "mtso";
  	 	}else if(obj.part.data.category == "nodeData1"){
  	 		linkTab = "tab_mtso";
  	 		mtsoGubun = "mtso";
  	 	}else{
  	 		linkTab = "tab_mtso";
  	 		mtsoGubun = "mtso";
  	 	}

    	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
    	var paramData = {
    					mtsoEqpGubun :mtsoGubun,
    					mtsoEqpId : obj.part.data.mtsoId,
    					parentWinYn : 'Y',
    					intgMtsoId : obj.part.data.intgMtsoId,
    					mtsoTypCd : obj.part.data.mtsoTypCd,
    					linkTab : linkTab
    					};

//    	console.log("paramData : ", paramData);
		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 1300,
			height : window.innerHeight * 0.83
		});
	}


	// 국사 통합 정보 팝업
	function eqpDtlComLkupPop(e, obj){
		console.log("eqpDtlComLkupPop data : ", obj.part.data);

		var mtsoGubun, linkTab = "";
		mtsoGubun = "eqp";
		linkTab = "tab_Eqp";

		var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		var paramData = {
				mtsoEqpGubun :mtsoGubun,
				mtsoEqpId : obj.part.data.eqpId,
				parentWinYn : 'Y',
				linkTab : linkTab
		};

//    	console.log("paramData : ", paramData);
		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 1300,
			height : window.innerHeight * 0.83
		});
	}

	function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : 650
              });
        }

    function eqpPopup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.75
              });
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
                  height : window.innerHeight * 0.7
              });
        }