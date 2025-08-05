/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var excelGrid = 'eqpDataGrid';
	var invtParam = "";



	var grMdlList		= [];
	var grJrdtTeamList	= [];
	var grOpTeamList	= [];
	var grShtgItmCd		= [];
	var grEqpTypMsg		= '';
	var paramData = null;
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();

		$('#btnEdit').setEnabled(false);		// 최초 선택시에는 수정버튼 비활성


	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgId');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOpTeamGrp', null, 'GET', 'opTeamOrgId');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getRegEqpMdlList', null, 'GET', 'regEqpMdlList');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MDLTYPE', null, 'GET', 'eqpTyp');
	}

	Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}

	function colColorChange(code) {
		var color = '#000000';
		switch(code)  {
		case "1":
			color = "#ff253a";	// 불가
			break;
		case "2":
			color = "#3191e8";	// 변경 데이터
			break;
		case "3":
			color = "#ff7e00";	// 변경 데이터
			break;
		}
		return color;

	}

	function setIsNaNCheck(strVal) {
		if (isNaN(strVal)) { strVal = 0; }
		return strVal;
	}

	function initGrid() {


		$('#'+excelGrid).alopexGrid({

            fitTableWidth : true,
//            rowClickSelect : true,
            rowClickSelect : false,   // 체크박스 선택시에만
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,

			pager : false,
			autoColumnIndex: true,
			height : '6row',
			autoResize: true,
			defaultState : {
//				dataSet : {editing : true}
			},
			excelWorker :{
				importOption : {
					columnOrderToKey : true
				}
			},
			columnFixUpto : 'eqpNm',
			columnMapping: [
				{key : 'check',width:'40px',selectorColumn : true},
				{ key : 'errMge', align:'center', title : '순번', width: '50px'},
				{ key : 'eqpIntgFcltsCd', align:'center', title : '장비통시코드', width: '100px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.eqpIntgFcltsCdErr == 0){
							return 'red';
						}

					}
					}},
				{ key : 'eqpNm', align:'center', title : '장비명', width: '150px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.eqpNmErr == 0){
							return 'red';
						}

					}
				}},
