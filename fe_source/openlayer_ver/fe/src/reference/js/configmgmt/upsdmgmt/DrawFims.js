/**
 * Draw.js
 *
 * @author Administrator
 * @date 2019. 6. 25. 오전 17:30:03
 * @version 1.0
 */

var comDraw = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var paramData = null;
	/*
     * 메인에서 한번 호출되서 초기화 되는 부분
     */
    var floorStandardSize 	= [];
    var eqpMgmtList			= [];
    var drawRackInfo		= [];
    var rackInArr			= [];
    var rackInTmpArr 		= [];
    var rackInItemArr		= [];
    var rackEqpId			= "";
    var gIntgFcltsCd		= "";
    var gChgDtm				= "";
    var urlCk				= "";
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

    this.init = function(id, param) {

        paramData = param;
        setEventListener();
        gIntgFcltsCd 	= param.intgFcltsCd;
        urlCk			= param.urlCk;
        var param = {intgFcltsCd :  gIntgFcltsCd};
        httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');

    };

    function setEventListener() {

    	var canvas = document.getElementById("Canvas1");
    	m_strStarted = "STARTED";
    	SetCommand('DESIGN_PANEL_NEW', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', '');
    	CanvasResize("WIDTH|^@^|1920|^@@^|HEIGHT|^@^|970");


    	if (canvas.addEventListener) {
//			canvas.addEventListener ("mousewheel", OnEvtMouseWheel, false);
//			canvas.addEventListener ("keydown", OnEvtKeyDown, false);
//			canvas.addEventListener ("keyup", OnEvtKeyUp, false);
//			canvas.addEventListener ("DOMMouseScroll", OnEvtMouseWheel, false);
		}
		else {
			if (canvas.attachEvent) {
//				canvas.attachEvent ("onmousewheel", OnEvtMouseWheel);
			}
		}
    	canvas.onkeydown = OnEvtKeyDown;
    	canvas.onmousemove = OnEvtMouseMove;
		canvas.onmousedown = OnEvtMouseDown;
		canvas.onmouseup = OnEvtMouseUp;
//		canvas.onmouseout = OnEvtMouseOut;
//		canvas.ondblclick = OnEvtDblClick;
		//document.onscroll = OnEvtScroll;


		function OnEvtMouseOut(event) {
			if (BoardInfo.ScrollDown == "") {
				MouseDownClear();
				document.getElementById("Canvas1").style.cursor = "default";
				Draw();
			}
		}

		function OnEvtKeyDown(event) {
			BoardInfo.Key.IsShiftKey = event.shiftKey;
		}

		function OnEvtMouseDown(event) {
    		var rect = canvas.getBoundingClientRect();
    		var nX = parseInt((event.clientX - rect.left)/scaleFactor);
    		var nY = parseInt((event.clientY - rect.top)/scaleFactor);

    		if (event.button == 0) {
    			BoardInfo.IsMouseDown = true;
    			BoardInfo.MouseDownButton = "LEFT";

    			BoardInfo.MouseDownX = nX;
    			BoardInfo.MouseDownY = nY;
    			BoardInfo.ScrollDown = "";
    		}
    		else if (event.button == 1) {
    			MouseDownClear();
    			BoardInfo.Selected.Clear();
    			//document.getElementById("Canvas1").style.cursor = "move";
    			BoardInfo.IsMouseDown = true;
    			BoardInfo.MouseDownButton = "MIDDLE";
    			BoardInfo.MouseDownX = nX;
    			BoardInfo.MouseDownY = nY;
    			BoardInfo.ScrollDown = "";
    		}
    		else if (event.button == 2) {
    			BoardInfo.IsMouseDown = true;
    			BoardInfo.MouseDownButton = "RIGHT";
    			BoardInfo.MouseDownX = nX;
    			BoardInfo.MouseDownY = nY;
    			BoardInfo.ScrollDown = "";
    		}
    		else {
    			BoardInfo.IsMouseDown = false;
    			BoardInfo.MouseDownButton = "";
    			BoardInfo.MouseDownX = 0;
    			BoardInfo.MouseDownY = 0;
    			BoardInfo.ScrollDown = "";
    		}
    	}

		function OnEvtMouseMove(event) {
			var rect = canvas.getBoundingClientRect();
            var nX = parseInt((event.clientX - rect.left)/scaleFactor);
            var nY = parseInt((event.clientY - rect.top)/scaleFactor);
            BoardInfo.MouseMoveX = nX;
            BoardInfo.MouseMoveY = nY;

            if (BoardInfo.IsMouseDown && (BoardInfo.MouseDownButton == "MIDDLE" || BoardInfo.MouseDownButton == "LEFT")) {
            	document.getElementById("Canvas1").style.cursor = "move";
            	var nScrollX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
                BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
                var nRateX = nScrollX / (BoardInfo.Scroll.HScroll.Width - BoardInfo.Scroll.HScroll.BarW);
                var nScrollY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
                BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
                SetScrollValueAdd(-nScrollX, -nScrollY);
                return;
            } else if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "LEFT") {
    			if (!BoardInfo.Selected.getIsExistItem() && BoardInfo.Key.IsShiftKey) {
    				document.getElementById("Canvas1").style.cursor = "move";

    				var nScrollX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
	                BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
	                var nRateX = nScrollX / (BoardInfo.Scroll.HScroll.Width - BoardInfo.Scroll.HScroll.BarW);
	                var nScrollY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
	                BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
	                SetScrollValueAdd(-nScrollX, -nScrollY);

    				return;
    			}
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
    					document.getElementById("Canvas1").style.cursor = "default";
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
	}

    function EditPageEditItem(oPage, nEventX, nEventY) {
		var bRetItemEditing = false;

		ClearEditing();
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


    	if(flag == "fimsImgeSave") {
    		if (urlCk == "1") {
    			parent.main.winClose();
    		}
    	}
    	if(flag == "InOut") {
			if(status == "success") {
				portKeyArr = [];
				portKeyBorderArr = [];
				var tmpPortKeyBorderArr = [];

				$.each(response.InOutList, function(i, item){
					var inId = response.InOutList[i].inId;
					var outId = response.InOutList[i].outId;
					var amp		= response.InOutList[i].amp;
					var type	= response.InOutList[i].type;
					var pos		= response.InOutList[i].pos;
					var oPage = GetPage(1);
					var oPanel = GetPanel(oPage, 1);
					if (type != 'F') {
						if (oPage && oPanel) {
							for (var j = 0; j < oPanel.Items.length; j++) {
								var oItem = oPanel.Items[j];
								if (oItem.ItemId == inId.trim()) {
									var inKey = oItem.Key;
								}
								if (oItem.ItemId == outId.trim()) {
									var outKey = oItem.Key;
								}
							}
						}
						if (inKey != undefined && outKey != undefined) {
							var oItemIn = GetItem(oPanel, inKey);
							var oItemOut = GetItem(oPanel, outKey);
							portKeyArr.push(oItemIn.Key+":"+oItemOut.Key);

							tmpPortKeyBorderArr.push("|"+oItemIn.Key+"|");			// 같은 값이 존재할 수 있어 구분자로 처리
							tmpPortKeyBorderArr.push("|"+oItemOut.Key+"|");
						}

					}

				});
				//console.log(portKeyArr);

				// 유니크값으로 변환
				$.each(tmpPortKeyBorderArr, function(i, el){
					if($.inArray(el, portKeyBorderArr) === -1) portKeyBorderArr.push(el);
				});
				Draw();
			}
		}

    	if(flag == 'eqpinfo'){

    		if (response.eqpMgmtList.length > 0) {

				$.each(response.eqpMgmtList, function(i, item){
					var rackId = response.eqpMgmtList[i].rackId;
					if (rackId != undefined && rackId != "" && rackId != null) {
						eqpMgmtList.push(response.eqpMgmtList[i]);
					}
				});

				//console.log("------"+eqpMgmtList[0].rackId);
    			rackEqpId = eqpMgmtList[0].eqpId;
        		var param = {rackId : eqpMgmtList[0].rackId};
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInfo', param, 'GET', 'rackInfo');
    		}

    	}

    	if (flag == 'rackInfo') {
			if(status == "success") {
//				console.log(response.RackInfo[0]);
				drawRackInfo.push(response.RackInfo[0]);
				var param = {rackId : eqpMgmtList[0].rackId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');

			}
		}

    	if (flag == 'RackInList') {
			if(status == "success") {
				rackInArr = [];
				var tmpSpos = 0;
				$.each(response.rackInList, function(i, item){
					var sPos = response.rackInList[i].sPos;
					var ePos = response.rackInList[i].ePos;
					var systemNm = response.rackInList[i].systemNm;
					var dismantleFlag = response.rackInList[i].dismantleFlag;
					var barcodeFlag = response.rackInList[i].barcodeFlag;
					var eqpId = response.rackInList[i].eqpId;
					var cstrCd = response.rackInList[i].cstrCd;
					var stdNm = response.rackInList[i].stdNm;
					rackInArr.push(sPos+":"+ePos+":"+systemNm+":"+dismantleFlag+":"+barcodeFlag+":"+eqpId+":"+cstrCd+":"+stdNm);
					if (rackEqpId == eqpId) {
						tmpSpos = sPos;
					}

				});

				var param = {rackId : eqpMgmtList[0].rackId, sPos : tmpSpos};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqRackInList', param, 'GET', 'RackInDetail');
			}
		}

    	if (flag == 'RackInDetail') {
			if(status == "success") {
				rackInItemArr.push(response.RackInDetail[0]);
				var param = {itemId : eqpMgmtList[0].rackId};
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getParamInfoSet', param, 'GET', 'ParamInfoSet');
			}
		}

    	if(flag == "ParamInfoSet") {
			if(status == "success") {
				var _sisulCd = "";
				var _floorId = "";
				var _version = "";
				$.each(response.paramInfoSet, function(i, item){
					_sisulCd = response.paramInfoSet[i].sisulCd;
					_floorId = response.paramInfoSet[i].floorId;
					_version = response.paramInfoSet[i].version;
				});
				$("#sisulCd").val(_sisulCd);
				$("#floorId").val(_floorId);
				$("#version").val(_version);
				itemSelectFlag = true;

				var param =  $("#searchForm").serialize();
				//console.log(param);
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorInfo', param, 'GET', 'floorList');
			}
		}

    	if (flag == "floorList") {
    		var option_data =  [];
    		for(var i=0; i < response.floorInfo.length; i++){
    			var resObj = response.floorInfo[i];
    			floorStandardSize.push(resObj.floorId+":"+resObj.standardSize);
    		}

			if (response.floorInfo.length == 0) {
				SetCommand('DESIGN_PANEL_LOAD', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', "");
			} else {

				var sisulCd = $("#sisulCd").val();
				var floorId = $("#floorId").val();

				var tmpParam =  {sisulCd:sisulCd, floorId:floorId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/items', tmpParam, 'GET', 'itemsList');
			}
    	}

    	if (flag == "itemsList") {
    		//console.log(floorStandardSize);
    		for (var j = 0; j < floorStandardSize.length; j++) {
				var tmpStandardSize = floorStandardSize[j].split(":");
				var tmpFloorId = tmpStandardSize[0];
				var tmpScale = tmpStandardSize[1];
				var floorId = $("#floorId").val();
				if (floorId == tmpFloorId) {
					baseScale = tmpScale;
				}
			}
    		var pageDatas = "PAGE_NAMEVALUE|^@3@^|Key|^@1@^|1|^@2@^|Title|^@1@^|상면관리|^@2@^|Style|^@1@^|0|^@2@^|Date|^@1@^||^@2@^|Time|^@1@^||^@2@^|IsPrintable|^@1@^|true|^@2@^|HeadPrint|^@1@^|A|^@2@^|FootPrint|^@1@^|A|^@2@^|SheetKey|^@1@^||^@2@^|Value|^@1@^|";
			var panelDatas = "PANEL_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|Key|^@1@^|1|^@2@^|BackColor|^@1@^|rgba(255,255,255,1)|^@2@^|Width|^@1@^|5000|^@2@^|Height|^@1@^|5000|^@2@^|IsPrintable|^@1@^|true|^@2@^|ExpandTitle|^@1@^||^@2@^|IsExpandable|^@1@^|false|^@2@^|IsExpanded|^@1@^|true|^@2@^|ExPageKey|^@1@^||^@2@^|IsPrintExpand|^@1@^|false|^@2@^|BackImageString|^@1@^||^@2@^|BackImageWidth|^@1@^|5000|^@2@^|RunPageAdd|^@1@^||^@2@^|RunPageLoad|^@1@^||^@2@^|RunPageSave|^@1@^||^@2@^|IsUserSizable|^@1@^|false|^@2@^|UserMinHeight|^@1@^|5000|^@2@^|UserMaxHeight|^@1@^|1000|^@2@^|Value|^@1@^||^@2@^|BackImageAngle|^@1@^|0";
			var itemDatas = "";
        	$.each(response.ItemsList, function(n, item) {
				var _key = n + 1;
				if (item.typeName == "background") {
					return;
				}
				var _label = EmptyStr(item.label);
				if (_label == "" || _label == undefined || _label == null){
					_label = "|^@^|";
				}
				_label = _label.replace(/(\n|\r\n)/g, '|^@^|');

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
    						var minX = 0;
    						var maxX = 0;
    						var minY = 0;
    						var maxY = 0;
							for (var i = 0; i < oPanel.Items.length; i++) {
								var oItem = oPanel.Items[i];
								if (oItem.Style != e_ItemStyle_Square && oItem.Style != e_ItemStyle_DimensionLine && oItem.LayerId == "L001") {
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
							}
							BoardInfo.Scroll.HScroll.Value = minX;
							BoardInfo.Scroll.VScroll.Value = minY;
							var maxScaleX = maxX - BoardInfo.Scroll.HScroll.Value;
							var maxScaleY = maxY - BoardInfo.Scroll.VScroll.Value;
							for (var i = 0; i < 20; i++) {
								if (maxScaleX > 1700) {
									scaleFactor /= 1.1;
									maxScaleX = (maxX * scaleFactor);
									console.log("1 변경 X : "+i+"--"+maxScaleX);
								} else if (maxScaleX < 1300) {
									if (maxScaleY < 650) {
										scaleFactor *= 1.1;
										maxScaleX = (maxX * scaleFactor);
										console.log("2 변경 X : "+i+"--"+maxScaleX);
									}
								}
								if (maxScaleY > 1000) {
									scaleFactor /= 1.1;
									maxScaleY = (maxY * scaleFactor);
									console.log("3 변경 Y : "+i+"--"+maxScaleY);
								} else if (maxScaleY < 650) {
									if (maxScaleX < 1500) {
										scaleFactor *= 1.1;
										maxScaleY = (maxY * scaleFactor);
										console.log("4 변경 Y : "+i+"--"+maxScaleY);
									}
								}
							}
							var width 	= (maxX - BoardInfo.Scroll.HScroll.Value) * scaleFactor;
							var height 	= (maxY - BoardInfo.Scroll.VScroll.Value) * scaleFactor;
//							console.log("스케일 : "+ maxScaleX +"--"+ maxScaleY);

							var tmpX = (1740 - width) / 4;
							var tmpY = (1050 - height) / 4;
							console.log(" : "+ maxScaleX +"--"+ maxScaleY +"--"+ tmpX +"--"+ tmpY);
//
//
//							console.log("스케일 : "+xx +"--"+yy);
//
							BoardInfo.Scroll.HScroll.Value -= tmpX;
							BoardInfo.Scroll.VScroll.Value -= tmpY;

							SetScroll();
							Draw();

							if (urlCk == "1") {
								setTimeout(function(){ImgSave();}, 2000);
							}

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

	function ImgSave() {
		var canvas = document.getElementById("Canvas1");
		var canvasValue = canvas.toDataURL("image/jpeg",1.0);
		if (gIntgFcltsCd != undefined && gIntgFcltsCd != null && gIntgFcltsCd != "") {
			var paramData = {intgFcltsCd : gIntgFcltsCd, chgDtm : gChgDtm, bgData : canvasValue.replace("data:image/jpeg;base64,", "")};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setFimsImgeSave', paramData, 'POST', '');
		}
	}

	function Draw() {
		var canvas = document.getElementById("Canvas1");
		if (!BoardInfo.MainContext) {
			if (canvas.getContext) {
				BoardInfo.MainContext = canvas.getContext("2d");
			}
			else {
				document.title = "ERROR";
				document.write("지원할 수 없는 환경입니다.");
			}
		}
		BoardInfo.CanvasWidth = canvas.clientWidth;
		BoardInfo.CanvasHeight = canvas.clientHeight;

//		DrawBoard(BoardInfo.MainContext);
		try {
			if (BoardInfo.MainContext) {
				DrawBoard(BoardInfo.MainContext);
			}
		}
		catch (err) {
			SetProcData("ERROR", "METHOD_NAME|^@^|Draw", err);
		}
	}

	function DrawBoard(context) {

		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nCanvasHeight = BoardInfo.CanvasHeight;
		if (context) {
			context.beginPath();
			context.save();
			context.clearRect(0, 0, nCanvasWidth, nCanvasHeight);

//			var img = new Image();
//			img.src = '/tango-transmission-web/resources/images/upsd/img_background_pattern.png';
//			var pattern = context.createPattern(img, 'repeat');
//			context.fillStyle = pattern;
//			context.fillRect(0, 0, nCanvasWidth, nCanvasHeight);

			var img = document.getElementById("tmpImage");
			var pattern = context.createPattern(img, 'repeat');
			context.rect(0, 0, nCanvasWidth, nCanvasHeight);
			context.fillStyle = pattern;
			context.fill();

			context.translate(2,2);
			context.scale(scaleFactor,scaleFactor);
			DrawPages(context);
			context.restore();
			context.closePath();


			var barNo			= "";
			var bpId			= "";
			var bpNm			= "";
			var dablMgmtYn		= "";
			var dumyEqpYn		= "";
			var eqpFwVerVal		= "";
			var eqpHostNm		= "";
			var eqpId			= "";
			var eqpInstlMtsoId	= "";
			var eqpInstlMtsoNm	= "";
			var eqpMdlId		= "";
			var eqpMdlNm		= "";
			var eqpNm			= "";
			var eqpRoleDivCd	= "";
			var eqpRoleDivNm	= "";
			var eqpSerNoVal		= "";
			var eqpStatCd		= "";
			var eqpStatNm		= "";
			var frstRegDate		= "";
			var frstRegUserId	= "";
			var gisUseYn		= "";
			var intgFcltsCd		= "";
			var jrdtTeamOrgId	= "";
			var jrdtTeamOrgNm	= "";
			var lastChgDate		= "";
			var lastChgUserId	= "";
			var lcl				= "";
			var lclNm			= "";
			var lnkgEqpIdVal	= "";
			var lnkgSystmCd		= "";
			var mainEqpIpAddr	= "";
			var mcl				= "";
			var mclNm			= "";
			var mgmtGrpNm		= "";
			var mgmtInfNrgstYn	= "";
			var opTeamOrgId		= "";
			var opTeamOrgNm		= "";
			var orgId			= "";
			var ownBizrCd		= "";
			var ownBizrNm		= "";
			var portCnt			= "";
			var rackId			= "";
			var rackInAttrYn	= "";
			var scl				= "";
			var sclNm			= "";
			var siteCd			= "";
			var siteNm			= "";
			var skt2EqpYn		= "";
			var swVerVal		= "";
			var teamId			= "";
			var tmof			= "";
			var tmofNm 			= "";

			var rackLabel			= "";
			var unitSize		= "0";
			var startPos		= 0;
			var endPos			= 0;
			var totPos			= 0;
			var dismantleNm		= "-";
			var cstrStatNm		= "";
			var cstrCd			= "";


			if (drawRackInfo.length > 0 && eqpMgmtList.length > 0 && rackInItemArr.length > 0) {
				//cosole.log(drawRackInfo);
				rackLabel		= drawRackInfo[0].label;
				unitSize		= drawRackInfo[0].unitSize;
				barNo			= eqpMgmtList[0].barNo;				//: "13076R17120QA"
				bpId			= eqpMgmtList[0].bpId;					//: "BP0004483"
				bpNm			= eqpMgmtList[0].bpNm;					//: "None"
				dablMgmtYn		= eqpMgmtList[0].dablMgmtYn;			//: "YES"
				dumyEqpYn		= eqpMgmtList[0].dumyEqpYn;			//: "NO"
				eqpFwVerVal		= eqpMgmtList[0].eqpFwVerVal;			//: "DU 25"
				eqpHostNm		= eqpMgmtList[0].eqpHostNm;			//: "S생연지구_광암동B7ELDC_33"
				eqpId			= eqpMgmtList[0].eqpId;				//: "DV10219741389"
				eqpInstlMtsoId	= eqpMgmtList[0].eqpInstlMtsoId;		//: "MO01011949973"
				eqpInstlMtsoNm	= eqpMgmtList[0].eqpInstlMtsoNm;		//: "S생연지구집중국"
				eqpMdlId		= eqpMgmtList[0].eqpMdlId;				//: "DMT0000009"
				eqpMdlNm		= eqpMgmtList[0].eqpMdlNm;				//: "SKT미확인장비모델"
				eqpNm			= eqpMgmtList[0].eqpNm;				//: "S생연지구_광암동B7ELDC_33"
				eqpRoleDivCd	= eqpMgmtList[0].eqpRoleDivCd;			//: "23"
				eqpRoleDivNm	= eqpMgmtList[0].eqpRoleDivNm;			//: "LTE DU"
				eqpSerNoVal		= eqpMgmtList[0].eqpSerNoVal;			//: "S61G339875"
				eqpStatCd		= eqpMgmtList[0].eqpStatCd;			//: "03"
				eqpStatNm		= eqpMgmtList[0].eqpStatNm;			//: "서비스중지"
				frstRegDate		= eqpMgmtList[0].frstRegDate;			//: "2017-04-29"
				frstRegUserId	= eqpMgmtList[0].frstRegUserId;		//: "ERP_EQP_BATCH"
				gisUseYn		= eqpMgmtList[0].gisUseYn;				//: "N"
				intgFcltsCd		= eqpMgmtList[0].intgFcltsCd;			//: "201732440"
				jrdtTeamOrgId	= eqpMgmtList[0].jrdtTeamOrgId;		//: "1000193937"
				jrdtTeamOrgNm	= eqpMgmtList[0].jrdtTeamOrgNm;		//: "Core운용1팀"
				lastChgDate		= eqpMgmtList[0].lastChgDate;			//: "2020-08-06"
				lastChgUserId	= eqpMgmtList[0].lastChgUserId;		//: "SYSTEM"
				lcl				= eqpMgmtList[0].lcl;					//: "Z"
				lclNm			= eqpMgmtList[0].lclNm;				//: "기타 장비"
				lnkgEqpIdVal	= eqpMgmtList[0].lnkgEqpIdVal;			//: "100522856"
				lnkgSystmCd		= eqpMgmtList[0].lnkgSystmCd;			//: "CMS"
				mainEqpIpAddr	= eqpMgmtList[0].mainEqpIpAddr;		//: "38.64.19.202"
				mcl				= eqpMgmtList[0].mcl;					//: "Z99"
				mclNm			= eqpMgmtList[0].mclNm;				//: "기타 장비"
				mgmtGrpNm		= eqpMgmtList[0].mgmtGrpNm;			//: "SKT"
				mgmtInfNrgstYn	= eqpMgmtList[0].mgmtInfNrgstYn;		//: "NO"
				opTeamOrgId		= eqpMgmtList[0].opTeamOrgId;			//: "50000027"
				opTeamOrgNm		= eqpMgmtList[0].opTeamOrgNm;			//: "일산품질개선팀"
				orgId			= eqpMgmtList[0].orgId;				//: "1430455776"
				ownBizrCd		= eqpMgmtList[0].ownBizrCd;			//: "01"
				ownBizrNm		= eqpMgmtList[0].ownBizrNm;			//: "SKT"
				portCnt			= eqpMgmtList[0].portCnt;				//: "4"
				rackId			= eqpMgmtList[0].rackId;				//: "E4BFD7E5-2BEA-8893-0ED1-6D63B43CEEB5"
				rackInAttrYn	= eqpMgmtList[0].rackInAttrYn;			//: "Y"
				scl				= eqpMgmtList[0].scl;					//: "Z9999"
				sclNm			= eqpMgmtList[0].sclNm;				//: "기타 장비"
				siteCd			= eqpMgmtList[0].siteCd;				//: "KK111113173424976"
				siteNm			= eqpMgmtList[0].siteNm;				//: "S목감"
				skt2EqpYn		= eqpMgmtList[0].skt2EqpYn;			//: "NO"
				swVerVal		= eqpMgmtList[0].swVerVal;				//: "9.0.0"
				teamId			= eqpMgmtList[0].teamId;				//: "1000193937"
				tmof			= eqpMgmtList[0].tmof;					//: "MO00000000101"
				tmofNm 			= eqpMgmtList[0].tmofNm;


				if (barNo == undefined) { barNo = "-"; }
				if (siteCd == undefined) { siteCd = "-"; }
				if (siteNm == undefined) { siteNm = "-"; }

				if (eqpFwVerVal == undefined) { eqpFwVerVal = "-"; }
				if (mainEqpIpAddr == undefined) { mainEqpIpAddr = "-"; }
				if (swVerVal == undefined) { swVerVal = "-"; }
				if (eqpSerNoVal == undefined) { eqpSerNoVal = "-"; }
				if (eqpHostNm == undefined) { eqpHostNm = "-"; }
				if (jrdtTeamOrgNm == undefined) { jrdtTeamOrgNm = "-"; }
				if (opTeamOrgNm == undefined) { opTeamOrgNm = "-"; }
				var dismantleFlag = rackInItemArr[0].dismantleFlag;
				if (dismantleFlag == 'Y') {
					dismantleNm = "대상";
				} else if (dismantleFlag == 'N') {
					dismantleNm = "미 대상";
				}

				cstrCd			= rackInItemArr[0].cstrCd;
				if (cstrCd == undefined) {
					cstrCd = '-';
				}
				var cstrStatCd = rackInItemArr[0].cstrStatCd;
				if (cstrStatCd == '1') {
					cstrStatNm = "ENG SHEET 예약";
				} else if (cstrStatCd == '2') {
					cstrStatNm = "장비 개통 틍록";
				}
			}
			// *************************************
			// * 랙 - 그림 Start
			// *************************************
			// ************* UNIT For문 1710, 266


			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,1)";
			context.fillRect(1699, 246, 200, 698);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.strokeStyle ="rgba(0,0,0,1)";
			context.strokeRect(1710, 252, 176, 678);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle ="rgba(125,225,227,0.5)";
			context.fillRect(1710, 252, 176, 678);
			context.restore();
			context.closePath();

//			context.beginPath();
//			context.save();
//			context.rect(1710, 252, 176, 30);
//			context.clip();
//			context.textAlign = "center";
//			context.fillStyle = "rgba(0,0,0,1)";
//			context.font = "10px Arial";
//			context.fillText("앞 면", 1710, 252);
//			context.restore();
//			context.closePath();


			var tmpi	 	= 0;
			var tmpri		= 0;
			var strAppend 	= '';
			var tmpCkFlag 	= false;
			var frstPos 	= 10000;

			var tmpUnitSize	= unitSize;
			var startX = 1718;
			var startY = 300;

			rackInTmpArr 	= [];

			var startNum = 0;
			if (tmpUnitSize > 42) {
				var tmpSpos = 0;
				var tmpEpos = 0;
				for (var j = 0; j < rackInArr.length; j++) {
					var strRackIn 	= rackInArr[j].split(":");
					var eqpId2		= strRackIn[5];
					var sPos 		= strRackIn[0];
					var ePos 		= strRackIn[1];
					if (eqpId2 == rackEqpId) {
						tmpSpos = sPos;
						tmpEpos = ePos;
						break;
					}
				}
				if (tmpEpos > 42) {
					tmpUnitSize = tmpEpos;
					startNum = tmpEpos - 42 + 1;
					//console.log("1 : "+startNum+"--"+tmpUnitSize);
				} else {
					tmpUnitSize = 42;
					startNum = 0;
				}
			} else {
				tmpUnitSize = 42;
				startNum = 0;
			}
			//console.log(startNum+"--"+tmpUnitSize);
			var kkk = 0;
			for (var i = startNum; i < tmpUnitSize; i++) {
				kkk  = kkk + 1;
				tmpi = i + 1;
				tmpri = tmpUnitSize - kkk + 1;
				//console.log(i+"--"+tmpri+"--"+startNum+"--"+tmpUnitSize);

				for (var j = 0; j < rackInArr.length; j++) {

					var strRackIn 	= rackInArr[j].split(":");
					var sPos 		= strRackIn[0];
					var ePos 		= strRackIn[1];
					var label 		= strRackIn[2];
					var eqpId2		= strRackIn[5];
					var tmpCstrCd 	= strRackIn[6];
					var stdNm 		= strRackIn[7];
					var lastPos 	= parseInt(ePos);

					if (tmpri == lastPos) {
//						rackInTmpArr.push(sPos);
						if (stdNm != undefined && stdNm != "undefined" && stdNm != "" && stdNm != null) {
							label = stdNm;
						}

						var rowHeight = (parseInt(ePos) - parseInt(sPos)+1) * 15;
						var sePos = (parseInt(ePos) - parseInt(sPos)+1);
						if (label == '사용불가_이격셀프') {
							var tmpNum = ePos;
							var tmpstartY = startY;
							for (var k = 0; k < sePos; k++) {
								context.beginPath();
								context.save();
								context.fillStyle = "rgba(255,255,255,1)";
								context.fillRect(startX, tmpstartY - 14, 160, 14);
								context.strokeStyle = "rgba(0,0,0,1)";
								context.strokeRect(startX, tmpstartY - 14, 160, 14);
								context.restore();
								context.closePath();

								context.beginPath();
								context.save();
								context.fillStyle = "rgba(0,0,0,1)";
								context.font = "10px Arial";
								context.rect(startX, tmpstartY - 14, 160, 14);
								context.clip();
								context.textAlign = "center";
								context.fillText(tmpNum, startX + 80, tmpstartY - 4);
								context.restore();
								context.closePath();
								tmpNum -= 1;
								tmpstartY += 15;
							}
						} else {
							if (eqpId2 == rackEqpId) {
								context.beginPath();
								context.save();
								context.fillStyle = "rgba(255,255,0,1)";
								context.fillRect(startX, startY - 14, 160, rowHeight);
								context.strokeStyle = "rgba(0,0,0,1)";
								context.strokeRect(startX, startY - 14, 160, rowHeight);
								context.restore();
								context.closePath();

								context.beginPath();
								context.save();
								context.rect(startX, startY - 14, 160, rowHeight);
								context.clip();
								context.textAlign = "center";
								context.fillStyle = "rgba(0,0,0,1)";
								context.font = "10px Arial";
								context.fillText(label, startX + 80, startY - 3);
								context.restore();
								context.closePath();
								totPos = (parseInt(ePos) - parseInt(sPos)+1);
								startPos = sPos;
								endPos = sPos;

							} else {
								context.beginPath();
								context.save();
								context.fillStyle = "rgba(125,140,227,0.5)";
								context.fillRect(startX, startY - 14, 160, rowHeight);
								context.strokeStyle = "rgba(0,0,0,1)";
								context.strokeRect(startX, startY - 14, 160, rowHeight);
								context.restore();
								context.closePath();

								context.beginPath();
								context.save();
								context.rect(startX, startY - 14, 160, rowHeight);
								context.clip();
								context.textAlign = "center";
								context.fillStyle = "rgba(0,0,0,1)";
								context.font = "10px Arial";
								context.fillText(label, startX + 80, startY - 3);
								context.restore();
								context.closePath();
							}

						}
						startY += (parseInt(ePos) - parseInt(sPos)+1) * 15;

						frstPos = sPos;
						tmpCkFlag = true;
						break;
					}

				}
				if (!tmpCkFlag) {

					context.beginPath();
					context.save();
					context.fillStyle = "rgba(255,255,255,1)";
					context.fillRect(startX, startY - 14, 160, 15);
					context.strokeStyle = "rgba(0,0,0,1)";
					context.strokeRect(startX, startY - 14, 160, 15);
					context.restore();
					context.closePath();

					context.beginPath();
					context.save();
					context.fillStyle = "rgba(0,0,0,1)";
					context.font = "10px Arial";
					context.rect(startX, startY - 14, 160, 15);
					context.clip();
					context.textAlign = "center";
					context.fillText(tmpri, startX + 80, startY - 4);
					context.restore();
					context.closePath();


//					context.beginPath();
//					context.save();
//					context.strokeStyle ="rgba(0,0,0,1)";
//					context.moveTo(startX, startY);
//					context.lineTo(startX + 28, startY);
//					context.stroke();
//					context.restore();
//					context.closePath();

//					context.beginPath();
//					context.save();
////					context.rect(1535, 84, 162, 25);
////					context.clip();
//					context.fillStyle = "rgba(0,0,0,1)";
//					context.font = "9px Arial";
//					context.fillText(tmpri+"", startX + 15, startY - 2);
//					context.restore();
//					context.closePath();

					startY += 15;
					frstPos = 10000;
					tmpCkFlag = false;
				} else {
					if (frstPos == tmpri) {
						tmpCkFlag = false;
					}
				}

			}

			// *************************************
			// * 랙 - 그림 End
			// *************************************

			// *************************************
			// * 랙 - 실장 정보 Start
			// *************************************
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,191,194,1)";
			context.fillRect(1699, 30, 200, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("랙 - 실장 정보", 1760, 47);
			context.restore();
			context.closePath();

			// ************* 랙 명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 57, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("랙명", 1705, 74);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 57, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1781, 57, 118, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(rackLabel, 1787, 74);	//*****************
			context.restore();
			context.closePath();

			// ************* 랙 사이즈
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 84, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("랙 사이즈", 1705, 101);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 84, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(unitSize+" UNIT", 1787, 101);	//*****************
			context.restore();
			context.closePath();

			// ************* 실장 위치
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 111, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("실장 위치", 1705, 128);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 111, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(startPos+"~"+endPos, 1787, 128);	//*****************
			context.restore();
			context.closePath();

			// ************* 실장 사이즈
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 138, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("실장 사이즈", 1705, 155);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 138, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(totPos+" UNIT", 1787, 155);	//*****************
			context.restore();
			context.closePath();

			// ************* 철거 대상 여부
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 165, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("철거대상여부", 1705, 182);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 165, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(dismantleNm, 1787, 182);	//*****************
			context.restore();
			context.closePath();









			// ************* 공사코드
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 192, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("공사 코드", 1705, 209);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 192, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(cstrCd, 1787, 209);	//*****************
			context.restore();
			context.closePath();



			// ************* 공사 상태
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1699, 219, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("공사 상태", 1705, 236);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1781, 219, 118, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(cstrStatNm, 1787, 236);	//*****************
			context.restore();
			context.closePath();


			// *************************************
			// * 랙 - 실장 정보 End
			// *************************************

			// *************************************
			// * 장비 - 기본 정보 Start
			// *************************************
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,191,194,1)";
			context.fillRect(1453, 30, 244, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 - 기본 정보", 1536, 47);
			context.restore();
			context.closePath();

			// ************* 전송실
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 57, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("전송실", 1459, 74);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 57, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(tmofNm, 1541, 74);	//*****************
			context.restore();
			context.closePath();
			// ************* 국사명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 84, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1453, 84, 80, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("국사명", 1459, 101);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 84, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1535, 84, 162, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpInstlMtsoNm, 1541, 101);	//*****************
			context.restore();
			context.closePath();


			// ************* 장비ID
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 111, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비ID", 1459, 128);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 111, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpId, 1541, 128);	//*****************
			context.restore();
			context.closePath();

			// ************* 장비명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 138, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비명", 1459, 155);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 138, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1535, 138, 162, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpNm, 1541, 155);	//*****************
			context.restore();
			context.closePath();

			// ************* 장비모델명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 165, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 모델명", 1459, 182);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 165, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpMdlNm, 1541, 182);	//*****************
			context.restore();
			context.closePath();

			// ************* 바코드
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 192, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("바코드", 1459, 209);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 192, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(barNo, 1541, 209);	//*****************
			context.restore();
			context.closePath();

			// *************************************
			// * 장비 - 기본 정보 End
			// *************************************
			// *************************************
			// * 장비 - 기타 정보 Start
			// *************************************
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,191,194,1)";
			context.fillRect(1453, 219, 244, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 - 기타 정보", 1536, 235);
			context.restore();
			context.closePath();

			// ************* 장비 용도
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 246, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 용도", 1459, 263);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 246, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("-", 1541, 263);	//*****************
			context.restore();
			context.closePath();

			// ************* 장비 타입
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 273, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 타입", 1459, 290);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 273, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpRoleDivNm, 1541, 290);	//*****************
			context.restore();
			context.closePath();

			// ************* 장비 상태
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 300, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장비 상태", 1459, 317);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 300, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpStatNm, 1541, 317);	//*****************
			context.restore();
			context.closePath();

			// ************* 사이트 키
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 327, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("사이트 키", 1459, 344);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 327, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(siteCd, 1541, 344);	//*****************
			context.restore();
			context.closePath();

			// ************* 사이트명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 354, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("사이트 명", 1459, 371);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 354, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1535, 354, 162, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(siteNm, 1541, 371);	//*****************
			context.restore();
			context.closePath();

			// ************* 호스트 명
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 381, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("호스트 명", 1459, 398);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 381, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.rect(1535, 381, 162, 25);
			context.clip();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpHostNm, 1541, 398);	//*****************
			context.restore();
			context.closePath();

			// ************* IP주소
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 408, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("IP주소", 1459, 425);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 408, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(mainEqpIpAddr, 1541, 425);	//*****************
			context.restore();
			context.closePath();

			// ************* 연동코드
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 435, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("연동코드", 1459, 452);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 435, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(lnkgSystmCd, 1541, 452);	//*****************
			context.restore();
			context.closePath();

			// ************* 연동ID
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 462, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("연동ID", 1459, 479);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 462, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(lnkgEqpIdVal, 1541, 479);	//*****************
			context.restore();
			context.closePath();

			// ************* 시설코드
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 489, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("시설코드", 1459, 506);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 489, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(intgFcltsCd, 1541, 506);	//*****************
			context.restore();
			context.closePath();

			// ************* 펌웨어버전
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 516, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("펌웨어 버전", 1459, 533);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 516, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpFwVerVal, 1541, 533);	//*****************
			context.restore();
			context.closePath();

			// ************* SW 버전
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 543, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("SW 버전", 1459, 560);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 543, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(swVerVal, 1541, 560);	//*****************
			context.restore();
			context.closePath();

			// ************* 시리얼 번호
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 570, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("시리얼 번호", 1459, 587);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 570, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(eqpSerNoVal, 1541, 587);	//*****************
			context.restore();
			context.closePath();

			// ************* 작업지시번호
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 597, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("작업지시번호", 1459, 614);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 597, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("-", 1541, 614);	//*****************
			context.restore();
			context.closePath();

			// ************* 포트 수
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 624, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("포트 수", 1459, 641);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 624, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(portCnt, 1541, 641);	//*****************
			context.restore();
			context.closePath();

			// ************* SKT2 여부
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 651, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("SKT2 여부", 1459, 668);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 651, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(skt2EqpYn, 1541, 668);	//*****************
			context.restore();
			context.closePath();

			// ************* 장애관리여부
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 678, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("장애관리여부", 1459, 695);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 678, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(dablMgmtYn, 1541, 695);	//*****************
			context.restore();
			context.closePath();

			// ************* 소유사업자
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 705, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("소유사업자", 1459, 722);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 705, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(ownBizrNm, 1541, 722);	//*****************
			context.restore();
			context.closePath();

			// ************* 관리팀
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 732, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("관리팀", 1459, 749);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 732, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(jrdtTeamOrgNm, 1541, 749);	//*****************
			context.restore();
			context.closePath();

			// ************* 운용팀
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 759, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("운용팀", 1459, 776);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 759, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(opTeamOrgNm, 1541, 776);	//*****************
			context.restore();
			context.closePath();

			// ************* 틍록일
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 786, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("틍록일", 1459, 803);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 786, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(frstRegDate, 1541, 803);	//*****************
			context.restore();
			context.closePath();

			// ************* 틍록자
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 813, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("틍록자", 1459, 830);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 813, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(frstRegUserId, 1541, 830);	//*****************
			context.restore();
			context.closePath();

			// ************* 수정일
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 840, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("수정일", 1459, 857);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 840, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(lastChgDate, 1541, 857);	//*****************
			context.restore();
			context.closePath();

			// ************* 수정자
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 867, 80, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("수정자", 1459, 884);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 867, 162, 25);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText(lastChgUserId, 1541, 884);	//*****************
			context.restore();
			context.closePath();

			// ************* 기타
			context.beginPath();
			context.save();
			context.fillStyle = "rgba(125,225,227,1)";
			context.fillRect(1453, 894, 80, 50);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("기타 사항", 1459, 911);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(255,255,255,0.9)";
			context.fillRect(1535, 894, 162, 50);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.fillStyle = "rgba(0,0,0,1)";
			context.font = "12px Arial";
			context.fillText("-", 1541, 911);	//*****************
			context.restore();
			context.closePath();

			// *************************************
			// * 장비 - 기본 정보 End
			// *************************************




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
					DrawItems(context, oPanel, null, bSelectedPage, oPage.Edit.getEditable(), bPrintable);

					// 선택된 아이템 표시

					for (var i = 0; i < oPanel.Items.length; i++) {
						var oItem = oPanel.Items[i];
						if (oItem.ItemId == eqpMgmtList[0].rackId) {
							var trans_cx =  (parseInt(oItem.DrawX) + 0.5) + oItem.DrawW / 2;
							var trans_cy =  (parseInt(oItem.DrawY) + 0.5) + oItem.DrawH / 2;
							var angle = oItem.Angle;
							context.save();
							context.translate(trans_cx, trans_cy);
							context.rotate(angle*Math.PI/180);
							context.globalAlpha = 1.0;
							context.fillStyle = "rgba(255,255,0,0.5)";
							context.fillRect(-oItem.DrawW/2, -oItem.DrawH/2, oItem.DrawW, oItem.DrawH);
							context.restore();
							context.closePath();

						}
					}


//					if (BoardInfo.Selected.getIsExistItem()) {
//						if (oPage.Key == BoardInfo.Selected.PageKey && oPanel.Key == BoardInfo.Selected.PanelKey) {
//							for (var j = 0; j < BoardInfo.Selected.ItemKeys.length; j++) {
//								var strItemKey = BoardInfo.Selected.ItemKeys[j];
//								var oItem = GetItem(oPanel, strItemKey);
//
//								if (oItem) {
//									var trans_cx =  (parseInt(oItem.DrawX) + 0.5) + oItem.DrawW / 2;
//									var trans_cy =  (parseInt(oItem.DrawY) + 0.5) + oItem.DrawH / 2;
//									var angle = oItem.Angle;
//									context.save();
//									context.translate(trans_cx, trans_cy);
//									context.rotate(angle*Math.PI/180);
//									context.globalAlpha = 1.0;
//									context.fillStyle = "rgba(255,0,255,0.3)";
//									context.fillRect(-oItem.DrawW/2, -oItem.DrawH/2, oItem.DrawW, oItem.DrawH);
//									context.restore();
//									context.closePath();
//
////									rackUnitCnt = oItem.UnitSize;
//								}
//							}
//						}
//					}
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
				}// if
			}// if
		}// if

		if (oItem.Style == e_ItemStyle_DimensionLine) { // 기존데이터 예외처리
			return;
		}

		if (oItem.Style == e_ItemStyle_DimensionLine && oItem.Height < 10) { // 기존데이터 예외처리
			oItem.Height = 25;
			oItem.Y = oItem.Y - 15;
		}
		if (oItem.LayerId == "L007" || oItem.LayerId == "L008" || oItem.LayerId == "L009" ) {
			oItem.Angle = 0;
		}
		var strVersion = $("#version").val();
		if (strVersion == "") {
			strVersion = 0;
		}
		if (firstDataFlag && parseInt(strVersion) < changeDate) {
			if (oItem.BackImage != null && oItem.Key == 0 && oItem.Angle > 0 ) {
				oItem.X = parseInt(oItem.X - oItem.Width);
				oItem.Y = parseInt(oItem.Y - oItem.Height);
			} else if (oItem.Key > -1 && oItem.Angle > 0 && oItem.Points.length > 0) {
				if (oItem.Angle == 90) {
					oItem.X = parseInt(oItem.X - (oItem.Width / 2) - (oItem.Height/2));
					oItem.Y = parseInt(oItem.Y + (oItem.Width/2) - (oItem.Height/2));
				} else if (oItem.Angle == 180) {
					oItem.X = parseInt(oItem.X - oItem.Width);
					oItem.Y = parseInt(oItem.Y - oItem.Height);
				} else if (oItem.Angle == 270) {
					oItem.X = parseInt(oItem.X + (oItem.Height / 2) - (oItem.Width/2));
					oItem.Y = parseInt(oItem.Y - (oItem.Height / 2) - (oItem.Width/2));
				}
			}
		}


		var nX = nParX + oItem.X;
		var nY = nParY + oItem.Y;
		var nW = oItem.Width;
		var nH = oItem.Height;
		//
		oItem.DrawX = nX;
		oItem.DrawY = nY;
		oItem.DrawW = nW;
		oItem.DrawH = nH;

		var clrBackColor = oItem.BackColor;
		if (oItem.Style == e_ItemStyle_Check) {
			if (oItem.Checked) {
				clrBackColor = oItem.CheckBackColor;
			}
			else {
				clrBackColor = oItem.UnCheckBackColor;
			}
		}// if
		else if (oItem.Style == e_ItemStyle_Text) {
			if (BoardInfo.EditMode == e_EditMode_EditPage) {
				if (oItem.Edit && bSelectedPage && bEditable) {
					clrBackColor = BoardInfo.TextEditBackColor;
				}
			}
			else {
				if (oItem.Edit) {
					//clrBackColor = BoardInfo.TextEditBackColor;
				}
			}
		}

		var trans_cx =  (parseInt(nX) + 0.5) + nW / 2;
		var trans_cy =  (parseInt(nY) + 0.5) + nH / 2;
		var angle = oItem.Angle;
		var alpha = oItem.Alpha;
		if (oItem.LayerId != layerArr[0]) alpha = "0.2";
		var borderColor = oItem.BorderColor;

		var rgbBorderColor =  GetDBToRGB(borderColor);
		borderColor = "rgba("+rgbBorderColor.red+", "+rgbBorderColor.green+", "+rgbBorderColor.blue+", 1)";

		if (portKeyBorderArr.indexOf("|"+oItem.Key+"|") != -1) {
			borderColor = "#04B4AE";
		}

		switch(oItem.Style) {
		case e_ItemStyle_Cell:
			var dottX =  nW / 5;
			var dottY =  nH / 5;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth + 3;
			context.moveTo(-nW/2, -nH/2 + nH);
			context.lineTo(-nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			// left Right
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth =  oItem.BorderWidth + 1;
			context.moveTo(-nW/2, -nH/2);
			context.lineTo(-nW/2, -nH/2 + nH);
			context.moveTo(-nW/2 + nW, -nH/2);
			context.lineTo(-nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			// curve
			context.beginPath();
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth =  oItem.BorderWidth + 2;
			context.moveTo(-nW/2 + nW, -nH/2);
			context.lineTo(-nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			// curve
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2 + nW, -nH/2);
			context.quadraticCurveTo(-nW/2, -nH/2, -nW/2, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();

			break;
		case e_ItemStyle_LeftDoors:
			// left Right
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth =  oItem.BorderWidth + 2;
			context.moveTo(-nW/2, -nH/2);
			context.lineTo(-nW/2, -nH/2 + nH);
	//		context.moveTo(-nW/2 + nW, -nH/2);
	//		context.lineTo(-nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			// curve
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2, -nH/2);
			context.quadraticCurveTo(-nW/2 + nW, -nH/2, -nW/2 + nW, -nH/2 + nH);
	//		context.moveTo(-nW/2 + nW/2, -nH/2 + nH);
	//		context.quadraticCurveTo(0, 0, -nW/2 + nW, -nH/2);
			context.stroke();
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_SlideDoor:
			var xW = nW/3;
			var yH = nH/2;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;

			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.fillStyle = "rgba(100,100,100,0.5)";
			context.fillRect(-nW/2, -nH/2, nW, nH);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth + 2;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			//context.strokeRect(-nW/2, -nH/2, nW, nH);

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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);

			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.strokeRect(-nW/2, -nH/2 + 4, nW, nH - 8);
			context.restore();
			context.closePath();



			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);

			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.strokeRect(-nW/2 + 4, -nH/2, nW - 8, nH);
			context.restore();
			context.closePath();

			break;

		case e_ItemStyle_AcPanel:
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.moveTo(-nW/2, -nH/2);
			context.lineTo(-nW/2, -nH/2 + nH);
			context.lineTo(-nW/2 +nW, -nH/2);
			context.fillStyle = borderColor;
			context.fill();
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2 +nW, -nH/2);
			context.lineTo(-nW/2 +nW, -nH/2 + nH);
			context.lineTo(-nW/2, -nH/2 + nH);
			context.strokeStyle = borderColor;
			context.stroke();
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_Circle:
			var kappa = .5522848;
			ox = (nW / 2) * kappa, // control point offset horizontal
			oy = (nH / 2) * kappa, // control point offset vertical
			xe = -nW/2 + nW,           // x-end
			ye = -nH/2 + nH,           // y-end
			xm = -nW/2 + nW / 2,       // x-middle
			ym = -nH/2 + nH / 2;       // y-middle
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.strokeStyle = borderColor;
			context.globalAlpha = alpha;
			context.lineWidth = oItem.BorderWidth;
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
			return;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);

			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			if (oItem.Key != 0) {
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2, nW, nH);
			}
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_EtcBox:
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_Generator:



			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2, nW, nH);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2 + 6, -nH/2 + 6, nW - 12, (nH) - 12);
			context.restore();
			context.closePath();


			var tmpW = nW/10;
			var tmpH = nH/10;

			var tmpW1 = nW/20;
			var tmpH1 = nH/20;

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
				context.beginPath();
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

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.beginPath();
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.fillStyle = borderColor;
				context.arc(-nW/2 + nW - 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
				context.closePath();

				context.beginPath();
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
			context.beginPath();
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

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.fillStyle = borderColor;
			context.fillRect(-nW/2 + 12, -nH/2 + 20, nW - 24, -10);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.fillStyle = borderColor;
			context.arc(-nW/2 + 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
			context.fill();
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.fillStyle = borderColor;
			context.arc(-nW/2 + 4, -nH/2 + nH - nH/4, 2, 0, 2 * Math.PI, false);
			context.fill();
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.fillStyle = borderColor;
			context.arc(-nW/2 + nW - 4, -nH/2 + nH/4, 2, 0, 2 * Math.PI, false);
			context.fill();
			context.restore();
			context.closePath();

			context.beginPath();
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

//			if (eleLinkeFlag) {
//				context.beginPath();
//				context.save();
//				context.translate(trans_cx, trans_cy);
//				context.rotate(angle*Math.PI/180);
//				context.globalAlpha = 0.5;
//				context.fillStyle = "#b40431";
//				context.lineWidth = oItem.BorderWidth;
//				context.fillRect(-nW/2, -nH/2, nW, nH);
//				context.restore();
//				context.closePath();
//			}
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
			context.restore();
			context.closePath();

			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.strokeRect(-nW/2, -nH/2 + nH, nW, 0);
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_beamPillar:
			var xW = nW/3;
			var yH = nH/2;
			var  intervalPxl = nW/3;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;

			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2, -nH/2);
			context.lineTo(-nW/2, -nH/2+nH);
			context.moveTo(-nW/2 + nW, -nH/2);
			context.lineTo(-nW/2 + nW, -nH/2+nH);
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2, -nH/2 + yH);
			context.lineTo(-nW/2 + nW, -nH/2 + yH);

			context.stroke();
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_Plus:
			var xW = nW/3;
			var yH = nH/3;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
				context.lineWidth = oItem.BorderWidth;
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
					oItem.BorderWidth = 4;
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
				var nDefX = 0;
				var nDefY = 0;
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
			context.beginPath();
			context.save();
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.strokeRect(parseInt(nX) + 0.5, parseInt(nY) + 0.5, nW, nH);
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_OjcCurve:
			var xW = nW/3;
			var yH = nH/3;
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.lineWidth = oItem.BorderWidth;
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
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2, -nH/2);
			context.quadraticCurveTo(-nW/2 + nW, -nH/2, -nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_Triangle:
			// Item labelx값은 상단 꼭지점 위치임(기능 변경임) --> 시작점기준으로 +함.(moveTo의 기준점)
			var vertex = 0;

			if (oItem.Points != "" && oItem.Points != undefined && oItem.Points != null) {
				vertex = oItem.Points;
			}
			context.beginPath();
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.moveTo(-nW/2 + vertex, -nH/2);
			context.lineTo(-nW/2, -nH/2 + nH);
			context.lineTo(-nW/2 + nW, -nH/2 + nH);
			context.stroke();
			context.restore();
			context.closePath();
			break;
		case e_ItemStyle_DimensionLine:
				return;
			break;
		case e_ItemStyle_Text:
			if (oItem.BorderWidth > 1) {
				context.beginPath();
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
			//console.log(oItem.Text+"----"+oItem.BorderWidth);
			break;
		}

		// 하위 아이템 출력
		if (oItem.Childs && oItem.Childs.length > 0) {
			DrawItems(context, null, oItem.Childs, bSelectedPage, bEditable, bPrintable)
		}


		var astrText = oItem.Text;//;
		if (ownerView) {
			astrText =  "1";	// 자릿수만 체크함.(문자자체가 배열처리되어서 자릿수만 체크하고 밑에서 처리)
		}
		//console.log(astrText +"----"+astrText.length);
		var cTextColor = oItem.TextColor;
		rgbFont =  GetDBToRGB(cTextColor);
		var cTextColor = "rgba("+rgbFont.red+", "+rgbFont.green+", "+rgbFont.blue+", 1)";

		var nTxtX = nX;
		var nTxtY = nY;
		var nTxtW = nW;
		var nTxtH = nH;

		// 텍스트 출력
		if (oItem.IsViewText && astrText && astrText.length > 0 && !oItem.IsEditing) {

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
					//console.log(oItem.Text);
					if (nOneW > nTxtW) {
						//console.log(oItem.SystemNm+"---"+asText2.length);
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
					//console.log(oItem.TextLineSpacing);
				}
				context.save();
				if (oItem != e_ItemStyle_Text) {
					context.rect(nX, nY, nW, nH);
				}
				context.clip();
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

