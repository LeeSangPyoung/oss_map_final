/**
 * DrawMtsoFloor.js



 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */



(function($) {

	/***************************************************************************
	 * autocomplete
	 **************************************************************************/
	$.alopex.widget.autocomplete = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'autocomplete',
		setters : ['autocomplete', 'setOptions'],
		getters : ['getSelectedData'],
		properties: {
			textinput : null,
			dropdown : null,
			noresultstr : 'No Results',
			lastKeyword : "",
			url : null,
			method : "GET",
			datatype : "json",
			paramname : null,
			source : undefined,
			minlength : 1,
			fitwidth : true,
			maxheight : '',
			select : null,
			selected : undefined,
			maxresult : 100
		},
		init : function(el, option) {
			$.extend(el, this.properties, option);
			if ( $(el).find('.Dropdown').length === 0 ){
				$(el).append('<ul class="Dropdown"></ul>');
			}
			el.textinput = $(el).find('.Textinput').first();

			el.dropdown = $(el).find('.Dropdown').first();
			$(el.dropdown).css('minWidth', 300);
			$(el.dropdown).css('width', 400);
			$(el.dropdown).css('display', 'none');
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');
			$a.convert(el.textinput);
			$a.convert(el.dropdown);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);

			$(el.dropdown).addHandler($.alopex.widget.autocomplete._defaultHandler);
			//$(el.dropdown).on('click', $.alopex.widget.autocomplete._eqpSearch);

		},
		_defaultHandler : function(e){
			var el = e.currentTarget.parentElement.parentElement;
			el.lastKeyword = e.currentTarget.innerText;
			el.selected = e.currentTarget.data;
			console.log(el.selected);
			var eqpId =  el.selected.searchId;
			if (eqpId != undefined && eqpId != null && eqpId != "") {
				main.fnEqpSearch(eqpId);
			}

			if( typeof el.select === "function" ){
				el.select(e, el.selected);
			}
		},
		setOptions : function(el, data){
			$.extend(el, data);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
		},
		_eqpSearch : function(e){
			if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
    			var searchId = "";
    			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
    			//param.searchId = searchId.replace(/"/g, "");
    			alert(searchId);
    		}
		},
		_keyupHandler : function(e){
			var el = e.currentTarget;
			var text = $(el).val();
			var divEl = el.parentElement;
			var req = {};
			req.data = {};
			req.el = divEl;
			// minLength 와 같거나 큰 길이의 입력에 대해서만 동작
			if( e.keyCode !== 13 && divEl.lastKeyword != text ){
				divEl.lastKeyword = text;
				if( 0 < $('#searchNm').val().length ){
					req.url = divEl.url;
					divEl.paramname? req.data[divEl.paramname] = text : req.data = text;
					req.method = divEl.method;
					req.dataType = divEl.datatype;
					req.success = function(res){
						if( res.length > this.el.maxresult ){
							res.length = this.el.maxresult;
						}
						if(res.length > 0){
							var textRes = res[0].text.toUpperCase();
							if(textRes.indexOf($('#searchNm').val().toUpperCase()) > -1){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}else{
							if(text == $('#searchNm').val()){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}
					}
					$.ajax(req);
				}else{
					$(el.dropdown).html('');
					$(el.dropdown).close();
				}
			}else if( e.keyCode !== 13 && divEl.lastKeyword == text ){
				$(el.dropdown).open();
			}else {
				return;
			}
		},
		_setDataSource : function(dd, data){
			switch (typeof data) {
			case 'string':
				$el.html(data);
				break;
			case 'object':
				$.alopex.widget.autocomplete._htmlGenerator(dd, data);
				break;
			default:
				break;
			}
			$(dd).refresh();
			// [20160503 kjb - 아래 주석 풀었음]
			dd.userInputDataSource = data;
		},
		_noResultHandler : function(el){
			if ( $(el.dropdown).find('li').length === 0 ){
				$(el.dropdown).append('<li class="af-disabled Disabled" data-role="empty">'+el.noresultstr+'</li>');
			}
		},
		_htmlGenerator: function(dd, data) {
			var item;

			$(dd).html('');

			for( var i = 0 ; i < data.length ; i++ ){
				item = document.createElement('li');
				if ( data[i].id !== undefined ) {
					item.id = data[i].id;
				}
				if ( data[i].text !== undefined ){
					item.innerText = data[i].text;
				} else if ( data[i].value !== undefined ){
					item.innerText = data[i].value;
				} else {
					item.innerText = data[i];
				}
				item.data = data[i];
				$(dd).append(item);
			}
		},
		getSelectedData : function(el){
			return el.selected;
		}
 	});
})(jQuery);