//				{ key : 'eqpTid', align:'center', title : '장비TID', width: '150px' },
//	   			{ key : 'mainEqpIpAddr', align:'center', title : '장비IP', width: '110px' },
//	   			{ key : 'eqpHostNm', align:'center', title : '호스트명', width: '110px' },
	   			{ key : 'barNo', align:'center', title : '바코드', width: '130px'},
    			{ key : 'cstrCd', align:'center', title : '공사코드', width: '120px'},
    			{ key : 'wkrtNo', align:'center', title : '작업지시번호', width: '120px'},
    			{ key : 'eqpMdlNm', align:'center', title : '장비모델명', width: '130px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.eqpMdlNmErr == 0){
							return 'red';
						}

					}
					}},
    			{ key : 'intgFcltsCd', align:'center', title : '국사통시코드', width: '100px'},
    			{ key : 'eqpInstlMtsoNm', align:'center', title : '국사명', width: '100px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.eqpInstlMtsoNmErr == 0){
							return 'red';
						}

					}
					}},
    			{ key : 'jrdtTeamOrgNm', align:'center', title : '관리팀', width: '100px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.jrdtTeamOrgNmErr == 0){
							return 'red';
						}

					}
					}},
    			{ key : 'opTeamOrgNm', align:'center', title : '운용팀', width: '100px',inlineStyle : {
					color: function(value,data,mapping){
						if(data.opTeamOrgNmErr == 0){
							return 'red';
						}

					}
						}},
    			{ key : 'eqpRmk', align:'center', title : '비고', width: '100px'},

    			/***********************************************
	   			 * Row Check
	   			***********************************************/
    			{ key : 'eqpMdlId', align:'center', title : '장비모델ID', width: '100px', hidden : true},
    			{ key : 'jrdtTeamOrgId', align:'center', title : '관리팀ID', width: '100px', hidden : true},
    			{ key : 'opTeamOrgId', align:'center', title : '운용팀ID', width: '100px', hidden : true},
    			{ key : 'eqpInstlMtsoId', align:'center', title : '국사ID', width: '100px', hidden : true},

    			{ key : 'eqpRoleDivCd', align:'center', title : '장비타입', width: '100px', hidden : true},
    			{ key : 'portCnt', align:'center', title : '포트CNT', width: '100px', hidden : true},
    			{ key : 'ownBizrCd', align:'center', title : '소유사업자', width: '100px', hidden : true},


    			{ key : 'eqpNmErr', align:'center', title : '장비명Err', width: '100px', hidden : true},
    			{ key : 'eqpMdlNmErr', align:'center', title : '장비모델Err', width: '100px', hidden : true},
    			{ key : 'eqpInstlMtsoNmErr', align:'center', title : '국사Err', width: '100px', hidden : true},
    			{ key : 'jrdtTeamOrgNmErr', align:'center', title : '관리팀Err', width: '100px', hidden : true},
    			{ key : 'opTeamOrgNmErr', align:'center', title : '운용팀Err', width: '100px', hidden : true},
    			{ key : 'rowDelYn', align:'center', title : 'row삭제용', width: '100px', hidden : true}

	   		],
	   		message: {
	   		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
       });
	}

	function isUndefinedCheck(str) {
		var reStr = str;
		if(typeof str == 'undefined' && str == undefined){
			reStr = '';
		} else {
			reStr = str.toString().replace(/,/gi, '');
		}
		return reStr;
	}

	function isNaNCheck(str) {
		var reStr = '0';
		if(typeof str != 'undefined' && str != undefined && str != ''){
			str = str.toString().replace(/,/gi, '');
			if (isNaN(str)) {
				reStr = "1";
			}
		}
		return reStr;
	}

	function isExcelToDBCheck(excelStr, dbStr, baseDate, dbDate) {
		var reStr = '0';

		if (typeof excelStr != 'undefined' && excelStr != undefined) {
			excelStr = excelStr.toString().replace(/ /gi, '').replace(/,/gi, '');
		} else {
			excelStr = '';
		}

		if (typeof dbStr != 'undefined' && dbStr != undefined) {
			dbStr = dbStr.toString().replace(/ /gi, '').replace(/,/gi, '');
		} else {
			dbStr = '';
		}

		if (excelStr != dbStr) {
			reStr = '2';
			if(typeof dbDate != 'undefined' && dbDate != undefined && dbDate != ''){
				if (baseDate < dbDate) { reStr = '3'; }
			}
		}
		return reStr;
	}



	function setEventListener() {
		$('#uploadfile').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('dataEmpty');
			$('#'+excelGrid).alopexGrid('showProgress');
			var $input = $(this);
			var $grid = $('#'+excelGrid);
			var files = e.target.files;
			var worker = new ExcelWorker();
			worker.import($grid, files, function(dataList){
				dataList.shift();							// 첫번째 배열 삭제
				$grid.alopexGrid('dataAdd', dataList);
			});
			//$input.val('');

			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getRegEqpMdlList', null, 'GET', 'search');

		});




		$('#btnUpload').on('click', function(e) {
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			var eqpNmCount 			= 0;
			var eqpMdlNmCount 		= 0;
			var eqpInstlMtsoNmCount = 0;
			var jrdtTeamOrgNmCount 	= 0;
			var eqpIntgFcltsCdCount   = 0;
    		for(var i in dataObj) {
    			if (dataObj[i].eqpNmErr == "0") {
    				eqpNmCount += 1;
    			}
    			if (dataObj[i].eqpMdlNmErr == "0") {
    				eqpMdlNmCount += 1;
    			}
    			if (dataObj[i].eqpInstlMtsoNmErr == "0") {
    				eqpInstlMtsoNmCount += 1;
    			}
    			if (dataObj[i].jrdtTeamOrgNmErr == "0") {
    				jrdtTeamOrgNmCount += 1;
    			}
    			if (dataObj[i].eqpIntgFcltsCdErr == "0") {
    				eqpIntgFcltsCdCount += 1;
    			}
    		}
    		if (eqpNmCount > 0 || eqpMdlNmCount > 0  || eqpInstlMtsoNmCount > 0  || jrdtTeamOrgNmCount > 0 || eqpIntgFcltsCdCount > 0 ) {
    			var magText = '--------------------------------------------<br>';
    			if (eqpNmCount > 0) {
    				magText += '장비명(네이밍룰) : ' + eqpNmCount + '개<br>';
    			}
    			if (eqpMdlNmCount > 0) {
    				magText += '장비모델명 : ' + eqpMdlNmCount + '개<br>';
    			}
    			if (eqpInstlMtsoNmCount > 0) {
    				magText += '국사명 : ' + eqpInstlMtsoNmCount + '개<br>';
    			}
    			if (jrdtTeamOrgNmCount > 0) {
    				magText += '관리팀 : ' + jrdtTeamOrgNmCount + '개<br>';
    			}

    			if (eqpIntgFcltsCdCount > 0) {
    				magText += '장비통시코드 : ' + eqpIntgFcltsCdCount + '개<br>';
    			}
    			magText += '--------------------------------------------';
    			alertBox('W', '업로드 필수 항목중 오류가 발생하였습니다.(오류 항목을 수정하여 주시기 바랍니다.)<br><br>'+magText);
    		} else {

    			var paramData = '';

    			callMsgBox('','C', '해당 목록을 업로드 하시겠습니까?', function(msgId, msgRst){
  			       //저장한다고 하였을 경우
	 		        if (msgRst == 'Y') {
	 		        	var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
	 	    			var eqpNmCount 			= 0;
	 	    			var eqpMdlNmCount 		= 0;
	 	    			var eqpInstlMtsoNmCount = 0;
	 	    			var jrdtTeamOrgNmCount 	= 0;
	 	        		for(var i in dataObj) {
	 	        			var eqpStatCd = '01';
	 	        			var eqpNm = dataObj[i].eqpNm;
//	 	        			var eqpTid = dataObj[i].eqpTid;
//	 	        			var mainEqpIpAddr = dataObj[i].mainEqpIpAddr;
//	 	        			var eqpHostNm = dataObj[i].eqpHostNm;
	 	        			var eqpTid = '';
	 	        			var mainEqpIpAddr = '';
	 	        			var eqpHostNm = '';
	 	        			var barNo = dataObj[i].barNo;
	 	        			var cstrMgno = dataObj[i].cstrCd;
	 	        			var wkrtNo = dataObj[i].wkrtNo;
	 	        			var eqpMdlId = dataObj[i].eqpMdlId;
	 	        			var eqpInstlMtsoId = dataObj[i].eqpInstlMtsoId;
	 	        			var jrdtTeamOrgId = dataObj[i].jrdtTeamOrgId;
	 	        			var opTeamOrgId = dataObj[i].opTeamOrgId;
	 	        			var eqpRmk = dataObj[i].eqpRmk;
	 	        			var eqpRoleDivCd = dataObj[i].eqpRoleDivCd;
	 	        			var portCnt = dataObj[i].portCnt;
	 	        			var ownBizrCd = dataObj[i].ownBizrCd;
	 	        			var eqpIntgFcltsCd = dataObj[i].eqpIntgFcltsCd;

	 	        			if (mainEqpIpAddr == undefined) {mainEqpIpAddr = '';}
	 	        			if (eqpHostNm == undefined) {eqpHostNm = '';}
	 	        			if (barNo == undefined) {barNo = '';}
	 	        			if (cstrMgno == undefined) {cstrMgno = '';}
	 	        			if (wkrtNo == undefined) {wkrtNo = '';}
	 	        			if (eqpRmk == undefined) {eqpRmk = '';}
	 	        			if (portCnt == undefined) {portCnt = '';}

	 	        			var dablMgmtYn = "Y";
	 	        			var eqpAutoRegYn = "N";
	 	        			var intgEqpYn = "N";
	 	        			var eqpId = "DV***********";
//	 	        			var ownBizrCd = "01";
	 	        			var regYn = "N";
	 	        			var skt2EqpYn = "N";

	 	        			var userId;
	 	        			if($("#userId").val() == ""){
	 	        				 userId = "SYSTEM";
	 	        			}else{
	 	        				 userId = $("#userId").val();
	 	        			}

	 	        			var frstRegUserId = userId;
	 	        			var lastChgUserId = userId;

	 	        			var paramData = {
	 	        					eqpStatCd 			: eqpStatCd,
	 	        					eqpNm				: eqpNm,
	 	        					eqpTid				: eqpTid,
	 	        					mainEqpIpAddr		: mainEqpIpAddr,
	 	        					eqpInstlMtsoId		: eqpInstlMtsoId,
	 	        					eqpHostNm			: eqpHostNm,
	 	        					barNo				: barNo,
	 	        					cstrMgmtNo			: cstrMgno,
	 	        					wkrtNo				: wkrtNo,
	 	        					eqpMdlId			: eqpMdlId,
	 	        					jrdtTeamOrgId		: jrdtTeamOrgId,
	 	        					opTeamOrgId			: opTeamOrgId,
	 	        					eqpRmk				: eqpRmk,
	 	        					eqpRoleDivCd		: eqpRoleDivCd,
	 	        					portCnt				: portCnt,
	 	        					dablMgmtYn			: dablMgmtYn,
	 	        					eqpAutoRegYn		: eqpAutoRegYn,
	 	        					intgEqpYn			: intgEqpYn,
	 	        					eqpId				: eqpId,
	 	        					ownBizrCd			: ownBizrCd,
	 	        					regYn				: regYn,
	 	        					skt2EqpYn			: skt2EqpYn,
	 	        					intgFcltsCd           : eqpIntgFcltsCd,
	 	        					frstRegUserId		: frstRegUserId,
	 	        					lastChgUserId		: lastChgUserId
	 	        			};
//	 	        			console.log(paramData);
//	 	        			alert();
	 	        			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/insertEqpMgmt', paramData, 'POST', 'saveOk');
	 	        		}

	 		        }
    			});

    		}

		});


		$('#btnEqpMdlSearch').on('click', function(e) {
   		 orgJrdtTeamOrgId = $('#jrdtTeamOrgIdReg').val();
   		 orgEqpRoleDivCdSave = $('#eqpRoleDivCdReg').val();
   		 $a.popup({
   	          	popid: 'EqpMdlLkup',
   	          	title: configMsgArray['equipmentModelLkup'],
   	            url: '/tango-transmission-web/configmgmt/equipment/EqpMdlLkup.do',
   	            windowpopup : true,
   	            data: '',
   	            modal: true,
                movable:true,
   	            width : 950,
   	           	height : window.innerHeight * 0.9,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	           		var checkYn = false;
   	           		var eqpRuleRmk 		= $('#eqpRule').val();
   	           		var eqpRoleDivCd	= $('#eqpRoleDivCdReg').val();
   	           		var portCnt			= $('#portCntReg').val();
		   	      	for(j in grMdlList) {
						if (data.eqpMdlId == grMdlList[j].eqpMdlId) {
							checkYn 		= true;
							eqpRuleRmk 		= grMdlList[j].eqpRuleRmk;
							eqpRoleDivCd 	= grMdlList[j].eqpRoleDivCd;
							portCnt 		= grMdlList[j].portCnt;
							continue;
						}
					}
		   	      	if (checkYn) {
			   	      	$('#eqpMdlNmReg').val(data.eqpMdlNm);
		                $('#eqpMdlIdReg').val(data.eqpMdlId);
		                $('#eqpRoleDivCdReg').val(eqpRoleDivCd);
		                $('#portCntReg').val(portCnt);
		                $('#eqpRule').val(eqpRuleRmk);


		                var eqpMdlId = data.eqpMdlId;
		    			var eqpNm = $('#eqpNmReg').val();
		    			for(j in grMdlList) {
		    				if (eqpMdlId == grMdlList[j].eqpMdlId) {
		    					nameCk = ruleChk(eqpNm, grMdlList[j].eqpRglaExprVal);

		    					if (nameCk > 0) {
		    						$('#eqpRuleErrMsg').val("");
		    					} else {
		    						$('#eqpRuleErrMsg').val("'"+eqpNm+"' 의 표기법은 옳바르지 않습니다.");
		    					}
		    					continue;
		    				}
		    			}



		   	      	} else {
		   	      		alertBox('W', grEqpTypMsg + ' 장비타입만 등록 가능합니다.');
		   	      	}

   	           	}
   	      });
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
   	           	height : window.innerHeight * 0.8,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행

       			$('#eqpInstlMtsoNmReg').val(data.mtsoNm);
                $('#eqpInstlMtsoIdReg').val(data.mtsoId);
                $('#jrdtTeamOrgIdReg').setData({ jrdtTeamOrgId:data.teamId });
                $('#opTeamOrgIdReg').setData({ opTeamOrgId:data.teamId });

                if(data.mgmtGrpNm == "SKT"){
                	$('#ownBizrCdReg').val("01");
                }else if(data.mgmtGrpNm == "SKB"){
                	$('#ownBizrCdReg').val("02");
                }


   	           	}
   		 	});
		});

		$('#btnExportExcelOnDemand').on('click', function(e) {
			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="sample_multi_eqp.xlsx" /><input type="hidden" name="fileExtension" value="xlsx" />');
			$form.append('<input type="hidden" name="type" value="excelUploadFile" />');
			$form.append('<input type="hidden" name="sampleFileType" value="장비멀티등록샘플" />');
			$form.appendTo('body');
			$form.submit().remove();
        });

		var selectGridId = "";
		$('#'+excelGrid).on('click', '.bodycell', function(e){
//		$('#'+excelGrid).on('dblclick', '.bodycell', function(e){

			$('#eqpNmReg').val('');
// 			$('#eqpTidReg').val('');
 			$('#eqpInstlMtsoIdReg').val('');
 			$('#eqpInstlMtsoNmReg').val('');
// 			$('#mainEqpIpAddrReg').val('');
// 			$('#eqpHostNmReg').val('');
 			$('#eqpMdlIdReg').val('');
 			$('#eqpMdlNmReg').val('');
 			$('#cstrMgnoReg').val('');
 			$('#wkrtNoReg').val('');

 			$('#barNoReg').val('');
 			$('#jrdtTeamOrgIdReg').setData('');
 			$('#opTeamOrgIdReg').setData('');
 			$('#eqpRmkReg').val('');

 			$('#eqpRoleDivCdReg').val('');
 			$('#portCntReg').val('');
 			$('#eqpRule').val('');
 			$('#eqpRuleErrMsg').val('');

 			$('#intgFcltsCdReg').val('');


 			var dataObj = null;
 			dataObj = AlopexGrid.parseEvent(e).data;

 			$('#btnEdit').setEnabled(true);

 			selectGridId = dataObj._index.id;
 			$('#eqpNmReg').val(dataObj.eqpNm);
// 			$('#eqpTidReg').val(dataObj.eqpTid);
 			$('#eqpInstlMtsoIdReg').val(dataObj.eqpInstlMtsoId);
 			$('#eqpInstlMtsoNmReg').val(dataObj.eqpInstlMtsoNm);
// 			$('#mainEqpIpAddrReg').val(dataObj.mainEqpIpAddr);
// 			$('#eqpHostNmReg').val(dataObj.eqpHostNm);
 			$('#eqpMdlIdReg').val(dataObj.eqpMdlId);
 			$('#eqpMdlNmReg').val(dataObj.eqpMdlNm);
 			$('#cstrMgnoReg').val(dataObj.cstrCd);
 			$('#wkrtNoReg').val(dataObj.wkrtNo);

 			$('#barNoReg').val(dataObj.barNo);
 			$('#jrdtTeamOrgIdReg').setData({jrdtTeamOrgId : dataObj.jrdtTeamOrgId});
 			$('#opTeamOrgIdReg').setData({opTeamOrgId : dataObj.opTeamOrgId});
 			$('#eqpRmkReg').val(dataObj.eqpRmk);

 			$('#eqpRoleDivCdReg').val(dataObj.eqpRoleDivCd);
 			$('#portCntReg').val(dataObj.portCnt);

 			$('#ownBizrCdReg').val(dataObj.ownBizrCd);
 			$('#intgFcltsCdReg').val(dataObj.eqpIntgFcltsCd);


 			for(j in grMdlList) {
				if (dataObj.eqpMdlNm == grMdlList[j].eqpMdlNm) {
					$('#eqpRule').val(grMdlList[j].eqpRuleRmk);
					continue;
				}
			}

 		});
