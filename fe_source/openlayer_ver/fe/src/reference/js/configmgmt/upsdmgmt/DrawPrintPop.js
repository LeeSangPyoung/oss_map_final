/**
 * Draw.js
 *
 * @author Administrator
 * @date 2019. 6. 25. 오전 17:30:03
 * @version 1.0
 */
var gridModel = null;

var comDraw = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGrid';
	var gridRack = 'dataRackGrid';
	var paramData = null;
	/*
     * 메인에서 한번 호출되서 초기화 되는 부분
     */
    var floorStandardSize = [];
    var zoomSize = 0;
    var m_strPos = "";
 	var m_strStarted = "";
 	var lineWidth = 0;
 	var lineColor = "rgba(0,0,0,1)";
 	var layerArr = ['L003','L001'];										// Checked Layer값들을 정의함.
 	var firstDataFlag = true;
 	var scaleFactor = 1.00;
 	var baseScale = 26.45;
 	var dimensionView = true;
 	var ownerView = false;
 	var labelView = true;
 	var addItemWidth = 0;
 	var addItemHeight = 0;
 	var addItemZ = 0;
 	var addItemType = "";
 	var addItemTypeName = "";
 	var spaceFlag = false;
 	var itemSizeFix = true;									// 기본 아이템 픽스
 	var label90 = true;
 	var scrollLeftX = 0;					// -좌표값을 인식하기 위함.
 	var scrollLeftY = 0;
 	var firstYn = true;
 	var firstFloorId = "";
 	var portKeyArr = [];
	var portKeyBorderArr = [];
	var acArr = [];
	var dcArr = [];
	var rackUnitCnt = 0;
	var itemSelectFlag = false;
	var clickItem = null;
	var itemHstSrnoYn = "N";
	var variableNm 		= null;
	var variableVal 	= null;
	
    this.setImgSrc = function(){
    	
    	var canvas = document.getElementById("Canvas1");
    	
		if(canvas != null) {
			
			var myImgSrc = canvas.toDataURL("image/png");
			myImgSrc = myImgSrc.replace("data:image/png;base64,","");
			
			return myImgSrc;
		}
    }
    
    this.init = function(id, param) {



    	$("#drawDtlLkupForm").setData(param);
        paramData = param;
        var floorNm =  param.floorNm.replace("&nbsp;"," > ");
        $("#floorNm").val(floorNm);
        var itemHstSrno			= param.itemHstSrno;
        if (itemHstSrno == undefined || itemHstSrno == null || itemHstSrno == "" || itemHstSrno == "0") {
        	$("#btnPrint").show();
        	//$("#page_Position").val("0");
        	//$("#divPosition").show();
		} else {
			$("#divCanvas").css('height','100%');
			itemHstSrnoYn = "Y";
			$("#itemHstSrno").val(itemHstSrno);

			$("#divPrint").hide();
			$("#btnPrint").hide();
        	//$("#divPosition").hide(); //

		}
        setEventListener();
    	window.resizeTo(1122, 793);
        variableNm			= param.variableNm;					// 특정 URL에서 넘어와 값 전달이 필요할 경우 사용함.
    	variableVal			= param.variableVal;				// 특정 URL에서 넘어와 값 전달이 필요할 경우 사용함.

    	layerArr = [];
		layerArr.push('L003');
		layerArr.push('L001');	// 처음 접근시 기초평면은 마지막 배열에 추가 하기 위함.
		layerArr.push('L004');
		layerArr.push('L005');
		layerArr.push('L006');
		layerArr.push('L007');
		layerArr.push('L008');
		layerArr.push('L009');
		$("#layers").val(layerArr);

    	setRegDataSet(param);

    };

    function setRegDataSet(data) {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorInfo', data, 'GET', 'Floor');

    }

    function winPrint() {
    	window.print();
    	$a.close();
    }

    function setEventListener() {
    	$(window).resize(function() {
    		if (itemHstSrnoYn == "Y") {
    			CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height());
    		} else {
    			var ckGubun = $("input:radio[name=rdPrint][value='0']").is(":checked") ? true : false;
    			if (ckGubun) {
    				$("#divCanvas").width(1122);
        			$("#divCanvas").height(700);
    				CanvasResize("WIDTH|^@^|1122|^@@^|HEIGHT|^@^|700");
    			} else {
    				$("#divCanvas").width(793);
        			$("#divCanvas").height(1029);
    				CanvasResize("WIDTH|^@^|793|^@@^|HEIGHT|^@^|1029");
    			}

    		}

		})

    	$('#btnPrint').on('click', function(e) {
    		$("#divCanvasWarp").hide();
        	//$("#divPosition").hide();
    		$("#btnPrint").hide();
    		setTimeout(winPrint(),5000);
		});


    	$(document).on('click', "[name='rdPrint']", function(e){
    		var ckGubun = $("input:radio[name=rdPrint][value='0']").is(":checked") ? true : false;
    		if (ckGubun) {
    			window.resizeTo(1122, 793);
    		} else {
    			window.resizeTo(793, 1122);
    		}
      	 });





    	var canvas = document.getElementById("Canvas1");
    	CanvasResize("WIDTH|^@^|1122|^@@^|HEIGHT|^@^|700");
    	canvas.onmousemove = OnEvtMouseMove;
		canvas.onmousedown = OnEvtMouseDown;
		canvas.onmouseup = OnEvtMouseUp;
		canvas.onmouseout = OnEvtMouseOut;
		canvas.ondblclick = OnEvtDblClick;
		//document.onscroll = OnEvtScroll;


		function OnEvtMouseOut(event) {
			if (BoardInfo.ScrollDown == "") {
				MouseDownClear();
				document.getElementById("Canvas1").style.cursor = "default";
				Draw();
			}
		}
		function OnEvtMouseDown(event) {

    		var rect = canvas.getBoundingClientRect();
    		var nX = parseInt((event.clientX - rect.left)/scaleFactor);
    		var nY = parseInt((event.clientY - rect.top)/scaleFactor);

    		MouseDownClear();
			BoardInfo.Selected.Clear();
			document.getElementById("Canvas1").style.cursor = "move";
			BoardInfo.IsMouseDown = true;
			BoardInfo.MouseDownButton = "MIDDLE";
			BoardInfo.MouseDownX = nX;
			BoardInfo.MouseDownY = nY;
			BoardInfo.ScrollDown = "";
    	}

		function OnEvtMouseMove(event) {
			var rect = canvas.getBoundingClientRect();
            var nX = parseInt((event.clientX - rect.left)/scaleFactor);
            var nY = parseInt((event.clientY - rect.top)/scaleFactor);
            BoardInfo.MouseMoveX = nX;
            BoardInfo.MouseMoveY = nY;

            if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "MIDDLE") {
                var nScrollX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
                BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
                var nRateX = nScrollX / (BoardInfo.Scroll.HScroll.Width - BoardInfo.Scroll.HScroll.BarW);
                var nScrollY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
                BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
                SetScrollValueAdd(-nScrollX, -nScrollY);
                return;
            }
    	}

		function OnEvtMouseUp(event) {
    		var rect = canvas.getBoundingClientRect();
    		var nEventX = parseInt((event.clientX - rect.left)/scaleFactor);
    		var nEventY = parseInt((event.clientY - rect.top)/scaleFactor);
    		if (BoardInfo.IsMouseDown) {

    			if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_DesignPage) {

    				if (BoardInfo.MouseDownButton == "LEFT") {
    					var bSearchSelect = true;
    					var bSelect = true;
    					var bChangeSelectPage = false;
    					// 아이템 선택
    					if (bSearchSelect) {
    						var nGetX = Math.abs(BoardInfo.MouseUpSelectedX - nEventX);
    						var nGetY = Math.abs(BoardInfo.MouseUpSelectedY - nEventY);
    						var bSelected = false;
    						if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
    							//if (nGetX < 3 && nGetY < 3) {
    								BoardInfo.Selected.Clear();
    								// 1개 선택 처리
    								bSelected = SelectItem(bSelect, nEventX, nEventY, 1, 1, false)
    								//alert(bSelected);
    							//}
    						}
    					}
    					if (!bSelected) {
    						BoardInfo.Selected.Clear();
    						portKeyArr = [];
    						portKeyBorderArr = [];
    					} else {
    						var strItemKey = BoardInfo.Selected.ItemKeys[0];
    						var oPage = GetPage(1);
    						var oPanel = GetPanel(oPage, 1);
    						var oItem = GetItem(oPanel, strItemKey);
    						if (oItem) {

    							MouseDownClear();
    						}
    					}
    				} else {
    					BoardInfo.Selected.Clear();
    					MouseDownClear();
    					document.getElementById("Canvas1").style.cursor = "default";
    					portKeyArr = [];
						portKeyBorderArr = [];
    				}
    			}// if

    		}
    		equipmentSelectFlag =false;
    		if (!equipmentSelectFlag) { // 장비 등록을 위한 선택임(드로윙툴에 영향을 주면 안됨)
    			MouseDownClear();
    			Draw();
    			SetPortItemList();
    			//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/eqp', paramData, 'GET', 'EquipmentInfo');
    		}
    	}

		function OnEvtDblClick(event) {
			var rect = canvas.getBoundingClientRect();
    		var nEvtX = parseInt((event.clientX - rect.left)/scaleFactor);
    		var nEvtY = parseInt((event.clientY - rect.top)/scaleFactor);

			var sMouseButton = "";

			if (event.button == 0) {
				sMouseButton = "LEFT";
			}
			else if (event.button == 2) {
				sMouseButton = "RIGHT";
			}
			if (variableNm != undefined && variableNm != null && variableNm != "") {
				if (sMouseButton == "LEFT") {
					if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
						if (BoardInfo.Selected.getIsExistItem()) {
							var strItemKey = BoardInfo.Selected.ItemKeys[0];
							var oPage = GetPage(1);
							var oPanel = GetPanel(oPage, 1);
							var oItem = GetItem(oPanel, strItemKey);
							var dataObj = {rackId : oItem.ItemId};
							parent.top.comMain.comLkupClose(dataObj);
						}
					}
				}
			} else {
				if (sMouseButton == "LEFT") {
					if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
						if (BoardInfo.Selected.getIsExistItem()) {
							var $this = $('#divRackIn');
							if ($this.hasClass('open')) {
								$this.animate ({
									right : 0
								}, 300).removeClass('open');
							}
							var strUrl = "";
							var strWidth = 0;
							var strHeight = 0;
							var winFlag = false;
						}
					}
				}
			}

		}

    	function OnEvtMouseWheel(event) {
    		if ('wheelDelta' in event) {
    			if (event.wheelDelta > 0) {
    				if(zoomSize < 20){
    					scaleFactor *= 1.1;
    					Draw();
    					zoomSize = zoomSize + 1;
    					$("#btn-zoom-size").html(zoomSize);
    				}
    			}
    			else {
    				if(zoomSize > 1){
    					scaleFactor /= 1.1;
    					Draw();
    					zoomSize = zoomSize - 1;
    					$("#btn-zoom-size").html(zoomSize);
    				}
    			}
    		}
    	}

    	$('#btn-zoom-in').on('click', function(e) {
    		e.preventDefault();
    		if(zoomSize < 20){
	            scaleFactor *= 1.1;
				Draw();
				zoomSize = zoomSize + 1;
				$("#btn-zoom-size").html(zoomSize);
            }
		});

    	$('#btn-zoom-out').on('click', function(e) {
    		e.preventDefault();
    		if(zoomSize > 1){
	            scaleFactor /= 1.1;
				Draw();
				zoomSize = zoomSize - 1;
				$("#btn-zoom-size").html(zoomSize);
            }
		});
	}

    function EditPageEditItem(oPage, nEventX, nEventY) {
		var bRetItemEditing = false;

		ClearEditing();
		//PopupClear();

		if (oPage.Key == BoardInfo.Selected.PageKey) {
			if (oPage.Edit.getEditable()) {
				var oPanel = GetPanelFromXYXY(nEventX, nEventY, nEventX + 1, nEventY + 1);
				if (oPanel) {
					var oItem = GetItemFromXY(oPanel, nEventX, nEventY);

					bRetItemEditing = EditPageEditItem2(oPage, oPanel, oItem, nEventX, nEventY, BoardInfo.MouseDownButton);
				}
				else {
					if (BoardInfo.MouseDownButton == "RIGHT") {
						bRetItemEditing = PopupSet(oPage, null, null, nEventX, nEventY);
					}
				}
			}
			else {
				if (BoardInfo.MouseDownButton == "RIGHT") {
					bRetItemEditing = PopupSet(oPage, null, null, nEventX, nEventY);
				}
			}
		}// if

		return bRetItemEditing;
	}

    function EditPageEditItem2(oPage, oPanel, oItem, nEventX, nEventY, sMouseButton) {
		var bRetItemEditing = false;

		if (oItem) {
			if (oItem.Edit) {
				switch (oItem.Style) {
				case e_ItemStyle_Text:
				{
					if (sMouseButton == "LEFT") {
						BoardInfo.Selected.ClearItemKeys();

						var sSize = "12px";
						var sFont = "";
						var sWeight = "";

						var asSizes = oItem.TextFont.split(' ');
						for (var nFont = 0; nFont < asSizes.length; nFont++) {
							if (asSizes[nFont].indexOf('px') > -1) {
								sSize = asSizes[nFont];
							}
							else {
								if (asSizes[nFont].toLowerCase() == "bold") {
									sWeight = asSizes[nFont];
								}
								else {
									if (sFont != "") {
										sFont += " ";
									}

									sFont += asSizes[nFont];
								}
							}
						}// for nFont

						var canvasDiv = document.getElementById("divMove");
						var nX = parseInt((oItem.DrawX - canvasDiv.offsetLeft)*scaleFactor);
						if (isWindow == 1) {
							var nY = parseInt((oItem.DrawY - canvasDiv.offsetTop - baseOffsetTop)*scaleFactor);
						}
						else {
							var nY = parseInt((oItem.DrawY + 77 - canvasDiv.offsetTop)*scaleFactor);
						}
						$("#tagText").css("z-index", "1000");
						$("#tagText").css("left", nX );
						$("#tagText").css("top", nY);
						$("#tagText").css("width", oItem.DrawW*scaleFactor);
						$("#tagText").css("height", oItem.DrawH*scaleFactor);
						$("#tagText").css("font-size", sSize);
						$("#tagText").css("font-family", sFont);
						if (sWeight != "") {
							$("#tagText").css("font-weight", sWeight);
						}
						$("#tagText").css("color", "#fff");
						$("#tagText").css("border", "none"); //1px solid green
						switch (oItem.TextAlign) {
						case e_TextAlign_CenterTop:
						case e_TextAlign_CenterMiddle:
						case e_TextAlign_CenterBottom:
						{
							$("#tagText").css("text-align", "center");
							break;
						}
						case e_TextAlign_RightTop:
						case e_TextAlign_RightMiddle:
						case e_TextAlign_RightBottom:
						{
							$("#tagText").css("text-align", "right");
							break;
						}
						default:
						{
							$("#tagText").css("text-align", "left");
							break;
						}
						}

						var strValue = "";
						for (var i = 0; i < oItem.Text.length; i++) {
							if (i > 0) {
								strValue += "\n";
							}

							strValue += oItem.Text[i];
						}
						$("#tagText").val(strValue);
						//input.value = strValue;

						BoardInfo.Editing.setEdit(oItem.PageKey, oItem.PanelKey, oItem.Key, "TEXT", oItem.TextMaxLine);
						BoardInfo.Tab.Set(oItem.PageKey, oItem.PanelKey, oItem.Key);

						oItem.IsEditing = true;
						Draw();
						$("#tagText").css("visibility", "visible");
						$("#tagText").focus();
						bRetItemEditing = true;

					}
					else if (sMouseButton == "RIGHT") {
						bRetItemEditing = PopupSet(oPage, oPanel, oItem, nEventX, nEventY);
					}
					break;
				}
				}// switch
			}//if (oItem.Edit) {
			else {
				bRetItemEditing = PopupSet(oPage, oPanel, oItem, nEventX, nEventY);
			}
		}// if
		else {
			if (sMouseButton == "RIGHT") {
				bRetItemEditing = PopupSet(oPage, oPanel, null, nEventX, nEventY);
			}
		}

		return bRetItemEditing;
	}

    function SetPortItemList() {

		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		if (oPage && oPanel) {
			if (BoardInfo.Selected.getIsExistItem && BoardInfo.Selected.ItemKeys.length == 1 ) {
				var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
				var paramData = {itemId:oItem.ItemId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/inOut', paramData, 'GET', 'InOut');
			}
		}
	}


	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if (flag == "floorItmeSet") {
    		var option_data =  [];
    		var tmpFloorid = $('#tmpFloorid').val();
    		for(var i=0; i < response.floorInfo.length; i++){
    			var resObj = response.floorInfo[i];
    			option_data.push(resObj);
    			floorStandardSize.push(resObj.floorId+":"+resObj.standardSize);
    			if(resObj.floorId == tmpFloorid) {
    				baseScale = resObj.standardSize;
    			}
    		}
    		$('#floorId').setData({ data : option_data});
			$('#floorId').val(tmpFloorid);

			if (response.floorInfo.length == 0) {

				$("#btnDrawEdit").hide();
				SetCommand('DESIGN_PANEL_LOAD', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', "");
			} else {
				$("#btnDrawEdit").show();
				var sisulCd = $("#sisulCd").val();
				var floorId = $("#floorId").val();

				var tmpParam =  {sisulCd:sisulCd, floorId:floorId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/items', tmpParam, 'GET', 'itemsList');
			}
    	}


    	if(flag == "Floor") {
			if(status == "success") {
				var floorId = $("#floorId").val();
				$.each(response.floorInfo, function(i, item){
					if (floorId == response.floorInfo[i].floorId) {
						baseScale = response.floorInfo[i].standardSize;
						if (baseScale == null || baseScale == "0" ) {
							baseScale = 26.45;
						}
					}
				});
				if (response.floorInfo.length == 0) {
					SetCommand('DESIGN_PANEL_LOAD', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', "");
				} else {
					var param =  $("#drawDtlLkupForm").serialize();
					if (itemHstSrnoYn == "N") {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getItemsList', param, 'GET', 'itemsList');
					} else {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawHistroyItems', param, 'GET', 'itemsList');
					}


				}
			}
		}

    	if (flag == "Eqp") {

    		$('#'+gridRack).alopexGrid('hideProgress');
			$('#'+gridRack).alopexGrid('dataSet', response.rackEqp);
    	}
    	if(flag == "ParamInfoSet") {
			if(status == "success") {
				var _sisulCd = "";
				var _floorId = "";
				var _version = "";
				$.each(response.paramInfoSet, function(i, item){
					_sisulCd = response.paramInfoSet[i].sisulCd;
					_floorId = response.paramInfoSet[i].floorId;
				});
				$("#sisulCd").val(_sisulCd);
				$("#tmpFloorid").val(_floorId);
				itemSelectFlag = true;
				var sisulCd = $("#sisulCd").val();
				var data = {sisulCd : sisulCd};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/floorInfo', data, 'GET', 'floorItmeSet');
			}
		}

    	if (flag == "itemsList") {

//    		var sisulCd = $("#sisulCd").val();
//			var floorId = $("#floorId").val();
//
//			var tmpParam =  {sisulCd:sisulCd, floorId:floorId};
//
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/ac', tmpParam, 'GET', 'AcList');
			//httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/dc', tmpParam, 'GET', 'DcList');
    		for (var j = 0; j < floorStandardSize.length; j++) {
				var tmpStandardSize = floorStandardSize[j].split(":");
				var tmpFloorId = tmpStandardSize[0];
				var tmpScale = tmpStandardSize[1];
				var floorId = $("#floorId").val();
				if (floorId == tmpFloorId) {
					baseScale = tmpScale;
				}
			}


    		//console.log(response.ItemsList);
        	var pageDatas = "PAGE_NAMEVALUE|^@3@^|Key|^@1@^|1|^@2@^|Title|^@1@^|상면관리|^@2@^|Style|^@1@^|0|^@2@^|Date|^@1@^||^@2@^|Time|^@1@^||^@2@^|IsPrintable|^@1@^|true|^@2@^|HeadPrint|^@1@^|A|^@2@^|FootPrint|^@1@^|A|^@2@^|SheetKey|^@1@^||^@2@^|Value|^@1@^|";
			var panelDatas = "PANEL_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|Key|^@1@^|1|^@2@^|BackColor|^@1@^|rgba(255,255,255,1)|^@2@^|Width|^@1@^|5000|^@2@^|Height|^@1@^|5000|^@2@^|IsPrintable|^@1@^|true|^@2@^|ExpandTitle|^@1@^||^@2@^|IsExpandable|^@1@^|false|^@2@^|IsExpanded|^@1@^|true|^@2@^|ExPageKey|^@1@^||^@2@^|IsPrintExpand|^@1@^|false|^@2@^|BackImageString|^@1@^||^@2@^|BackImageWidth|^@1@^|5000|^@2@^|RunPageAdd|^@1@^||^@2@^|RunPageLoad|^@1@^||^@2@^|RunPageSave|^@1@^||^@2@^|IsUserSizable|^@1@^|false|^@2@^|UserMinHeight|^@1@^|5000|^@2@^|UserMaxHeight|^@1@^|1000|^@2@^|Value|^@1@^||^@2@^|BackImageAngle|^@1@^|0";
			var itemDatas = "";
        	$.each(response.ItemsList, function(n, item) {
        		//console.log(item.linethickness);
				var _key = n + 1;
				//console.log(_key);
				var _label = EmptyStr(item.label);
				if (_label == "" || _label == undefined || _label == null){
					_label = "|^@^|";
				}
				_label = _label.replace(/(\n|\r\n)/g, '|^@^|');

				var _itemType = ConvertItemStyle(item.itemType);
				var _rotation = item.rotation;
				var _dimensionTop = item.dimensionTopYn;
				var _dimensionLeft = item.dimensionLeftYn;
				var _dimensionRight = item.dimensionRightYn;
				var _dimensionBottom = item.dimensionBottomYn;
				/***************************************************************
				 * 	이전 데이터 치수선을 표현하기 위함. Start
				 * *************************************************************/

				if (item.dimensionTop == "1") _dimensionTop = 'Y';
				if (item.dimensionLeft == "1") _dimensionLeft = 'Y';
				if (item.dimensionRight == "1") _dimensionRight = 'Y';
				if (item.dimensionBottom == "1") _dimensionBottom = 'Y';
				/***************************************************************
				 * 	이전 데이터 치수선을 표현하기 위함. End
				 * *************************************************************/
				var _alpha = "1.0";
				var _mobileFlag =  item.mobileFlag;

				itemDatas += 		"ITEM_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|PanelKey|^@1@^|1|^@2@^|";
				itemDatas += 		"LayerId|^@1@^|"+EmptyStr(item.layerId)+"|^@2@^|";
				itemDatas += 		"TypeName|^@1@^|"+EmptyStr(item.typeName);+"|^@2@^|";
				itemDatas += 		"ParentItemKey|^@1@^|-1|^@2@^|";
				itemDatas += 		"Key|^@1@^|"+_key+"|^@2@^|";
				itemDatas += 		"Style|^@1@^|"+ConvertItemStyle(EmptyStr(item.itemType));+"|^@2@^|";		//item Type  e_ItemStyle_Square
				itemDatas += 		"ItemType|^@1@^|"+EmptyStr(item.itemType)+"|^@2@^|";
				itemDatas += 		"ItemId|^@1@^|"+EmptyStr(item.itemId)+"|^@2@^|";
				itemDatas += 		"Edit|^@1@^|true|^@2@^|";
				itemDatas += 		"IsSelectable|^@1@^|true|^@2@^|";
				itemDatas += 		"IsPrintable|^@1@^|true|^@2@^|";
				itemDatas += 		"X|^@1@^|"+EmptyStr(item.x)+"|^@2@^|";
				itemDatas += 		"Y|^@1@^|"+EmptyStr(item.y)+"|^@2@^|";
				itemDatas += 		"Z|^@1@^|"+EmptyStr(item.height)+"|^@2@^|";
				itemDatas += 		"Width|^@1@^|"+EmptyStr(item.width)+"|^@2@^|";
				itemDatas += 		"Height|^@1@^|"+EmptyStr(item.length)+"|^@2@^|";
				itemDatas += 		"Angle|^@1@^|"+EmptyStr(item.rotation);+"|^@2@^|";
				itemDatas += 		"BackColor|^@1@^|"+EmptyStr(item.backgroundcolor)+"|^@2@^|";
				itemDatas += 		"BackImageString|^@1@^||^@2@^|";
				itemDatas += 		"BorderColor|^@1@^|"+EmptyStr(item.linecolor)+"|^@2@^|";
				itemDatas += 		"BorderWidth|^@1@^|"+EmptyStr(item.linethickness)+"|^@2@^|";
				itemDatas += 		"TextFont|^@1@^|"+EmptyStr(item.fontsize)+"px 돋움체|^@2@^|";
				itemDatas += 		"TextColor|^@1@^|"+EmptyStr(item.fontcolor)+"|^@2@^|";
				itemDatas += 		"TextAlign|^@1@^|4|^@2@^|";
				itemDatas += 		"Text|^@1@^|"+_label+"|^@2@^|";
				itemDatas += 		"SystemNm|^@1@^|"+EmptyStr(item.systemNm)+"|^@2@^|";
				itemDatas += 		"TextLineSpacing|^@1@^|0|^@2@^|TextBorder|^@1@^|0|^@2@^|TextMaxLine|^@1@^|0|^@2@^|IsViewOutBound|^@1@^|false|^@2@^|IsViewText|^@1@^|true|^@2@^|IsVisible|^@1@^|true|^@2@^|";
				itemDatas += 		"IsBorderLeft|^@1@^|true|^@2@^|IsBorderRight|^@1@^|true|^@2@^|IsBorderTop|^@1@^|true|^@2@^|IsBorderBottom|^@1@^|true|^@2@^|IsUserSizable|^@1@^|false|^@2@^|TextFormat|^@1@^|-1|^@2@^|";
				itemDatas += 		"EditOnly|^@1@^|false|^@2@^|IsWrap|^@1@^|false|^@2@^|DimensionTop|^@1@^|N|^@2@^|DimensionLeft|^@1@^|N|^@2@^|DimensionRight|^@1@^|N|^@2@^|DimensionBottom|^@1@^|N|^@2@^|";
				itemDatas += 		"DimensionWidth|^@1@^|"+EmptyStr(item.width) * baseScale+"|^@2@^|";
				itemDatas += 		"DimensionLength|^@1@^|"+EmptyStr(item.length) * baseScale+"|^@2@^|";
				itemDatas += 		"Alpha|^@1@^|1.0|^@2@^|";
				itemDatas += 		"Points|^@1@^|"+EmptyStr(item.points)+"|^@2@^|";
				itemDatas += 		"MobileFlag|^@1@^|N|^@2@^|";
				itemDatas += 		"UnitSize|^@1@^|"+EmptyStr(item.unitSize)+"|^@2@^|";


				if (_rotation < 90) {
					itemDatas += 		"DimensionTop|^@1@^|"+_dimensionTop+"|^@2@^|";
					itemDatas += 		"DimensionLeft|^@1@^|"+_dimensionLeft+"|^@2@^|";
					itemDatas += 		"DimensionRight|^@1@^|"+_dimensionRight+"|^@2@^|";
					itemDatas += 		"DimensionBottom|^@1@^|"+_dimensionBottom+"|^@2@^|";
				}
				else if(_rotation >= 90 && _rotation < 180 ) {
					itemDatas += 		"DimensionTop|^@1@^|"+_dimensionLeft+"|^@2@^|";
					itemDatas += 		"DimensionLeft|^@1@^|"+_dimensionBottom+"|^@2@^|";
					itemDatas += 		"DimensionRight|^@1@^|"+_dimensionTop+"|^@2@^|";
					itemDatas += 		"DimensionBottom|^@1@^|"+_dimensionRight+"|^@2@^|";
				}
				else if(_rotation >= 180 && _rotation < 270 ) {
					itemDatas += 		"DimensionTop|^@1@^|"+_dimensionBottom+"|^@2@^|";
					itemDatas += 		"DimensionLeft|^@1@^|"+_dimensionRight+"|^@2@^|";
					itemDatas += 		"DimensionRight|^@1@^|"+_dimensionLeft+"|^@2@^|";
					itemDatas += 		"DimensionBottom|^@1@^|"+_dimensionTop+"|^@2@^|";
				}
				else if(_rotation >= 270 && _rotation < 360 ) {
					itemDatas += 		"DimensionTop|^@1@^|"+_dimensionRight+"|^@2@^|";
					itemDatas += 		"DimensionLeft|^@1@^|"+_dimensionTop+"|^@2@^|";
					itemDatas += 		"DimensionRight|^@1@^|"+_dimensionBottom+"|^@2@^|";
					itemDatas += 		"DimensionBottom|^@1@^|"+_dimensionLeft+"|^@2@^|";
				}
				itemDatas += 		"DimensionWidth|^@1@^|"+item.width * baseScale+"|^@2@^|";
				itemDatas += 		"DimensionLength|^@1@^|"+item.length * baseScale+"|^@2@^|";
				itemDatas += 		"Alpha|^@1@^|"+_alpha+"|^@2@^|";
				itemDatas += 		"Points|^@1@^|"+item.points+"|^@2@^|";
				itemDatas += 		"MobileFlag|^@1@^|"+_mobileFlag+"|^@2@^|";
				itemDatas += 		"UnitSize|^@1@^|"+item.unitSize+"|^@2@^|";

				itemDatas += 		"MoveYn|^@1@^|"+item.moveYn+"|^@2@^|";


				itemDatas += 		"RackCount|^@1@^|"+EmptyStr(item.useUnit);

				itemDatas += 		"|^@4@^|";
            });

        	var sVal = pageDatas + "|^@4@^|" + panelDatas + "|^@4@^|" + itemDatas;
        	SetCommand('DESIGN_PANEL_LOAD', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', sVal);
    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){}


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



    function EmptyStr(value,defaultString) {
    	if (typeof value === 'undefined' || value == null || value == "") {
    	    if(defaultString == null)
    	        defaultString ="-";
    		return defaultString;
    	}
    	return value;
    }


 	/*****************************************************
	 * DrawTool 관련 Start
	 * ***************************************************/
	var e_EditMode_EditPage = 0;
	var e_EditMode_DesignPage = 1;
	var e_EditMode_DesignPanel = 2;

	var e_PageStyle_Page = 0;
	var e_PageStyle_Image = 1;

	var e_ItemStyle_None = 0;
	// 텍스트
	var e_ItemStyle_Text = 1;
	//Check
	var e_ItemStyle_Check = 2;
	// 사각형
	var e_ItemStyle_Square = 3;
	// 원형
	var e_ItemStyle_Circle = 4;
	// 직선
	var e_ItemStyle_Straight = 5;
	// 삼각형
	var e_ItemStyle_Triangle = 6;
	// 치수선
	var e_ItemStyle_DimensionLine = 7;
	// 테이블
	var e_ItemStyle_Table = 11;
	// 테이블 Row
	var e_ItemStyle_TableRow = 12;
	// 테이블 Cell
	var e_ItemStyle_TableCell = 13;
	// 곡선
	var e_ItemStyle_Curve = 14;
	// Edit_Page 이미지
	var e_ItemStyle_Image = 21;

	// 여기서부터는 도면에 쓰인 아이템 스타일이므로 추가해야 함.
	//장비/렉
	var e_ItemStyle_AcPanel = 101;
	var e_ItemStyle_StdReck = 102;
	var e_ItemStyle_RectFier = 103;
	var e_ItemStyle_Aircon = 104;
	var e_ItemStyle_Battery471W = 105;
	var e_ItemStyle_EtcBox = 106;
	var e_ItemStyle_Generator = 107;
	var e_ItemStyle_BatteryLithium = 108;
	var e_ItemStyle_Battery_1 = 109;
	var e_ItemStyle_Battery_2 = 110;
	var e_ItemStyle_ExcReck	= 111;

	e_ItemStyle_PwrPatch	= 112;
	e_ItemStyle_UtpPatch	= 113;
	e_ItemStyle_PanelPatch	= 114;


	e_ItemStyle_EleTr		= 115;	// 한전 변압기
	e_ItemStyle_ElePoleTr	= 116;	// 인입전주
	e_ItemStyle_EleInTr		= 117;	// 자가변압기
	e_ItemStyle_EleOutTr	= 118;	// 외부변압기

	e_ItemStyle_EleLink	= 119;	// 연결단자

	// 기초평면
	var e_ItemStyle_Cell = 201;
	var e_ItemStyle_DoubleDoors = 202;
	var e_ItemStyle_ConPillar = 203;
	var e_ItemStyle_Haro1Ea = 204;
	var e_ItemStyle_Beam = 205;
	var e_ItemStyle_beamPillar = 206;
	var e_ItemStyle_ConColumn = 207;
	var e_ItemStyle_SlideDoor = 208;
	var e_ItemStyle_LeftDoors = 209;
	var e_ItemStyle_RightDoors = 210;
	var e_ItemStyle_Door = 211;
	var e_ItemStyle_Stairs = 212;
	var e_ItemStyle_DoubleStairs = 213;
	var e_ItemStyle_FluorescentLight = 214;
	var e_ItemStyle_Haro2Ea = 215;
	var e_ItemStyle_Cctv = 216;
	var e_ItemStyle_Monitor = 217;
	var e_ItemStyle_InnerWall = 218;
	var e_ItemStyle_Wall = 219;
	// ojc덕트
	var e_ItemStyle_Plus = 301;
	var e_ItemStyle_OjcCurve = 302;
	var e_ItemStyle_OjcP = 303;
	var e_ItemStyle_OjcM = 304;
	var e_ItemStyle_OjcT = 305;
	var e_ItemStyle_OjcL = 306;
	var e_ItemStyle_OjcD = 307;
	// 접지케이블 포설
	var e_ItemStyle_CableLine = 401;

	//--- 아이템In 모양
	// None
	var e_ItemInLineStyle_None = 0;
	// 가로선
	var e_ItemInLineStyle_HLine = 1;
	// 세로선
	var e_ItemInLineStyle_VLine = 2;
	// X 선
	var e_ItemInLineStyle_XLine = 3;
	// + 선
	var e_ItemInLineStyle_PLine = 4;
	// 원
	var e_ItemInLineStyle_Ellipse = 5;
	// 대각선1
	var e_ItemInLineStyle_Diagonal1 = 6;
	// 대각선2
	var e_ItemInLineStyle_Diagonal2 = 7;

	//--- TextAlign
	var e_TextAlign_LeftTop = 0;
	var e_TextAlign_LeftMiddle = 1;
	var e_TextAlign_LeftBottom = 2;
	var e_TextAlign_CenterTop = 3;
	var e_TextAlign_CenterMiddle = 4;
	var e_TextAlign_CenterBottom = 5;
	var e_TextAlign_RightTop = 6;
	var e_TextAlign_RightMiddle = 7;
	var e_TextAlign_RightBottom = 8;

	//--- CheckBoxStyle ---
	var e_CheckBoxStyle_None = 0;
	var e_CheckBoxStyle_Rectangle = 1;

	//--- CheckStyle ---
	var e_CheckStyle_None = 0;
	var e_CheckStyle_Check = 1;
	var e_CheckStyle_Text = 2;
	var e_CheckStyle_Circle = 3;
	var e_CheckStyle_Rectangle = 4;
	var e_CheckStyle_FillCircle = 5;
	var e_CheckStyle_FillRectangle = 6;
	var e_CheckStyle_Minus = 7;
	var e_CheckStyle_Plus = 8;

	//--- 아이템 편집모드
	var e_ItemEditMode_None = 0;
	var e_ItemEditMode_Add = 1;
	var e_ItemEditMode_Pen = 2;
	var e_ItemEditMode_Eraser = 3;
	var e_ItemEditMode_Tab1 = 4;
	var e_ItemEditMode_Tab2 = 5;
	var e_ItemEditMode_Straight = 6;    //STRAIGHT

	//--- 속성창의 라인 형식 ---
	var e_LineFormat_Text = 0;
	var e_LineFormat_Number = 1;
	var e_LineFormat_Bool = 2;
	var e_LineFormat_Color = 3;
	var e_LineFormat_MultiText = 4;
	var e_LineFormat_TextAlign = 5;
	var e_LineFormat_CapStyle = 6;
	var e_LineFormat_InLineStyle = 7;
	var e_LineFormat_CheckBoxStyle = 8;
	var e_LineFormat_CheckStyle = 9;
	var e_LineFormat_Image = 10;
	var e_LineFormat_Font = 11;

	//--- Copy, Paste 스타일
	var e_PasteStyle_None = 0;
	var e_PasteStyle_Right = 1;
	var e_PasteStyle_Bottom = 2;
	var e_PasteStyle_Set = 3;

	//--- Popup Menu ---
	var e_PopupStyle_None = 0;
	var e_PopupStyle_Simple = 1;
	var e_PopupStyle_Date = 3;
	var e_PopupStyle_Time = 4;

	var e_PopupReserved_None = 0;
	var e_PopupReserved_PageEditable = 1;
	var e_PopupReserved_PageDate = 2;
	var e_PopupReserved_PageTime = 3;
	var e_PopupReserved_PageAdd = 4;
	var e_PopupReserved_PageDelete = 5;
	var e_PopupReserved_PageUndelete = 6;
	var e_PopupReserved_PageIncomplete = 7;
	var e_PopupReserved_PageCopy = 8;
	var e_PopupReserved_PageCopyToday = 9;

	var e_PopupReserved_PanelHide = 21;
	var e_PopupReserved_PanelShow = 22;
	var e_PopupReserved_PanelDelete = 23;
	var e_PopupReserved_PanelSort = 24;
	var e_PopupReserved_PanelRotateLeft = 25;
	var e_PopupReserved_PanelRotateRight = 26;

	//--- Data처리 ---
	var e_PanelDataStyle_PageAdd = 0;
	var e_PanelDataStyle_PageLoad = 1;
	var e_PanelDataStyle_PageSave = 2;

	//--- DataKeyEvent ---
	var e_DataKeyEvent_PageAdd = 0;
	var e_DataKeyEvent_PageLoad = 1;
	var e_DataKeyEvent_PageSave = 2;

	var m_sDebug = "";

	var BoardInfo = function () {};

	BoardInfo.MainContext = null;
	BoardInfo.CanvasWidth = 0;
	BoardInfo.CanvasHeight = 0;

	BoardInfo.PagesBounds = function () {};
	BoardInfo.PagesBounds.X = 0;
	BoardInfo.PagesBounds.Y = 0;
	BoardInfo.PagesBounds.Width = 0;
	BoardInfo.PagesBounds.Height = 0;

	BoardInfo.AddItemStyle = e_ItemEditMode_None;
	BoardInfo.AddItemValue = "";

	BoardInfo.PenColor = "rgba(0,0,0,1)";
	BoardInfo.PenWidth = 1;
	BoardInfo.PenPositions = [];
	BoardInfo.PenReady = false;
	BoardInfo.PenPageKey = "";
	BoardInfo.PenPanelKey = -1;
	BoardInfo.PenWebWrite = true;

	BoardInfo.IsMouseDown = false;
	BoardInfo.MouseDownButton = "";
	BoardInfo.MouseDownX = 0;
	BoardInfo.MouseDownY = 0;
	BoardInfo.MouseMoveX = 1;
	BoardInfo.MouseMoveY = 2;
	BoardInfo.MouseUpSelectedX = 0;
	BoardInfo.MouseUpSelectedY = 0;
	BoardInfo.IsSelectedMove = false;
	BoardInfo.ScrollDown = "";

	BoardInfo.Key = function () {};
	BoardInfo.Key.IsCtrlKey = false;
	BoardInfo.Key.IsShiftKey = false;
	BoardInfo.Key.IsAltKey = false;

	BoardInfo.Key.IsOnlyCtrlKey = function () {
		return BoardInfo.Key.IsCtrlKey && !BoardInfo.Key.IsShiftKey && !BoardInfo.Key.IsAltKey;
	};

	BoardInfo.Key.Clear = function () {
		BoardInfo.Key.IsCtrlKey = false;
		BoardInfo.Key.IsShiftKey = false;
		BoardInfo.Key.IsAltKey = false;
	};

	BoardInfo.Editing = function () {
	};
	BoardInfo.Editing.PageKey = "";
	BoardInfo.Editing.PanelKey = -1;
	BoardInfo.Editing.ItemKey = -1;
	BoardInfo.Editing.Style = "";
	BoardInfo.Editing.MaxLine = 0;

	BoardInfo.Editing.getIsEdit = function () {
		if (BoardInfo.Editing.ItemKey > -1) {
			return true;
		}
		else {
			return false;
		}
	}

	BoardInfo.Editing.setEdit = function (sPageKey, nPanelKey, nItemKey, sStyle, nMaxLine) {
		BoardInfo.Editing.PageKey = sPageKey;
		BoardInfo.Editing.PanelKey = nPanelKey;
		BoardInfo.Editing.ItemKey = nItemKey;
		BoardInfo.Editing.Style = sStyle;
		BoardInfo.Editing.MaxLine = nMaxLine;
	}

	BoardInfo.Editing.Clear = function () {
		BoardInfo.Editing.PageKey = "";
		BoardInfo.Editing.PanelKey = -1;
		BoardInfo.Editing.ItemKey = -1;
		BoardInfo.Editing.Style = "";
		BoardInfo.Editing.MaxLine = 0;
	}

	BoardInfo.Tab = function () {};
	BoardInfo.Tab.PageKey = "";
	BoardInfo.Tab.PanelKey = -1;
	BoardInfo.Tab.ItemKey = -1;

	BoardInfo.Tab.Clear = function () {
		this.PageKey = "";
		this.PanelKey = -1;
		this.ItemKey = -1;
	};

	BoardInfo.Tab.Set = function (sPageKey, nPanelKey, nItemKey) {
		this.PageKey = sPageKey;
		this.PanelKey = nPanelKey;
		this.ItemKey = nItemKey;
	}

	BoardInfo.Tab.IsExist = function () {
		if (this.PageKey == "" || this.PanelKey == -1 || this.ItemKey == -1) {
			return false;
		}
		else {
			return true;
		}

	}

	BoardInfo.Selected = function () {};
	BoardInfo.Selected.PageKey = "";
	BoardInfo.Selected.PanelKey = -1;
	BoardInfo.Selected.ItemKeys = [];
	BoardInfo.Selected.Points = [];

	BoardInfo.Selected.Clear = function () {
		this.PageKey = "";
		this.PanelKey = "";
		BoardInfo.Selected.ClearItemKeys();
	};

	BoardInfo.Selected.ClearItemKeys = function () {
		this.ItemKeys = [];
		BoardInfo.Selected.ClearPoints();
	};

	BoardInfo.Selected.ClearPoints = function () {
		BoardInfo.Selected.Points = [];
	}

	BoardInfo.Selected.getIsExistPoint = function () {
		if (BoardInfo.Selected.Points.length > 0) {
			return true;
		}
		else {
			return false;
		}
	}

	BoardInfo.Selected.getIsExistItem = function () {
		if (this.PageKey != "" && this.PanelKey != "" && this.ItemKeys.length > 0) {
			return true;
		}
		else {
			return false;
		}
	};

	BoardInfo.Selected.getIsExistPanel = function () {
		if (this.PageKey != "" && this.PanelKey != "") {
			return true;
		}
		else {
			return false;
		}
	};

	BoardInfo.Selected.getIsExistPage = function () {
		if (this.PageKey != "") {
			return true;
		}
		else {
			return false;
		}
	};

	BoardInfo.Popup = function () {};
	BoardInfo.Popup.PageKey = "";
	BoardInfo.Popup.PanelKey = -1;
	BoardInfo.Popup.ItemKey = -1;
	BoardInfo.Popup.IsShow = false;
	BoardInfo.Popup.Style = e_PopupStyle_None;
	BoardInfo.Popup.MenuHeight = 20;
	BoardInfo.Popup.MaxHeight = 500;
	BoardInfo.Popup.ScrollWidth = 5;
	BoardInfo.Popup.ScrollHValue = 0;
	BoardInfo.Popup.ScrollHMaximum = 0;
	BoardInfo.Popup.ScrollVValue = 0;
	BoardInfo.Popup.ScrollVMaximum = 0;
	BoardInfo.Popup.MaxWidth = 300;
	BoardInfo.Popup.MinWidth = 100;
	BoardInfo.Popup.BackColor = "rgba(240,240,240,1)";
	BoardInfo.Popup.ShadowColor = "rgba(151,151,151,0.7)";
	BoardInfo.Popup.BorderColor = "rgba(0,0,0,1)";
	BoardInfo.Popup.ActiveColor = "rgba(0,216,255,1)";
	BoardInfo.Popup.TextColor = "rgba(0,0,0,1)";
	BoardInfo.Popup.DisabledTextColor = "rgba(150,150,150,1)"
	BoardInfo.Popup.TextFont = "12px 굴림";
	BoardInfo.Popup.ColWidths = [];
	BoardInfo.Popup.Menus = [];

	BoardInfo.Popup.DrawX = 0;
	BoardInfo.Popup.DrawY = 0;
	BoardInfo.Popup.DrawW = 0;
	BoardInfo.Popup.DrawH = 0;

	BoardInfo.PropertiesWindow = function () {};
	BoardInfo.PropertiesWindow.IsView = false;
	BoardInfo.PropertiesWindow.TitleWidth = 110;
	BoardInfo.PropertiesWindow.ValueWidth = 120;
	BoardInfo.PropertiesWindow.ScrollWidth = 1;
	BoardInfo.PropertiesWindow.LineHeight = 18;

	BoardInfo.PropertiesWindow.getWidth = function () {
		var nSum = this.TitleWidth + 1 + this.ValueWidth + 1 + this.ScrollWidth;
		return nSum;
	};

	BoardInfo.PropertiesWindow.X = 0;
	BoardInfo.PropertiesWindow.Y = 0;
	BoardInfo.PropertiesWindow.Width = BoardInfo.PropertiesWindow.getWidth();
	BoardInfo.PropertiesWindow.Height = 0;

	BoardInfo.PropertiesWindow.ScrollValue = 0;
	BoardInfo.PropertiesWindow.ScrollMaximum = 0;
	BoardInfo.PropertiesWindow.Lines = [];
	BoardInfo.PropertiesWindow.PageKey = "";
	BoardInfo.PropertiesWindow.PanelKey = "";
	BoardInfo.PropertiesWindow.ItemKeys = [];
	BoardInfo.PropertiesWindow.InputTagName = "";
	BoardInfo.PropertiesWindow.InputLineName = "";
	BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;

	BoardInfo.PropertiesWindow.Clear = function () {
		BoardInfo.PropertiesWindow.ScrollMaximum = 0;
		BoardInfo.PropertiesWindow.Lines = [];
		BoardInfo.PropertiesWindow.PageKey = "";
		BoardInfo.PropertiesWindow.PanelKey = "";
		BoardInfo.PropertiesWindow.ItemKeys = [];
		BoardInfo.PropertiesWindow.InputTagName = "";
		BoardInfo.PropertiesWindow.InputLineName = "";
		BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;
	};

	BoardInfo.PropertiesWindow.IsEmptyBounds = function () {
		if (BoardInfo.PropertiesWindow.Height > 0 && BoardInfo.PropertiesWindow.Width > 0) {
			return false;
		}
		else {
			return true;
		}
	}

	BoardInfo.IsViewDesignItemLayout = false;
	BoardInfo.IsViewDesignItemID = false;

	BoardInfo.EditMode = e_EditMode_EditPage;
	BoardInfo.ItemEditMode = e_ItemEditMode_None;

	BoardInfo.IsViewPageTitle = false;
	BoardInfo.PageTitleHeight = 20;
	BoardInfo.PageTitleBackColor = "#D4F4FA";
	BoardInfo.PageTitleForeColor = "#000000";
	BoardInfo.PageTitleTextFont = "12px 굴림";
	BoardInfo.PageTitleSelectedBackColor = "#6EE3F7";
	BoardInfo.PageTitleSelectedForeColor = "#000000";
	BoardInfo.PageTitleSelectedTextFont = "12px 굴림";
	BoardInfo.PageTitleDeletedBackColor = "#888888";
	BoardInfo.PageTitleDeletedForeColor = "#FFFFFF";
	BoardInfo.PageTitleDeletedTextFont = "italic 12px 굴림";

	BoardInfo.BaseTextFont = "12px 돋움체";
	BoardInfo.TextEditBackColor = "rgba(255,255,192,0.5)";

	BoardInfo.PageBackColor = "#DDDDDD";
	BoardInfo.PageSortAsc = true;
	BoardInfo.PageViewKindKeys = [];

	BoardInfo.PanelReduceHeight = 20;
	BoardInfo.PanelReduceBackColor = "rgba(200,200,200,1)";
	BoardInfo.PanelReduceForeColor = "rgba(0,0,0,1)";
	BoardInfo.RanelReduceTextFont = "12px 돋움체";

	BoardInfo.RequestLoadPages = function () {};
	BoardInfo.RequestLoadPages.List = [];

	BoardInfo.RequestLoadPages.Clear = function () {
		BoardInfo.RequestLoadPages.List = [];
	};

	BoardInfo.RequestLoadPages.Add = function (sPageKey, sPanelPageKey, nIndex) {
		var oInfo = function () {};
		oInfo.PageKey = sPageKey;
		oInfo.PanelPageKey = sPanelPageKey;
		oInfo.PanelIndex = nIndex;

		BoardInfo.RequestLoadPages.List.push(oInfo);
	};

	BoardInfo.RequestLoadPages.RemoveAt = function (nIndex) {
		BoardInfo.RequestLoadPages.List[nIndex] = null;
		BoardInfo.RequestLoadPages.List.splice(nIndex, 1);
	};

	BoardInfo.RequestLoadPages.GetIndex = function (sPageKey) {
		var nIndex = -1;

		for (var i = 0; i < BoardInfo.RequestLoadPages.List.length; i++) {
			var oInfo = BoardInfo.RequestLoadPages.List[i];

			if (oInfo && oInfo.PanelPageKey == sPageKey) {
				nIndex = i;
				break;
			}
		}

		return nIndex;
	};

	BoardInfo.RequestLoadPages.ExistPageKey = function (sEditPageKey) {
		var bRet = false;

		for (var i = 0; i < BoardInfo.RequestLoadPages.List.length; i++) {
			var oInfo = BoardInfo.RequestLoadPages.List[i];

			if (oInfo && oInfo.PageKey == sEditPageKey) {
				bRet = true;
				break;
			}
		}
		;

		return bRet;
	};

	BoardInfo.CopyItems = [];

	BoardInfo.Scroll = function () {};
	BoardInfo.Scroll.BackColor = '#EAEAEA';
	BoardInfo.Scroll.ForeColor = '#B0B0B0';
	BoardInfo.Scroll.Width = 15;
	BoardInfo.Scroll.Height = 15;

	BoardInfo.Scroll.VScroll = function () {};
	BoardInfo.Scroll.VScroll.Value = 0;
	BoardInfo.Scroll.VScroll.Maximum = 0;
	BoardInfo.Scroll.VScroll.X = 0;
	BoardInfo.Scroll.VScroll.Y = 0;
	BoardInfo.Scroll.VScroll.Height = 0;
	BoardInfo.Scroll.VScroll.Width = 0;
	BoardInfo.Scroll.VScroll.BarX = 0;
	BoardInfo.Scroll.VScroll.BarY = 0;
	BoardInfo.Scroll.VScroll.BarW = 0;
	BoardInfo.Scroll.VScroll.BarH = 0;

	BoardInfo.Scroll.HScroll = function () {};
	BoardInfo.Scroll.HScroll.Value = 0;
	BoardInfo.Scroll.HScroll.Maximum = 0;
	BoardInfo.Scroll.HScroll.X = 0;
	BoardInfo.Scroll.HScroll.Y = 0;
	BoardInfo.Scroll.HScroll.Height = 0;
	BoardInfo.Scroll.HScroll.Width = 0;
	BoardInfo.Scroll.HScroll.BarX = 0;
	BoardInfo.Scroll.HScroll.BarY = 0;
	BoardInfo.Scroll.HScroll.BarW = 0;
	BoardInfo.Scroll.HScroll.BarH = 0;

	BoardInfo.Scroll.VScroll.Clear = function () {
		BoardInfo.Scroll.VScroll.Value = 0;
		BoardInfo.Scroll.VScroll.Maximum = 0;
		BoardInfo.Scroll.VScroll.X = 0;
		BoardInfo.Scroll.VScroll.Y = 0;
		BoardInfo.Scroll.VScroll.Height = 0;
		BoardInfo.Scroll.VScroll.BarX = 0;
		BoardInfo.Scroll.VScroll.BarY = 0;
		BoardInfo.Scroll.VScroll.BarW = 0;
		BoardInfo.Scroll.VScroll.BarH = 0;

	};

	BoardInfo.Scroll.HScroll.Clear = function () {
		BoardInfo.Scroll.HScroll.Value = 0;
		BoardInfo.Scroll.HScroll.Maximum = 0;
		BoardInfo.Scroll.HScroll.X = 0;
		BoardInfo.Scroll.HScroll.Y = 0;
		BoardInfo.Scroll.HScroll.Width = 0;
		BoardInfo.Scroll.HScroll.BarX = 0;
		BoardInfo.Scroll.HScroll.BarY = 0;
		BoardInfo.Scroll.HScroll.BarW = 0;
		BoardInfo.Scroll.HScroll.BarH = 0;

	};

	BoardInfo.Scroll.Clear = function () {
		BoardInfo.Scroll.HScroll.Clear();
		BoardInfo.Scroll.VScroll.Clear();
	}

	BoardInfo.ProcDatas = [];
	BoardInfo.Pages = [];
	BoardInfo.Views = [];

	BoardInfo.getViewsCount = function () {
		var nCount = 0;

		if (BoardInfo.Views) {
			nCount = BoardInfo.Views.length;
		}

		return nCount;
	};

	BoardInfo.getViewsHeight = function () {
		var nHeight = 0;

		if (BoardInfo.Views) {
			for (var i = 0; i < BoardInfo.Views.length; i++) {
				var pageIndex = BoardInfo.Views[i];

				nHeight += BoardInfo.Pages[pageIndex].getHeight();

				if (BoardInfo.IsViewPageTitle) {
					nHeight += BoardInfo.PageTitleHeight;
				}
			}
		}

		return nHeight + 2;
	};

	BoardInfo.getViewsWidth = function () {
		var nWidth = 0;
		if (BoardInfo.Views) {
			for (var i = 0; i < BoardInfo.Views.length; i++) {
				var pageIndex = BoardInfo.Views[i];
				var oPage = BoardInfo.Pages[pageIndex];

				if (nWidth < oPage.getWidth()) {
					nWidth = oPage.getWidth();
				}
			}
		}
		return nWidth + 2;
	};

	//--- 출력 ----
	BoardInfo.Print = function () {};
	BoardInfo.Print.Width = 793;
	BoardInfo.Print.Height = 1122;

	BoardInfo.Print.TitleFont = "30px 돋움체";
	BoardInfo.Print.SubTitleFont = "15px 돋움체";

	//--- 로그 ---
	BoardInfo.Print.LogImage = null;

	//--- StoreText ---
	BoardInfo.StoreTextSource = "";

	var canvas = document.getElementById("Canvas1");
	m_strStarted = "STARTED";
	SetCommand('DESIGN_PANEL_NEW', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', '');
	CanvasResize("WIDTH|^@^|"+1000+"|^@@^|HEIGHT|^@^|"+1000);

	function CanvasResize(args) {
		var arrArgs = GetCommandArgs(args, "WIDTH,HEIGHT")
		var canvas = document.getElementById("Canvas1");
		canvas.setAttribute("width", arrArgs[0]);
		canvas.setAttribute("height", arrArgs[1]);
		if (m_strStarted == "STARTED") {
			ClearEditing();
			SetScroll();
			Draw();
		}
	}

//	function CanvasResize(args) {
//		var arrArgs = GetCommandArgs(args, "WIDTH,HEIGHT")
//
//		var canvas = document.getElementById("Canvas1");
//
//		canvas.setAttribute("width", arrArgs[0]);
//		canvas.setAttribute("height", arrArgs[1]);
//
//		if (m_strStarted == "STARTED") {
//			ClearEditing();
//
//			SetScroll();
//			Draw();
//			SetScroll();
//			Draw();
//			SetProcData("CANVAS_RESIZE", "WIDTH|^@^|".concat(arrArgs[0], "|^@@^|HEIGHT|^@^|" ,arrArgs[1], "|^@@^|METHOD_NAME|^@^|CanvasResize"), "");
//			setTimeout(SetLayerHeight(),3000);
//		}
//	}


	// 이벤트 호출
	function SetCommand(sCmd, sOpt, sVal) {
		try {
			sCmd = sCmd.trim();
			while (sOpt.indexOf("|^@~@^|") > -1) {sOpt = sOpt.replace("|^@~@^|", "'");}
			while (sOpt.indexOf("|^@~~@^|") > -1) {sOpt = sOpt.replace("|^@~~@^|", "\\");}
			while (sOpt.indexOf("|^@~rn~@^|") > -1) {sOpt = sOpt.replace("|^@~rn~@^|", "\n");}
			while (sOpt.indexOf("|^@~n~@^|") > -1) {sOpt = sOpt.replace("|^@~n~@^|", "\n");}
			while (sOpt.indexOf("|^@~r~@^|") > -1) {sOpt = sOpt.replace("|^@~r~@^|", "\r");}
			while (sOpt.indexOf("|^@~t~@^|") > -1) {sOpt = sOpt.replace("|^@~t~@^|", "\t");}
			while (sVal.indexOf("|^@~@^|") > -1) {sVal = sVal.replace("|^@~@^|", "'");}
			while (sVal.indexOf("|^@~~@^|") > -1) {sVal = sVal.replace("|^@~~@^|", "\\");}
			while (sVal.indexOf("|^@~rn~@^|") > -1) {sVal = sVal.replace("|^@~rn~@^|", "\n");}
			while (sVal.indexOf("|^@~n~@^|") > -1) {sVal = sVal.replace("|^@~n~@^|", "\n");}
			while (sVal.indexOf("|^@~r~@^|") > -1) {sVal = sVal.replace("|^@~r~@^|", "\r");}
			while (sVal.indexOf("|^@~t~@^|") > -1) {sVal = sVal.replace("|^@~t~@^|", "\t");}
			if (sCmd.substr(0, 5) == "EDIT_") {

			}
			else {
				switch (sCmd) {
					case "DESIGN_PANEL_NEW":
					{
						DesignNewPanel(sOpt);
						break;
					}
					case "DESIGN_PANEL_LOAD":
					{
						var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE");
						BoardInfo.EditMode = e_EditMode_DesignPanel;
						firstYn = true;
						if (firstYn) {
							ClearPage();
							var oPage = PageLoad(sVal);
							if (oPage) {
								if (asOpts[0] != "") {
									SetPageKey(oPage, asOpts[0]);
								}
								if (asOpts[1] != "") {
									oPage.Title = asOpts[1];
								}
								BoardInfo.Pages.push(oPage);
								BoardInfo.Views.push(BoardInfo.Pages.length - 1);
							}

    						var oPanel = GetPanel(oPage, 1);
    						var minX = 10000;
    						var maxX = 0;
    						var minY = 10000;
    						var maxY = 0;
							for (var i = 0; i < oPanel.Items.length; i++) {
								var oItem = oPanel.Items[i];
								if (i == 0 ) {
									minX = oItem.X;
									maxX = oItem.X + oItem.Width;
									minY = oItem.Y;
									maxY = oItem.Y + oItem.Height;
								}
								else {
									minX = Math.min(minX, oItem.X);
									maxX = Math.max(maxX, oItem.X + oItem.Width);
									minY = Math.min(minY, oItem.Y);
									maxY = Math.max(maxY, oItem.Y + oItem.Height);
								}
							}
							BoardInfo.Scroll.HScroll.Value = minX - 2;
							BoardInfo.Scroll.VScroll.Value = minY - 2;
							scaleFactor = 1.0;
							zoomSize = 15;
//							scaleFactor /= 1.1;
//							scaleFactor /= 1.1;
//							scaleFactor /= 1.1;
//							scaleFactor /= 1.1;
//							scaleFactor /= 1.1;
//							scaleFactor /= 1.1;
//	    					zoomSize = zoomSize - 6;
	    					$(".btnsize").html(zoomSize);
							var sisulCd = $("#sisulCd").val();
							var floorId = $("#floorId").val();

							var tmpParam =  {sisulCd:sisulCd, floorId:floorId};


							SetScroll();
							Draw();



							if (itemSelectFlag) {
								var _itemId = $("#itemId").val();
								var oPage = GetPage(1);
								var oPanel = GetPanel(oPage, 1);
								if (oPage && oPanel) {
									for (var j = 0; j < oPanel.Items.length; j++) {
										var oItem = oPanel.Items[j];
										if (oItem.ItemId == _itemId.trim()) {
											var itemKey = oItem.Key;
										}
									}
								}
								SetCommand("SELECT_CLEAR", "", "");
								BoardInfo.ItemEditMode = e_ItemEditMode_None;
								BoardInfo.AddItemStyle = e_ItemStyle_None;
								BoardInfo.Selected.PageKey = 1;
								BoardInfo.Selected.PanelKey = 1;
								BoardInfo.Selected.ItemKeys.push(itemKey);
								SetPropertiesWindow();

								var paramData = {RackId : itemKey}
								$('#'+gridRack).alopexGrid('showProgress');
								httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqp', paramData, 'GET', 'Eqp');

//								MouseDownClear();
//								EquipmentSelected();
//								SetPortItemList();
								itemSelectFlag = false;
							}



							setTimeout(AcDcLjine(tmpParam), 5000);

						}
						break;
					}
					default:
					{
						break;
					}
				}
			}
		}
		catch (err) {
			//msgbox.toast("에러코드 :" + err);
		}
	}

	function AcDcLjine(tmpParam) {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/aclist', tmpParam, 'GET', 'AcList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/dclist', tmpParam, 'GET', 'DcList');
	}

	function Draw() {

		var canvas = document.getElementById("Canvas1");
		if (!BoardInfo.MainContext) {
			if (canvas.getContext) {
				BoardInfo.MainContext = canvas.getContext("2d");
			} else {
				msgbox.toast("지원할 수 없는 환경입니다.");
			}
		}
		BoardInfo.CanvasWidth = canvas.clientWidth;
		BoardInfo.CanvasHeight = canvas.clientHeight;
		DrawBoard(BoardInfo.MainContext);
//		try {
//			if (BoardInfo.MainContext) {
//
//			}else{
//			}
//		}
//		catch (err) {
//			msgbox.toast("에러코드 :" + err);
//
//		}
	}

	function DrawBoard(context) {
		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nCanvasHeight = BoardInfo.CanvasHeight;
		if (context) {
			context.clearRect(0, 0, nCanvasWidth, nCanvasHeight);
			context.beginPath();
			var img = new Image();
			img.src = '/tango-transmission-web/resources/images/upsd/back_1.png';
			var pattern = context.createPattern(img, 'repeat');

			context.fillStyle = pattern;
			context.globalAlpha = 0.3;
			context.fillRect(0, 0, 20000, 20000);
			context.closePath();

			context.save();
            context.translate(0,0);
            context.translate(2,2);

			context.scale(scaleFactor,scaleFactor);

			DrawPages(context);
			context.restore();
		}
	}

	function DrawPages(context) {
		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nCanvasHeight = BoardInfo.CanvasHeight;

		if (BoardInfo.Views.length > 0) {
			var nStartPos = 2;
			for (var i = 0; i < BoardInfo.Views.length; i++) {
				var nPgIdx = BoardInfo.Views[i];
				var oPage = BoardInfo.Pages[nPgIdx];
				var nTitleHeight = 0;
				var nX = 2;
				var nY = 2;
				var nW = oPage.getWidth();
				var nH = oPage.getHeight() + nTitleHeight;
				nStartPos = (nY + nH);
				nX -= BoardInfo.Scroll.HScroll.Value;
				nY -= BoardInfo.Scroll.VScroll.Value;
				var nRight = nX + nW;
				var nBottom = nY + nH;
				oPage.DrawX = nX;
				oPage.DrawY = nY;
				oPage.DrawW = nW;
				oPage.DrawH = nH;
				if (nRight > 0 && nBottom > 0 && nX < nCanvasWidth && nY < nCanvasHeight) {
					if (nW > 0 && nH > 0) {
						DrawPage(context, oPage, nPgIdx, nX, nY, nW, nH);
					}
				}
			}
		}
	}

	function DrawPage(context, oPage, nPgIdx, nX, nY, nW, nH) {
		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nCanvasHeight = BoardInfo.CanvasHeight;
		var bSelectedPage = false;
		if (BoardInfo.Selected.PageKey == oPage.Key) {
			bSelectedPage = true;
		}

		context.beginPath();
		var nPanelStartPos = nY;
		for (var i = 0; i < oPage.Panels.length > 0; i++) {
			var oPanel = oPage.Panels[i];

			nPanelStartPos = DrawPanel(context, oPage, oPanel, nX, nY, nW, nH, nPanelStartPos, nCanvasWidth, nCanvasHeight, bSelectedPage, false);
		}
	}

	function DrawPanel(context, oPage, oPanel, nX, nY, nW, nH, nPanelStartPos, nCanvasWidth, nCanvasHeight, bSelectedPage, bPrintable) {
		var nX2 = nX;
		var nY2 = nPanelStartPos;
		var nW2 = oPanel.Width;
		var nH2 = oPanel.Height;
		if (!oPanel.IsExpanded) {
			nH2 = BoardInfo.PanelReduceHeight;
		}
		nPanelStartPos = (nY2 + nH2);
		var nRight = nX2 + nW2;
		var nBottom = nY2 + nH2;
		// 캔버스영역에 들어가는지 확인
		if (nRight > 0 && nBottom > 0 && nX2 < nCanvasWidth && nY2 < nCanvasHeight) {
			if (nW2 > 0 && nH2 > 0) {
				oPanel.DrawX = nX2;
				oPanel.DrawY = nY2;
				oPanel.DrawW = nW2;
				oPanel.DrawH = nH2;

				if (oPanel.IsExpanded) {
//					context.beginPath();
//					var img = new Image();
//					img.src = 'images/upsd/back_1.png';
//					var pattern = context.createPattern(img, 'repeat');
//					context.fillStyle = pattern;
//					context.globalAlpha = 1.0;
//					context.fillRect(0, 0, 20000, 20000);
//					context.closePath();

					DrawItems(context, oPanel, null, bSelectedPage, oPage.Edit.getEditable(), bPrintable);

					var ckAcDc = $("input:checkbox[id=ckAcDc]").is(":checked") ? true : false;

					if (ckAcDc) {

						if (acArr.length > 0) {
							var dashList = [12,3,3,3];
							var antOffset = 0;
							context.beginPath();
							context.setLineDash(dashList);
							context.lineDashOffset = antOffset;
							context.lineWidth = 2;
							context.globalAlpha = 1.0;
							context.strokeStyle = "#CC0000";
							for(i = 0; i < acArr.length; i++) {
								var portKey = acArr[i].split(":");
								var oItemIn = GetItem(oPanel, parseInt(portKey[0]));
								var oItemOut = GetItem(oPanel, parseInt(portKey[1]));

								var nInX = (parseInt(oItemIn.DrawX) + 0.5) + oItemIn.DrawW / 2;
								var nInY = (parseInt(oItemIn.DrawY) + 0.5) + oItemIn.DrawH / 2;
								var nOutX = (parseInt(oItemOut.DrawX) + 0.5) + oItemOut.DrawW / 2;
								var nOutY = (parseInt(oItemOut.DrawY) + 0.5) + oItemOut.DrawH / 2;
								context.moveTo(nInX, nInY);
								context.lineTo(nOutX, nInY);
								context.lineTo(nOutX, nOutY);
							}
							context.stroke();
							context.closePath();
							context.setLineDash([0]);
						}

						if (dcArr.length > 0) {
							var dashList = [12,3,3,3];
							var antOffset = 0;
							context.beginPath();
							context.setLineDash(dashList);
							context.lineDashOffset = antOffset;
							context.lineWidth = 2;
							context.globalAlpha = 1.0;
							context.strokeStyle = "#006600"; //33CC00
							for(i = 0; i < dcArr.length; i++) {
								var portKey = dcArr[i].split(":");
								var oItemIn = GetItem(oPanel, parseInt(portKey[0]));
								var oItemOut = GetItem(oPanel, parseInt(portKey[1]));

								var nInX = (parseInt(oItemIn.DrawX) + 0.5) + oItemIn.DrawW / 2;
								var nInY = (parseInt(oItemIn.DrawY) + 0.5) + oItemIn.DrawH / 2;
								var nOutX = (parseInt(oItemOut.DrawX) + 0.5) + oItemOut.DrawW / 2;
								var nOutY = (parseInt(oItemOut.DrawY) + 0.5) + oItemOut.DrawH / 2;
								context.moveTo(nInX, nInY);
								context.lineTo(nOutX, nInY);
								context.lineTo(nOutX, nOutY);
							}
							context.stroke();
							context.closePath();
							context.setLineDash([0]);
						}


					} else {
						if (portKeyArr.length > 0) {
							var dashList = [12,3,3,3];
							var antOffset = 0;
							context.beginPath();
							context.setLineDash(dashList);
							context.lineDashOffset = antOffset;
							context.lineWidth = 2;
							context.globalAlpha = 1.0;
							context.strokeStyle = "#FF8000";
							for(i = 0; i < portKeyArr.length; i++) {
								var portKey = portKeyArr[i].split(":");
								var oItemIn = GetItem(oPanel, parseInt(portKey[0]));
								var oItemOut = GetItem(oPanel, parseInt(portKey[1]));

								var nInX = (parseInt(oItemIn.DrawX) + 0.5) + oItemIn.DrawW / 2;
								var nInY = (parseInt(oItemIn.DrawY) + 0.5) + oItemIn.DrawH / 2;
								var nOutX = (parseInt(oItemOut.DrawX) + 0.5) + oItemOut.DrawW / 2;
								var nOutY = (parseInt(oItemOut.DrawY) + 0.5) + oItemOut.DrawH / 2;
								context.moveTo(nInX, nInY);
								context.lineTo(nOutX, nInY);
								context.lineTo(nOutX, nOutY);
							}
							context.stroke();
							context.closePath();
							context.setLineDash([0]);
						}
					}


				}
			}
		}
		return nPanelStartPos
	}

	function DrawItems(context, parentPanel, parentItem, bSelectedPage, bEditable, bPrintable) {
		var nParentX = 0;
		var nParentY = 0;
		var nParentW = 0;
		var nParentH = 0;
		if (parentPanel && parentPanel.Items && parentPanel.Items.length > 0) {
			nParentX = parentPanel.DrawX;
			nParentY = parentPanel.DrawY;
			nParentW = parentPanel.DrawW;
			nParentH = parentPanel.DrawH;
			for (var i = 0; i < parentPanel.Items.length; i++) {
				var oItem = parentPanel.Items[i];

				if (oItem) {
					if (oItem.IsSelectable) {
						parentPanel.IsExistSelectableItem = true;
					}
					DrawItem(context, oItem, nParentX, nParentY, nParentW, nParentH, bSelectedPage, bEditable, bPrintable);
				}
			}
			firstDataFlag = false;	// 무조건 false 처리함. 딱 1번만 실행해서 데이터를 보정하기 위함.
		}
	}

	function DrawItem(context, oItem, nParX, nParY, nParW, nParH, bSelectedPage, bEditable, bPrintable) {
		var changeDate = 201803221200;
		if (BoardInfo.EditMode == e_EditMode_EditPage || BoardInfo.EditMode == e_EditMode_DesignPanel) {
			if (!oItem.IsVisible) {
				return;
			}
			else if (oItem.EditOnly) {
				if (!(bSelectedPage && bEditable)) {
					return;
				}
			}
		}
		if (oItem.Label == "bg") {
			return;
		}
		if (oItem.Style == e_ItemStyle_DimensionLine && oItem.Height < 10) { // 기존데이터 예외처리
			oItem.Height = 25;
			oItem.Y = oItem.Y - 15;
		}
		var strVersion = '201803221202';
		if (strVersion == "") {
			strVersion = 0;
		}
		var nX = nParX + oItem.X;
		var nY = nParY + oItem.Y;
		var nW = oItem.Width;
		var nH = oItem.Height;
		oItem.DrawX = nX;
		oItem.DrawY = nY;
		oItem.DrawW = nW;
		oItem.DrawH = nH;

		var clrBackColor = oItem.BackColor;
		if (oItem.Style == e_ItemStyle_Check) {
			if (oItem.Checked) {
				clrBackColor = oItem.CheckBackColor;
			} else {
				clrBackColor = oItem.UnCheckBackColor;
			}
		} else if (oItem.Style == e_ItemStyle_Text) {
			if (BoardInfo.EditMode == e_EditMode_EditPage) {
				if (oItem.Edit && bSelectedPage && bEditable) {
					clrBackColor = BoardInfo.TextEditBackColor;
				}
			}
		}
		context.beginPath();
		var trans_cx =  (parseInt(nX) + 0.5) + nW / 2;
		var trans_cy =  (parseInt(nY) + 0.5) + nH / 2;
		var angle = oItem.Angle;
		var alpha = oItem.Alpha;
		if (oItem.LayerId != layerArr[0]) alpha = "0.5";
		var borderColor = oItem.BorderColor;

		var rgbBorderColor =  GetDBToRGB(borderColor);
//		borderColor = "rgba("+rgbBorderColor.red+", "+rgbBorderColor.green+", "+rgbBorderColor.blue+", 1)";
		if (oItem.LayerId == 'L003') {
			if (oItem.Style == e_ItemStyle_StdReck) {
				borderColor = "#000";
			} else {
				switch(oItem.Style) {
					case e_ItemStyle_Cell:
					case e_ItemStyle_DoubleDoors:
					case e_ItemStyle_RightDoors:
					case e_ItemStyle_LeftDoors:
					case e_ItemStyle_SlideDoor:
					case e_ItemStyle_Door:
					case e_ItemStyle_Stairs:
					case e_ItemStyle_DoubleStairs:
					case e_ItemStyle_Circle:
					case e_ItemStyle_Square:
					//case e_ItemStyle_EtcBox:
					case e_ItemStyle_Straight:
					case e_ItemStyle_CableLine:
					case e_ItemStyle_OjcP:
					case e_ItemStyle_OjcT:
					case e_ItemStyle_OjcL:
					case e_ItemStyle_OjcD:
					case e_ItemStyle_InnerWall:
					case e_ItemStyle_Wall:
						borderColor = "rgba(0, 0, 0, 1)";
						break;
					default:
						borderColor = "#000";
						break;
				}

				switch(oItem.Style) {
				case e_ItemStyle_DoubleDoors:
				case e_ItemStyle_RightDoors:
				case e_ItemStyle_LeftDoors:
				case e_ItemStyle_SlideDoor:
				case e_ItemStyle_Door:
				case e_ItemStyle_Stairs:
				case e_ItemStyle_DoubleStairs:
				case e_ItemStyle_Straight:
				case e_ItemStyle_InnerWall:
				case e_ItemStyle_Wall:
					alpha = "0.5";
					break;
				case e_ItemStyle_Cell:
					alpha = "0.3";
					break;
				default:
					alpha = "0.5";
					break;
				}
			}
		} else  {
			borderColor = "rgba(0, 0, 0, 1)";
		}


		// 공간정보(랙타입에서 레이어전체로 변경-20181114)
		if (spaceFlag == true && oItem.LayerId == "L003"  && oItem.Style != e_ItemStyle_DimensionLine) {} else {
			//console.log(oItem.BorderWidth);
			var oBorderWidth = oItem.BorderWidth + 0.5;
			if (oItem.MoveYn == "Y") {
				alpha = "1.0";
				borderColor = "red";
				if (oItem.Style != e_ItemStyle_Square ) {
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.lineWidth = oBorderWidth;
					context.globalAlpha = 0.3;
					context.fillStyle = borderColor;
					context.fillRect(-nW/2, -nH/2, nW, nH);
					context.restore();
					context.closePath();
				}

			}


			switch(oItem.Style) {
			case e_ItemStyle_Cell:
				var dottX =  nW / 5;
				var dottY =  nH / 5;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = 0.3;
				context.strokeStyle = borderColor;
				// Top
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2 + (dottX), -nH/2);
				context.moveTo(-nW/2 + (dottX * 2), -nH/2);
				context.lineTo(-nW/2 + (dottX*3), -nH/2);
				context.moveTo(-nW/2 + (dottX * 4), -nH/2);
				context.lineTo(-nW/2 + (dottX*5), -nH/2);
				// Left
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + (dottY));
				context.moveTo(-nW/2, -nH/2 + (dottY * 2));
				context.lineTo(-nW/2, -nH/2 + (dottY * 3));
				context.moveTo(-nW/2, -nH/2 + (dottY * 4));
				context.lineTo(-nW/2, -nH/2 + (dottY * 5));
				// Right
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + (dottY));
				context.moveTo(-nW/2 + nW, -nH/2 + (dottY * 2));
				context.lineTo(-nW/2 + nW, -nH/2 + (dottY * 3));
				context.moveTo(-nW/2 + nW, -nH/2 + (dottY * 4));
				context.lineTo(-nW/2 + nW, -nH/2 + (dottY * 5));
				// Bottom
				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + (dottX), -nH/2 + nH);
				context.moveTo(-nW/2 + (dottX * 2), -nH/2 + nH);
				context.lineTo(-nW/2 + (dottX*3), -nH/2 + nH);
				context.moveTo(-nW/2 + (dottX * 4), -nH/2 + nH);
				context.lineTo(-nW/2 + (dottX*5), -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_DoubleDoors:
				// bottom
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth + 3;
				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				// left Right
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth =  oBorderWidth + 1;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				// curve
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = 1;
				context.moveTo(-nW/2, -nH/2);
				context.quadraticCurveTo(0, 0, -nW/2 + nW/2, -nH/2 + nH);
				context.moveTo(-nW/2 + nW/2, -nH/2 + nH);
				context.quadraticCurveTo(0, 0, -nW/2 + nW, -nH/2);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_RightDoors:
				// left Right
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth =  oBorderWidth + 2;
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				// curve
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2 + nW, -nH/2);
				context.quadraticCurveTo(-nW/2, -nH/2, -nW/2, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_LeftDoors:
				// left Right
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth =  oBorderWidth + 2;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				// curve
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2);
				context.quadraticCurveTo(-nW/2 + nW, -nH/2, -nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_SlideDoor:
				var xW = nW/3;
				var yH = nH/2;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2+nH);
				context.moveTo(-nW/2, -nH/2+yH);
				context.lineTo(-nW/2 + nW/2, -nH/2+yH);
				context.stroke();
				context.strokeRect(-nW/2 + nW/2, -nH/2, nW/2, nH);
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Door:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = "rgba(100,100,100,0.5)";
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth + 2;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Stairs:
				var xW = nW/14;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + xW, -nH/2);
				context.lineTo(-nW/2 + xW, -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 2), -nH/2);
				context.lineTo(-nW/2 + (xW * 2), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 3), -nH/2);
				context.lineTo(-nW/2 + (xW * 3), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 4), -nH/2);
				context.lineTo(-nW/2 + (xW * 4), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 5), -nH/2);
				context.lineTo(-nW/2 + (xW * 5), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 6), -nH/2);
				context.lineTo(-nW/2 + (xW * 6), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 7), -nH/2);
				context.lineTo(-nW/2 + (xW * 7), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 8), -nH/2);
				context.lineTo(-nW/2 + (xW * 8), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 9), -nH/2);
				context.lineTo(-nW/2 + (xW * 9), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 10), -nH/2);
				context.lineTo(-nW/2 + (xW * 10), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 11), -nH/2);
				context.lineTo(-nW/2 + (xW * 11), -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_DoubleStairs:
				var xW = nW/14;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + xW, -nH/2);
				context.lineTo(-nW/2 + xW, -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 2), -nH/2);
				context.lineTo(-nW/2 + (xW * 2), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 3), -nH/2);
				context.lineTo(-nW/2 + (xW * 3), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 4), -nH/2);
				context.lineTo(-nW/2 + (xW * 4), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 5), -nH/2);
				context.lineTo(-nW/2 + (xW * 5), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 6), -nH/2);
				context.lineTo(-nW/2 + (xW * 6), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 7), -nH/2);
				context.lineTo(-nW/2 + (xW * 7), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 8), -nH/2);
				context.lineTo(-nW/2 + (xW * 8), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 9), -nH/2);
				context.lineTo(-nW/2 + (xW * 9), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 10), -nH/2);
				context.lineTo(-nW/2 + (xW * 10), -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 11), -nH/2);
				context.lineTo(-nW/2 + (xW * 11), -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = "rgba(100,100,100,0.9)";
				context.fillRect(-nW/2 - 3, -nH/2 + (nH/2) - 5, xW * 11 + 6, 10);
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2 - 3, -nH/2 + (nH/2) - 5, xW * 11 + 6, 10);
				context.restore();
				context.closePath();

				break;

			case e_ItemStyle_FluorescentLight:
				var xW = nW/4;
				var yH = nH/20;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + (yH*2), nW, yH*16);

				context.moveTo(-nW/2 + xW, -nH/2);
				context.lineTo(-nW/2 + xW, -nH/2 + nH);
				context.moveTo(-nW/2 + (xW * 3), -nH/2);
				context.lineTo(-nW/2 + (xW * 3), -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_ConPillar:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + nW - 3, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH - 3);
				context.moveTo(-nW/2 + nW, -nH/2 + 3);
				context.lineTo(-nW/2 + 3, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Monitor:
				var xW = nW/20;
				var yH = nH/20;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, yH*14);
				context.strokeRect(-nW/2 + (xW*2), -nH/2 + (yH*2), xW*16, yH*10);

				context.moveTo(-nW/2 + (xW*8) , -nH/2 + (yH*17));
				context.lineTo(-nW/2 + (xW*12) , -nH/2 + (yH*17));

				context.moveTo(-nW/2 + (xW*5) , -nH/2 + nH);
				context.lineTo(-nW/2 + (xW*15) , -nH/2 + nH);

				context.stroke();
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_Cctv:
				var xW = nW/20;
				var yH = nH/20;
				var dottArc = nW / 9;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;

				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, dottArc, 0, 2*Math.PI);
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, dottArc/2, 0, 2*Math.PI);

				context.moveTo(-nW/2 , -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + (yH*2));
				context.lineTo(-nW/2 + xW, -nH/2 + (yH*2));
				context.lineTo(-nW/2 , -nH/2);

				context.moveTo(-nW/2 , -nH/2 + (yH*3));
				context.lineTo(-nW/2 + xW, -nH/2 + (yH*3));
				context.lineTo(-nW/2 + xW, -nH/2 + (yH*6));
				context.lineTo(-nW/2, -nH/2 + (yH*6));
				context.lineTo(-nW/2 , -nH/2 + (yH*3));

				context.moveTo(-nW/2 + (xW*2) , -nH/2 + (yH*3));
				context.lineTo(-nW/2 + nW, -nH/2 + (yH*3));
				context.lineTo(-nW/2 + (xW*16), -nH/2 + (yH*9));
				context.lineTo(-nW/2 + (xW*2), -nH/2 + (yH*9));
				context.lineTo(-nW/2 + (xW*2), -nH/2 + (yH*3));

				context.moveTo(-nW/2 + (xW*9), -nH/2 + (yH*10));
				context.lineTo(-nW/2 + (xW*11), -nH/2 + (yH*10));
				context.lineTo(-nW/2 + (xW*11), -nH/2 + (yH*14));
				context.lineTo(-nW/2 + (xW*18), -nH/2 + (yH*14));
				context.lineTo(-nW/2 + (xW*18), -nH/2 + (yH*11));
				context.lineTo(-nW/2 + (xW*20), -nH/2 + (yH*11));
				context.lineTo(-nW/2 + (xW*20), -nH/2 + (yH*19));
				context.lineTo(-nW/2 + (xW*18), -nH/2 + (yH*19));
				context.lineTo(-nW/2 + (xW*18), -nH/2 + (yH*16));
				context.lineTo(-nW/2 + (xW*9), -nH/2 + (yH*16));
				context.lineTo(-nW/2 + (xW*9), -nH/2 + (yH*10));
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Haro1Ea:
				var dottX =  nW / 3;
				var dottY =  nH / 3;
				var dottArcX = nW / 5;
				var dottArcY = nH / 5;
				var dottArc = dottArcX;
				if (dottArcX > dottArcY) dottArc = dottArcY;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + nW/2, -nH/2 + nH/2 - dottY);
				context.lineTo(-nW/2 + nW/2, -nH/2 + nH/2 + dottY);
				context.moveTo(-nW/2 + nW/2 - dottX, -nH/2 + nH/2);
				context.lineTo(-nW/2 + nW/2 + dottX, -nH/2 + nH/2);
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, dottArc, 0, 2*Math.PI);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Haro2Ea:
				var dottX =  nW / 5;
				var dottY =  nH / 3;
				var dottArcX = nW / 5
				var dottArcY = nH / 5;
				var dottArc = dottArcX;
				var tmpX = nW/4;
				if (dottArcX > dottArcY) dottArc = dottArcY;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + tmpX, -nH/2 + nH/2 - dottY);
				context.lineTo(-nW/2 + tmpX, -nH/2 + nH/2 + dottY);
				context.moveTo(-nW/2 + tmpX - dottX, -nH/2 + nH/2);
				context.lineTo(-nW/2 + tmpX + dottX, -nH/2 + nH/2);
				context.arc(-nW/2 + tmpX, -nH/2 + nH/2, dottArc, 0, 2*Math.PI);

				context.moveTo(-nW/2 + (tmpX*3), -nH/2 + nH/2 - dottY);
				context.lineTo(-nW/2 + (tmpX*3), -nH/2 + nH/2 + dottY);
				context.moveTo(-nW/2 + (tmpX*3) - dottX, -nH/2 + nH/2);
				context.lineTo(-nW/2 + (tmpX*3) + dottX, -nH/2 + nH/2);
				context.arc(-nW/2 + (tmpX*3), -nH/2 + nH/2, dottArc, 0, 2*Math.PI);

				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Aircon:
				var dottX =  nW / 4;
				var dottY =  nH / 6;
				var dottTopX =  nW / 8;
				var dottTopY =  nH / 8;
				if (dottArcX > dottArcY) dottArc = dottArcY;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + dottY, nW, nH - dottY);

				context.moveTo(-nW/2 + dottTopX, -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 2), -nH/2);
				context.moveTo(-nW/2 + dottTopX, -nH/2);
				context.lineTo(-nW/2 + dottTopX - 2, -nH/2 + dottY);
				context.moveTo(-nW/2 + (dottTopX * 2), -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 2) + 2, -nH/2 + dottY);

				context.moveTo(-nW/2 + (dottTopX * 3) + dottTopX/2, -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 4) + dottTopX/2, -nH/2);
				context.moveTo(-nW/2 + (dottTopX * 3) + dottTopX/2, -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 3) + dottTopX/2 - 2, -nH/2 + dottY);
				context.moveTo(-nW/2 + (dottTopX * 4) + dottTopX/2, -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 4) + dottTopX/2 + 2, -nH/2 + dottY);

				context.moveTo(-nW/2 + (dottTopX * 6), -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 7), -nH/2);
				context.moveTo(-nW/2 + (dottTopX * 6), -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 6) - 2, -nH/2 + dottY);
				context.moveTo(-nW/2 + (dottTopX * 7), -nH/2);
				context.lineTo(-nW/2 + (dottTopX * 7) + 2, -nH/2 + dottY);

				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Battery471W:
				var dottX =  nW / 6;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 2, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 3, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 4, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 5, -nH/2, dottX, nH - 4);

				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Battery_2:
				var dottX =  nW / 6;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 2, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 3, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 4, -nH/2, dottX, nH - 4);
				context.strokeRect(-nW/2 + dottX * 5, -nH/2, dottX, nH - 4);

				context.moveTo(-nW/2, -nH/2 + nH/2 - 4);
				context.lineTo(-nW/2 + nW, -nH/2 + nH/2 - 4);
				context.stroke();

				context.moveTo(-nW/2, -nH/2 + nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH/2);
				context.stroke();

				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_BatteryLithium:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);

				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.strokeRect(-nW/2, -nH/2 + 4, nW, nH - 8);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.strokeRect(-nW/2 + 4, -nH/2, nW - 8, nH);
				context.restore();
				context.closePath();

				break;

			case e_ItemStyle_AcPanel:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 +nW, -nH/2);
				context.fillStyle = borderColor;
				context.fill();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2 +nW, -nH/2);
				context.lineTo(-nW/2 +nW, -nH/2 + nH);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.strokeStyle = borderColor;
				context.stroke();
				context.restore();
				context.closePath();

				var ckAcDc = $("input:checkbox[id=ckAcDc]").is(":checked") ? true : false;
				if (ckAcDc) {
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = 0.9;
					context.fillStyle = "#006600";
					context.fillRect(-nW/2, -nH/2, nW, nH);
					context.strokeStyle = "#006600";
					context.lineWidth = oItem.BorderWidth;
					context.strokeRect(-nW/2, -nH/2, nW, nH);

					context.restore();
					context.closePath();
				}

				break;
			case e_ItemStyle_Circle:
				var kappa = .5522848;
				ox = (nW / 2) * kappa, // control point offset horizontal
				oy = (nH / 2) * kappa, // control point offset vertical
				xe = -nW/2 + nW,           // x-end
				ye = -nH/2 + nH,           // y-end
				xm = -nW/2 + nW / 2,       // x-middle
				ym = -nH/2 + nH / 2;       // y-middle
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.strokeStyle = borderColor;
				context.globalAlpha = alpha;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2 + nH/2);
				context.bezierCurveTo(-nW/2, ym - oy, xm - ox, -nH/2, xm, -nH/2);
				context.bezierCurveTo(xm + ox, -nH/2, xe, ym - oy, xe, ym);
				context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
				context.bezierCurveTo(xm - ox, ye, -nW/2, ym + oy, -nW/2, ym);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Square:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);

				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				if (oItem.Key != 0) {
					if (oItem.ItemType != "background") {
						context.lineWidth = oBorderWidth;
						context.strokeRect(-nW/2, -nH/2, nW, nH);
					}

				}
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_EtcBox:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Generator:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2 + 6, -nH/2 + 6, nW - 12, (nH) - 12);
				context.restore();
				context.closePath();

				var tmpW = nW/10;
				var tmpH = nH/10;
				var tmpW1 = nW/20;
				var tmpH1 = nH/20;

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.moveTo(-nW/2 + nW/2 - tmpW, -nH/2 +  tmpH);
				context.lineTo(-nW/2 + nW/2 - tmpW - tmpW1, -nH/2 + nH/2);
				context.lineTo(-nW/2 + nW/2, -nH/2 + nH/2);
				context.lineTo(-nW/2 + nW/2 - tmpW1, -nH/2 + nH - tmpH);
				context.lineTo(-nW/2 + nW/2 + tmpW1, -nH/2 + nH/2 - tmpH1);
				context.lineTo(-nW/2 + nW/2 - tmpW1, -nH/2 + nH/2 - tmpH1);
				context.lineTo(-nW/2 + nW/2 + tmpW1, -nH/2 +  tmpH);
				context.lineTo(-nW/2 + nW/2 - tmpW, -nH/2 +  tmpH);
				context.strokeStyle = borderColor;
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_StdReck:

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = 0.3;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
				context.moveTo(-nW/2 + 8, -nH/2 + 4);
				context.lineTo(-nW/2 + 8, -nH/2 + nH - 4);
				context.moveTo(-nW/2 + nW - 8, -nH/2 + 4);
				context.lineTo(-nW/2 + nW - 8, -nH/2 + nH - 4);
				context.stroke();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();


				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_ExcReck:

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = 0.3;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
				context.moveTo(-nW/2 + 8, -nH/2 + 4);
				context.lineTo(-nW/2 + 8, -nH/2 + nH - 4);
				context.moveTo(-nW/2 + nW - 8, -nH/2 + 4);
				context.lineTo(-nW/2 + nW - 8, -nH/2 + nH - 4);
				context.stroke();
				context.restore();
				context.closePath();


				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2 + 12, -nH/2 + 20, nW - 24, -10);
				context.restore();
				context.closePath();


				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();


				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_PwrPatch:

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2 + nH/6, nW, nH - nH/6 - nH/6);
				context.strokeRect(-nW/2, -nH/2, nW/3, nH/6);
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.fillRect(-nW/2 + nW - nW/3, -nH/2 + nH - nH/6, nW/3, nH/6);
				context.restore();
				context.closePath();

				var tmpArc = 10;
				if (nW > nH) {
					tmpArc = nH;
				} else {
					tmpArc = nW;
				}
				if (tmpArc < 25) {
					tmpArc = 25;
				}
				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 2;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, tmpArc/4, 0, tmpArc/4 * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 1;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, tmpArc/4 - 4 , 0, (tmpArc/4 - 4) * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 2;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/7, -nH/2 + nH/2, tmpArc/4, 0, tmpArc/4 * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 1;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/7, -nH/2 + nH/2, tmpArc/4 - 4 , 0, (tmpArc/4 - 4) * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 2;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - nW/7, -nH/2 + nH/2, tmpArc/4, 0, tmpArc/4 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();


				break;
			case e_ItemStyle_UtpPatch:


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2 + nH/6, nW, nH - nH/6 - nH/6);
				context.strokeRect(-nW/2, -nH/2, nW/3, nH/6);
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.fillRect(-nW/2 + nW - nW/3, -nH/2 + nH - nH/6, nW/3, nH/6);
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2 + nW/7, -nH/2 + nH/5, nW/7, nH - (nH/7 + nH/7 + nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2 + nW/7 + 3, -nH/2 + nH/5, nW/7 - 6, nH - (nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2 + nW/2 - ((nW/7)/2), -nH/2 + nH/5, nW/7, nH - (nH/7 + nH/7 + nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2 + nW/2 - ((nW/7)/2) + 3, -nH/2 + nH/5, nW/7 - 6, nH - (nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2 + nW - nW/7 - nW/7, -nH/2 + nH/5, nW/7, nH - (nH/7 + nH/7 + nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2 + nW - nW/7 - nW/7 + 3, -nH/2 + nH/5, nW/7 - 6, nH - (nH/7 + nH/7 + nH/7));
				context.restore();
				context.closePath();

				break;

			case e_ItemStyle_PanelPatch:


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2 + nH/6, nW, nH - nH/6 - nH/6);
				context.strokeRect(-nW/2, -nH/2, nW/3, nH/6);
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.fillRect(-nW/2 + nW - nW/3, -nH/2 + nH - nH/6, nW/3, nH/6);
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.fillRect(-nW/2 + nW/10, -nH/2 + nH/3, nW - (nW/10 + nW/10), 3);
				context.restore();
				context.closePath();
//
//
//				context.beginPath();
//				context.save();
//				context.translate(trans_cx, trans_cy);
//				context.rotate(angle*Math.PI/180);
//				context.lineWidth = oItem.BorderWidth;
//				context.globalAlpha = alpha;
//				context.strokeStyle = borderColor;
//				context.strokeRect(-nW/2 + 15, -nH/2, 4, nH - 4);
//				context.restore();
//				context.closePath();
//
//
//				context.beginPath();
//				context.save();
//				context.translate(trans_cx, trans_cy);
//				context.rotate(angle*Math.PI/180);
//				context.lineWidth = oItem.BorderWidth;
//				context.globalAlpha = alpha;
//				context.strokeStyle = borderColor;
//				context.strokeRect(-nW/2 + nW - 19, -nH/2, 4, nH - 4);
//				context.restore();
//				context.closePath();
//
//				context.beginPath();
//				context.save();
//				context.translate(trans_cx, trans_cy);
//				context.rotate(angle*Math.PI/180);
//				context.lineWidth = oItem.BorderWidth;
//				context.globalAlpha = alpha;
//				context.strokeStyle = borderColor;
//				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
//				context.restore();
//				context.closePath();

				break;

			case e_ItemStyle_EleInTr:

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth + 2;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2 + nW/7, -nH/2);
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW/7, -nH/2  + nH);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.moveTo(-nW/2 + nW, -nH/2 + nH);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2  + nH);


				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));

				context.stroke();
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.fillRect(-nW/2 + nW/5, -nH/2 + nH/5, nW/5, nH - (nH/5 + nH/5));
				context.fillRect(-nW/2 + nW - (nW/5 + nW/5), -nH/2 + nH/5, nW/5, nH - (nH/5 + nH/5));
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_EleOutTr:

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth + 2;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2 + nW/7, -nH/2);
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW/7, -nH/2  + nH);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.moveTo(-nW/2 + nW, -nH/2 + nH);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2  + nH);


				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));

				context.stroke();
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2 + nW/5, -nH/2 + nH/5, nW/5, nH - (nH/5 + nH/5));
				context.strokeRect(-nW/2 + nW - (nW/5 + nW/5), -nH/2 + nH/5, nW/5, nH - (nH/5 + nH/5));
				context.restore();
				context.closePath();

				break;

			case e_ItemStyle_EleLink:
				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2 + nH/6, nW, nH - nH/6 - nH/6);
				context.strokeRect(-nW/2, -nH/2, nW/3, nH/6);
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.fillRect(-nW/2 + nW - nW/3, -nH/2 + nH - nH/6, nW/3, nH/6);
				context.restore();
				context.closePath();


				break;
			case e_ItemStyle_EleTr:

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth + 2;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2 + nW/7, -nH/2);
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.moveTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW/7, -nH/2  + nH);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.moveTo(-nW/2 + nW, -nH/2 + nH);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2  + nH);


				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + (oItem.BorderWidth + 6));
				context.moveTo(-nW/2 + (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));
				context.lineTo(-nW/2 + nW - (oItem.BorderWidth + 2), -nH/2 + nH - (oItem.BorderWidth + 6));

				context.stroke();
				context.restore();
				context.closePath();


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2 + nW/7, -nH/2 + 16);
				context.lineTo(-nW/2 + nW/7, -nH/2 + nH - 16);
				context.moveTo(-nW/2 + nW/7 - 3, -nH/2 + 16);
				context.lineTo(-nW/2 + nW/7 - 3, -nH/2 + nH - 16);
				context.moveTo(-nW/2 + nW - nW/7, -nH/2 + 16);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2 + nH - 16);
				context.moveTo(-nW/2 + nW - nW/7 + 3, -nH/2 + 16);
				context.lineTo(-nW/2 + nW - nW/7 + 3, -nH/2 + nH - 16);

				context.stroke();
				context.restore();
				context.closePath();

				var tmpArc = 10;
				if (nW > nH) {
					tmpArc = nH;
				} else {
					tmpArc = nW;
				}
				if (tmpArc < 25) {
					tmpArc = 25;
				}
				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 2;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, tmpArc/3, 0, tmpArc/3 * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = 1;
				context.strokeStyle = borderColor;
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, tmpArc/3 - 4 , 0, (tmpArc/3 - 4) * Math.PI, false);
				context.stroke();
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_ElePoleTr:


				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.lineWidth = oItem.BorderWidth;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW/2, -nH/2 + nH/2, nW/10, 0, nW/10 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth + 5;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2, -nH/2 + nH/2);
				context.lineTo(-nW/2 + nW, -nH/2 + nH/2);
				context.stroke();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.moveTo(-nW/2 + nW/7, -nH/2);
				context.lineTo(-nW/2 + nW/7, -nH/2 + nH);
				context.moveTo(-nW/2 + nW/4, -nH/2);
				context.lineTo(-nW/2 + nW/4, -nH/2 + nH);
				context.moveTo(-nW/2 + nW - nW/7, -nH/2);
				context.lineTo(-nW/2 + nW - nW/7, -nH/2 + nH);
				context.moveTo(-nW/2 + nW - nW/4, -nH/2);
				context.lineTo(-nW/2 + nW - nW/4, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();

				break;
			case e_ItemStyle_ConColumn:
				var kappa = .5522848;
				ox = (nW / 2) * kappa, // control point offset horizontal
				oy = (nH / 2) * kappa, // control point offset vertical
				xe = -nW/2 + nW,           // x-end
				ye = -nH/2 + nH,           // y-end
				xm = -nW/2 + nW / 2,       // x-middle
				ym = -nH/2 + nH / 2;       // y-middle
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2 + nH/2);
				context.bezierCurveTo(-nW/2, ym - oy, xm - ox, -nH/2, xm, -nH/2);
				context.bezierCurveTo(xm + ox, -nH/2, xe, ym - oy, xe, ym);
				context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
				context.bezierCurveTo(xm - ox, ye, -nW/2, ym + oy, -nW/2, ym);
				context.stroke();
				context.clip();
				context.moveTo(-nW/2 + nW - 5, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH - 5);
				context.moveTo(-nW/2 + nW, -nH/2 + 5);
				context.lineTo(-nW/2 + 5, -nH/2 + nH);

				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_RectFier:
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
				context.restore();
				context.closePath();


				var ckAcDc = $("input:checkbox[id=ckAcDc]").is(":checked") ? true : false;
				if (ckAcDc) {
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = 0.9;
					context.fillStyle = "red";
					context.fillRect(-nW/2, -nH/2, nW, nH);
					context.strokeStyle = "#red";
					context.lineWidth = oItem.BorderWidth;
					context.strokeRect(-nW/2, -nH/2, nW, nH);

					context.restore();
					context.closePath();
				}


				break;
			case e_ItemStyle_beamPillar:
				var xW = nW/3;
				var yH = nH/2;
				var  intervalPxl = nW/3;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);

				context.moveTo(-nW/2 + intervalPxl, -nH/2 + intervalPxl);
				context.lineTo(-nW/2 + intervalPxl, -nH/2 + nH - intervalPxl);
				context.moveTo(-nW/2 + nW - intervalPxl, -nH/2 + intervalPxl);
				context.lineTo(-nW/2 + nW - intervalPxl, -nH/2 + nH -  intervalPxl);
				context.moveTo(-nW/2 + intervalPxl, -nH/2 + yH);
				context.lineTo(-nW/2 + nW - intervalPxl, -nH/2 + yH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Beam:
				var xW = nW/3;
				var yH = nH/2;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;

				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2+nH);
				context.moveTo(-nW/2 + nW, -nH/2);
				context.lineTo(-nW/2 + nW, -nH/2+nH);
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2 + yH);
				context.lineTo(-nW/2 + nW, -nH/2 + yH);

				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Plus:
				var xW = nW/3;
				var yH = nH/3;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;

				context.moveTo(-nW/2 + xW, -nH/2);
				context.lineTo(-nW/2 + (xW*2), -nH/2);
				context.lineTo(-nW/2 + (xW*2), -nH/2 + yH);
				context.lineTo(nW/2, -nH/2 + yH);
				context.lineTo(nW/2, -nH/2 + (yH*2));
				context.lineTo(nW/2 - xW, -nH/2 + (yH*2));
				context.lineTo(nW/2 - xW, -nH/2 + nH);
				context.lineTo(-nW/2 + (xW*2), -nH/2 + nH);
				context.lineTo(-nW/2 + xW, -nH/2 + nH);
				context.lineTo(-nW/2 + xW, -nH/2 + (yH*2));
				context.lineTo(-nW/2, -nH/2 + (yH*2));
				context.lineTo(-nW/2, -nH/2 + yH);
				context.lineTo(-nW/2 + xW, -nH/2 + yH);
				context.lineTo(-nW/2 + xW, -nH/2);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Straight:
			case e_ItemStyle_CableLine:
			case e_ItemStyle_OjcP:
			case e_ItemStyle_OjcT:
			case e_ItemStyle_OjcL:
			case e_ItemStyle_OjcD:
			case e_ItemStyle_InnerWall:
			case e_ItemStyle_Wall:
				if (oItem.Angle == 0) {
					context.beginPath();
					context.save();
					context.globalAlpha = alpha;
					context.strokeStyle = borderColor;
					//console.log(oBorderWidth);
					context.lineWidth = oBorderWidth;
					context.lineCap = "butt";
					if (firstDataFlag && parseInt(strVersion) < changeDate) {	//외벽의 경우 정의가 되어 있지 않아 처음 호출시 재 정의 해야 함. (oItem.Points.indexOf(",0") != -1 || oItem.Points.indexOf(".") != -1)
						var strF = false;
						var strPoint = oItem.Points.split(",");
						if (strPoint.length > 0) {
							if (strPoint[0].indexOf(":") == -1) {
								strF = true;
							}
						}
						context.lineWidth = 4;
						oBorderWidth = 4;
						oItem.Angle = 0;
						if (strF) {
							var strString = "";
							var strPoints = oItem.Points.split(":");
							var closeX = "";
							var closeY = "";
							var minX = oItem.X;
							var maxX = oItem.X;
							var minY = oItem.Y;
							var maxY = oItem.Y;
							for (k = 0; k < strPoints.length; k++) {
								var strXY = strPoints[k].split(",");
								if (k == 0) {
									closeX = parseInt(nX) + parseInt(strXY[0]);
									closeY = parseInt(nY) + parseInt(strXY[1]);
									minX = parseInt(nX) + parseInt(strXY[0]);
									maxX = parseInt(nX) + parseInt(strXY[0]);
									minY = parseInt(nY) + parseInt(strXY[1]);
									maxY = parseInt(nY) + parseInt(strXY[1]);
								}
								var strX = parseInt(nX) + parseInt(strXY[0]);
								var strY = parseInt(nY) + parseInt(strXY[1]);
								minX = Math.min(minX, parseInt(nX) + parseInt(strXY[0]));
								maxX = Math.max(maxX, parseInt(nX) + parseInt(strXY[0]));
								minY = Math.min(minY, parseInt(nY) + parseInt(strXY[1]));
								maxY = Math.max(maxY, parseInt(nY) + parseInt(strXY[1]));

								strString +=  strX +":"+ strY + ",";
							}
							if (oItem.Style ==e_ItemStyle_Wall) {
								strString +=  closeX +":"+ closeY + ",";
							}
							oItem.Points = strString.slice(0,-1);
							oItem.X = minX;
							oItem.Y = minY;
							oItem.Width = maxX - minX;
							oItem.Height = maxY - minY;
						}
					}
					oItem.Angle = 0;
					var arrPoints = oItem.Points.split(",");
					for (i = 0; i < arrPoints.length; i++) {
						var staightPos = arrPoints[i].split(":");
						var staightPosX = nParX + parseInt(staightPos[0]);
						var staightPosY = nParY + parseInt(staightPos[1]);
						if (i == 0) {

							if (oItem.Style == e_ItemStyle_Wall || oItem.Style == e_ItemStyle_InnerWall) {
								context.lineWidth = oItem.BorderWidth;
								context.globalAlpha = alpha;
								context.fillStyle = borderColor;
								context.fillRect(staightPosX - (oItem.BorderWidth/2) - 3, staightPosY - (oItem.BorderWidth/2) - 3, oItem.BorderWidth + 6, oItem.BorderWidth + 6);
							}

							context.moveTo(staightPosX, staightPosY);
						} else {
							if (oItem.Style == e_ItemStyle_Wall || oItem.Style == e_ItemStyle_InnerWall) {
								context.lineWidth = oItem.BorderWidth;
								context.globalAlpha = alpha;
								context.fillStyle = borderColor;
								context.fillRect(staightPosX - (oItem.BorderWidth/2) - 3, staightPosY - (oItem.BorderWidth/2) - 3, oItem.BorderWidth + 6, oItem.BorderWidth + 6);
							}
							context.lineTo(staightPosX, staightPosY);
						}
					}
					context.stroke();
					context.restore();
					context.closePath();
				}
				break;
			case e_ItemStyle_OjcM:
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.strokeRect(parseInt(nX) + 0.5, parseInt(nY) + 0.5, nW, nH);
				context.closePath();
				break;
			case e_ItemStyle_OjcCurve:
				var xW = nW/3;
				var yH = nH/3;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oBorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;


				context.moveTo(-nW/2 + (xW * 2), -nH/2);
				context.quadraticCurveTo(-nW/2, -nH/2, -nW/2, -nH/2 + (yH*2));
				context.moveTo(-nW/2, -nH/2 + (yH*2));
				context.lineTo(-nW/2, nH/2);
				context.lineTo(-nW/2 + xW, -nH/2 + nH);
				context.lineTo(-nW/2 + xW, -nH/2 + (yH*2));
				context.quadraticCurveTo(-nW/2 + xW, -nH/2 + yH, -nW/2 + (xW*2), -nH/2 + yH);
				context.lineTo(nW/2, -nH/2 + yH);
				context.lineTo(nW/2, -nH/2);
				context.lineTo(-nW/2 + (xW * 2), -nH/2);
				context.stroke();

				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Curve:
				// curve
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2, -nH/2);
				context.quadraticCurveTo(-nW/2 + nW, -nH/2, -nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				break;
			case e_ItemStyle_Triangle:
				var vertex = oItem.Points;
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oBorderWidth;
				context.moveTo(-nW/2 + vertex, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.closePath();
				context.stroke();
				context.restore();

				break;
			case e_ItemStyle_DimensionLine:
				// 치수선 Top
				if (dimensionView) {
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = alpha;
					context.lineWidth = 1;
					context.strokeStyle = "red";
					context.strokeRect(-nW/2 - 5, -nH/2 + 20, nW + 10, 0);
					context.restore();
					context.closePath();

					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = alpha;
					context.lineWidth = 1;
					context.strokeStyle = "red";
					context.strokeRect(-nW/2, -nH/2 + 12, 0, nH - 12);
					context.restore();
					context.closePath();

					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = alpha;
					context.lineWidth = 1;
					context.strokeStyle = "red";
					context.strokeRect(-nW/2 + nW, -nH/2 + 12, 0, nH - 12);
					context.restore();
					context.closePath();

					var nDimW = Math.round(oItem.Width * baseScale);

//					var dimensionCenterX = (nW / 2);
//					var nDimCenterX = 3 * nDimW.toString().length;
					var DimensionLinColor = "red";
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = alpha;
					context.font = "8px 돋음";
					context.fillStyle = DimensionLinColor;
					context.textAlign = "center";
					context.fillText(nDimW.toString(), (-nW/2 + nW/2), -nH/2 + 10);
					//console.log(nDimW+"----------");
					context.restore();
					context.closePath();
				}
				break;
			case e_ItemStyle_Text:
				if (oItem.BorderWidth > 1) {
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.lineWidth = oItem.BorderWidth;
					context.globalAlpha = alpha;
					context.strokeStyle = borderColor;
					context.strokeRect(-nW/2, -nH/2, nW, nH);
					context.restore();
					context.closePath();
				}
				break;
			default:
				context.strokeStyle = "rgba(0,0,0,1)";
				context.lineWidth = oBorderWidth;
				context.strokeRect(parseInt(nX) + 0.5, parseInt(nY) + 0.5, nW, nH);
			break;
			}
		}






		context.closePath();

		var nDimW = Math.round(oItem.Width * baseScale);//oItem.DimensionWidth;		// TEXT 용
		var nDimL 	= Math.round(oItem.Height * baseScale);//oItem.DimensionLength;	// TEXT 용

		var dimensionCenterX = (nW / 2);
		var dimensionCenterY = (nH / 2);

		var nDimCenterX = 3 * oItem.DimensionWidth.toString().length;
		var nDimCenterY = 3 * oItem.DimensionLength.toString().length;

		var DimensionColor = 'red';
