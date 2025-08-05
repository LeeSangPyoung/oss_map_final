/**
 * EpwrStcMgmt.js
 *
 * @author Administrator
 * @date 2018. 02. 05.
 * @version 1.0
 */
var main = $a.page(function() {
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		setDate();
		setSelectCode();
		setEventListener();
		$('#searchDsbn').show();
		$('#searchRtf').hide();
		$('#searchBatry').hide();
		$('#searchArcn').hide();
		$('#searchFextn').hide();
		$('#searchGnt').hide();
		$('#searchMtsoEnv').hide();
		$('#searchRpr').hide();
	};

	function setSelectCode() {
//		var searchMtsoTypCd = {supCd : '008000'};
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ 'SKT', null, 'GET', 'fstOrg'); //181121 kys 제거
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchMtsoTypCd, 'GET', 'searchMtsoTypCd');

		var chrrOrgGrpCd;
		var option_data =  null;

		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();//181121 kys 추가
		 }

		 if(chrrOrgGrpCd == "SKT"){
			 option_data =  [{comCd: "",comCdNm: "전체"},
				 				 {comCd: "1",comCdNm: "전송실"},
								 {comCd: "2",comCdNm: "중심국사"},
								 {comCd: "3",comCdNm: "기지국사"},
								 {comCd: "4",comCdNm: "국소"}
								 ];
	 	 }else{
	 		 option_data =  [{comCd: "",comCdNm: "전체"},
		 			 			 {comCd: "1",comCdNm: "정보센터"},
		 						 {comCd: "2",comCdNm: "국사"},
		 						 {comCd: "4",comCdNm: "국소"}
		 						 ];
	  	 }
		 $('#searchMtsoTypCd').setData({
             data:option_data
		});

		 var day = new Date();
		 var nowYear = day.getFullYear();
		 var year = [{comCd:"",comCdNm:"선택"}];
		 for(var i=2004; i<=nowYear; i++ ){
//			 var obj = [{ comCd : i, comCdNm : i }];
			 var obj = [];
			 obj.comCd = i;
			 obj.comCdNm = i;
			 year.push(obj);
		 }
		 $('#searchYear').setData({
			 data:year
		 })
		 $('#searchArcnMnftDt').setData({
			 data:year
		 })
		 $('#searchFextnYear').setData({
			 data:year
		 })
		 $('#searchBatryMnftDt').setData({
			 data:year
		 })
		 $('#searchGntMnftDt').setData({
			 data:year
		 })


		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTyp');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');

		//181121 kys 모델,제조사 셀렉트박스 추가
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMdl', null, 'GET', 'getMdl');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getVend', null, 'GET', 'getVend');

		 //181121 kys 국사유형 셀렉트박스 추가
		 if(chrrOrgGrpCd == "SKT"){
				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
								{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
								{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}

		 //181121 kys 축전지 용량 js추가
		 var capaVal = [40,65,100,120,130,150,180,200,220,250,300,400,500,600,700,800,900,1000,1200,1500,1600,1800,2000,2200,2400,3000];
			for(i=0; i<capaVal.length; i++){
				$("#searchBatryCapa").append("<option value='" + capaVal[i] +"'>" + capaVal[i] + "</option>");
			}



			$('#mtsoTypCd').setData({
	             data:option_data
			});
	}
    function setDate() {
    	$('#searchEndPerd').val(calculateDate(0));
    	$('#searchStaPerd').val(calculateDate(30));
    }

	function setEventListener() {
		var perPage = 100;

		//본부 선택시 이벤트
   	 	$('#orgId').on('change', function(e) {

   		 var orgID =  $("#orgId").getData();
   		 if(orgID.orgId == ''){ //181121 kys 추가
   			 var mgmtGrpNm;
   			if($("#chrrOrgGrpCd").val() == ""){
   				mgmtGrpNm = "SKT";
   		 }else{
   			mgmtGrpNm = $("#chrrOrgGrpCd").val();;
   		 }
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
   		 }else{
   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
   		 }
        });

		//조회
		$('#btnSearch').on('click', function(e) {
			var idx  = $('#basicTabs').getCurrentTabIndex();

	    	switch (idx) {
				case 0 :
					dsbn.setGrid(1,perPage);
					break;
				case 1 :
					rtf.setGrid(1,perPage);
					break;
				case 2 :
					batry.setGrid(1,perPage);
					break;
				case 3 :
					arcn.setGrid(1,perPage);
					break;
				case 4 :
					fextn.setGrid(1,perPage);
					break;
				case 5 :
					gnt.setGrid(1,perPage);
					break;
				case 6 :
					heltr.setGrid(1,perPage);
					break;
				case 7 :
					mtsoEnv.setGrid(1,perPage);
					break;
				case 8 :
					rpr.setGrid(1,perPage);
					break;
				case 9 :
					pue.setGrid(1,perPage);
					break;

				default :
					break;
			}
			//$("#dataGridBatry").prop('contentWindow').$a.setGrid(1, perPage, param);
			//main.setGrid(1,perPage);
		});

		//엔터키로 조회
		$('#searchMain').on('keydown', function(e){

			if (e.which == 13  ){
				var param =  $("#searchMain").serialize();
				var idx  = $('#basicTabs').getCurrentTabIndex();
				switch (idx) {
				case 0 :
					dsbn.setGrid(1,perPage);
					break;
				case 1 :
					rtf.setGrid(1,perPage);
					break;
				case 2 :
					batry.setGrid(1,perPage);
					break;
				case 3 :
					arcn.setGrid(1,perPage);
					break;
				case 4 :
					fextn.setGrid(1,perPage);
					break;
				case 5 :
					gnt.setGrid(1,perPage);
					break;
				case 6 :
					heltr.setGrid(1,perPage);
					break;
				case 7 :
					mtsoEnv.setGrid(1,perPage);
					break;
				case 8 :
					rpr.setGrid(1,perPage);
					break;
				case 9 :
					pue.setGrid(1,perPage);
					break;
				default :
					break;
				}
			}
		});

		//탭변경 이벤트
   	 $('#basicTabs').on("tabchange", function(e, index) {
   		$('#searchDsbn').hide();
		$('#searchRtf').hide();
		$('#searchBatry').hide();
		$('#searchArcn').hide();
		$('#searchFextn').hide();
		$('#searchGnt').hide();
		$('#searchMtsoEnv').hide();
		$('#searchRpr').hide();

		if(index == 6 || index == 9){
			$("#searchSbeqpNmDiv").hide();
		} else {
			$("#searchSbeqpNmDiv").show();
		}
   		 switch (index) {
			case 0 :
				$('#searchDsbn').show();
				$('#dataGridDsbn').alopexGrid("viewUpdate");
				break;
			case 1 :
				$('#searchRtf').show();
				$('#dataGridRtf').alopexGrid("viewUpdate");
				break;
			case 2 :
				$('#searchBatry').show();
				$('#dataGridBatry').alopexGrid("viewUpdate");
				break;
			case 3 :
				$('#searchArcn').show();
				$('#dataGridArcn').alopexGrid("viewUpdate");
				break;
			case 4 :
				$('#searchFextn').show();
				$('#dataGridFextn').alopexGrid("viewUpdate");
				break;
			case 5 :
				$('#searchGnt').show();
				$('#dataGridGnt').alopexGrid("viewUpdate");
				break;
			case 6 :
				$('#dataGridHeltr').alopexGrid("viewUpdate");
				break;
			case 7 :
				$('#searchMtsoEnv').show();
				$('#dataGridMtsoEnv').alopexGrid("viewUpdate");
				break;
			case 8 :
				$('#searchRpr').show();
				$('#dataGridRpr').alopexGrid("viewUpdate");
				break;
			case 9 :
				$('#dataGridPue').alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){

		if(flag == 'fstOrg'){
			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);
				}

				$('#orgId').setData({
					data : option_data,
					option_selected: ''
				});
			}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+'SKT', null, 'GET', 'team');
		}

		if(flag == 'team'){
			$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
                 data:option_data
    		});
		}
		if(flag == 'searchMtsoTypCd'){
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

		if(flag == 'getMdl'){
			var batryMdl = [{sbeqpMdlNm: '', sbeqpMdlNmReg: '선택'}];
			var rtfMdl = [{sbeqpMdlNm: '', sbeqpMdlNmReg: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				resObj.sbeqpMdlNmReg = resObj.sbeqpMdlNm;
				if(resObj.sbeqpClCd == 'R'){
					rtfMdl.push(resObj);
				} else {
					batryMdl.push(resObj);
				}
			}
			$("#searchRtfMdlNm").setData({
				data : rtfMdl
			})
			$("#searchBatryMdlNm").setData({
				data : batryMdl
			})
//			$('#'+flag).setData({
//				data : option_data,
//				option_selected: ''
//			});
		}

		if(flag == 'getVend'){
//			var batryVend = [{sbeqpVendNm: '', sbeqpVendNm: '선택'}];
//			var rtfVend = [{sbeqpVendNm: '', sbeqpVendNm: '선택'}];
//			var arcnVend = [{sbeqpVendNm: '', sbeqpVendNm: '선택'}];
//			var fextnVend = [{sbeqpVendNm: '', sbeqpVendNm: '선택'}];
//			var gntVend = [{sbeqpVendNm: '', sbeqpVendNm: '선택'}];
			var batryVend = [{sbeqpVendNm: '', sbeqpVendNmReg: '선택'}];
			var rtfVend = [{sbeqpVendNm: '', sbeqpVendNmReg: '선택'}];
			var arcnVend = [{sbeqpVendNm: '', sbeqpVendNmReg: '선택'}];
			var fextnVend = [{sbeqpVendNm: '', sbeqpVendNmReg: '선택'}];
			var gntVend = [{sbeqpVendNm: '', sbeqpVendNmReg: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				if(resObj.sbeqpClCd == 'R'){
					resObj.sbeqpVendNmReg = resObj.sbeqpVendNm;
					rtfVend.push(resObj);
				} else if(resObj.sbeqpClCd == 'B'){
					resObj.sbeqpVendNmReg = resObj.sbeqpVendNm;
					batryVend.push(resObj);
				} else if(resObj.sbeqpClCd == 'A'){
					resObj.sbeqpVendNmReg = resObj.sbeqpVendNm;
					arcnVend.push(resObj);
				} else if(resObj.sbeqpClCd == 'F'){
					resObj.sbeqpVendNmReg = resObj.sbeqpVendNm;
					fextnVend.push(resObj);
				} else {
					resObj.sbeqpVendNmReg = resObj.sbeqpVendNm;
					gntVend.push(resObj);
				}
			}
			$("#searchRtfVend").setData({
				data : rtfVend
			})
			$("#searchBatryVend").setData({
				data : batryVend
			})
			$("#searchArcnVend").setData({
				data : arcnVend
			})
			$("#searchFextnVend").setData({
				data : fextnVend
			})
			$("#searchGntVend").setData({
				data : gntVend
			})
//			$('#'+flag).setData({
//				data : option_data,
//				option_selected: ''
//			});
		}


		if(flag == 'excelDownload'){
			$('#'+batryGridId).alopexGrid('hideProgress');
//			console.log('excelCreate');
//			console.log(response);

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
		}
	}
	//request 실패시.
	function failCallback(response, status, jqxhr, flag){

	}
	function batryReg(param){

	}
	var calculateDate = function(option){

		var current_date = new Date();
  		var option_date = new Date(Date.parse(current_date) - option * 1000 * 60 * 60 * 24);

  		var option_Year = option_date.getFullYear();
  		var option_Month = (option_date.getMonth()+1)>9 ? ''+(option_date.getMonth()+1) : '0'+(option_date.getMonth()+1);
  		var option_Day = option_date.getDate() > 9 ? '' + option_date.getDate() : '0' + option_date.getDate();

  		return option_Year + '-' + option_Month + '-' + option_Day;
	};

	this.popup = function(popid,title, url, data, width, height ){
		$a.popup({
			popid: popid,
			title: title,
			url: url,
			data: data,
			iframe: false,
			modal: true,
			movable:true,
			windowpopup:true,
			width : width,
			height : height

		});
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