//
		$('#btnEdit').on('click', function(e){

 			var eqpNm = $('#eqpNmReg').val();
 			var eqpTid = '';
 			var eqpInstlMtsoId = $('#eqpInstlMtsoIdReg').val();
 			var eqpInstlMtsoNm = $('#eqpInstlMtsoNmReg').val();
 			var mainEqpIpAddr = '';
 			var eqpHostNm = '';
 			var eqpMdlId = $('#eqpMdlIdReg').val();
 			var eqpMdlNm = $('#eqpMdlNmReg').val();

 			var eqpRoleDivCd = $('#eqpRoleDivCdReg').val();
 			var portCnt = $('#portCntReg').val();

 			var cstrMgno = $('#cstrMgnoReg').val();
 			var wkrtNo = $('#wkrtNoReg').val();

 			var barNo = $('#barNoReg').val();
 			var jrdtTeamOrgId = $('#jrdtTeamOrgIdReg').val();
 			var ownBizrCd = $('#ownBizrCdReg').val();

 			var eqpIntgFcltsCd = $('#intgFcltsCdReg').val();


 			for(j in grJrdtTeamList) {
    				if (jrdtTeamOrgId == grJrdtTeamList[j].orgId) {
    					var jrdtTeamOrgNm = grJrdtTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ','');
    					break;
    				}
          	  }

 			var opTeamOrgId = $('#opTeamOrgIdReg').val();

 			 for(j in grOpTeamList) {
     				if (opTeamOrgId == grOpTeamList[j].orgId) {
     					var opTeamOrgNm = grOpTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ','');
     					break;
     				}
           	  }





 			var eqpRmk = $('#eqpRmkReg').val();
 			if (eqpNm == "" || eqpNm == "-") {
 				alertBox('W', '장비명은 필수 항목입니다.');
 			} else if (eqpInstlMtsoId == "") {
 				alertBox('W', '국사명은 필수 항목입니다.');
 			} else if (eqpMdlId == "") {
 				alertBox('W', '장비모델 선택은 필수 항목입니다.');
 			} else if (jrdtTeamOrgId == "") {
 				alertBox('W', '관리팀 선택은 필수 항목입니다.');
 			} else if (eqpIntgFcltsCd == "" && cstrMgno != "") {
 				alertBox('W', '공사코드가 존재하는 경우에는 장비통시코드가 필수 항목입니다.');
 			}else {
 				var nameCk = 0;
 				for(j in grMdlList) {
 					if (eqpMdlNm == grMdlList[j].eqpMdlNm) {
 						nameCk = ruleChk(eqpNm, grMdlList[j].eqpRglaExprVal);
 						continue;
 					}
 				}

 				if (nameCk > 0) {
 					$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpNm : eqpNm, eqpTid : eqpTid, eqpInstlMtsoId : eqpInstlMtsoId, eqpInstlMtsoNm : eqpInstlMtsoNm, mainEqpIpAddr : mainEqpIpAddr
 		 				, eqpHostNm : eqpHostNm, eqpMdlId : eqpMdlId, eqpMdlNm : eqpMdlNm, eqpRoleDivCd : eqpRoleDivCd, portCnt : portCnt, cstrCd : cstrMgno, wkrtNo : wkrtNo, barNo : barNo
 		 				, jrdtTeamOrgId: jrdtTeamOrgId, opTeamOrgId : opTeamOrgId, jrdtTeamOrgNm : jrdtTeamOrgNm, opTeamOrgNm : opTeamOrgNm,ownBizrCd : ownBizrCd
 		 				, eqpRmk : eqpRmk, eqpIntgFcltsCdErr : '1', eqpNmErr : '1', eqpMdlNmErr :  '1', eqpInstlMtsoNmErr : '1', jrdtTeamOrgNmErr : '1', opTeamOrgNmErr : '1'}, {_index : {id : selectGridId}});

 					$('#eqpNmReg').val('');
// 		 			$('#eqpTidReg').val('');
 		 			$('#eqpInstlMtsoIdReg').val('');
 		 			$('#eqpInstlMtsoNmReg').val('');
// 		 			$('#mainEqpIpAddrReg').val('');
// 		 			$('#eqpHostNmReg').val('');
 		 			$('#eqpMdlIdReg').val('');
 		 			$('#eqpMdlNmReg').val('');
 		 			$('#cstrMgnoReg').val('');
 		 			$('#wkrtNoReg').val('');

 		 			$('#barNoReg').val('');
 		 			$('#jrdtTeamOrgIdReg').setData('');
 		 			$('#opTeamOrgIdReg').setData('');
 		 			$('#eqpRmkReg').val('');

 		 			$('#eqpRoleDivCdReg').val('');
 		 			$('#portCntReg').val('');
 		 			$('#eqpRule').val('');
 		 			$('#eqpRuleErrMsg').val('');

 		 			$('#intgFcltsCdReg').val('');

 		    	} else {
 		    		alertBox('W', '장비 네이밍 룰 오류가 발생하였습니다. 장비룰을 참고하여 작성하시기 바랍니다.');
 		    	}
 			}

 			if (eqpIntgFcltsCd != "" ) {
 				var pararmData = {intgFcltsCd : eqpIntgFcltsCd};  // 공사코드가 있고 통시가 있는 경우
 				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getUploadIntgFcltsCdCheck', pararmData, 'GET', 'uploadIntgFcltsCdCheck')
 			}


 		});

		$('#eqpNmReg').keyup(function(e) {
			var eqpMdlId = $('#eqpMdlIdReg').val();
			var eqpNm = $('#eqpNmReg').val();
			for(j in grMdlList) {
				if (eqpMdlId == grMdlList[j].eqpMdlId) {
					nameCk = ruleChk(eqpNm, grMdlList[j].eqpRglaExprVal);

					if (nameCk > 0) {
						$('#eqpRuleErrMsg').val("");
					} else {
						$('#eqpRuleErrMsg').val("'"+eqpNm+"' 의 표기법은 옳바르지 않습니다.");
					}
					continue;
				}
			}


	   	 });

		$('#btnMultiMdl').on('click', function(e){
			var deleteList = AlopexGrid.trimData ( $('#'+excelGrid).alopexGrid("dataGet", { _state : {selected:true }} ));
	    	if (deleteList.length <= 0) {
	    		alertBox('W', '선택된 열이 없습니다. 열 선택 후 사용 하시기 바랍니다.');
	    	} else {
	    		var dataParam = {"checkGubun" : "1"};

	    		$a.popup({
	              	popid: 'MultiSearch',
	              	title: '장비모델검색',
	                  url: '/tango-transmission-web/configmgmt/equipment/EqpMutiSearch.do',
	                  data: dataParam,
	                  iframe: false,
		      		  modal: false,
		      		  movable:false,
		      		  windowpopup: true,
	                  width : 500,
	                  height : 180,
	                  callback : function(data) { // 팝업창을 닫을 때 실행
	                	  	if (data != undefined && data != 'undefined' && data != null) {
	                		  for(j in grMdlList) {
	  	          				if (data.eqpMdlId == grMdlList[j].eqpMdlId) {
	  	          					$('#'+excelGrid).alopexGrid("dataEdit", {eqpMdlId : grMdlList[j].eqpMdlId, eqpMdlNm : grMdlList[j].eqpMdlNm, eqpRoleDivCd : grMdlList[j].eqpRoleDivCd, portCnt : grMdlList[j].portCnt, eqpMdlNmErr : '1'}, { _state : {selected:true }} );
	  	          					break;
	  	          				}
	  	                	  }

	                		  	var dataObj = $('#'+excelGrid).alopexGrid("dataGet", { _state : {selected:true }} );
				          		for(var i in dataObj) {
				      				var nameCk = 0;
				      				for(j in grMdlList) {
				          				if (dataObj[i].eqpMdlNm == grMdlList[j].eqpMdlNm) {
				          					nameCk = ruleChk(dataObj[i].eqpNm, grMdlList[j].eqpRglaExprVal);

				          					if (nameCk > 0) {
				          					} else {
				          						$('#'+excelGrid).alopexGrid('dataEdit', { eqpNmErr : '0'}, {_index : {id : dataObj[i]._index.id}});
				          					}
				          					continue;
				          				}
				          			}
				          		}
	                	  }
	                	  $('#'+excelGrid).alopexGrid("viewUpdate");
	                  }
	              });
	    	}

 		});

		$('#btnMultiMtso').on('click', function(e){
			var deleteList = AlopexGrid.trimData ( $('#'+excelGrid).alopexGrid("dataGet", { _state : {selected:true }} ));
	    	if (deleteList.length <= 0) {
	    		alertBox('W', '선택된 열이 없습니다. 열 선택 후 사용 하시기 바랍니다.');
	    	} else {
				var dataParam = {"checkGubun" : "2"};

				$a.popup({
	   	          	popid: 'MtsoLkup',
	   	          	title: configMsgArray['findMtso'],
	   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	   	            windowpopup : true,
	   	            modal: true,
	                movable:true,
	   	            width : 950,
	   	           	height : window.innerHeight * 0.8,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행

	   	           	var ownBizrCd = "";
	                if(data.mgmtGrpNm == "SKT"){
	                	ownBizrCd = "01";
	                }else if(data.mgmtGrpNm == "SKB"){
	                	ownBizrCd = "02";
	                }

	   	           		$('#'+excelGrid).alopexGrid("dataEdit", {eqpInstlMtsoId : data.mtsoId, eqpInstlMtsoNm : data.mtsoNm, ownBizrCd: ownBizrCd,  eqpInstlMtsoNmErr : '1'}, { _state : {selected:true }} );

	   	           	}
	   		 	});
	    	}
 		});

		$('#btnMultiJrdtTeam').on('click', function(e){
			var deleteList = AlopexGrid.trimData ( $('#'+excelGrid).alopexGrid("dataGet", { _state : {selected:true }} ));
	    	if (deleteList.length <= 0) {
	    		alertBox('W', '선택된 열이 없습니다. 열 선택 후 사용 하시기 바랍니다.');
	    	} else {
				var dataParam = {"checkGubun" : "3"};
				$a.popup({
	              	popid: 'MultiSearch',
	              	title: '관리팀검색',
	                  url: '/tango-transmission-web/configmgmt/equipment/EqpMutiSearch.do',
	                  data: dataParam,
	                  iframe: false,
		      		  modal: false,
		      		  movable:false,
		      		  windowpopup: true,
	                  width : 500,
	                  height : 230,
	                  callback : function(data) { // 팝업창을 닫을 때 실행
	                	  if (data != undefined && data != 'undefined' && data != null) {
	                		  for(j in grJrdtTeamList) {
	  	          				if (data.jrdtTeamOrgId == grJrdtTeamList[j].orgId) {
	  	          					$('#'+excelGrid).alopexGrid("dataEdit", {jrdtTeamOrgId : data.jrdtTeamOrgId, jrdtTeamOrgNm : grJrdtTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ',''), jrdtTeamOrgNmErr : '1'}, { _state : {selected:true }} );
	  	          					break;
	  	          				}
	  	                	  }
	                	  }
	                  }
	              });
	    	}
 		});

		$('#btnMultiOpTeam').on('click', function(e){
			var deleteList = AlopexGrid.trimData ( $('#'+excelGrid).alopexGrid("dataGet", { _state : {selected:true }} ));
	    	if (deleteList.length <= 0) {
	    		alertBox('W', '선택된 열이 없습니다. 열 선택 후 사용 하시기 바랍니다.');
	    	} else {
				var dataParam = {"checkGubun" : "4"};
				$a.popup({
	              	popid: 'MultiSearch',
	              	title: '운용팀검색',
	                  url: '/tango-transmission-web/configmgmt/equipment/EqpMutiSearch.do',
	                  data: dataParam,
	                  iframe: false,
		      		  modal: false,
		      		  movable:false,
		      		  windowpopup: true,
	                  width : 500,
	                  height : 180,
	                  callback : function(data) { // 팝업창을 닫을 때 실행
	                	  if (data != undefined && data != 'undefined' && data != null) {
	                		  for(j in grOpTeamList) {
	  	          				if (data.opTeamOrgId == grOpTeamList[j].orgId) {
	  	          					$('#'+excelGrid).alopexGrid("dataEdit", {opTeamOrgId : data.opTeamOrgId, opTeamOrgNm : grOpTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ',''), opTeamOrgNmErr : '1'}, { _state : {selected:true }} );
	  	          					break;
	  	          				}
	  	                	  }
	                	  }
	                  }
	              });
	    	}
 		});


		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});

		//장비통시코드
		$('#btnIntgFcltsCdSearch').on('click', function(e) {

     		 $a.popup({
 		          	popid: 'IntgFcltsSearchPop',
 		          	/* 포트현황		 */
 		          	title: '통합시설검색',
 		            url: '/tango-transmission-web/demandmgmt/common/IntgFcltsSearchPopup.do',
 		            data : {

 		            	reqMode : "TE"
 		            },
 		            windowpopup : true,
 		            modal: true,
 		            movable:true,
 		            width : 1300,
 		            height : window.innerHeight * 0.8,
 		           callback : function(data) {
 		        	 if(data.intgFcltsDivCd == "13" || data.intgFcltsDivCd == "05" || data.intgFcltsDivCd == "06") {
 		        		 $('#intgFcltsCdReg').val(data.intgFcltsCd);
 		        		console.log($('#intgFcltsCdReg').val());
 		        	  } else {
 		        		 callMsgBox('','I', "통합시설코드에 조회구분이 전송장비/전송실/지역중심국인 경우만 선택 가능합니다." , function(msgId, msgRst){});
 		        	  }
					}
 		   	});
		});
	};


	function ruleChk(eqpNm, eqpRglaExprVal){
		if (typeof eqpNm != 'undefined' && eqpNm != undefined && eqpNm != '') {
	   		 var name = eqpNm;
	   		 var rglaExprVal = eqpRglaExprVal;

	   		 var num = 0;
  			 var ruleInf = new RegExp("^"+rglaExprVal+"$", "g");
  			 if(ruleInf.test(name)){
  				 num++;
  			 }
	   		 return num;
		 }
	}


	var saveCount = 0;
	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'saveOk'){
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			saveCount += 1;
//			console.log(saveCount+"---"+dataObj.length);
			if (saveCount == dataObj.length) {
//				alertBox('I', '저장이 완료 되었습니다.');
				callMsgBox('','I', '저장이 완료 되었습니다', function(msgId, msgRst){
					$a.close();
				});

			}

		}



		if(flag == 'search'){
    		$('#'+excelGrid).alopexGrid('hideProgress');

    		$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCdErr : '0', eqpNmErr : '0', eqpMdlNmErr : '0', eqpInstlMtsoNmErr : '0', jrdtTeamOrgNmErr : '0', opTeamOrgNmErr : '0', ownBizrCd : '01'}, {});

    		var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
    		//console.log(dataObj);


    		for(var i in dataObj) {
    			if (typeof dataObj[i].eqpMdlNm != 'undefined' && dataObj[i].eqpMdlNm != undefined) {

				} else {
					dataObj[i].rowDelYn = 'Y';
					continue;
				}
    			/* 관리팀 ID 및 체크 */
    			for(j in grJrdtTeamList) {
    				if (dataObj[i].jrdtTeamOrgNm == grJrdtTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ','')) {
    					$('#'+excelGrid).alopexGrid('dataEdit', {jrdtTeamOrgId : grJrdtTeamList[j].orgId, jrdtTeamOrgNmErr : '1'}, {_index : {id : dataObj[i]._index.id}});
    					continue;
    				}
    			}
    			/* 운용팀 ID 및 체크 */
				for(j in grOpTeamList) {
    				if (dataObj[i].opTeamOrgNm == grOpTeamList[j].orgNm.replace('SKT / ','').replace('SKB / ','').replace('ONS / ','').replace(' ','').replace(' ','').replace(' ','')) {
    					$('#'+excelGrid).alopexGrid('dataEdit', {opTeamOrgId : grOpTeamList[j].orgId, opTeamOrgNmErr : '1'}, {_index : {id : dataObj[i]._index.id}});
    					continue;
    				}
    			}
				/* 모델 ID 및 체크, 장비 네이밍룰 체크 */
				var nameCk = 0;
				for(j in grMdlList) {
    				if (dataObj[i].eqpMdlNm == grMdlList[j].eqpMdlNm) {
    					nameCk = ruleChk(dataObj[i].eqpNm, grMdlList[j].eqpRglaExprVal);

    					if (nameCk > 0) {
    						$('#'+excelGrid).alopexGrid('dataEdit', {eqpMdlId : grMdlList[j].eqpMdlId, eqpRoleDivCd : grMdlList[j].eqpRoleDivCd, portCnt : grMdlList[j].portCnt, eqpMdlNmErr : '1', eqpNmErr : '1'}, {_index : {id : dataObj[i]._index.id}});
    					} else {
    						$('#'+excelGrid).alopexGrid('dataEdit', {eqpMdlId : grMdlList[j].eqpMdlId, eqpRoleDivCd : grMdlList[j].eqpRoleDivCd, portCnt : grMdlList[j].portCnt, eqpMdlNmErr : '0', eqpNmErr : '0'}, {_index : {id : dataObj[i]._index.id}});
    					}
    					continue;
    				}
    			}

				/* 국사 ID 및 체크 */
				if (typeof dataObj[i].intgFcltsCd != 'undefined' && dataObj[i].intgFcltsCd != undefined && dataObj[i].intgFcltsCd != '' && dataObj[i].intgFcltsCd != null) {
					var paramData = {lnkgMtsoIdntVal : dataObj[i].intgFcltsCd};
				} else {
					var paramData = {mtsoNm : dataObj[i].eqpInstlMtsoNm};
				}

				/* 공사코드가 존재하는 경우 장비통시코드 및 체크 */
				if (typeof dataObj[i].cstrCd != 'undefined' && dataObj[i].cstrCd != undefined && dataObj[i].cstrCd != '' && dataObj[i].cstrCd != null) {
					if (typeof dataObj[i].eqpIntgFcltsCd != 'undefined' && dataObj[i].eqpIntgFcltsCd != undefined && dataObj[i].eqpIntgFcltsCd != '' && dataObj[i].eqpIntgFcltsCd != null) {
						//$('#'+excelGrid).alopexGrid('dataEdit', { eqpIntgfcltsCdErr : '1'}, {_index : {id : dataObj[i]._index.id}});
						var pararmData2 = {intgFcltsCd : dataObj[i].eqpIntgFcltsCd};  // 공사코드가 있고 통시가 있는 경우
						httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getUploadIntgFcltsCdCheck', pararmData2, 'GET', 'uploadIntgFcltsCdCheck')
					}
				}else {

					if (typeof dataObj[i].eqpIntgFcltsCd != 'undefined' && dataObj[i].eqpIntgFcltsCd != undefined && dataObj[i].eqpIntgFcltsCd != '' && dataObj[i].eqpIntgFcltsCd != null) {
						//$('#'+excelGrid).alopexGrid('dataEdit', { eqpIntgfcltsCdErr : '1'}, {_index : {id : dataObj[i]._index.id}});
						var pararmData2 = {intgFcltsCd : dataObj[i].eqpIntgFcltsCd};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getUploadIntgFcltsCdCheck', pararmData2, 'GET', 'uploadIntgFcltsCdCheck')
					}

				}


				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getUploadCheck', paramData, 'GET', 'mtso');


//				var tmpValue = '[';
//				if (dataObj[i].eqpNmErr == '1' && dataObj[i].eqpMdlNmErr == '1' && dataObj[i].eqpInstlMtsoNmErr == '1' && dataObj[i].jrdtTeamOrgNmErr == '1') {
//					tmpValue += '가능';
//				} else {
//					if (dataObj[i].eqpNmErr == '0') 		{ tmpValue += "장비 네이밍룰 오류,"; }
//					if (dataObj[i].eqpMdlNmErr == '0') 		{ tmpValue += "장비 모델정보 오류,"; }
//					if (dataObj[i].eqpInstlMtsoNmErr == '0'){ tmpValue += "국사 정보 오류,"; }
//					if (dataObj[i].jrdtTeamOrgNmErr == '0')	{ tmpValue += "관리팀 오류,"; }
//				}
//				tmpValue += ']';
//				var errMgeValue = {errMge : tmpValue};
//				console.log("-----"+dataObj[i]._index.data);
//				$('#'+excelGrid).alopexGrid('dataEdit', errMgeValue, {_index : {data : dataObj[i]._index.data}});

    		}