var main = $a.page(function() {
	var perPage = 100;
	var gridId = 'dataNamsGrid';

	var rackInArr = [];
	var upDataFlag = false;
	var upSelectFlag = false;
	var paramData = null;




    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	var perPage = 100;
    	paramData = param;

    	var tmpAttrIn = param.rackInTmpArr.split(",");

    	$("#dataDummyGrid").show();
    	$("#dataTangoGrid").hide();
    	$("#btnRackSeach").hide();
    	$("#sPos").setEnabled(false);
    	initGrid();
        setEventListener();


        $('#searchForm').setData(param);

        var orgSPos = param.sPos;
        var orgRackId = param.rackId;
        $('#orgSPos').val(orgSPos);
        $('#orgRackId').val(orgRackId);


        var orgCstrCd = $('#orgCstrCd').val();
        var orgCstrGubun = $('#orgCstrGubun').val();

        $('#cstrCd').val(orgCstrCd);
		if (orgCstrGubun != null && orgCstrGubun != undefined) {
			$('#cstrStatCd').val(orgCstrGubun);
			if (orgCstrGubun == 1) {
				$("input:radio[id=rdCk]:input[value='0']").attr("checked", true);
		   		$("#dataDummyGrid").show();
		   		$("#dataTangoGrid").hide();
		   		//$("#spanCstrMessege").html("  <font style='color:red;'>■ 공사진행상태가 ENG SHEET 예약입니다. Dummy 장비를 선택하세요.</font>");
			} else if (orgCstrGubun == 2) {
				$("input:radio[id=rdCk]:input[value='1']").attr("checked", true);
		   		$("#dataDummyGrid").hide();
		   		$("#dataTangoGrid").show();
		   		//$("#spanCstrMessege").html(" <font style='color:red;'> ■ 공사진행상태가 장비개통등록입니다. Tango 장비를 선택하세요.</font>");
			}
		}

        setSelectCode(param);
        if (orgCstrGubun == null || orgCstrGubun == undefined || orgCstrGubun == "undefined") {
        	$('#cstrStatCd').val('0');
        }
        if (orgCstrCd == null || orgCstrCd == undefined || orgCstrCd == "undefined") {
        	$('#cstrCd').val('');
        }

        $("#eqpMdGubun1").css('display', '');
        $("#eqpMdGubun2").css('display', 'none');
        $("#nameEqpNm").text("자재명");
        $("#nameEqpMdlNm").text("자재모델명");
        $("#nameMtsoNm").text("통합시설명");

    };
    function setSelectCode(param){
    	var supCd = {supCd : 'F10000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'setlObjCd');

    	//var tmpEqp = param.eqpId.substring(0,2);
    	if (param.eqpId != undefined && param.eqpId != "" && param.eqpId != null) {
    		var tmpEqp = param.eqpId.substring(0,2);
    		if (tmpEqp == "SE") {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqRackInList2', param, 'GET', 'RackInDetail');
        	} else {
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqRackInList', param, 'GET', 'RackInDetail');
        	}
    	} else {
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqRackInList', param, 'GET', 'RackInDetail');
    	}


		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInfo', param, 'GET', 'rackInfo');

		param.mgmtGrpNm = 'SKB';
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');



    }
  //Grid 초기화
	function initGrid() {

		AlopexGrid.setup({
			renderMapping : {
				"bargraph" : {
					renderer : function(value, data, render, mapping) {
						var rule = render.rule;
						var percentage = 0;

						if(rule) {
							var min = rule[0];
							var max = rule[1];
							if(typeof min === "string") {
								min = parseFloat(data[min]);
							}
							if(typeof max === "string") {
								max = parseFloat(data[max]);
							}
							if(typeof min === "number" && typeof max === "number") {
								percentage = parseInt((value-min)/(max-min)*100);
								percentage = Math.min(Math.max(0,percentage),100);
							}
						}
						//http://omnipotent.net/jquery.sparkline/#hidden : jQuery sparkline
						if(percentage >= 80){
							return '<div class="progress_container"><div class="percentage-bar_green" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else if(percentage <=25){
							return '<div class="progress_container"><div class="percentage-bar_red" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}else{
							return '<div class="progress_container"><div class="percentage-bar_yellow" style="width:'+percentage+'%;">'+percentage+'%</div></div>';
						}
					}
				}
			},
		});
		$('#'+gridId).alopexGrid('dataEmpty');
		var idx  = $('#basicTabs').getCurrentTabIndex();
    	switch (idx) {
	    	case 0 :
	    		var columnG = [{ align:'center', title : 'No.', width: '30', resizing: false, numberingColumn: true },
	    			{ key : 'erpIntgFcltsNm', align:'center', title : '통합시설명', width: '150px' },
	    			{ key : 'namsMatlNm', align:'center', title : '자재명', width: '150px' },
	    			{ key : 'barNo', align : 'center', title : '바코드', width : '120px'},
	    			{ key : 'eqpRoleDivNm', align : 'center', title : '장비역할', width : '100px'},
	    			{ key : 'eqpMdlId', align : 'center', title : '모델ID', width : '90px'},
	    			{ key : 'eqpMdlNm', align:'center', title : '모델명', width: '100px' }];

				break;
	    	case 1 :
	    		var columnG = [{ align:'center', title : 'No.', width: '30', resizing: false, numberingColumn: true },
	    			{ key : 'eqpInstlMtsoNm', align:'center', title : '국사명', width: '150px' },
	    			{ key : 'eqpNm', align:'center', title : '장비명', width: '150px' },
	    			{ key : 'barNo', align : 'center', title : '바코드', width : '120px'},
	    			{ key : 'eqpRoleDivNm', align : 'center', title : '장비역할', width : '100px'},
	    			{ key : 'eqpMdlId', align : 'center', title : '모델ID', width : '90px'},
	    			{ key : 'eqpMdlNm', align:'center', title : '모델명', width: '100px' },
	    			{ key : 'eqpId', align:'center', title : '장비ID', width: '100px', hidden : true }];
				break;
	    	default :
	    		var columnG = [{ align:'center', title : 'No.', width: '30', resizing: false, numberingColumn: true },
	    			{ key : 'erpIntgFcltsNm', align:'center', title : '통합시설명', width: '150px' },
	    			{ key : 'namsMatlNm', align:'center', title : '자재명', width: '150px' },
	    			{ key : 'barNo', align : 'center', title : '바코드', width : '120px'},
	    			{ key : 'eqpRoleDivNm', align : 'center', title : '장비역할', width : '100px'},
	    			{ key : 'eqpMdlId', align : 'center', title : '모델ID', width : '90px'},
	    			{ key : 'eqpMdlNm', align:'center', title : '모델명', width: '100px' }];
				break;
		}
		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '2row',
			autoResize: true,
			pager : false,
			paging : {
				pagerTotal: false,
			},
			numberingColumnFromZero: false,
			columnMapping : columnG,
			message: {
				//nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>바코드는  Nams 장비 정보 및 바코드 조회를 통해 입력 가능합니다.</div>"
			}
		});
	};
    function setEventListener() {
    	urlData = "/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAutoSearch";
    	$("#idSelect").setOptions({
 			url : urlData,
 			method : "get",
 			datatype: "json",
 			paramname : "searchNm",
 			minlength: 2,
 			noresultstr : "검색 결과가 없습니다.",
 			before : function(id, option){

 			}
 		});


    	$('#basicTabs').on("tabchange", function(e, index) {
	   		 switch (index) {
				case 0 :
					$("#nameEqpNm").text("자재명");
			        $("#nameEqpMdlNm").text("자재모델명");
			        $("#nameMtsoNm").text("통합시설명");
			        $("#eqpMdGubun1").css('display', '');
			        $("#eqpMdGubun2").css('display', 'none');
			        $("#nSGubun").text("Nams");

					break;
				case 1 :
					$("#nameEqpNm").text("장비명");
			        $("#nameEqpMdlNm").text("장비모델명");
			        $("#nameMtsoNm").text("국사명");
			        $("#eqpMdGubun1").css('display', 'none');
			        $("#eqpMdGubun2").css('display', '');
			        $("#nSGubun").text("Swing");
					break;
				default :
					$("#nameEqpNm").text("자재명");
			        $("#nameEqpMdlNm").text("자재모델명");
			        $("#nameMtsoNm").text("통합시설명");
			        $("#eqpMdGubun1").css('display', '');
			        $("#eqpMdGubun2").css('display', 'none');
			        $("#nSGubun").text("Nams");
					break;
			}
	   		initGrid();
    	});



    	$('#btnRackSeach').on('click', function(e) {
    		var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {mtsoEqpGubun :'mtso', mtsoEqpId : $('#mtsoId').val(), parentWinYn : 'Y',
        			linkTab : 'tab_Draw',
					linkTabContrlYn : 'Y',					// 특정 용도로 활용하기 위함 팝업(Return값을 받을 수 있음.)
					variableNm : 'floorId',					// 특정 용도로 활용하기 위함 팝업
					variableVal : $('#floorId').val()		// 특정 용도로 활용하기 위함 팝업
        	};
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 900,
    			height : window.innerHeight,
				callback: function(data) {
					$('#rackId').val(data.rackId);
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInfo', data, 'GET', 'rackInfo');
				}
    		});
 		});


    	$(document).on('click', 'input[id=rdCk]', function (e) {
    		var st = $("input:radio[id=rdCk]:checked").val();
	   		if(st == 0) {
	   			$("#dataDummyGrid").show();
	   			$("#dataTangoGrid").hide();

	   			$('#eqpId').val("");
				$('#eqpInstlMtsoNm').val("");
				$('#eqpMdlNm').val("");
				$('#eqpNm').val("");
				$('#eqpRoleDivNm').val("");
				//$('#tmofNm').val("");

	   		} else {
	   			$("#dataDummyGrid").hide();
	   			$("#dataTangoGrid").show();

	   			var eqpId = $('#orgEqpId').val();
	   			var eqpInstlMtsoNm = $('#orgEqpInstlMtsoNm').val();
	   			var eqpMdlNm = $('#orgEqpMdlNm').val();
	   			var eqpNm = $('#orgEqpNm').val();
	   			var eqpRoleDivNm = $('#orgEqpRoleDivNm').val();
	   			var tmofNm = $('#orgTmofNm').val();

	   			$('#eqpId').val(eqpId);
				$('#eqpInstlMtsoNm').val(eqpInstlMtsoNm);
				$('#eqpMdlNm').val(eqpMdlNm);
				$('#eqpNm').val(eqpNm);
				$('#eqpRoleDivNm').val(eqpRoleDivNm);
				//$('#tmofNm').val(tmofNm);



	   		}
		});
    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });
    	 $('#btnunitCnt').on('click', function(e) {
    		 var rackEqCd = "";
    		 var rackEqName = "";
    		 var rdCk = $('input[id="rdCk"]:checked').val();
    		 var seachFlag = true;
    		 if (rdCk == "0") {
    			var strVal1 = $("#eqpTypeGubun1 option:selected").val();
 				var strVal2 = $("#eqpTypeGubun2 option:selected").val();
 				var strVal3 = $("#eqpTypeGubun3 option:selected").val();
    			var strTxt1 = $("#eqpTypeGubun1 option:selected").text();
 				var strTxt2 = $("#eqpTypeGubun2 option:selected").text();
 				var strTxt3 = $("#eqpTypeGubun3 option:selected").text();
 				var strLen2 = document.getElementById("eqpTypeGubun2").length;
 				var strLen3 = document.getElementById("eqpTypeGubun3").length;
 				if (strVal3 == null || strVal3 == "") {
 					if ((strVal2 == null || strVal2 == "") && strLen2 == 1) {
 						if (strVal1 == null || strVal1 == "") {
 						} else {
 							rackEqCd = strVal1;
 							rackEqName = strTxt1;
 						}
 					} else{
 						if ((strVal3 == null || strVal3 == "") && strLen3 == 1) {
 							if (strVal2 == null || strVal2 == "") {
 							} else {
 								rackEqCd = strVal2;
 	 							rackEqName = strTxt2;
 							}
 						}
 					}
 				} else {
 					if (strVal3 == null || strVal3 == "") {
 					} else {
 						rackEqCd = strVal3;
						rackEqName = strTxt3;
 					}
 				}
 				var systemCd = rackEqCd;
 				var systemNm = rackEqName;
 				if (systemCd == "" || systemCd == null) {
 					seachFlag = false;
 				}
    		 } else  {
    			 var eqpId = $('#eqpId').val();
    			 var systemNm = $('#eqpRoleDivNm').val();
    			 if (eqpId == "" || eqpId == null) {
    				 seachFlag = false;
    			 }
    		 }
    		 if (seachFlag) {
    			 if (rdCk == "0") {
    				 alert("Dummy 장비의 경우 지원하지 않습니다.");
    			 } else {
    				 var eqpId = $('#eqpId').val();
    				 var param = {eqpId : eqpId};
        			 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUnitCntList', param, 'GET', 'UnitCntList');
    			 }

    		 } else {
    			 alert("Tango 장비를 먼저 선택하여 주시기 바랍니다.");
    		 }
           });



    	$('#btnrepLoadNmSearch').on('click', function(e) {
    		//if (upDataFlag) {
    		//	alert("DUMMY 장비선택 만 수정 가능합니다. \nTANGO 장비선택을 원하시면 실장 내역을 삭제 후 등록하여 주시기 바랍니다.");
    		//} else {
    			var param = {"mgmtGrpNm":"SKT", "teamId": "11111111","orgId": "11111111"};
	   	   		 $a.popup({
	   	   	          	popid: 'eqpPop',
	   	   	          	title: '장비조회',
	   	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpEqpLkup.do',
	   	   	            data: param,
	       	            modal: true,
	                    movable:true,
	                    windowpopup : true,
	   	   	            width : 950,
	   	   	           	height : 800,
	   	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	   	           		$('#eqpNm').val(data.eqpNm);
	   	   	           		$('#eqpInstlMtsoNm').val(data.eqpInstlMtsoNm);
	   	   	           		$('#eqpMdlNm').val(data.eqpMdlNm);
	   	   	           		$('#eqpRoleDivNm').val(data.eqpRoleDivNm);
	   	   	           		//$('#tmofNm').val(data.tmofNm);
	   	   	           		$('#eqpId').val(data.eqpId);

	   	   	           		var eqpId = $("#eqpId").val();
	   	   	           		var param = {itemId : eqpId};
	   	   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAccordEq', param, 'GET', 'AccordEq');
	   	   	           	}
	   	   	      });
    		//}
    	});

    	$('#btnSearch').on('click', function(e) { //
    		var idx  = $('#basicTabs').getCurrentTabIndex();
        	switch (idx) {
    	    	case 0 :
    	    		var searchBarCode = $("#searchBarCode").val();
    	    		var searchNamsMatlNm = $("#searchNamsMatlNm").val();
    	    		var searchEqpMdlNm = $("#searchEqpMdlNm").val();
    	    		var searchErpIntgFcltsNm = $("#searchErpIntgFcltsNm").val();
    	    		if (searchBarCode != "" || searchNamsMatlNm != "" || searchEqpMdlNm != "" || searchErpIntgFcltsNm != "") {
    	    			main.setGrid(1,perPage);
    	    		}
    				break;
    	    	case 1 :
    	    		var barNo = $("#searchBarCode").val();
    	    		var eqpNm = $("#searchNamsMatlNm").val();
    	    		var eqpMdlId = $("#searchEqpMdlId").val();
    	    		var mtsoNm = $("#searchErpIntgFcltsNm").val();
    	    		if (barNo != "" || eqpNm != "" || eqpMdlId != "" || mtsoNm != "") {
    	    			main.setGrid(1,perPage);
    	    		}
    				break;
    		}
		});

    	$('#btnCncl').on('click', function(e) {
    		$a.close();
		});

    	$(document).on('click', '[id=btnSave]', function (e) {
    		$('#searchForm').progress();
    		var rdCk = $('input[id="rdCk"]:checked').val();

    		var barNo = "000000000000000000000"; // 기본값.
    		if (rdCk == "0") {
    			barNo = $("#dummyBarCode").val();
    		} else {
    			barNo = $("#barCode").val();
    		}
    		var param = {searchBarCode : barNo};
    		//console.log(param);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSearchBarCodeEqpId2', param, 'GET', 'BarCodeEqpId');

		});

    	$('#eqpTypeGubun1').on('change', function(e) {
    		upSelectFlag = false;
    		$('#rackEqCd').val("");

			var strTxt = this.options[this.selectedIndex].text;
			// 장비타입 구분 중분류
			var supCd = {supCd : this.options[this.selectedIndex].value};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun2');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', '', 'GET', 'typeGubun3');
		});
		$('#eqpTypeGubun2').on('change', function(e) {
			upSelectFlag = false;
			$('#rackEqCd').val("");

			var strTxt = this.options[this.selectedIndex].text;
			// 장비타입 구분 소분류
			var supCd = {supCd : this.options[this.selectedIndex].value};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun3');
		});

		$('#'+gridId).on('click', '.bodycell', function(e){
			var idx  = $('#basicTabs').getCurrentTabIndex();
	    	switch (idx) {
		    	case 0 :
		    		$('#barCode').css("background-color", "#32a8a6");
					$('#dummyBarCode').css("background-color", "#32a8a6");
					var barCodeFlag = false;
					var dataObj = AlopexGrid.parseEvent(e).data;
					var barCode = $('#barCode').val();
					if (barCode == dataObj.barNo) {
						barCodeFlag = true;
					}
					$('#barCode').val(dataObj.barNo);
					$('#dummyBarCode').val(dataObj.barNo);

					setTimeout(function() {
						$('#barCode').css("background-color", "#fff");
						$('#dummyBarCode').css("background-color", "#fff");
						}, 2000);

					break;
		    	case 1 :

					$("input:radio[id=rdCk]:input[value='1']").attr("checked", true);
			   		$("#dataDummyGrid").hide();
			   		$("#dataTangoGrid").show();
			   		$("#btnRackSeach").show();
					$("#sPos").setEnabled(true);


		    		$('#barCode').css("background-color", "#32a8a6");
					$('#dummyBarCode').css("background-color", "#32a8a6");

					$('#eqpInstlMtsoNm').css("background-color", "#32a8a6");
					$('#eqpMdlNm').css("background-color", "#32a8a6");
					$('#eqpId').css("background-color", "#32a8a6");
					$('#eqpNm').css("background-color", "#32a8a6");
					$('#eqpRoleDivNm').css("background-color", "#32a8a6");

					var barCodeFlag = false;
					var dataObj = AlopexGrid.parseEvent(e).data;
					var barCode = $('#barCode').val();
					if (barCode == dataObj.barNo) {
						barCodeFlag = true;
					}
					$('#barCode').val(dataObj.barNo);
					$('#dummyBarCode').val(dataObj.barNo);


					$('#eqpId').val(dataObj.eqpId);
					$('#eqpInstlMtsoNm').val(dataObj.eqpInstlMtsoNm);
					$('#eqpMdlNm').val(dataObj.eqpMdlNm);
					$('#eqpNm').val(dataObj.eqpNm);
					$('#eqpRoleDivNm').val(dataObj.eqpRoleDivNm);


   	           		var param = {itemId : dataObj.eqpId};
   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAccordEq', param, 'GET', 'AccordEq');


					setTimeout(function() {
						$('#barCode').css("background-color", "#fff");
						$('#dummyBarCode').css("background-color", "#fff");
						$('#eqpInstlMtsoNm').css("background-color", "#fff");
						$('#eqpMdlNm').css("background-color", "#fff");
						$('#eqpId').css("background-color", "#fff");
						$('#eqpNm').css("background-color", "#fff");
						$('#eqpRoleDivNm').css("background-color", "#fff");
						}, 2000);
					break;
			}

		});


    	var supCd = {supCd : 'D00001'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun1');

		$('#cstrStatCd').clear();
    	var option_data_cstr = [{cd: '0', cdNm: '선택하세요'},{cd: '1', cdNm: 'ENG SHEET 예약'},{cd: '2', cdNm: '장비 개통 등록'}]; //,{cd: '3', cdNm: '장비 개통 검증'}
		$('#cstrStatCd').setData({
            data:option_data_cstr
		});
		$('#cstrStatCd').val("0");



	};

	this.fnEqpSearch = function(eqpId) {
		var data = { eqpId : eqpId};
		if (eqpId.substring(0,2) == "SE") { // 부대장비
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSbeqpSearchInfo', data, 'GET', 'SearchInfo');
		} else {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpSearchInfo', data, 'GET', 'SearchInfo');
		}
    };

	this.setGrid = function(page, rowPerPage){

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);



		$('#'+gridId).alopexGrid('showProgress');

		var idx  = $('#basicTabs').getCurrentTabIndex();
    	switch (idx) {
	    	case 0 :
	    		var param =  $("#searchForm").serialize();
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBarCodeList', param, 'GET', 'search');
				break;
	    	case 1 :
	    		var barNo = $("#searchBarCode").val();
	    		var eqpNm = $("#searchNamsMatlNm").val();
	    		var eqpMdlId = $("#searchEqpMdlId").val();
	    		var mtsoNm = $("#searchErpIntgFcltsNm").val();
	    		var param =  {barNo : barNo, eqpNm : eqpNm, eqpMdlId : eqpMdlId, mtsoNm: mtsoNm, mgmtGrpNm : 'SKB'};
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBarCodeSkb', param, 'GET', 'search');
				break;
	    	default :
				break;
		}


	}

	function getTextLength(str) {
		var len = 0;
		for (var i = 0; i < str.length; i++) {
			if (escape(str.charAt(i)).length == 6) {
				len++;
			}
			len++;
		}
		return len;
	}

	function successCallback(response, status, jqxhr, flag){


		if(flag == 'BarCodeEqpId'){

			var eqpCount = 0;
			var barCodeBigo = "";
			$.each(response.BarCodeEqpId, function(i, item){
				eqpCount = i+1;
				barCodeBigo = response.BarCodeEqpId[i].barCodeBigo;
			});
			if (eqpCount > 0 && !upDataFlag) {
				alert(barCodeBigo+ " 에서 사용중 인 BAR CODE 입니다.");
				$('#searchForm').progress().remove();

			} else {
				var rdCk = $('input[id="rdCk"]:checked').val();//$("#rdCk option:checked").val();
				var eqFlag = true;
				if (eqFlag) {
					var saveFlag = true;

					if ($("#unitSize").val() == null || $("#unitSize").val() == "" || $("#unitSize").val() == "0") $("#unitSize").val("1");
					if ($("#unitCnt").val() == null || $("#unitCnt").val() == "" || $("#unitCnt").val() == "0") $("#unitCnt").val("1");
					var strVal1 = $("#eqpTypeGubun1 option:selected").val();
					var strVal2 = $("#eqpTypeGubun2 option:selected").val();
					var strVal3 = $("#eqpTypeGubun3 option:selected").val();

					var strTxt1 = $("#eqpTypeGubun1 option:selected").text();
					var strTxt2 = $("#eqpTypeGubun2 option:selected").text();
					var strTxt3 = $("#eqpTypeGubun3 option:selected").text();
					var strLen2 = document.getElementById("eqpTypeGubun2").length;
					var strLen3 = document.getElementById("eqpTypeGubun3").length;
					if (strVal3 == null || strVal3 == "") {
						if ((strVal2 == null || strVal2 == "") && strLen2 == 1) {
							if (strVal1 == null || strVal1 == "") {
							} else {
								$("#rackEqCd").val(strVal1);
								$("#rackEqName").val(strTxt1);
							}
						} else{
							if ((strVal3 == null || strVal3 == "") && strLen3 == 1) {
								if (strVal2 == null || strVal2 == "") {
								} else {
									$("#rackEqCd").val(strVal2);
									$("#rackEqName").val(strTxt2);
								}
							}
						}
					} else {
						if (strVal3 == null || strVal3 == "") {
						} else {
							$("#rackEqCd").val(strVal3);
							$("#rackEqName").val(strTxt3);
						}
					}
					var systemCd = $("#rackEqCd").val();
					var description = $("#description").val();
					var rackId = $('#rackId').val();

					var sPos =  parseInt($("#sPos").val());
					if (isNaN(sPos)) {saveFlag = false;}
					var unitCnt = parseInt($("#unitCnt").val());
					if (isNaN(unitCnt) || unitCnt < 1) {saveFlag = false;}
					var ePos = sPos + unitCnt - 1;
					if (isNaN(ePos)) {saveFlag = false;}
					var modelNm = $('#rackEqName').val();
					var unitSize = parseInt($('#unitSize').val());
					var inFlag = $("#rackEq_inFlag").val();

					var dismantleFlag = $("#dismantleFlag").val();
					var barcodeFlag =  $("#barcodeFlag").val();
					var barNo = $('#barCode').val();
//					if (getTextLength(barNo) > 30) {
//						return false;
//					}


					var cstrStatCd =  $("#cstrStatCd").val();
					var cstrCd =  $("#cstrCd").val();

					var setlObjCd =  $("#setlObjCd").val();


					var orgCstrCd = $('#orgCstrCd').val();
				    var orgCstrGubun = $('#orgCstrGubun').val();


				    var orgRackId 	= $("#orgRackId").val();
					var orgSPos 	= $("#orgSPos").val();
					var orgEPos		= $("#orgEPos").val();
					if (ePos > unitSize) {
						saveFlag = false;
					}
					if (sPos < ePos) {
						for(i=0;i<rackInArr.length;i++) {
							if (orgRackId == rackId && orgSPos != sPos && parseInt(rackInArr[i].sPos) == sPos) {

							} else {
								if (orgRackId == rackId && orgSPos != sPos && orgEPos != ePos && parseInt(rackInArr[i].sPos) == orgSPos) {

								} else {
									if (sPos < parseInt(rackInArr[i].sPos)) {
										if (ePos >= parseInt(rackInArr[i].sPos)) {
											saveFlag = false;
											break;
										}
									}
								}

							}
						}
					}

					var idx  = $('#basicTabs').getCurrentTabIndex();
			    	switch (idx) {
				    	case 0 :
				    		var mgmtGrpNm = 'SKT';
							break;
				    	case 1 :
				    		var mgmtGrpNm = 'SKB';
							break;
					}


					//saveFlag = false;
					if (!saveFlag) {
						alert("위치할 수 없는 랙 번호입니다.");
						$('#searchForm').progress().remove();
					} else {

						if (rdCk == "0") {	// Dummy
							var modelId = 'TMP0000001'; //Temp 아이템임.
							var userId = $("#userId").val();
							var barNo = $('#dummyBarCode').val();
							var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:systemCd, description:description, dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd, mgmtGrpNm : mgmtGrpNm, setlObjCd : setlObjCd};

							if (!upDataFlag) {
								if (systemCd == "" || systemCd == null) {
									alert("Dummy 분류가 선택 되지 않았습니다.");
									$('#searchForm').progress().remove();
								} else {
									//console.log(param);
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertRactEq', param, 'POST', 'InsertRactEq');
								}
							} else {
								$('#eqpId').val("");
								$('#eqpInstlMtsoNm').val("");
								$('#eqpMdlNm').val("");
								$('#eqpNm').val("");
								$('#eqpRoleDivNm').val("");
								//$('#tmofNm').val("");
								if (systemCd == "" || systemCd == null) {
									alert("Dummy 분류가 선택 되지 않았습니다.");
									$('#searchForm').progress().remove();
								} else {
									// 탱고장비에서 Dummy장비로 수정할 경우 삭제처리
									var orgEqpId 	= $("#orgEqpId").val();
									var orgSPos 	= $("#orgSPos").val();
									var orgRackId	= $("#orgRackId").val();
									if ((orgRackId != rackId) || (orgSPos != undefined && orgSPos != null && orgSPos!= "" && orgSPos != sPos)) {	// 탱고장비에서 Dummy 장비로 수정시는 불가
										alert("Dummy는 랙번호 이동이 불가능합니다.\n삭제 후 등록 하세요.");
										$('#searchForm').progress().remove();
									} else {
										var param = {itemId : orgEqpId, rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:systemCd, description:description, dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd, mgmtGrpNm : mgmtGrpNm, setlObjCd : setlObjCd};
										//console.log(param);
										httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
									}
								}
							}
			    		} else {
			    			var eqpId = $('#eqpId').val();
			    			if (eqpId == "") {
			    				alert("선택된 장비가 없습니다. 장비를 검색하여 주시기 바랍니다.");
			    			} else {
								var userId = $("#userId").val();
								var orgEqpId = $("#orgEqpId").val();
								if (!upDataFlag) {
									var param = {itemId : eqpId, regId : userId};	// 등록 일 경우 oItemId는 eqpid로
									//console.log(param);
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
								} else {
									if (orgEqpId != eqpId) {
										var param = {itemId : eqpId, regId : userId};	// 수정이지만 dummy 장비에서 탱고장비로 수정할 경우
										httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
									} else {
										var orgRackId 	= $("#orgRackId").val();
										var orgSPos 	= $("#orgSPos").val();
										if (orgRackId == rackId && orgSPos == sPos) {
											// 탱고장비 수정은 없는 경우(랙/spos 변경이 없을 경우)
											modelId = $('#eqpId').val();
											modelNm = $('#eqpRoleDivNm').val();
											description = $('#description2').val();
											var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:'', description:description, dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd, mgmtGrpNm : mgmtGrpNm, setlObjCd : setlObjCd};
											httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
										} else {
											var param = {rackId:orgRackId, sPos:orgSPos, regId : userId};
											httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRactEq', param, 'POST', 'DeleteRactEq');
										}
									}
								}
			    			}
			    		}

					}
				} else {
					alert("랙 번호가 선택되지 않았습니다. \n먼저 랙번호를 선택하세요.");
				}
			}


		}


		if(flag == 'mdl'){
			$('#searchEqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#searchEqpMdlId').setData({
	             data:option_data
			});
		}

		if (flag == 'SearchBarCodeEqpId') {
			if(status == "success") {
				var eqpCount = 0;
				var eqpId = "";
				$.each(response.BarCodeEqpId, function(i, item){
					eqpCount = response.BarCodeEqpId[i].eqpCount;
					eqpId = response.BarCodeEqpId[i].eqpId;
				});

				if (eqpCount == 1) {
					if (confirm("선택하신 바코드로 운용중인 장비가 조회됩니다.\n조회된 장비를 등록 하시겠습니까?") == true) {
						$("input:radio[id=rdCk]:input[value='1']").attr("checked", true);
						var data = { eqpId : eqpId};
						if (eqpId.substring(0,2) == "SE") { // 부대장비
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSbeqpSearchInfo', data, 'GET', 'SearchInfo');
						} else {
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpSearchInfo', data, 'GET', 'SearchInfo');
						}
					}// if
				}
			}
		} else if (flag == 'DeleteRactEq') {
			if(status == "success") {
				var userId = $("#userId").val();
				var eqpId = $('#eqpId').val();
    			if (eqpId == "") {
    				alert("선택된 장비가 없습니다. 장비를 검색하여 주시기 바랍니다.");
    			} else {
    				upDataFlag = false;
    				var param = {itemId : eqpId, regId : userId};	// 등록 일 경우 oItemId는 eqpid로
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
    			}
			}
		} else if (flag == 'rackSpos') {
			if(status == "success") {
				rackInArr = [];
				$.each(response.RackSpos, function(i, item){
					var sPos = response.RackSpos[i].sPos;
					var ePos = response.RackSpos[i].ePos;
					var option_data = {sPos:sPos, ePos:ePos}
					rackInArr.push(option_data);
				});
		    	var inArrSpos = 0;
	    		var inArrEpos = 0;
	    		var orgSPos = $("#orgSPos").val();
	    		for(var j = 0; j < rackInArr.length; j++){
	    			inArrSpos = parseInt(rackInArr[j].sPos);
	    			inArrEpos = parseInt(rackInArr[j].ePos);
	    			if (orgSPos != inArrSpos) {

	    				if (inArrSpos ==  inArrEpos) {
		    				$("select[id='sPos'] option[value='"+inArrSpos+"']").remove();
		    			} else {
		    				for(var k = inArrEpos; k >= inArrSpos; k--){
		    					$("select[id='sPos'] option[value='"+k+"']").remove();
		    				}
		    			}
	    			}
	    		}
	    		var selSize = $("select[id='sPos'] option").size();
	    		if (selSize == 1) {
	    			alert("선택가능한 랙 번호가 없습니다.");
	    		} else {
	    			$("#sPos").val(orgSPos);
	    		}
			}
		} else if (flag == 'rackInfo') {
			if(status == "success") {
				var rackNm = "";
				var unitSize = "0";
				$.each(response.RackInfo, function(i, item){
					rackNm 		= response.RackInfo[i].label;
					unitSize 	= response.RackInfo[i].unitSize;
				});

				if (unitSize == undefined || unitSize == null || unitSize == "0") {unitSize = 1;}
				$('#rackNm').val(rackNm);
				$('#unitSize').val(unitSize);

				$('#sPos').clear();
		    	var option_data = [{cd: '', cdNm: '선택하세요'}];
		    	for (var i = parseInt(unitSize); i > 0; i--) {
		    		option_data.push({cd: i, cdNm: i});
				}
				$('#sPos').setData({
		            data:option_data
				});

				var rackId = $('#rackId').val();
				var param = {rackId : rackId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackSpos', param, 'GET', 'rackSpos');

			}
		} else if (flag == 'typeGubun3') {
			$('#eqpTypeGubun3').clear();

			var option_data = [{cd: '', cdNm: '소분류'}];
			for(var i=0; i<response.csTypeList.length; i++){
				var resObj = response.csTypeList[i];
				option_data.push(resObj);
			}
			$('#eqpTypeGubun3').setData({
				data : option_data
			});
			if (upSelectFlag) {
				var type3 = $('#type3').val();
				if (type3 == "" || type3 == null || type3 == undefined  || type3 == "D00001") {

				} else {
					$('#eqpTypeGubun3').val(type3);
				}
			}
		} else if (flag == 'typeGubun2') {
			$('#eqpTypeGubun2').clear();
			var option_data = [{cd: '', cdNm: '중분류'}];
			for(var i=0; i<response.csTypeList.length; i++){
				var resObj = response.csTypeList[i];
				option_data.push(resObj);
			}
			$('#eqpTypeGubun2').setData({
				data : option_data
			});
			if (upSelectFlag) {
				var type2 = $('#type2').val();
				if (type2 != "" && type2 != null && type2 != undefined && type2 != "D00001") {
					$('#eqpTypeGubun2').val(type2);
					var supCd = {supCd : type2};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun3');
				}
			}


		} else if (flag == 'typeGubun1') {
			$('#eqpTypeGubun1').clear();

			var option_data = [{cd: '', cdNm: '대분류'}];
			for(var i=0; i<response.csTypeList.length; i++){
				var resObj = response.csTypeList[i];
				option_data.push(resObj);
			}
			$('#eqpTypeGubun1').setData({
				data : option_data
			});
		} else  if (flag == 'UpdateRactEq') {
			if(status == "success") {
				var result = response.ractEq;
				if (result.length > 0) {
					if (result[0].intgFcltsCd != undefined && result[0].intgFcltsCd != null && result[0].intgFcltsCd != "") {
						var strSrc = "/tango-transmission-web/configmgmt/upsdmgmt/DrawFimsNoS.do?urlCk=1&intgFcltsCd="+result[0].intgFcltsCd;
						$("#ifrm").attr('src', strSrc);
					} else {
						$a.close();
					}
				} else {
					$a.close();
				}

			}
		} else if (flag == 'InsertRactEq') {
			if(status == "success") {
				var result = response.ractEq;
				if (result.length > 0) {
					if (result[0].intgFcltsCd != undefined && result[0].intgFcltsCd != null && result[0].intgFcltsCd != "") {
						var strSrc = "/tango-transmission-web/configmgmt/upsdmgmt/DrawFimsNoS.do?urlCk=1&intgFcltsCd="+result[0].intgFcltsCd;
						$("#ifrm").attr('src', strSrc);
					} else {
						$a.close();
					}
				} else {
					$a.close();
				}

			}
		} else if (flag == 'UnitCntList') {
			if(status == "success") {
				var untCnt = 0;
				$.each(response.UnitCntList, function(i, item){
					untCnt = response.UnitCntList[i].unitCnt;
				});
				if (untCnt != 0 || response.UnitCntList.length > 0) {
					if (confirm("추천 UNIT수는 "+untCnt+"입니다. 등록하시겠습니까?") == true) {
						$("#unitCnt").val(untCnt);
					}// if
				} else {
					alert("해당 장비는 추천 UNIT수가 존재하지 않습니다.");
				}
			}
		} else if (flag == 'BaseEq') {
			if(status == "success") {
				var result = response.saveEq;
				if (result.length > 1) {
					var rdCk = $('input[id="rdCk"]:checked').val();

					var systemCd = $("#rackEqCd").val();
					if (rdCk == "0") {
						var description = $("#description").val();
					} else {
						var description = $("#description2").val();
					}
					var rackId = $('#rackId').val();
					var sPos =  parseInt($("#sPos").val());
					var ePos = sPos + parseInt($("#unitCnt").val()) - 1;
					var modelNm = $('#eqpRoleDivNm').val();
					var unitSize = parseInt($('#unitSize').val());
					var inFlag = $("#rackEq_inFlag").val();
					var modelId = $("#eqpId").val();
					var userId = $("#userId").val();
					var barNo = $("#barCode").val();
					var dismantleFlag = $("#dismantleFlag").val();
					var barcodeFlag =  $("#barcodeFlag").val();
					var cstrStatCd =  $("#cstrStatCd").val();
					var cstrCd =  $("#cstrCd").val();

					var idx  = $('#basicTabs').getCurrentTabIndex();
			    	switch (idx) {
				    	case 0 :
				    		var mgmtGrpNm = 'SKT';
							break;
				    	case 1 :
				    		var mgmtGrpNm = 'SKB';
							break;
					}
					var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:'', description:description, dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId, barCode : barNo, cstrStatCd : cstrStatCd, cstrCd : cstrCd, mgmtGrpNm : mgmtGrpNm};

					if (modelId == "") {
						alert("장비 정보를 불러오지 못했습니다. 다시 시도 하여 주시기 바랍니다.");
					} else if (userId == "") {
						alert("로그인 정보를 상실하였습니다. 다시 로그인하여 주시기 바랍니다.");
					} else {
						if (!upDataFlag) {
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertRactEq', param, 'POST', 'InsertRactEq');
						} else {
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
		    			}
					}
				}
			}
		} else if (flag == 'AccordEq') {
			if(status == "success") {
				var strAlert = "";
				var label = "";
				var flag = false;
				$.each(response.accordEq, function(i, item){
					label = response.accordEq[i].label;
					if (response.accordEq[i].label == undefined || response.accordEq[i].label == "undefined") {
						label = "라벨명 없음"
					}
					strAlert = response.accordEq[i].sisulNm +" > "+ response.accordEq[i].floorName +" > "+ label.replace("|^@^|","");
					flag = true;
				});
				if (flag) {
					alert("해당 장비는 "+strAlert+"\n에서 사용중인 장비입니다.");
					var eqpId = $('#orgEqpId').val();
		   			var eqpInstlMtsoNm = $('#orgEqpInstlMtsoNm').val();
		   			var eqpMdlNm = $('#orgEqpMdlNm').val();
		   			var eqpNm = $('#orgEqpNm').val();
		   			var eqpRoleDivNm = $('#orgEqpRoleDivNm').val();
		   			var tmofNm = $('#orgTmofNm').val();

		   			$('#eqpId').val(eqpId);
					$('#eqpInstlMtsoNm').val(eqpInstlMtsoNm);
					$('#eqpMdlNm').val(eqpMdlNm);
					$('#eqpNm').val(eqpNm);
					$('#eqpRoleDivNm').val(eqpRoleDivNm);
					//$('#tmofNm').val(tmofNm);

				}

			}
		} else if (flag == 'SearchInfo') {
			if(status == "success") {
				$.each(response.RackInDetail, function(i, item){


					$('#eqpInstlMtsoNm').css("background-color", "#32a8a6");
					$('#eqpMdlNm').css("background-color", "#32a8a6");
					$('#eqpId').css("background-color", "#32a8a6");
					$('#eqpNm').css("background-color", "#32a8a6");
					$('#eqpRoleDivNm').css("background-color", "#32a8a6");

					var eqpId = response.RackInDetail[i].eqpId;
					var eqpInstlMtsoNm = response.RackInDetail[i].eqpInstlMtsoNm;
					var eqpMdlNm = response.RackInDetail[i].eqpMdlNm;
					var eqpNm = response.RackInDetail[i].eqpNm;
					var eqpRoleDivNm = response.RackInDetail[i].eqpRoleDivNm;


					$('#eqpId').val(eqpId);
					$('#eqpInstlMtsoNm').val(eqpInstlMtsoNm);
					$('#eqpMdlNm').val(eqpMdlNm);
					$('#eqpNm').val(eqpNm);
					$('#eqpRoleDivNm').val(eqpRoleDivNm);



   	           		var param = {itemId : eqpId};
   	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAccordEq', param, 'GET', 'AccordEq');

					setTimeout(function() {
						$('#eqpInstlMtsoNm').css("background-color", "#fff");
						$('#eqpMdlNm').css("background-color", "#fff");
						$('#eqpId').css("background-color", "#fff");
						$('#eqpNm').css("background-color", "#fff");
						$('#eqpRoleDivNm').css("background-color", "#fff");

					}, 2000);

				});
			}
		} else if (flag == 'RackInDetail') {
			if(status == "success") {
				$.each(response.RackInDetail, function(i, item){
					var barCode = response.RackInDetail[i].barCode;
					var barcodeFlag = response.RackInDetail[i].barcodeFlag;
					var dismantleFlag = response.RackInDetail[i].dismantleFlag;
					var sPos = response.RackInDetail[i].sPos;
					var ePos = response.RackInDetail[i].ePos;
					var eqpId = response.RackInDetail[i].eqpId;
					var eqpInstlMtsoNm = response.RackInDetail[i].eqpInstlMtsoNm;
					var eqpMdlNm = response.RackInDetail[i].eqpMdlNm;
					var eqpNm = response.RackInDetail[i].eqpNm;
					var eqpRoleDivNm = response.RackInDetail[i].eqpRoleDivNm;
					var tmofNm = response.RackInDetail[i].tmofNm;
					var description = response.RackInDetail[i].description;
					var type1 = response.RackInDetail[i].type1;
					var type2 = response.RackInDetail[i].type2;
					var type3 = response.RackInDetail[i].type3;

					var cstrStatCd =  response.RackInDetail[i].cstrStatCd;
					var cstrCd =  response.RackInDetail[i].cstrCd;

					var setlObjCd =  response.RackInDetail[i].setlObjCd;
					console.log("-------"+setlObjCd);

					$('#setlObjCd').val(setlObjCd);
					if(cstrStatCd == "1" || cstrStatCd == "2") {
						$('#cstrStatCd').val(cstrStatCd);
					} else {
						$('#cstrStatCd').val("0");
					}
					$('#cstrCd').val(cstrCd);

					$('#type1').val(type1);
					$('#type2').val(type2);
					$('#type3').val(type3);

					$('#searchBarCode').val(barCode);
					$('#barCode').val(barCode);
					$('#dummyBarCode').val(barCode);


					$('#barcodeFlag').val(barcodeFlag);
					$('#dismantleFlag').val(dismantleFlag);
					$('#sPos').val(sPos);
					$('#orgEPos').val(ePos);

					var unitCnt = parseInt(ePos) - parseInt(sPos) + 1;
					$('#unitCnt').val(unitCnt);

					$('#eqpId').val(eqpId);
					$('#eqpInstlMtsoNm').val(eqpInstlMtsoNm);
					$('#eqpMdlNm').val(eqpMdlNm);
					$('#eqpNm').val(eqpNm);
					$('#eqpRoleDivNm').val(eqpRoleDivNm);
					//$('#tmofNm').val(tmofNm);
					$('#description').val(description);
					$('#description2').val(description);


					$('#orgEqpId').val(eqpId);
					$('#orgEqpInstlMtsoNm').val(eqpInstlMtsoNm);
					$('#orgEqpMdlNm').val(eqpMdlNm);
					$('#orgEqpNm').val(eqpNm);
					$('#orgEqpRoleDivNm').val(eqpRoleDivNm);
					$('#orgTmofNm').val(tmofNm);


					if (tmofNm != "" && tmofNm != null && tmofNm != undefined ) {
						$("input:radio[id=rdCk]:input[value='1']").attr("checked", true);
				   		$("#dataDummyGrid").hide();
				   		$("#dataTangoGrid").show();
				   		$("#btnRackSeach").show();
						$("#sPos").setEnabled(true);
					} else {
						$("input:radio[id=rdCk]:input[value='0']").attr("checked", true);
				   		$("#dataDummyGrid").show();
				   		$("#dataTangoGrid").hide();
					}
					if (type1 == "" || type1 == null || type1 == undefined  || type1 == "D00001") {
						if (type2 == "" || type2 == null || type2 == undefined) {
							var tmpSupCd = type3;
							$('#type1').val(type3);
							$('#type2').val("");
							$('#type3').val("");
						} else {
							var tmpSupCd = type2;
							$('#type1').val(type2);
							$('#type2').val(type3);
							$('#type3').val("");
						}
					} else {
						var tmpSupCd = type1;
					}
					if (tmpSupCd != "" && tmpSupCd != null && tmpSupCd != undefined && tmpSupCd != "D00001") {
						$('#eqpTypeGubun1').val(tmpSupCd);
						var supCd = {supCd : tmpSupCd};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun2');
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', '', 'GET', 'typeGubun3');
					}

					var mgmtGrpNm = response.RackInDetail[i].mgmtGrpNm;
					if (mgmtGrpNm == 'SKB') {
						$('#basicTabs').setTabIndex(1);
					}

					if (barCode != undefined && barCode != null && barCode != "") {
						main.setGrid(1,perPage);
					}

					upDataFlag = true;
					upSelectFlag = true;
				});
			}
		}

		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');

			var idx  = $('#basicTabs').getCurrentTabIndex();
	    	switch (idx) {
		    	case 0 :
		    		$('#'+gridId).alopexGrid('dataSet', response.BarCodeList);
					break;
		    	case 1 :
		    		$('#'+gridId).alopexGrid('dataSet', response.BarCodeList);
					break;
		    	default :
		    		$('#'+gridId).alopexGrid('dataSet', response.BarCodeList);
					break;
			}
		}

		if(flag == 'updateDrawMtsoFloor') {
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close(response);
        			}

				});
			}
		}

		if(flag == 'setlObjCd') {
			$('#setlObjCd').clear();

			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.csTypeList.length; i++){
				var resObj = response.csTypeList[i];
				option_data.push(resObj);
			}
			$('#setlObjCd').setData({
				data : option_data
			});
		}


	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    this.winClose = function() {
    	$a.close();
    };

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