//		if (bPrintable) {
//			DimensionColor = '#000000';
//		}
		spaceFlag	  = false;
		dimensionView = true;
		alpha			= "1.0";
		if (!spaceFlag) {
			if (dimensionView && oItem.DimensionTop == "Y"){ //
				// 치수선 Top
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2 - 5, -nH/2 - 20, nW + 10, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2, -nH/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2 + nW, -nH/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();

				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.font = "8px 돋음";
				context.fillStyle = DimensionColor;
				context.textAlign = "center";
				context.fillText(nDimW, -nW/2 + nW/2, -nH/2 - 36);
				context.restore();
				context.closePath();

				//console.log(DimensionColor);

			}

			if (dimensionView && oItem.DimensionBottom == "Y"){
				// 치수선 Bottom
				var angle180 = (angle + 180);
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle180*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2 - 5, -nH/2 - 20, nW + 10, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle180*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2, -nH/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle180*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nW/2 + nW, -nH/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();

				context.translate(trans_cx, trans_cy);
				context.rotate(angle180*Math.PI/180);
				context.globalAlpha = "1";
				context.font = "8px 돋음";
				context.fillStyle = DimensionColor;
				context.textAlign = "center";
				context.fillText(nDimW, -nW/2 + nW/2, -nH/2 - 36);
				context.restore();
				context.closePath();

			}
			if (dimensionView && oItem.DimensionRight == "Y"){
				// 치수선 Right
				var angle90 = (angle + 90);
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle90*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2 - 5, -nW/2 - 20, nH + 10, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle90*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2, -nW/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle90*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2 + nH, -nW/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();

				context.translate(trans_cx, trans_cy);
				context.rotate(angle90*Math.PI/180);
				context.globalAlpha = "1";
				context.font = "8px 돋음";
				context.fillStyle = DimensionColor;
				context.textAlign = "center";
				context.fillText(nDimL, -nH/2  + nH/2, -nW/2 - 36);

				context.restore();
				context.closePath();

			}
			if (dimensionView && oItem.DimensionLeft == "Y"){
				// 치수선 Right
				var angle270 = (angle + 270);
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle270*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2 - 5, -nW/2 - 20, nH + 10, 0);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle270*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2, -nW/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle270*Math.PI/180);
				context.lineWidth = 1;
				context.globalAlpha = alpha;
				context.strokeStyle = "red";
				context.strokeRect(-nH/2 + nH, -nW/2 - 26, 0, 15);
				context.restore();
				context.closePath();

				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle270*Math.PI/180);
				context.globalAlpha = "1";
				context.globalAlpha = alpha;
				context.font = "8px 돋음";
				context.fillStyle = DimensionColor;
				context.textAlign = "center";
				context.fillText(nDimL, -nH/2  + nH/2, -nW/2 - 36);

				context.restore();
				context.closePath();

			}
		}

		// 하위 아이템 출력
		if (oItem.Childs && oItem.Childs.length > 0) {
			DrawItems(context, null, oItem.Childs, bSelectedPage, bEditable, bPrintable)
		}
		var astrText = oItem.Text;
		if (ownerView) {
			astrText =  "1";	// 자릿수만 체크함.(문자자체가 배열처리되어서 자릿수만 체크하고 밑에서 처리)
		}
		var cTextColor = oItem.TextColor;

		var rgbFont =  GetDBToRGB(cTextColor);