//    		$('#'+excelGrid).alopexGrid('dataEdit', {jrdtTeamOrgNm : '-'}, {jrdtTeamOrgNmErr : '0'});
//    		$('#'+excelGrid).alopexGrid('dataEdit', {opTeamOrgNm : '-'}, {opTeamOrgNmErr : '0'});
    		$('#'+excelGrid).alopexGrid('dataDelete',{rowDelYn : 'Y'});



    		$('#'+excelGrid).alopexGrid("viewUpdate");
    	}

		if(flag == 'mtso'){
			var j = 0;
			var mtsoId = '';
			var mtsoNm = '';
			var ckGubun = '';
			var ckValue = '';
			for(var i = 0; i < response.length; i++){
				var resObj = response[i];
				ckGubun = resObj.checkgubun;
				ckValue	= resObj.checkvalue;
				mtsoId 	= resObj.mtsoId;
				mtsoNm 	= resObj.mtsoNm;
				j += 1;
			}
			if (j > 1) {
				mtsoId = '';
				mtsoNm = '-';
				if (ckGubun == 'mtsoNm') {
					$('#'+excelGrid).alopexGrid('dataEdit', {eqpInstlMtsoId : mtsoId, eqpInstlMtsoNmErr : '0'}, {eqpInstlMtsoNm : ckValue});
				} else {
					$('#'+excelGrid).alopexGrid('dataEdit', {eqpInstlMtsoId : mtsoId, eqpInstlMtsoNmErr : '0'}, {intgFcltsCd : ckValue});
				}
			} else {
				if (ckGubun == 'mtsoNm') {
					$('#'+excelGrid).alopexGrid('dataEdit', {eqpInstlMtsoId : mtsoId, eqpInstlMtsoNmErr : '1'}, {eqpInstlMtsoNm : ckValue});
				} else {
					$('#'+excelGrid).alopexGrid('dataEdit', {eqpInstlMtsoId : mtsoId, eqpInstlMtsoNm : mtsoNm, eqpInstlMtsoNmErr : '1'}, {intgFcltsCd : ckValue});
				}
			}
		}



		if(flag == 'uploadIntgFcltsCdCheck'){

			var j = 0;
			var eqpIntgFcltsCd = '-';
			var ckGubun = '';
			var ckValue = '';
			for(var i = 0; i < response.length; i++){
				var resObj = response[i];
				ckGubun = resObj.checkgubun;
				ckValue	= resObj.checkvalue;
				eqpIntgFcltsCd 	= resObj.intgFcltsCd;

//				j += 1;
			}


//			eqpIntgFcltsCd = '-';
			if (ckGubun == 'dupEqpId') {
				$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpIntgFcltsCdErr : '0'}, {eqpIntgFcltsCd : ckValue});
			} else if (ckGubun == 'notTrmsIntg') {
				$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpIntgFcltsCdErr : '0'}, {eqpIntgFcltsCd : ckValue});
			}  else if (ckGubun == 'intgChk') {
				$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpIntgFcltsCdErr : '1'}, {eqpIntgFcltsCd : ckValue});
			} else {
				$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpIntgFcltsCdErr : '0'}, {eqpIntgFcltsCd : ckValue});
			}

