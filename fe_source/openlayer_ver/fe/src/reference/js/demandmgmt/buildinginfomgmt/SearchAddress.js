/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridEmdId = 'resultPopEmdSearchGrid';
    var gridRoadId = 'resultPopRoadSearchGrid';
	
    var type = "";
    
    var callType = "";
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);
    	
    	//if (param.callType !=null && param.callType != undefined) {
		callType = param.callType;
	    //}
    	
    	initEmdGrid();
    	initRoadGrid();
    	setCombo();
    	setEventListener();
    	
    	
    };
    
    //Grid 초기화
    function initEmdGrid() {
    	
    	var mapping = [
			//공통
			{ 
				key : "sidoNm",
				align : "left",
				width : "90px",
				title : buildingInfoMsgArray['siDo']
			}, {
				key : 'sggNm',
				align:'left',
				width:'180px',
				title : buildingInfoMsgArray['siGunGu']
			}
/*			, {
				key : 'guNm',
				align:'left',
				width:'90px',
				title : '구'
			}*/
			, {
				key : 'emdNm',
				align:'left',
				width:'90px',
				title : buildingInfoMsgArray['eupMyeonDong']
			}
			, {
				key : 'riNm',
				align:'left',
				width:'90px',
				title : buildingInfoMsgArray['ri']
			}
    	];
  		
        //그리드 생성
        $('#'+gridEmdId).alopexGrid({
        	//extend : ['resultPopGrid'],
        	height : 200,
        	width : 770,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            pager : false
            ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        $('#'+gridEmdId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;

        	//console.log(param);
        	
        	var allAddr = param.sidoNm + " " + param.sggNm + " " + param.emdNm;
        	
        	if(param.hasOwnProperty("riNm")) {
        		allAddr = allAddr + " " + param.riNm;
        	}
        	//console.log(param.ldongCd);
        	$('#selectLdongCd').val(param.ldongCd);
        	$('#selectAllAddr').val(allAddr);
        });
    };
    
    //Grid 초기화
    function initRoadGrid() {
    	
    	var mapping = [
			//공통
			{ 
				key : "sidoNm",
				align : "left",
				width : "120px",
				title : buildingInfoMsgArray['siDo']
			}, {
				key : 'sggNm',
				align:'left',
				width:'160px',
				title : buildingInfoMsgArray['siGunGu']
			}
			, {
				key : 'roadNm',
				align:'left',
				width:'160px',
				title : buildingInfoMsgArray['streetName']
			}
			, {
				key : 'bldNumber',
				align:'left',
				width:'100px',
				title : buildingInfoMsgArray['buildingNumber']
			}
			, {
				key : 'bldNm',
				align:'left',
				width:'220px',
				title : buildingInfoMsgArray['buildingName']
			}
    	];
  		
        //그리드 생성
        $('#'+gridRoadId).alopexGrid({
        	//extend : ['resultPopGrid'],
        	height : 200,
        	width : 770,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            pager : false
        });
        
        $('#'+gridRoadId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;

        	//console.log(param);
        	
        	var roadAllAddr = param.sidoNm + " " + param.sggNm + " " + param.roadNm + " " + param.bldNumber;
        	
        	var emdAllAddr = param.sidoNm + " " + param.sggNm + " " + param.emdNm;
        	
        	if(param.hasOwnProperty("riNm")) {
        		emdAllAddr = emdAllAddr + " " + param.riNm;
        	}
        	
        	$("#hiddenEmdAllAddr").val(emdAllAddr);
        	
        	//console.log(param.pnuLtnoCd.substr(11, 1));
        	if(param.pnuLtnoCd.substr(10, 1) == "2") {
        		emdAllAddr = emdAllAddr + " 산 " + param.addrBunjiVal;
        	}
        	else {
        		emdAllAddr = emdAllAddr + " " + param.addrBunjiVal;
        	}
        	
        	//emdAllAddr = emdAllAddr + " " + param.addrBunjiVal;
        	
        	$("#selectRoadAllAddr").val(roadAllAddr);
        	$("#selectEmdAllAddr").val(emdAllAddr);

        	$("#selectRoadBigBunjiVal").val(param.bigBunjiVal);
        	$("#selectRoadSmlBunjiVal").val(param.smlBunjiVal);
        	
        	
        	$("#selectPnuLtnoCd").val(param.pnuLtnoCd);
        	$('#selectLdongCd').val(param.ldongCd);
        	
        	/*var allAddr = param.sidoNm + " " + param.sggNm + " " + param.emdNm;
        	
        	if(param.hasOwnProperty("riNm")) {
        		allAddr = allAddr + " " + param.riNm;
        	}
        	console.log(param.ldongCd);
        	$('#selectLdongCd').val(param.ldongCd);
        	$('#selectAllAddr').val(allAddr);*/
        });
    };
    
    function setCombo() {
    	selectSido("popSidoNm");
    	$("#selectHmstZnNm").setEnabled(false);
    	
    	// 서비스회선시뮬레이션에서 호출시
    	//console.log(callType);
    	if (callType == "SRVC_SIMUL") {
    		$("#selectLndDivCd").prepend("<option value=''>미설정</option>");
    		$("#selectLndDivCd").setSelected("");

			$('#selectBigBunjiVal').setEnabled(false);
			$('#selectSmlBunjiVal').setEnabled(false);
    	}
    }
    
    function setEventListener() {
    	type = "emd";
    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				type = "emd";
    				$('#'+gridEmdId).alopexGrid("viewUpdate");
    				break;
    			case 1 :
    				type = "road";
    				$('#'+gridRoadId).alopexGrid("viewUpdate");
    				break;
    			default :
    				break;
    		}
    	});		
    	
    	$('.Textinput').keydown(function(){
    		if(event.keyCode == 13) {
    			
    			if(type == "emd") {
    				if ($('#popSearchAddress').val() != undefined) {
        				if ($('#popSearchAddress').hasClass("Disabled") == true) {
        					return false;
        				}
        				var value = $.trim($(this).val());
        				$(this).val(value);
        				
        				//console.log(this.id);
        				
        				if(this.id == "searchEmd") {
        					$('#popSearchAddress').click(); 
            				return false;
        				}
        			} 
    			}
    			else {
    				if ($('#popSearchRoadAddress').val() != undefined) {
        				if ($('#popSearchRoadAddress').hasClass("Disabled") == true) {
        					return false;
        				}
        				var value = $.trim($(this).val());
        				$(this).val(value);
        				
        				if(this.id == "popRoadNm" || this.id == "popBldMainNum" || this.id == "popBldSubNum") {
        					$('#popSearchRoadAddress').click(); 
            				return false;
        				}
        			} 
    			}
    		}
    	});
    	
    	$('#popSearchAddress').on('click', function(e) {
    		
    		if($('#searchEmd').val() == "") {
    			alertBox('W',makeArgMsg('required', buildingInfoMsgArray['eupMyeonDong']));
    			return false;
    		}
    		
        	var dataParam = {
        		emdNm : $('#searchEmd').val()
        		, searchType : "jibun"
        	};
        	bodyProgress();
        	//showProgress(gridEmdId);
        	searchAddressRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/addresslist', dataParam, 'GET', 'popSearchAddressList');
        });
    	
    	$('#selectLndDivCd').on('change', function(e) {
    		//지구(블록)인 경우에만 택지지구명 InputText 활성화
    		if($('#selectLndDivCd option:selected').val() != "3") {
    			$("#selectHmstZnNm").val("");
    			$("#selectHmstZnNm").setEnabled(false);
    			
    			$('#selectBigBunjiVal').setEnabled(true);
    			$('#selectSmlBunjiVal').setEnabled(true);
    		}
    		else {
    			$('#selectHmstZnNm').setEnabled(true);
    			
    			$('#selectBigBunjiVal').val("");
    			$('#selectSmlBunjiVal').val("");
    			$('#selectBigBunjiVal').setEnabled(false);
    			$('#selectSmlBunjiVal').setEnabled(false);
    		}
    		
    		// 서비스회선시뮬레이션에서 호출시
        	if (callType == "SRVC_SIMUL") {
        		if (nullToEmpty($('#selectLndDivCd option:selected').val()) == "") {
        			/*지구명*/
        			$('#selectHmstZnNm').val("");
        			$('#selectHmstZnNm').setEnabled(false);
        			
        			/*번지*/
        			$('#selectBigBunjiVal').val("");
        			$('#selectSmlBunjiVal').val("");
        			$('#selectBigBunjiVal').setEnabled(false);
        			$('#selectSmlBunjiVal').setEnabled(false);
        		}
    		}
        });
    	
    	$('#popSidoNm').on('change', function(e) {
        	if($('#popSidoNm').val() != "") {
        		selectSgg("popSggNm", $('#popSidoNm').val());
        	}
        	else {
        		selectSgg("popSggNm", ' ');
        	}
        });
    	
    	$('#popSearchRoadAddress').on('click', function(e) {
    		
    		var selectSidoNm = $("#popSidoNm option:selected").text();
    		var selectSggNm = $("#popSggNm option:selected").text();
    		var selectRoadNm = $("#popRoadNm").val();
    		
    		if(selectSidoNm == "전체") {
    			selectSidoNm = "";
    		}
    		
    		if(selectSggNm == "전체") {
    			selectSggNm = "";
    		}
    		
    		// 시도 필수
    		if(selectSidoNm == "") {
    			alertBox('W',makeArgMsg('required', buildingInfoMsgArray['siDo']));
    			return false;
    		}
    		
    		/*if(selectSidoNm != "세종" && selectSggNm == "" && selectRoadNm == "") {
    			alertBox('W',buildingInfoMsgArray['streetNameInputForBuildingInfo']);
    			return false;
    		}*/

    		// 시도 중에서 세종시 일경우 도로명만 체크, 세종시가 아닌 경우는 시군구, 도로명 까지 다 체크
    		if(selectSidoNm == "세종") {
    			if(selectRoadNm == "") {
    				alertBox('W',buildingInfoMsgArray['streetNameInputForBuildingInfo']);
        			return false;
    			}
    		}
    		else {
    			if(selectSggNm == "") {
    				alertBox('W',makeArgMsg('required', buildingInfoMsgArray['siGunGu']));
        			return false;
    			}
    			else {
    				if(selectRoadNm == "") {
    					alertBox('W',buildingInfoMsgArray['streetNameInputForBuildingInfo']);
            			return false;
    				}
    			}
    		}
    		
    		var dataParam = {
    				sidoNm : selectSidoNm
    				, sggNm : selectSggNm
    				, roadNm : selectRoadNm
    				, bldMainNumber : $("#popBldMainNum").val()
    				, bldSubNumber : $("#popBldSubNum").val()
            		, searchType : "road"
            };
    		bodyProgress();
    		//showProgress(gridRoadId);
    		searchAddressRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/addresslist', dataParam, 'GET', 'popSearchRoadAddressList');
    		
    		//alert("SK주소센터 방화벽이 막혀있어 도로명 주소 검색은 현재 불가능 합니다.");
    		//return false;
    	});
    	
     	// 취소
        $('#btnSearchAddressCancel').on('click', function(e) {
        	$a.close();
        });
        
        $('#btnSearchAddressSend').on('click', function(e) {
        	// 서비스회선 시뮬레이션에서 호출한 경우 필수체크조건 변경
        	if (callType == "SRVC_SIMUL") {
        		 procForServiceSimulation();
        	} 
        	// 기존 체크로직
        	else {
	        	if(type == "emd") {
	        		if($('#selectAllAddr').val() == "") {
	            		alertBox('W',buildingInfoMsgArray['searchAddressListDoubleClickSelectForBuildingInfo']);
	            		return false;
	            	}
	            	
	        		if($('#selectLndDivCd option:selected').val() == "3") {
	        			if($("#selectHmstZnNm").val() == "" || $("#selectHmstZnNm").val().trim() == "") {
	        				alertBox('W',buildingInfoMsgArray['requiredLndDivHmstZnName']);
	                		return false;
	        			}
	        		}
	        		else {
	        			if($('#selectBigBunjiVal').val() == "" || 
	        					$('#selectBigBunjiVal').val() == "0" || $('#selectBigBunjiVal').val() == "00" ||
	        					$('#selectBigBunjiVal').val() == "000" || $('#selectBigBunjiVal').val() == "0000") {
	                		alertBox('W',makeArgMsg('required', buildingInfoMsgArray['mainBunji']));
	                		return false;
	                	}
	                	
	                	if($('#selectBigBunjiVal').val() != "") {
	                		if($('#selectBigBunjiVal').val().length > 4) {
	                			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['mainBunji']));
	                    		return false;
	                		}
	                	}
	                	
	                	if($('#selectSmlBunjiVal').val() != "") {
	                		if($('#selectSmlBunjiVal').val().length > 4) {
	                			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['subBunji']));
	                    		return false;
	                		}
	                	}
	        		}
	            	
	            	//PNU 생성
	            	var pad = "0000";
	            	var bigBunji = $('#selectBigBunjiVal').val();
	            	var smlBunji = $('#selectSmlBunjiVal').val();
	            	
	            	var bunjiVal = "";
	            	
	            	if(smlBunji.length == 0) {
	            		bunjiVal = parseInt(bigBunji);
	            	}
	            	else {
	            		bunjiVal = parseInt(bigBunji) + "-" + parseInt(smlBunji);
	            	}
	            	//console.log("bunjiVal");
	            	//console.log(bunjiVal);
	            	var bigBunjiPad = pad.substring(0, pad.length - bigBunji.length) + bigBunji;
	            	var smlBunjiPad = pad.substring(0, pad.length - smlBunji.length) + smlBunji;
	            	
	            	var pnu = $('#selectLdongCd').val() + $('#selectLndDivCd option:selected').val() + bigBunjiPad + smlBunjiPad;
	            	$('#selectPnuLtnoCd').val(pnu);
	            	
	            	var dataParam =  $("#searchAddressForm").getData();
	            	
	            	if($('#selectLndDivCd option:selected').val() == "3") {
	            		dataParam.bunjiVal = "블록";
	            	}
	            	else {
	            		dataParam.bunjiVal = bunjiVal;
	            	}
	            	
	            	//dataParam.bunjiVal = bunjiVal;
	            	//console.log("final");
	            	//console.log(dataParam);
	            	
	            	$a.close(dataParam);
	        	}
	        	else if(type == "road") {
	        		
	        		if($('#selectRoadAllAddr').val() == "") {
	            		alertBox('W',buildingInfoMsgArray['searchAddressListDoubleClickSelectForBuildingInfo']);
	            		return false;
	            	}
	        		
	        		var dataParam =  $("#searchAddressForm").getData();
	        		     		
	            	
	            	dataParam.selectSmlBunjiVal = $("#selectRoadSmlBunjiVal").val();
	            	dataParam.selectBigBunjiVal = $("#selectRoadBigBunjiVal").val();
	            	dataParam.selectAllAddr = $("#hiddenEmdAllAddr").val();
	            	dataParam.selectLndDivCd = $("#selectPnuLtnoCd").val().substr(10,1);
	            	
	            	//console.log("final");
	            	//console.log(dataParam);
	            	
	            	var bigBunji = $("#selectRoadBigBunjiVal").val();
	            	var smlBunji = $("#selectRoadSmlBunjiVal").val();
	            	
	            	var bunjiVal = "";
	            	
	            	if(smlBunji.length == 0) {
	            		bunjiVal = bigBunji;
	            	}
	            	else {
	            		bunjiVal = bigBunji + "-" + smlBunji;
	            	}
	            	
	            	if(dataParam.selectLndDivCd == "3") {
	            		dataParam.bunjiVal = "블록";
	            	}
	            	else {
	            		dataParam.bunjiVal = bunjiVal;
	            	}
	            	//console.log("bunji final");
	            	$a.close(dataParam);
	        	}
        	}
        });
	};
	
	//request
	function searchAddressRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successSearchAddressCallback(response, sflag);})
    	  .fail(function(response){failSearchAddressCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successSearchAddressCallback(response, flag){
    	if(flag == 'popSearchAddressList'){
    		bodyProgressRemove();
    		//hideProgress(gridEmdId);
    		//console.log(response);
    		$('#'+gridEmdId).alopexGrid("dataSet", response.list);
    		//$("#total").html(response.totalCnt);	
    	}
    	else if(flag = 'popSearchRoadAddressList') {
    		bodyProgressRemove();
    		//hideProgress(gridRoadId);
    		//console.log(response);
    		$('#'+gridRoadId).alopexGrid("dataSet", response.list);
    		//$("#total").html(response.totalCnt);	
    	}
    }
    
    //request 실패시.
    function failSearchAddressCallback(serviceId, response, flag){
    	if(flag == 'popSearchAddressList'){
    		//bodyProgressRemove();
    		//hideProgress(gridEmdId);
    	}
    	else if(flag = 'popSearchRoadAddressList') {
    		//bodyProgressRemove();
    		//hideProgress(gridRoadId);
    	}
    	bodyProgressRemove();
    	//console.log(response);
    	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
    }
    
    // 서비스 시뮬레이션용 주소검색의 경우
    function procForServiceSimulation() {
    	if(type == "emd") {
    		if($('#selectAllAddr').val() == "") {
        		alertBox('W',buildingInfoMsgArray['searchAddressListDoubleClickSelectForBuildingInfo']);
        		return false;
        	}
        	
    		if($('#selectLndDivCd option:selected').val() == "3") {
    			if($("#selectHmstZnNm").val() == "" || $("#selectHmstZnNm").val().trim() == "") {
    				alertBox('W',buildingInfoMsgArray['requiredLndDivHmstZnName']);
            		return false;
    			}
    		}
    		else if (nullToEmpty($('#selectLndDivCd option:selected').val()) != "") {
    			if($('#selectBigBunjiVal').val() == "" || 
    					$('#selectBigBunjiVal').val() == "0" || $('#selectBigBunjiVal').val() == "00" ||
    					$('#selectBigBunjiVal').val() == "000" || $('#selectBigBunjiVal').val() == "0000") {
            		alertBox('W',makeArgMsg('required', buildingInfoMsgArray['mainBunji']));
            		return false;
            	}
            	
            	if($('#selectBigBunjiVal').val() != "") {
            		if($('#selectBigBunjiVal').val().length > 4) {
            			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['mainBunji']));
                		return false;
            		}
            	}
            	
            	if($('#selectSmlBunjiVal').val() != "") {
            		if($('#selectSmlBunjiVal').val().length > 4) {
            			alertBox('W',makeArgMsg('inputBunjiForBuildingInfo', buildingInfoMsgArray['subBunji']));
                		return false;
            		}
            	}
    		}
        	
        	//PNU 생성
        	var pad = "0000";
        	var bigBunji = $('#selectBigBunjiVal').val();
        	var smlBunji = $('#selectSmlBunjiVal').val();
        	
        	var bunjiVal = "";
        	
        	if(smlBunji.length == 0) {
        		bunjiVal = parseInt(bigBunji);
        	}
        	else {
        		bunjiVal = parseInt(bigBunji) + "-" + parseInt(smlBunji);
        	}
        	//console.log("bunjiVal");
        	//console.log(bunjiVal);
        	var bigBunjiPad = pad.substring(0, pad.length - bigBunji.length) + bigBunji;
        	var smlBunjiPad = pad.substring(0, pad.length - smlBunji.length) + smlBunji;
        	
        	var pnu = $('#selectLdongCd').val() + $('#selectLndDivCd option:selected').val() + bigBunjiPad + smlBunjiPad;
        	$('#selectPnuLtnoCd').val(pnu);
        	
        	var dataParam =  $("#searchAddressForm").getData();
        	
        	
        	if($('#selectLndDivCd option:selected').val() == "3") {
        		dataParam.bunjiVal = "블록";
        	}
        	else {
        		dataParam.bunjiVal = bunjiVal;
        	}
        	
        	//dataParam.bunjiVal = bunjiVal;
        	//console.log("final");
        	//console.log(dataParam);
        	
        	$a.close(dataParam);
    	}
    	else if(type == "road") {
    		
    		if($('#selectRoadAllAddr').val() == "") {
        		alertBox('W',buildingInfoMsgArray['searchAddressListDoubleClickSelectForBuildingInfo']);
        		return false;
        	}
    		
    		var dataParam =  $("#searchAddressForm").getData();
    		     		
        	
        	dataParam.selectSmlBunjiVal = $("#selectRoadSmlBunjiVal").val();
        	dataParam.selectBigBunjiVal = $("#selectRoadBigBunjiVal").val();
        	dataParam.selectAllAddr = $("#hiddenEmdAllAddr").val();
        	dataParam.selectLndDivCd = $("#selectPnuLtnoCd").val().substr(10,1);
        	
        	//console.log("final");
        	//console.log(dataParam);
        	
        	var bigBunji = $("#selectRoadBigBunjiVal").val();
        	var smlBunji = $("#selectRoadSmlBunjiVal").val();
        	
        	var bunjiVal = "";
        	
        	if(smlBunji.length == 0) {
        		bunjiVal = bigBunji;
        	}
        	else {
        		bunjiVal = bigBunji + "-" + smlBunji;
        	}
        	
        	if(dataParam.selectLndDivCd == "3") {
        		dataParam.bunjiVal = "블록";
        	}
        	else {
        		dataParam.bunjiVal = bunjiVal;
        	}
        	//console.log("bunji final");
        	$a.close(dataParam);
    	}
    }
});