//		var cTextColor = "rgba("+rgbFont.red+", "+rgbFont.green+", "+rgbFont.blue+", 1)";
		var cTextColor = "rgba(0, 0, 0, 1)";

		if (oItem.LayerId == 'L003') {
			if (oItem.Style == e_ItemStyle_StdReck) {
				cTextColor = "#000";
			} else {
				cTextColor = "#000";
			}
		} else  {
			borderColor = "rgba(0, 0, 0, 1)";
		}

		// 텍스트 출력
		if (oItem.IsViewText && astrText && astrText.length > 0 && !oItem.IsEditing) {
			var nTxtX = nX;
			var nTxtY = nY;
			var nTxtW = nW;
			var nTxtH = nH;
			// TextBorder
			nTxtX += oItem.TextBorder;
			nTxtY += oItem.TextBorder;
			nTxtW -= (oItem.TextBorder * 2);
			nTxtH -= (oItem.TextBorder * 2)
			var strBase = "혫";
			var nTextX = nTxtX + 1;
			var nTextY = nTxtY + 1;
			var nTextHeight = context.measureText(strBase).width + context.measureText(strBase).width / 6;

			// Wrap 및 Format
			var asText2 = astrText;

			astrText = [];

			for (var i = 0; i < asText2.length; i++) {
				var sText = asText2[i];

				// Text Format 적용
				sText = GetTextFormat(sText, oItem.TextFormat);
				if (oItem.Edit || oItem.IsWrap) {
					var nOneW = context.measureText(sText).width;
					if (nOneW > nTxtW) {
						var asText3 = sText.split(" ");

						if (asText3.length > 1) {
							var sSpace = "";
							sText = "";

							for (var j = 0; j < asText3.length; j++) {
								var sText2 = sText.concat(sSpace, asText3[j]);
								sSpace = " ";

								nOneW = context.measureText(sText2).width;

								if (nOneW > nTxtW) {
									astrText.push(sText);
									sText = asText3[j];
								}
								else {
									sText = sText2;
								}
							}// for j

							if (sText != "") {
								astrText.push(sText);
							}
						}
						else {
							astrText.push(sText);
						}
					}
					else {
						astrText.push(sText);
					}
				}
				else {
					astrText.push(sText);
				}
			}// for i
			if (spaceFlag) {
				if (oItem.LayerId == "L003" && oItem.Style != e_ItemStyle_DimensionLine) {
				//if (oItem.Style == e_ItemStyle_StdReck) {
					astrText = [];
					astrText.push("0%");
				}
			}
			// 텍스트 크기 확인
			var nWidth = 0;
			var nHeight = 0;
			for (var i = 0; i < astrText.length; i++) {
				nHeight += nTextHeight + oItem.TextLineSpacing;
			}

			nTextY = nTxtY + ((nTxtH - nHeight) / 2) + 2;

			var textCenterX = -nW/2 + (nW / 2) - (nWidth / 2);
			var textCenterY = -nH/2  + (nH / 2) - (nHeight / 2);

			for (var i = 0; i < astrText.length; i++) {
				var strText = astrText[i];
				if (strText == "NONE") {
					strText = "";
					return;
				}
				nWidth = context.measureText(strText).width;
				nTextX = nTxtX + ((nTxtW - nWidth) / 2);
				if (i != 0) {
					textCenterY += nTextHeight + oItem.TextLineSpacing * (i + 1);
				}
				context.save();
				if (oItem != e_ItemStyle_Text) {
					context.rect(nX, nY, nW, nH);
				}
				//context.clip();
				if (labelView) {
					var tmpLeft = parseInt(strText.length);
					var textCenterTmpX = (nW / 2) ;
					//context.save();

					context.translate(trans_cx, trans_cy);
					if (!label90) {
						context.rotate(angle*Math.PI/180);
					} else {
						context.rotate(0);
					}

					context.globalAlpha = alpha;
					context.font = oItem.TextFont;
					context.fillStyle = cTextColor;
					context.textAlign = "center";
					context.textBaseline = "top";
					var textColor = oItem.TextColor;
					if (bPrintable) {
						textColor = '#000000';
					}

					if (spaceFlag) {
						if (oItem.LayerId == "L003"  && oItem.Style != e_ItemStyle_DimensionLine) {
						//if (oItem.Style == e_ItemStyle_StdReck) {
							var strText = "0%";
							if (oItem.RackCount > 0 && oItem.UnitSize > 0) {
								var unitP = (parseInt(oItem.RackCount)/parseInt(oItem.UnitSize)) * 100;
								strText = Math.ceil(unitP)+"%";
							}
							//textCenterY = -nTextHeight/2;
							context.fillStyle = textColor;
							context.fillText(strText, -nW/2 + nW/2, textCenterY);
							context.restore();
							context.closePath();
							break;
						}
						if (oItem.Style == e_ItemStyle_Cell) {

							context.fillStyle = textColor;
							context.fillText(strText, -nW/2 + nW/2, textCenterY);
						}
					}
					else
					{
						context.fillStyle = textColor;
						if (ownerView  && oItem.Style != e_ItemStyle_DimensionLine) {
							context.fillStyle = "16777215";
							context.font = "11px blod 돋움체";
							//16777215----
							context.fillText((oItem.SystemNm).toString(), -nW/2 + textCenterTmpX, textCenterY);
						} else {
							if (oItem.Style != e_ItemStyle_DimensionLine) {
								context.fillText(strText, -nW/2 + nW/2, textCenterY);
							}
						}

					}
				}
				context.restore();
				context.closePath();
			}// for i

		}
	}

	function PageLoad(strVal) {
		var oPage = null;
		var bErr = true;
		var astrVals1 = strVal.split("|^@4@^|");
		if (astrVals1.length > 0) {
			for (var i = 0; i < astrVals1.length; i++) {
				var astrVals2 = astrVals1[i].split("|^@3@^|");
				switch (astrVals2[0]) {
					case "PAGE_NAMEVALUE":
					{
						var asBools = [ "IsPrintable" ];
						var asNums = [ "Style" ];
						oPage = NewPage(BoardInfo.Pages.length, "");
						var astrVals3 = astrVals2[1].split("|^@2@^|");
						for (var j = 0; j < astrVals3.length; j++) {
							var astrVals4 = astrVals3[j].split("|^@1@^|");
							if (asBools.indexOf(astrVals4[0]) > -1) {
								oPage[astrVals4[0]] = (astrVals4[1] == "true");
							} else if (asNums.indexOf(astrVals4[0]) > -1) {
								oPage[astrVals4[0]] = parseInt(astrVals4[1]);
							} else {
								oPage[astrVals4[0]] = astrVals4[1];
							}
						}
						break;
					}
					case "PANEL_NAMEVALUE":
					{
						var asBools = [ "IsPrintable", "IsPrintExpand", "IsExpandable", "IsExpanded", "IsUserSizable" ];
						var asNums = [ "Width", "Height", "Key", "BackImageWidth", "UserMinHeight", "UserMaxHeight", "BackImageAngle" ];
						var oPanel = NewPanel(0, 0);
						var astrVals3 = astrVals2[1].split("|^@2@^|");
						for (var j = 0; j < astrVals3.length; j++) {
							var astrVals4 = astrVals3[j].split("|^@1@^|");
							if (asBools.indexOf(astrVals4[0]) > -1) {
								oPanel[astrVals4[0]] = (astrVals4[1] == "true");
							} else if (asNums.indexOf(astrVals4[0]) > -1) {
								oPanel[astrVals4[0]] = parseInt(astrVals4[1]);
							} else {
								oPanel[astrVals4[0]] = astrVals4[1];
							}
						}
						if (oPanel.BackImageString != "") {
							oPanel.BackImage = new Image();
							oPanel.BackImage.onload = function () {
								Draw();
							}
							oPanel.BackImage.src = oPanel.BackImageString;
						}
						oPage.Panels.push(oPanel);
						break;
					}
					case "ITEM_NAMEVALUE":
					{
						var asBools = [ "Edit", "IsSelectable", "IsPrintable", "Checked", "IsViewOutBound", "IsViewText",
							"IsBorderLeft", "IsBorderRight", "IsBorderTop", "IsBorderBottom", "IsUserSizable", "EditOnly", "IsVisible",
							"IsIncomplete", "IsWrap"];
						var asNums = [ "Style", "X", "Y", "Z", "Width", "Height", "Angle", "BorderWidth", "InLineStyle", "InLineWidth",
							"CheckBoxStyle", "CheckBoxAlign", "CheckBoxWidth", "CheckBoxHeight", "CheckBoxLineWidth",
							"CheckStyle", "CheckLineWidth", "UnCheckStyle", "UnCheckLineWidth",
							"TextAlign", "TextLineSpacing", "TextBorder", "TextMaxLine", "Key", "ParentItemKey",
							"TabFrom", "TabTo", "TabEnterFrom", "TabEnterTo" ];
						var asMultis = [ "Text", "CheckText", "UnCheckText" ];
						var oItem = NewItem(0, 0, 0, 0);
						var astrVals3 = astrVals2[1].split("|^@2@^|");
						for (var j = 0; j < astrVals3.length; j++) {
							var astrVals4 = astrVals3[j].split("|^@1@^|");
							if (asBools.indexOf(astrVals4[0]) > -1) {
								oItem[astrVals4[0]] = (astrVals4[1] == "true");
							} else if (asNums.indexOf(astrVals4[0]) > -1) {
								if (astrVals4[1] == "NaN") {
									astrVals4[1] = "0";
								}
								if (astrVals4[0] == "Width" || astrVals4[0] == "Height") {
									oItem[astrVals4[0]] = parseFloat(astrVals4[1]);
								} else {
									oItem[astrVals4[0]] = parseInt(astrVals4[1]);
								}

							} else if (asMultis.indexOf(astrVals4[0]) > -1) {
								var astrVals5 = astrVals4[1].split("|^@^|");
								for (var k = 0; k < astrVals5.length; k++) {
									oItem[astrVals4[0]].push(astrVals5[k]);
								}
							} else {
								oItem[astrVals4[0]] = astrVals4[1];
							}
						}
						if (oItem.BackImageString != "") {
							var oImage = new Image();
							oItem.BackImage = oImage;
							oItem.BackImage.onload = function () {
								Draw();
							}
							if (oItem.BackImageString  != "none") {
								oItem.BackImage.src = oItem.BackImageString;
							}
						}
						var oPanelPar = GetPanel(oPage, oItem.PanelKey);
						if (oPanelPar) {
							if (oItem.ParentItemKey == -1) {
								oPanelPar.Items.push(oItem);
							}
							else {
								var oItemPar = GetItem(oPanelPar, oItem.ParentItemKey);
								if (oItemPar) {
									oItemPar.Childs.push(oItem);
								}
								else {
									//SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "아이템을 적용할 아이템이 없습니다.\nITEM_KEY:" + oItem.ParentItemKey);
								}
							}
						}
						else {
							//SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "아이템을 적용할 패널이 없습니다.\nPANEL_KEY:" + oItem.PanelKey);
						}

						break;
					}
				}
			}
			bErr = false;
		}

		if (bErr) {
			//SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "불러올 페이지가 없습니다.");
		}

		return oPage;
	}

	function DesignNewPanel(strOpt) {
		var asOpts = GetCommandArgs(strOpt, "PAGE_KEY,PAGE_TITLE")

		BoardInfo.EditMode = e_EditMode_DesignPanel;

		ItemEditModeClear();
		ClearEditing();
		ClearPage();
		var oPage = NewPage(asOpts[0], asOpts[1]);
		var oPanel = NewPanel(5000, 5000);

		oPanel.PageKey = oPage.Key;
		oPanel.Key = oPage.getPanelMaxKey() + 1;

		oPage.Panels.push(oPanel);

		BoardInfo.Pages[0] = oPage;
		BoardInfo.Views[0] = 0;

		SetScroll();
		Draw();

//		document.getElementById('Canvas1').focus();
//		document.getElementById('Canvas1').click();
		return "";
	}

	function NewItem(nX, nY, nW, nH) {
		var oItem = function () {};
		if (BoardInfo.AddItemStyle == null) BoardInfo.AddItemStyle = e_ItemStyle_None;
		oItem.PageKey = "";
		oItem.PanelKey = -1;
		oItem.LayerId = "";
		if (addItemTypeName != "") {
			oItem.TypeName = addItemTypeName;
		}
		else {
			if (BoardInfo.AddItemStyle == e_ItemStyle_Curve) {
				oItem.TypeName = "곡선";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Square) {
				oItem.TypeName = "사각형";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Triangle) {
				oItem.TypeName = "삼각형";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Text) {
				oItem.TypeName = "텍스트";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_DimensionLine) {
				oItem.TypeName = "치수선";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Straight) {
				oItem.TypeName = "직선";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Cell) {
				oItem.TypeName = "cell";
			}
			else if (BoardInfo.AddItemStyle == e_ItemStyle_Circle) {
				oItem.TypeName = "원";
			}
			else {
				oItem.TypeName = "기타";
			}
		}
		oItem.ParentItemKey = -1;
		oItem.Key = -1;
		oItem.DataKey = "";
		oItem.Style = BoardInfo.AddItemStyle;
		oItem.ItemType = "";
		oItem.ItemId = "";
		oItem.Edit = true;
		oItem.EditOnly = false;
		oItem.IsWrap = false;
		oItem.IsSelectable = false;
		oItem.IsPrintable = true;

		oItem.X = nX;
		oItem.Y = nY;
		oItem.Z = 0;
		oItem.Width = nW;
		oItem.Height = nH;

		oItem.Angle = 0;
		oItem.BackColor = "16777215";
		oItem.BackImage = null;
		oItem.BackImageString = "";

		oItem.BorderColor = "16777215";
		oItem.BorderWidth = 1;
		oItem.IsBorderLeft = true;
		oItem.IsBorderRight = true;
		oItem.IsBorderTop = true;
		oItem.IsBorderBottom = true;
		oItem.BorderDash = "";

		oItem.InLineStyle = e_ItemInLineStyle_None;
		oItem.InLineColor = "16777215";
		oItem.InLineDash = "";
		oItem.InLineWidth = 1;
		oItem.InLineCap = "butt";

		oItem.TextFont = "11px 돋움체";
		oItem.TextColor = "16777215";
		oItem.TextAlign = 4;

		oItem.TextBorder = 0;
		oItem.TextLineSpacing = 0;
		oItem.TextMaxLine = 0;
		oItem.TextFormat = "-1";
		oItem.Text = [];
		oItem.SystemNm = [];

		oItem.IsViewOutBound = false;
		oItem.IsViewText = true;
		oItem.IsVisible = true;

		oItem.IsUserSizable = false;
		oItem.Childs = [];

		oItem.IsEditing = false;
		oItem.DrawX = 0;
		oItem.DrawY = 0;
		oItem.DrawW = 0;
		oItem.DrawH = 0;


		oItem.DimensionTop = 'N';
		oItem.DimensionLeft = 'N';
		oItem.DimensionRight = 'N';
		oItem.DimensionBottom = 'N';

		oItem.DimensionWidth = 1;
		oItem.DimensionLength = 1;

		oItem.Alpha = 1.0;
		oItem.Points = "";
		oItem.RackCount = 0;
		oItem.UnitSize = 0;
		oItem.MoveYn = "N";
		oItem.MobileFlag = 'N';
		return oItem;
	}

	 function ConvertItemStyle(strStyle) {

			switch(strStyle) {
			case 'ac_panel':
				strStyle = e_ItemStyle_AcPanel ;
				break;
			case 'std_rack':
			case 'std_integral_rack':
			case "std_double_rack":
			case "std_half_rack":
				strStyle = e_ItemStyle_StdReck ;
				break;
			case "exc_rack":
				strStyle = e_ItemStyle_ExcReck ;
				break;
			case "pwr_patch":
				strStyle = e_ItemStyle_PwrPatch;
				break;
			case "utp_patch":
				strStyle = e_ItemStyle_UtpPatch;
				break;
			case "panel_patch":
				strStyle = e_ItemStyle_PanelPatch;
				break;
			case "ele_pole_tr":
				strStyle = e_ItemStyle_ElePoleTr;
				break;
			case "ele_tr":
				strStyle = e_ItemStyle_EleTr;
				break;
			case "ele_in_tr":
				strStyle = e_ItemStyle_EleInTr;
				break;
			case "ele_out_tr":
				strStyle = e_ItemStyle_EleOutTr;
				break;
			case "ele_link":
				strStyle = e_ItemStyle_EleLink;
				break;
			case 'ipd':
			case 'etc_box':
			case 'cable_steel':
			case "etc_box_rack":
				strStyle = e_ItemStyle_EtcBox ;
				break;
			case 'circle':
				strStyle = e_ItemStyle_Circle ;
				break;
			case 'text':
				strStyle = e_ItemStyle_Text;
				break;
			case 'square':
				strStyle = e_ItemStyle_Square ;
				break;
			case 'straightline':
				strStyle = e_ItemStyle_Straight ;
				break;
			case 'triangle':
				strStyle = e_ItemStyle_Triangle;
				break;
			case 'rectifier':
			case 'rectifier_1':
			case 'rectifier_2':
			case 'rectifier_3':
			case 'rectifier_4':
			case 'rectifier_5':
			case 'rectifier_6':
			case 'rectifier_7':
			case 'rectifier_8':
			case 'rectifier_9':
			case 'rectifier_10':
			case 'rectifier_11':
			case 'rectifier_12':
			case 'rectifier_13':
			case 'rectifier_14':
				strStyle = e_ItemStyle_RectFier ;
				break;
			case 'cell':
				strStyle = e_ItemStyle_Cell;
				break;
			case 'double_doors':
				strStyle = e_ItemStyle_DoubleDoors;
				break;
			case 'door_left':
				strStyle = e_ItemStyle_LeftDoors;
				break;
			case 'door_right':
				strStyle = e_ItemStyle_RightDoors;
				break;
			case 'con_pillar':
				strStyle = e_ItemStyle_ConPillar;
				break;
			case 'haron_1ea':
			case 'haron_1':
			case 'haron_2':
				strStyle = e_ItemStyle_Haro1Ea;
				break;
			case 'haron_2ea':
				strStyle = e_ItemStyle_Haro2Ea;
				break;
			case 'aircon':
			case 'aircon_1':
			case 'aircon_2':
			case 'aircon_3':
			case 'aircon_4':
			case 'aircon_5':
			case 'aircon_6':
			case 'aircon_7':
			case 'aircon_8':
			case 'aircon_9':
			case 'aircon_10':
			case 'aircon_11':
			case 'aircon_12':
				strStyle = e_ItemStyle_Aircon;
				break;
			case 'battery285w':
			case 'battery382w':
			case 'battery471w':
			case 'battery_1':
			case 'battery_2':
			case 'battery_3':
			case 'battery_4':
			case 'battery_7':
			case 'battery_8':
			case 'battery_11':
			case 'battery_12':
				strStyle = e_ItemStyle_Battery471W;
				break;
			case 'battery_5':
			case 'battery_6':
			case 'battery_9':
			case 'battery_10':
			case 'battery_13':
			case 'battery_14':
				strStyle = e_ItemStyle_Battery_2;
				break;
			case 'battery_15':
			case 'battery_16':
			case 'battery_17':
			case 'battery_18':
				strStyle = e_ItemStyle_BatteryLithium;
				break;
			case 'ojc_plus':
				strStyle = e_ItemStyle_Plus;
				break;
			case 'curveline':
				strStyle = e_ItemStyle_Curve;
				break;
			case 'dimensionline':
				strStyle = e_ItemStyle_DimensionLine;
				break;
			case 'cableline':
				strStyle = e_ItemStyle_CableLine;
				break;
			case 'ojc_curve150':
			case 'ojc_curve200':
			case 'ojc_curve500':
				strStyle = e_ItemStyle_OjcCurve;
				break;
			case 'cableduct_p':
				strStyle = e_ItemStyle_OjcP;
				break;
			case 'cableduct_m':
				strStyle = e_ItemStyle_OjcM;
				break;
			case 'cableduct_t':
				strStyle = e_ItemStyle_OjcT;
				break;
			case 'cableduct_l':
				strStyle = e_ItemStyle_OjcL;
				break;
			case 'cableduct_d':
				strStyle = e_ItemStyle_OjcD;
				break;
			case 'beam':
				strStyle = e_ItemStyle_Beam;
				break;
			case 'beam_pillar':
				strStyle = e_ItemStyle_beamPillar;
				break;
			case 'con_column':
				strStyle = e_ItemStyle_ConColumn;
				break;
			case 'slide_door':
				strStyle = e_ItemStyle_SlideDoor;
				break;
			case 'door':
				strStyle = e_ItemStyle_Door;
				break;
			case 'stairs':
				strStyle = e_ItemStyle_Stairs;
				break;
			case 'double_stairs':
				strStyle = e_ItemStyle_DoubleStairs;
				break;
			case 'fluorescent_light':
				strStyle = e_ItemStyle_FluorescentLight;
				break;
			case 'cctv':
				strStyle = e_ItemStyle_Cctv;
				break;
			case 'monitor':
				strStyle = e_ItemStyle_Monitor;
				break;
			case 'innerwall':
				strStyle = e_ItemStyle_InnerWall;
				break;
			case 'wall':
				strStyle = e_ItemStyle_Wall;
				break;
			case 'generator':
			case 'generator_1':
			case 'generator_2':
			case 'generator_3':
			case 'generator_4':
				strStyle = e_ItemStyle_Generator;
				break;
			case 'bracket_plus':
			case 'bracket_t':

			case 'cable_verti_curve':
			case 'cable_transform':
			case 'cable_hori_curve300':
			case 'dimension':
			case 'ellipse':
			case 'etc_line':
			case 'image':
			case 'ojc_box':
			case 'ojc_t':
			case 'polygon':
			case 'polygonalline':
			case 'polygonalline02':
			case 'std_double_rack':
			case 'std_half_rack':

				strStyle = e_ItemStyle_Square ;
				break;
			default:
				strStyle = e_ItemStyle_None;
			break;
			}
			return strStyle;
	 }

	 function GetDBToRGB(strRGBInt) {
			var red = strRGBInt >> 16;
			var green = strRGBInt - (red << 16) >> 8
			var blue = strRGBInt - (red << 16) - (green << 8);
			return {red:red, green:green, blue:blue};
	 }

	 function GetTextFormat(sText, sFormat) {
			if (sText && sText != "" && sFormat && sFormat != "" && sFormat && sFormat != "-1" && sFormat.indexOf(".") > -1) {
				var asFormat = sFormat.toUpperCase().split(".");
				if (asFormat.length == 2) {}
			}
			return sText;
		}

	function GetCommandArgs(args, argKeys) {
		var arrKeys = argKeys.toUpperCase().split(',');
		var arrValues = new Array();

		if (args && args.length > 0) {
			var arrVals = args.split('|^@@^|');
			for (var i = 0; i < arrVals.length; i++) {
				var arrVals3 = arrVals[i].split('|^@^|');
				arrValues[arrVals3[0].toUpperCase()] = arrVals3[1];
			}
			for (var i = 0; i < arrKeys.length; i++) {
				arrKeys[i] = arrValues[arrKeys[i]];
				if (!arrKeys[i])
					arrKeys[i] = "";
			}
		} else {
			for (var i = 0; i < arrKeys.length; i++) {
				arrKeys[i] = "";
			}
		}

		return arrKeys;
	}

	function GetPage(strPageKey) {
		var retPage = null;
		if (strPageKey != "" || strPageKey != undefined || strPageKey != null) {
			for (var i = BoardInfo.Pages.length - 1; i >= 0; i--) {
				var oPage = BoardInfo.Pages[i];
				if (oPage.Key == strPageKey) {
					retPage = oPage;
					break;
				}
			}
		}
		return retPage;
	}

	function GetPanel(oPage, nPanelKey) {
		var retPanel = null;
		if (oPage && nPanelKey > -1) {
			for (var i = oPage.Panels.length - 1; i >= 0; i--) {
				var oPanel = oPage.Panels[i];
				if (oPanel.Key == nPanelKey) {
					retPanel = oPanel;
					break;
				}
			}
		}
		return retPanel;
	}

	function GetItem(oPanel, strItemKey) {
		var retItem = null;
		if (oPanel && oPanel.Items && oPanel.Items.length > 0) {
			for (var i = 0; i < oPanel.Items.length; i++) {
				var oItem = oPanel.Items[i];
				if (oItem.Key == strItemKey) {
					retItem = oItem;
					break;
				}
			}
		}
		return retItem;
	}

	function NewPage(pageKey, pageTitle) {
		var oPage = function () {};
		oPage.Key = pageKey;
		oPage.Title = pageTitle;
		oPage.Style = e_PageStyle_Page;
		oPage.Date = "";
		oPage.Time = "";
		oPage.SheetKey = "";

		oPage.HeadPrint = "A";
		oPage.FootPrint = "A";
		oPage.IsPrintable = true;
		oPage.Panels = [];
		oPage.Value = "";

		oPage.Edit = function() {};
		oPage.Edit.KindKey = "";
		oPage.Edit.IsLocked = false;
		oPage.Edit.LockedName = "";
		oPage.Edit.IsSign = false;
		oPage.Edit.IsModified = false;
		oPage.Edit.IsDeleted = false;
		oPage.Edit.RegName = "";
		oPage.Edit.InOut = "";
		oPage.Edit.Dept = "";
		oPage.Edit.IsView = false;
		oPage.Edit.IsPrinted = false;
		oPage.Edit.PrintedName = "";

		oPage.Edit.setModify = function(bModify) {
			if (bModify && !oPage.Edit.IsLocked) {
				if (!oPage.Edit.IsModified) {
					var sRetOpt = "";
					sRetOpt += GetCommandOption(false, "PAGE_KEY", oPage.Key);
					sRetOpt += GetCommandOption(true, "PAGE_MODIFIED", "1");

					SetProcData("EDIT_PAGE_MODIFIED", sRetOpt, "");
				}

				oPage.Edit.IsModified = true;
			}
			else {
				if (oPage.Edit.IsModified) {
					var sRetOpt = "";
					sRetOpt += GetCommandOption(false, "PAGE_KEY", oPage.Key);
					sRetOpt += GetCommandOption(true, "PAGE_MODIFIED", "0" );

					SetProcData("EDIT_PAGE_MODIFIED", sRetOpt, "");
				}

				oPage.Edit.IsModified = false;
			}
		};

		oPage.Edit.getSavable = function () {
			if (oPage.Edit.IsModified) {
				return true;
			}
			return false;
		};

		oPage.Edit.getEditable = function() {
			if (!oPage.Edit.IsLocked && !oPage.Edit.IsDeleted) {
				return true;
			}
			return false;
		}

		oPage.DrawX = 0;
		oPage.DrawY = 0;
		oPage.DrawW = 0;
		oPage.DrawH = 0;

		oPage.getHeight = function() {
			var nHeight = 0;
			if (oPage.Panels) {
				for (var i = 0; i < oPage.Panels.length; i++) {
					var oPanel = oPage.Panels[i];

					if (oPanel.IsExpanded) {
						nHeight += oPanel.Height;
					}
					else {
						nHeight += BoardInfo.PanelReduceHeight;
					}
				}
			}
			return nHeight;
		};

		oPage.getWidth = function() {
			var nWidth = 0;
			if (oPage.Panels) {
				for (var i = 0; i < oPage.Panels.length; i++) {
					if (nWidth < oPage.Panels[i].Width) {
						nWidth = oPage.Panels[i].Width;
					}
				}
			}
			return nWidth;
		}

		oPage.getPanelMaxKey = function() {
			var nMax = 0;
			if (oPage.Panels) {
				for (var i = 0; i < oPage.Panels.length; i++) {
					if (nMax < oPage.Panels[i].Key) {
						nMax = oPage.Panels[i].Key;
					}
				}
			}
			return nMax;
		}
		return oPage;
	}

	function NewPanel(nWidth, nHeight) {
		var oPanel = function () {};
		oPanel.PageKey = "";
		oPanel.Key = 0;
		oPanel.BackColor = "rgba(255,255,255,1)";
		oPanel.Width = nWidth
		oPanel.Height = nHeight;

		oPanel.BackImage = null;
		oPanel.BackImageString = "";
		oPanel.BackImageWidth = nWidth;
		oPanel.BackImageAngle = 0;

		oPanel.ExPageKey = "";
		oPanel.IsPrintable = true;
		oPanel.IsPrintExpand = false;
		oPanel.ExpandTitle = "";
		oPanel.IsExpandable = false;
		oPanel.IsExpanded = true;
		oPanel.Value = "";

		oPanel.Items = [];
		oPanel.Pens = [];

		oPanel.Datas = [];
		oPanel.RunPageAdd = "";
		oPanel.RunPageLoad = "";
		oPanel.RunPageSave = "";

		oPanel.LoadData = function() {};
		oPanel.LoadData.Datas = [];

		oPanel.LoadData.setData = function(nNo, sName, sValue) {
			var oData = function() {};
			oData.No = nNo;
			oData.Name = sName;
			oData.Value = sValue;
			if (oPanel.LoadData.getExist(nNo)) {
				oPanel.LoadData.setRemove(nNo);
			}
			oPanel.LoadData.Datas.push(oData);
		};

		oPanel.LoadData.getData = function(nNo) {
			var oData = null;
			if (oPanel.LoadData.Datas.length > 0) {
				for (var i = oPanel.LoadData.Datas.length - 1; i >= 0; i--) {
					var oData = oPanel.LoadData.Datas[i];
					if (oData) {
						if (oData.No == nNo) {
							bRet = oData;
							break;
						}
					}
					else {
						oPanel.LoadData.Datas.splice(i, 1);
					}
				}
			}
			return bRet;
		};

		oPanel.LoadData.setRemove = function(nNo) {
			var bRet = false;
			if (oPanel.LoadData.Datas.length > 0) {
				for (var i = oPanel.LoadData.Datas.length - 1; i >= 0; i--) {
					var oData = oPanel.LoadData.Datas[i];
					if (oData) {
						if (oData.No == nNo) {
							bRet = true;
							oPanel.LoadData.Datas.splice(i, 1);
							break;
						}
					}
					else {
						oPanel.LoadData.Datas.splice(i, 1);
					}
				}
			}
			return bRet;
		};

		oPanel.LoadData.getExist = function(nNo) {
			var bRet = false;
			if (oPanel.LoadData.Datas.length > 0) {
				for (var i = oPanel.LoadData.Datas.length - 1; i >= 0; i--) {
					var oData = oPanel.LoadData.Datas[i];

					if (oData) {
						if (oData.No == nNo) {
							bRet = true;
							break;
						}
					}
					else {
						oPanel.LoadData.Datas.splice(i, 1);
					}
				}
			}
			return bRet;
		};
		oPanel.IsUserSizable = false;
		oPanel.UserMinHeight = nHeight;
		oPanel.UserMaxHeight = 1000;
		oPanel.DrawX = 0;
		oPanel.DrawY = 0;
		oPanel.DrawW = 0;
		oPanel.DrawH = 0;
		oPanel.IsExistSelectableItem = false;
		return oPanel;
	}

	function ItemEditModeClear() {
		BoardInfo.AddItemStyle = e_ItemStyle_None;
		BoardInfo.AddItemValue = "";
		BoardInfo.ItemEditMode = e_ItemEditMode_None;
	}

	function ClearPage() {
		BoardInfo.Scroll.Clear();
		BoardInfo.Selected.Clear();
		BoardInfo.PropertiesWindow.Clear();
		BoardInfo.RequestLoadPages.Clear();
		BoardInfo.Pages = null;
		BoardInfo.Pages = [];
		BoardInfo.Views = [];
	}

	function ClearEditing()
	{
		if (BoardInfo.Editing.getIsEdit()) {
			var oPage = GetPage(BoardInfo.Editing.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Editing.PanelKey);
			if (oPage && oPanel) {
				var oItem = GetItem(oPanel, BoardInfo.Editing.ItemKey)
				if (oItem) {}
			}
			BoardInfo.Editing.Clear();
		}

	}


	function SelectItem(bSelect, nX, nY, nW, nH, bMultiSelect) {
		var retSelected = false;

		var nR = nX + nW;
		var nB = nY + nH;
		var oPage = GetPage(1);
		var oPanelInfo = GetPanel(oPage, 1);
		var anItems = [];

		if (oPage && oPanelInfo) {
			if (oPanelInfo.Items || oPanelInfo.Items.length > 0) {

				for (var i = oPanelInfo.Items.length - 1; i >= 0; i--) {

					var oItem = oPanelInfo.Items[i];

					var nItemX = oItem.DrawX;
					var nItemY = oItem.DrawY;
					var nItemW = oItem.DrawW;
					var nItemH = oItem.DrawH;
					var nItemA = oItem.Angle;
					if ((nItemA > 74 && nItemA < 106) ||(nItemA > 254 && nItemA < 286)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
						var trans_cx =  (parseInt(nItemX) + 0.5) + nItemW / 2;
						var trans_cy =  (parseInt(nItemY) + 0.5) + nItemH / 2;

						var bSel = IsIntersectWithRect(nX, nY, nW, nH, trans_cx - nItemH / 2, trans_cy - nItemW / 2, nItemH, nItemW);
					}
					else  if (nItemA == 45 || nItemA == 135 || nItemA == 225 || nItemA == 315) {
						var trans_cx =  (parseInt(nItemX) + 0.5) + nItemW / 2;
						var trans_cy =  (parseInt(nItemY) + 0.5) + nItemH / 2;
						var bSel = IsIntersectWithRect(nX, nY, nW, nH, trans_cx - 20, trans_cy - 20, 40, 40);
					}
					else {
						var bSel = IsIntersectWithRect(nX, nY, nW, nH, nItemX, nItemY, nItemW, nItemH);
					}

					if (bSel && oItem.LayerId == "L003") { //(oItem.LayerId == layerArr[0]) <--- 변경--->oItem.Alpha == "1.0"
						if (oItem.Key != 0) {
							anItems.push(oItem.Key);
						}
						if (!bMultiSelect) {
							break;
						}
					}
				}
				if (anItems.length > 0) {
					if (bSelect) {
						// 선택처리
						BoardInfo.Selected.PageKey = oPage.Key;
						BoardInfo.Selected.PanelKey = oPanelInfo.Key;

						for (var i = 0; i < anItems.length; i++) {
							BoardInfo.Selected.ItemKeys.push(anItems[i]);
						}
						retSelected = true;
					}
					else {
						// 중복아이템 선택취소
						for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
							anItems.push(BoardInfo.Selected.ItemKeys[i]);
						}
						BoardInfo.Selected.ItemKeys = [];
						anItems.sort();
						for (var i = 0; i < anItems.length; i++) {
							if (BoardInfo.Selected.ItemKeys.indexOf(anItems[i]) == -1) {
								BoardInfo.Selected.ItemKeys.push(anItems[i]);
							}
							else {
								BoardInfo.Selected.ItemKeys.pop();
							}
						}
						retSelected = true;
					}
				}
			}
		}

		return retSelected;
	}

	function IsIntersectWithRect(x1, y1, w1, h1, nTarX, nTarY, nTarW, nTarH) {
		return ((( (nTarX < (x1 + w1)) && (x1 < (nTarX + nTarW))) && (nTarY < (y1 + h1))) && (y1 < (nTarY + nTarH)));
	}

	function SetScroll()
	{
		var nTHeight = BoardInfo.getViewsHeight();
		var nTWidth = BoardInfo.getViewsWidth();
		var bHorizontal = false;
		var bVertical = false;
		var nCanvasHeight = BoardInfo.CanvasHeight;
		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nPropertiesWidth = 0;
		if (BoardInfo.EditMode == e_EditMode_DesignPage || BoardInfo.EditMode == e_EditMode_DesignPanel) {
			if (BoardInfo.PropertiesWindow.IsView) {
				nPropertiesWidth = BoardInfo.PropertiesWindow.getWidth();
			}
		}
		if (nPropertiesWidth > 0) {
			BoardInfo.PropertiesWindow.X = nCanvasWidth - nPropertiesWidth;
			BoardInfo.PropertiesWindow.Y = 0;
			BoardInfo.PropertiesWindow.Width = nPropertiesWidth;
			BoardInfo.PropertiesWindow.Height = nCanvasHeight;
		} else {
			BoardInfo.PropertiesWindow.X = 0;
			BoardInfo.PropertiesWindow.Y = 0;
			BoardInfo.PropertiesWindow.Width = 0;
			BoardInfo.PropertiesWindow.Height = 0;
		}

		var nPageScrollWidth = nCanvasWidth - BoardInfo.PropertiesWindow.Width;
		var nPageScrollHeight = nCanvasHeight;

		if (nTHeight > nPageScrollHeight) {
			bVertical = true;
		}

		if (nTWidth > nPageScrollWidth) {
			bHorizontal = true;
		}

		if (bVertical) {
			if (bHorizontal) {
				BoardInfo.Scroll.VScroll.Maximum = nTHeight - nPageScrollHeight + BoardInfo.Scroll.Height;
				BoardInfo.Scroll.VScroll.X = nPageScrollWidth - BoardInfo.Scroll.Width;
				BoardInfo.Scroll.VScroll.Y = 0;
				BoardInfo.Scroll.VScroll.Height = nPageScrollHeight - BoardInfo.Scroll.Height;
				BoardInfo.Scroll.VScroll.Width = BoardInfo.Scroll.Width;
			} else {
				BoardInfo.Scroll.VScroll.Maximum = nTHeight - nPageScrollHeight;
				BoardInfo.Scroll.VScroll.X = nPageScrollWidth - BoardInfo.Scroll.Width;
				BoardInfo.Scroll.VScroll.Y = 0;
				BoardInfo.Scroll.VScroll.Height = nPageScrollHeight;
				BoardInfo.Scroll.VScroll.Width = BoardInfo.Scroll.Width;
			}
			if (BoardInfo.Scroll.VScroll.Maximum < BoardInfo.Scroll.VScroll.Value) {
				BoardInfo.Scroll.VScroll.Value = BoardInfo.Scroll.VScroll.Maximum;
			}

			var nBarX = BoardInfo.Scroll.VScroll.X;
			var nBarY = 0;
			var nBarW = BoardInfo.Scroll.VScroll.Width;
			var nBarH = Math.floor(BoardInfo.Scroll.VScroll.Height / ((BoardInfo.Scroll.VScroll.Height + BoardInfo.Scroll.VScroll.Maximum) / BoardInfo.Scroll.VScroll.Height));

			if (nBarH < BoardInfo.Scroll.Width) {
				nBarH = BoardInfo.Scroll.Width;
			}

			BoardInfo.Scroll.VScroll.BarX = nBarX;
			BoardInfo.Scroll.VScroll.BarY = nBarY;
			BoardInfo.Scroll.VScroll.BarW = nBarW;
			BoardInfo.Scroll.VScroll.BarH = nBarH;
		} else {
			BoardInfo.Scroll.VScroll.Clear();
		}

		// 수평스크롤
		if (bHorizontal) {
			if (bVertical) {
				BoardInfo.Scroll.HScroll.Maximum = nTWidth - nPageScrollWidth + BoardInfo.Scroll.Width;
				BoardInfo.Scroll.HScroll.X = 0;
				BoardInfo.Scroll.HScroll.Y = nPageScrollHeight - BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Height = BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Width = nPageScrollWidth - BoardInfo.Scroll.Width;
			} else {
				BoardInfo.Scroll.HScroll.Maximum = nTWidth - nPageScrollWidth;
				BoardInfo.Scroll.HScroll.X = 0;
				BoardInfo.Scroll.HScroll.Y = nPageScrollHeight - BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Height = BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Width =  nPageScrollWidth;
			}

			if (BoardInfo.Scroll.HScroll.Maximum < BoardInfo.Scroll.HScroll.Value) {
				BoardInfo.Scroll.HScroll.Value = BoardInfo.Scroll.HScroll.Maximum;
			}

			var nBarX = 0;
			var nBarY = BoardInfo.Scroll.HScroll.Y;
			var nBarW = Math.floor(BoardInfo.Scroll.HScroll.Width / ((BoardInfo.Scroll.HScroll.Width + BoardInfo.Scroll.HScroll.Maximum) / BoardInfo.Scroll.HScroll.Width));
			var nBarH = BoardInfo.Scroll.HScroll.Height;

			if (nBarW < BoardInfo.Scroll.Height) {
				nBarW = BoardInfo.Scroll.Height;
			}

			BoardInfo.Scroll.HScroll.BarX = nBarX;
			BoardInfo.Scroll.HScroll.BarY = nBarY;
			BoardInfo.Scroll.HScroll.BarW = nBarW;
			BoardInfo.Scroll.HScroll.BarH = nBarH;
		} else {
			BoardInfo.Scroll.HScroll.Clear();
		}
		BoardInfo.PagesBounds.X = 0;
		BoardInfo.PagesBounds.Y = 0;
		BoardInfo.PagesBounds.Width = BoardInfo.Scroll.VScroll.X;
		BoardInfo.PagesBounds.Height = BoardInfo.Scroll.HScroll.Y;
	}

	function SetScrollValueAdd(nH, nV) {
		nH += BoardInfo.Scroll.HScroll.Value;
		nV += BoardInfo.Scroll.VScroll.Value;

		SetScrollValue(nH, nV);
	}

	function SetScrollValue(nH, nV) {
		ClearEditing();
		if (nH < 0) {
			scrollLeftX = nH;
		} else {
			scrollLeftX = 0;
		}

		if (nH > BoardInfo.Scroll.HScroll.Maximum) {
			nH = BoardInfo.Scroll.HScroll.Maximum;
		}

		if (nV < 0) {
			scrollLeftY = nV;
		} else {
			scrollLeftY = 0;
		}

		if (nV > BoardInfo.Scroll.VScroll.Maximum) {
			nV = BoardInfo.Scroll.VScroll.Maximum;
		}

		BoardInfo.Scroll.HScroll.Value = nH;
		BoardInfo.Scroll.VScroll.Value = nV;

		Draw();
	}

	function SetPageKey(oPage, sPageKey) {
		if (oPage) {
			oPage.Key = sPageKey;

			for (var i = 0; i < oPage.Panels.length; i++) {
				var oPanel = oPage.Panels[i];

				if (oPanel) {
					SetPageKeyAndPanelKey(oPanel, null, sPageKey, oPanel.Key);
				}
			}
		}
	}

	function SetPageKeyAndPanelKey(oPanel, oItem, sPageKey, nPanelKey) {
		if (oItem == null) {
			oPanel.PageKey = sPageKey;
			oPanel.Key = nPanelKey;

			for (var i = 0; i < oPanel.Items.length; i++) {
				SetPageKeyAndPanelKey(null, oPanel.Items[i], sPageKey, nPanelKey);
			}
		} else {
			oItem.PageKey = sPageKey;
			oItem.PanelKey = nPanelKey;

			for (var i = 0; i < oItem.Childs.length; i++) {
				SetPageKeyAndPanelKey(null, oItem.Childs[i], sPageKey, nPanelKey);
			}
		}
	}
	function MouseDownClear() {

		BoardInfo.IsMouseDown = false;
		BoardInfo.MouseDownButton = "";
		BoardInfo.MouseDownX = 0;
		BoardInfo.MouseDownY = 0;
		BoardInfo.IsSelectedMove = false;
		BoardInfo.SelectedResizeNo = 0;
		BoardInfo.ScrollDown = "";

		BoardInfo.PenPositions = [];
		BoardInfo.PenReady = false;
		BoardInfo.PenPageKey = "";
		BoardInfo.PenPanelKey = -1;
	}
	/*****************************************************
	 * DrawTool 관련 End
	 * ***************************************************/
});