//			var dupEqpIntgFcltsCdChk =  $('#'+excelGrid).alopexGrid('dataGet',{eqpIntgFcltsCd : eqpIntgFcltsCd});
//
//			if (dupEqpIntgFcltsCdChk.length > 1) {
//				$('#'+excelGrid).alopexGrid('dataEdit', {eqpIntgFcltsCd : eqpIntgFcltsCd, eqpIntgFcltsCdErr : '0'}, {eqpIntgFcltsCd : ckValue});
//			}



		}

		if(flag == 'regEqpMdlList'){
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				grMdlList.push(resObj);
			}
		}


		if(flag == 'mgmtTeamOrgId'){

    		$('#jrdtTeamOrgIdReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				grJrdtTeamList.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#jrdtTeamOrgIdReg').setData({
   	             data:option_data
    			});
    		}
    		else {
    			$('#jrdtTeamOrgIdReg').setData({
    	             data:option_data,
    	             jrdtTeamOrgId:paramData.jrdtTeamOrgId
    			});
    		}

    	}

    	if(flag == 'opTeamOrgId'){
    		$('#opTeamOrgIdReg').clear();
    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				grOpTeamList.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#opTeamOrgIdReg').setData({
      	             data:option_data
       			});
    		}
    		else {
    			$('#opTeamOrgIdReg').setData({
   	             data:option_data,
   	             opTeamOrgId:paramData.opTeamOrgId
    			});
    		}

    	}

    	if(flag == 'eqpTyp'){
    		grEqpTypMsg = '';
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				if (i == response.length -1) {
					grEqpTypMsg += response[i].comCdNm;
				} else {
					grEqpTypMsg += response[i].comCdNm + ', ';
				}
			}
    	}

		if(flag == 'saveG5EndDsn'){
    		$a.close();
    	}


	}

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){

		}
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



	function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 500,
                  height : 180
              });
	}

});

