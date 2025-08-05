/**
 * DrawTool.js
 *
 * @author
 * @date 2017. 9. 28.
 * @version 1.0
 */

function setItemId(popItemID) {
	if (popItemID != null || popItemID != "") {
		alert(popItemID)
	}
}
$a.page(function() {
	var paramData = null;
	var cstrGubun = 0;					// 공사진행상태
	var cstrCd = "";						// 공사코드
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		var paramData = param;
		$("#sisulCd").val(paramData.sisulCd);
		$("#floorId").val(paramData.floorId);
		$("#version").val(paramData.version);
		$("#itemId").val(paramData.itemId);

		cstrGubun = paramData.cstrGubun;
		cstrCd = paramData.cstrCd;


		Initialize();
		Draw();
		DrawDataBind();
	};

	m_strPos = "";
	m_strStarted = "";
	BoardInfo = function() {};
	nIntervalKey9Count = 0;
	nIntervalKey9Handle = -1;
	var rptYn	= false;
	var stdNm2	= null;
	var undoDataTimeCk = 3000;
	var neFloorWidth = 0;
	var neFloorHeight = 0;
	var bgBaseUrl = "/";
	var bgUrl = "";
	var bgRotation = "";
	var bgWidth = "0";
	var bgHeight = "0";
	var bgX = 0;
	var bgY = 0;
	var lineWidth = 0;
	var lineColor = "rgba(0,0,0,1)";
	var InSideColor = "rgba(255,255,255,0)";
	var MouseWay = false;           						// 꼭지점 크기 변경
	var MouseCursor = 0;            						// 꼭지점 마우스 커서 변경
	var MouseDownStraight = false;

	var MouseDownMiddleClickYn = false;

	var StraightPositions = [];
	var MemoFocusOut_Key = [];      				// 마우스 왼쪽 클릭 후 move된 경우 선택되지 않는 경우를 대비해  현재 선택된 text box가 memo 일경우 강제 focusout하기 위함.

	var layerArr = [];										// Checked Layer값들을 정의함.
	var itemSisulArr = [];
	var portKeyArr = [];
	var floorkeyArr = [];
	var floorIdArr = [];
	var floorLinkArr = [];
	var floorLinkDelFlag = false;
	var portKeyBorderArr = [];
	var firstUrl = true;										// 처음 팝업되었을 경우 체크
	var firstDataFlag = true;
	var mobileMoveFlag = false;
	var mobileMoveItemKey = [];
	var lineSx, lineSy, lineEx, lineEy, lineBackup; // 직선 그리기 변수값
	var scaleFactor = 1.00;
	var scaleFactorText = 1.00;
	var baseX = 0;
	var baseY = 0;
	var baseScale = 26.45;
	var dimensionView = true;
	var dimensionAllView = false;
	var ownerView = false;
	var labelView = true;
	var isBackgroundImage = false;					// Background Image selected
	var isWindow = 0;										// Draw영역 창모드로 보기 위함.
	var baseOffsetTop = 20;								// 창모드 일경우 타이틀바 영역을 빼기 위함.
	var isWindowDown = false;
	var isWindowUp = false;
	var isResizeDown = false;
	var isResizeUp = false;
	var addItemWidth = 0;
	var addItemHeight = 0;
	var addItemZ = 0;
	var addItemType = "";
	var addItemTypeName = "";
	var itemSearchVal = "";
	var printMinX = 0;
	var printMinY = 0;
	var pirntTitle = "";
	var pirntSubTitle = "";
	var bookMarkAll = false;
	var newFloorFlag = false;
	var spaceFlag = false;
	var itemSnapFix = true;
	var itemSizeFix = false;									// 기본 아이템 픽스
	var itemSelectFlag = false;
	var itemRptInf	= false;
	var popTest = true;
	var equipmentSelectFlag = false;
	var equipmentSelectKey = "";
	var equipmentSelectRowNum = "0";
	var equipmentSelectIpdType = "A";
	var selectedItemMovingX = 0;
	var selectedItemMovingY = 0;
	var selectedItemMovingFlag = false;
	var label90 = true;
	var ipdArr = [];
	var acPanelArr = [];
	var rectifierArr = [];
	var rackInArr = [];
	var rackInTmpArr = [];
	var popUnitSize = "1";

	var baseDefX = 0;					// 직선 꼭지점 가로/세로 한방향으로 처리하기 위함.
	var baseDefY = 0;
	var baseDefCk = false;

	var snap = 20; 						//pixels to snap

	var scrollLeftX = 0;					// -좌표값을 인식하기 위함.
	var scrollLeftY = 0;

	var eleLinkeFlag = false;



	var autoDrawFlag = false;

	function Initialize() {

		$('#cstrStatCd').clear();
    	var option_data_cstr = [{cd: '0', cdNm: '선택하세요'},{cd: '1', cdNm: 'ENG SHEET 예약'},{cd: '2', cdNm: '장비 개통 등록'}]; //,{cd: '3', cdNm: '장비 개통 검증'}
		$('#cstrStatCd').setData({
            data:option_data_cstr
		});
		$('#cstrStatCd').val("0");

		$('#scaleFactor').clear();
		var option_data = [];
		for(var i=200; i > 0; i -= 2) {
			var tmpi = (i/100);
			var resObj = {cd : tmpi, cdNm : tmpi.toFixed(2)};
			option_data.push(resObj);
		}
		$('#scaleFactor').setData({ data : option_data, option_selected: '' });

		$('[id^="itemTrans"]').css('display','none');
		$('#btnLabel90').css('background-color','#fff');	// 라벨 바로보기
		itemSizeFix = true;
		$('#btnSnap').css('background-color','#ccc');
		itemSnapFix = true;
		$('#btnSize').css('background-color','#ccc');	// 기본적으로 아이템은 기본 크기로 그려지도록 처리;
		//localStorage.clear();									// 데이터 undo, redo를 위한 Storage
		var canvas = document.getElementById("Canvas1");
		// 이벤트
		$(document).keydown(function(e){
			var allowPageList = new Array('/DrawTool.do');
			var bBlockF5Key = true;
			for(number in allowPageList) {
				var regExp = new RegExp('^' + allowPageList[number] + '.*', 'i');
				if (regExp.test(document.location.pathname)) {
					bBlockF5Key = false;
					break;
				}
			}
			if(bBlockF5Key) {
				if(e.which == 116) {

				} else if (e.which == 82 && e.ctrlKey) {
					return false;
				} else if (e.which == 46) {
					if (itemSisulArr.length > 0) {
						if (BoardInfo.Selected.getIsExistItem()) {

							var oPage = GetPage(BoardInfo.Selected.PageKey);
							var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

							if (oPage && oPanel) {
								if (confirm("삭제하시겠습니까?") == false) {
									return;
								}// if
								var aoItems = [];
								for (var i = 0; i < oPanel.Items.length; i++) {
									var oItem = oPanel.Items[i];
									if (itemSisulArr.indexOf(oItem.Key.toString()) == -1) {
										aoItems.push(oItem);
									}
									else {
										if (oItem.Key != "0") {
											oPanel.Items[i] = null;
										} else {
											aoItems.push(oItem);
										}
									}
								}// for i

								oPanel.Items = aoItems;
								BoardInfo.Selected.Clear();
								BoardInfo.PropertiesWindow.Clear();

								oPage.Edit.setModify(true);

								Draw();
							}// if
						}// if
					}
				}
			}
		});
		$(window).resize(function() {
			CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height());
		})
		$('#imgRight').on('click', function(e) {
			var $this = $('#rightPeek');
			if ($this.hasClass('open')) {
				$this.animate ({
					right : 0
				}, 300).removeClass('open');
			} else {
				$this.animate ({
					right : '-300px'
				}, 300).addClass('open');
			}
		});

		$('#imgLeft').on('click', function(e) {
			var $this = $('#leftPeek');
			if ($this.hasClass('open')) {
				$this.animate ({
					left : 0
				}, 300).removeClass('open');
			} else {
				$this.animate ({
					left : '-300px'
				}, 300).addClass('open');

			}
		});
		$('#btnItemProperty').on('click', function(e) {
			EquipmentClear();
		});
		$('#btnEquipmentProperty').on('click', function(e) {
			EquipmentSelected();

		});
		$('#btnHistroy').on('click', function(e) {
			HistroySelected();

		});

		$('#btnbaseView').on('click', function(e) {
			baseX = $("#baseX").val();
			baseY = $("#baseY").val();
			scaleFactor = $("#scaleFactor").val();
			BoardInfo.Scroll.HScroll.Value = baseX - 2;
			BoardInfo.Scroll.VScroll.Value = baseY - 2;

			scaleFactorText = 1.00;
			$('#scaleTitle').text((Math.round(scaleFactorText * 100)).toString() + "%");
			SetScroll();
			Draw();
		});
		$('#btnbaseSave').on('click', function(e) {
			var result = confirm('도면 시작위치 및 배율 값을 저장하시겠습니까?');
			if(result) {
				var sisulCd = $("#sisulCd").val();
				var floorId = $("#floorId").val();

				baseX = $("#baseX").val();
				baseY = $("#baseY").val();
				scaleFactor = $("#scaleFactor").val();
				BoardInfo.Scroll.HScroll.Value = baseX - 2;
				BoardInfo.Scroll.VScroll.Value = baseY - 2;

				scaleFactorText = 1.00;
				$('#scaleTitle').text((Math.round(scaleFactorText * 100)).toString() + "%");
				SetScroll();
				Draw();


				var param = {sisulCd:sisulCd, floorId:floorId, scaleFactor:scaleFactor, baseX:baseX, baseY:baseY };
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseInfo', param, 'POST', 'UpdateBaseInfo');
			}
		});




		$('#btnSetup').on('click', function(e) {

			var sisulCd	= $('#sisulCd').val();
			var floorId	= $('#floorId').val();
			var param = {sisulCd : sisulCd, floorId : floorId};
			$a.popup({
				popid: 'EqpLkup',
				title: '기본 도면 설정',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawToolSetup.do?',
				data: param,
				modal: true,
				movable:true,
				windowpopup : false,
				width : 530,
				height : 700,
				callback : function(data) { // 팝업창을 닫을 때 실행
//
//					var modelId = $('#modelId').val()
//					//alert(modelId);
//					var param = {rackId:modelId};
//					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
				}
			});
		});



		$('#btnEqDetail').on('click', function(e) {
			var data = {itemId: $('#modelId').val(), unitSize : $('#unitSize').val()};
			$a.popup({
				popid: 'EqpDetail',
				title: '랙 실장 상세정보',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawRackEqpAttr.do',
				data: data,
				modal: true,
				movable:true,
				windowpopup : false,
				width : 1000,
				height : 850
			});
//			 $a.popup({
//				 title: '랙 실장 상세정보',
//				 url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawRackEqpAttr.do',
//				 data: data,
//				 iframe: false,
//				 windowpopup: true,
//				 modal: false,
//				 width : 1000,
//				 height : 750,
//			 });
		});

		$('#btnEqSave').on('click', function(e) {
			var layerGubun = $('#layerGubun').val();
			var modelId = $('#modelId').val();
			var lv1 = $('#lv1').val();
			var lv2 = $('#lv2').val();
			var lv3 = $('#lv3').val();
			var label = $('#label').val();
			var width = $('#width1').val();
			var length = $('#length1').val();
			var height = $('#height1').val();
			var csType = $('#csType').val();
			var vendor = $('#vendor').val();
			var modelNm = $('#modelNm2').val();
			var serial = $('#serial').val();
			var capacity = $('#capacity').val();
			var weight = $('#weight').val();
			var pFactor = $('#pFactor').val();
			var efficiency = $('#efficiency').val();
			var voltInput = $('#voltInput').val();
			var freqInput = $('#freqInput').val();
			var rvoltOutput = $('#rvoltOutput').val();
			var mcurrentOutput = $('#mcurrentOutput').val();
			var manager = $('#manager').val();
			var description = $('#description').val();
			var unitSize = $('#unitSize').val();
			var portCnt = $('#portCnt').val();

			var cstrStatCd = $('#cstrStatCd').val();
			var cstrCd = $('#cstrCd').val();

			var regId = $("#userId").val();
			if (regId == '' || regId == null || regId == undefined) {
				regId = 'TANGO-EC';
			}
			var param = {layerGubun:layerGubun, modelId:modelId, lv1:lv1, lv2:lv2, lv3:lv3, label:label, width:width, length:length, height:height, csType:csType, vendor:vendor, modelNm:modelNm, serial:serial, capacity:capacity, weight:weight, pFactor:pFactor, efficiency:efficiency, voltInput:voltInput, freqInput:freqInput, rvoltOutput:rvoltOutput, mcurrentOutput:mcurrentOutput, manager:manager, description:description, unitSize:unitSize, portCnt:portCnt, cstrStatCd:cstrStatCd, cstrCd:cstrCd, regId : regId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateEquipmentInfo', param, 'POST', 'UpdateEquipmentInfo2');
		});


//		$(document).on('click', 'input:checkbox[id="ckLayerId"]', function(e){
//			if (this.checked) {
//				this.checked = false;
//			} else {
//				this.checked = true;
//			}
//
//			if (this.checked) {
//				if (layerArr.indexOf(layerKey) == -1) {
//					layerArr.splice(0,0, layerKey);
//				}
//			} else {
//				var layerCheckedCount = $("input[id=ckLayerId]:checked").length;
//				if (layerCheckedCount < 1) {
//					alert("최소 1개의 레이어가 선택되어 있어야 합니다.");
//					this.checked = true;
//				} else {
//					if (layerArr.indexOf(layerKey) != -1) {
//						layerArr.splice(layerArr.indexOf(layerKey),1);
//					}
//				}
//			}
//
//
//			$("#data-baseItems tbody tr").removeClass("eClickLayerBackgroundColor");
//			$("#data-layers tbody tr").removeClass("eClickLayerBackgroundColor");
//			$("#"+layerArr[0]).addClass("eClickLayerBackgroundColor");
//			$("#layers").val(layerArr);
//			var param =  $("#searchForm").serialize();
//			// 아이템 리스트
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
//			//var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
//			var sPage = GetPage(1);
//			var sPageData = GetPageData(sPage, true);
//			SetCommand('DESIGN_PANEL_LOAD_LAYER', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', sPageData);
//
//		});
//		$('input:checkbox[id="ckLayerId"]').click(function() {
//			var ckKey = $(this).attr('value');
//			alert(ckKey+"---"+this.checked);
//			if (this.checked) {
//				this.checked = false;
//			} else {
//				this.checked = true;
//			}
//
//			if (this.checked) {
//				if (layerArr.indexOf(layerKey) == -1) {
//					layerArr.splice(0,0, layerKey);
//				}
//			} else {
//				var layerCheckedCount = $("input[id=ckLayerId]:checked").length;
//				if (layerCheckedCount < 1) {
//					alert("최소 1개의 레이어가 선택되어 있어야 합니다.");
//					this.checked = true;
//				} else {
//					if (layerArr.indexOf(layerKey) != -1) {
//						layerArr.splice(layerArr.indexOf(layerKey),1);
//					}
//				}
//			}
//		});


		$(document).on('click', "[id^='tblBt']", function(e){
			var itemHstSrno = $(this).attr('value');
			if (itemHstSrno == undefined || itemHstSrno == null || itemHstSrno == "") {
				itemHstSrno = "0";
			}
			var sisulCd = $("#sisulCd").val();
			var floorId = $("#floorId").val();
			var floorNm = pirntSubTitle;

			var paramData = {sisulCd :  sisulCd, floorId : floorId, floorNm : floorNm, itemHstSrno : itemHstSrno};
			$a.popup({
				title: '도면이력',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawPrintPop.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 1200,
				height : 1000,
				callback: function(data){

				}
			});
		});

		// 목록 레이어 체크시 레이어 배열을 순서에 맞게 처리
		$(document).on('click', "#data-layers tbody tr th", function(e){
			var layerKey = $(this).attr('value');
			//alert(autoDrawFlag);
			if (autoDrawFlag) {
				alert("Auto Drawing 완료 후 이용 가능합니다.");
			} else {
				$('input:checkbox[id="ckLayerId"]').each(function() {
					if (this.value == layerKey) {
						if (this.checked) {
							this.checked = false;
						} else {
							this.checked = true;
						}

						if (this.checked) {
							if (layerArr.indexOf(layerKey) == -1) {
								layerArr.splice(0,0, layerKey);
							}
						} else {
							var layerCheckedCount = $("input[id=ckLayerId]:checked").length;
							if (layerCheckedCount < 1) {
								alert("최소 1개의 레이어가 선택되어 있어야 합니다.");
								this.checked = true;
							} else {
								if (layerArr.indexOf(layerKey) != -1) {
									layerArr.splice(layerArr.indexOf(layerKey),1);
								}
							}
						}

						$("#data-baseItems tbody tr").removeClass("eClickLayerBackgroundColor");
						$("#data-layers tbody tr").removeClass("eClickLayerBackgroundColor");
						$("#data-layers tbody tr").removeClass("eClickLayerBackgroundColor");
						$("#"+layerArr[0]).addClass("eClickLayerBackgroundColor");
						$("#layers").val(layerArr);
						var param =  $("#searchForm").serialize();
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
						var sPage = GetPage(1);
						var sPageData = GetPageData(sPage, true);
						SetCommand('DESIGN_PANEL_LOAD_LAYER', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', sPageData);
					}
				});
			}

		});


		// 목록 레이어 체크시 레이어 배열을 순서에 맞게 처리
		$(document).on('click', "#data-layers tbody tr td", function(e){
			var layerKey = $(this).attr('value');
			if (autoDrawFlag) {
				alert("Auto Drawing 완료 후 이용 가능합니다.");
			} else {
				$('input:checkbox[id="ckLayerId"]').each(function() {
					if (this.value == layerKey) {
						if (!this.checked) {
							this.checked = true;
						}
						if (layerArr.indexOf(layerKey) != -1) {
							layerArr.splice(layerArr.indexOf(layerKey),1);
						}
						if (layerArr.indexOf(layerKey) == -1) {
							layerArr.splice(0,0, layerKey);
						}
					}
				});

				$("#data-baseItems tbody tr").removeClass("eClickLayerBackgroundColor");
				$("#data-layers tbody tr").removeClass("eClickLayerBackgroundColor");
				$("#data-layers tbody tr").removeClass("eClickLayerBackgroundColor");
				$("#"+layerArr[0]).addClass("eClickLayerBackgroundColor");
				$("#layers").val(layerArr);
				var param =  $("#searchForm").serialize();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
				var sPage = GetPage(1);
				var sPageData = GetPageData(sPage, true);
				SetCommand('DESIGN_PANEL_LOAD_LAYER', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', sPageData);
			}
		});

		// 시설현황 목록 클릭 이벤트
		$(document).on('click', "#data-facilities tbody tr", function(e){

			var itemKey = $(this).attr('value');
			$('input:checkbox[id="ckSisulItem"]').each(function() {
				if (this.value == itemKey) {
					if (this.checked) {
						this.checked = false;
					} else {
						this.checked = true;
					}
					if (this.checked) {
						if (itemSisulArr.indexOf(itemKey) == -1) {
							itemSisulArr.splice(0,0, itemKey);
						}
					} else {
						if (itemSisulArr.indexOf(itemKey) != -1) {
							itemSisulArr.splice(itemSisulArr.indexOf(itemKey),1);
						}
					}
				}
			});

			//var itemKey = $(this).attr('value');
			SetCommand("SELECT_CLEAR", "", "");
			//BoardInfo.ItemEditMode = e_ItemEditMode_None;
			//BoardInfo.AddItemStyle = e_ItemStyle_None;

			BoardInfo.Selected.PageKey = 1;
			BoardInfo.Selected.PanelKey = 1;
			BoardInfo.Selected.ItemKeys = [];
			BoardInfo.PropertiesWindow.ItemKeys = [];
			for (var j = 0; j < itemSisulArr.length; j++) {
				BoardInfo.Selected.ItemKeys.push(itemSisulArr[j]);
				BoardInfo.PropertiesWindow.ItemKeys.push(itemSisulArr[j]);
			}
			//retSelected = true;
			//SetPropertiesWindow();
			//MouseDownClear();

			$("#layderItemProperty").css('display','Inline');
			$("#layderbaseProperty").css('display','none');

			SetPropertiesWindow();

			if (itemSisulArr.length == 1) {
				SetPortItemList();
			} else {
				portKeyArr = [];
				portKeyBorderArr = [];
			}
			Draw();
		});


		$(document).on('click', 'input[id=ckLayerId]', function (e) {
			var ckFlag = this.checked;
			if (ckFlag) {
				this.checked = false;
			} else {
				this.checked = true;
			}
		});



		$('#btnAutoEng').on('click', function(e) {
			$a.popup({
				title: '상면 Eng. 기준',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdEngStd.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				width : window.innerWidth * 0.9,
				height : window.innerHeight * 0.9,
			});
		});



		$('#btnAutoDrawing').on('click', function(e) {


			if (layerArr[0] != 'L001') {
				alert("기초평면 레이어 선택 후 생성하세요.");
				return;
			}

			var sisulCd = $("#sisulCd").val();
			var floorId = $("#floorId").val();
			var nW1 = neFloorWidth/baseScale * 0.5;
			var nH1 = neFloorHeight/baseScale * 0.5;

			var oPage = GetPage(1);
			var oPanel = GetPanel(oPage, 1);

			var wWallFlag = false;
			var wDoorFlag = false;
			if (oPage && oPanel) {
				var aoItems = [];
				for (var i = 0; i < oPanel.Items.length; i++) {
					var oItem = oPanel.Items[i];
					if (oItem.ItemType == "wall") {
						wWallFlag = true;
					} else if (oItem.ItemType == "double_doors" || oItem.ItemType == "door_left" || oItem.ItemType == "door_right") {
						wDoorFlag = true;
					}
				}
			}
			if (wWallFlag == false || wDoorFlag == false) {
				alert("외벽 또는 문 정보가 없습니다. 먼저 외벽 및 문을 생성해 주세요.");
				return;
			}
			if ($("#btnAutoDrawing").hasClass("btAutoDraw") === true) {
				$("#btnAutoDrawing").removeClass("btAutoDraw");
				$("#btnAutoDrawing").addClass("btAutoDrawOver");
				$("#btnAutoDrawing").text("Auto Draw End");
			} else {
				$("#btnAutoDrawing").removeClass("btAutoDrawOver");
				$("#btnAutoDrawing").addClass("btAutoDraw");
				$("#btnAutoDrawing").text("Auto Draw Start");
				autoDrawFlag = false;
				Draw();
				return;
			}

			autoDrawFlag = true;
			var result = confirm('기존 Cell 정보는 삭제되며, 상면 Eng 기준 Cell 정보로 다시 그려집니다.\n또한 여러개의 출입문이 존재할 경우 임의의 출입문이 기준으로 설정됩니다.(1개만 선택가능)\n\n그래도 Auto Drawing 하시겠습니까?');
			if(result) {
				var oPage = GetPage(1);
				var oPanel = GetPanel(oPage, 1);
				if (oPanel) {
					var oWX = 0;
					var oWY = 0;
					var oWWidth = 0;
					var oWHeight = 0;

					var oDX = 0;
					var oDY = 0;
					var oDWidth = 0;
					var oDHeight = 0;
					var oDAngle	= 0;
					var oItemStartXY = 0;						// 0 : 왼쪽 위, 1 : 오른쪽 위, 2 : 오른쪽 아래, 3 : 외쪽 아래
					var wEngWallCellWidth = 1850 / baseScale;	// 외벽과 셀 간격
					BoardInfo.Selected.Clear();
					BoardInfo.Selected.PageKey = oPage.Key;
					BoardInfo.Selected.PanelKey = oPanel.Key;

					for (var i = 0; i < oPanel.Items.length; i++) {
						var oItem = oPanel.Items[i];
						if (oItem.ItemType == "cell") {
							BoardInfo.Selected.ItemKeys.push(oItem.Key);
						}
						if (oItem.ItemType == "wall") {
							oWX 		= parseInt(oItem.X) + 0.5;
							oWY 		= parseInt(oItem.Y) + 0.5;
							oWWidth  	= oItem.DrawW;
							oWHeight	= oItem.DrawH;
						}
						if (oItem.ItemType == "double_doors" || oItem.ItemType == "door_left" || oItem.ItemType == "door_right") {
							oDX 		= parseInt(oItem.X) + 0.5;
							oDY 		= parseInt(oItem.Y) + 0.5;
							oDWidth 	= oItem.DrawW;
							oDHeight 	= oItem.DrawH;
						}
					}

					if (oWX + (oWWidth/2) > oDX + (oDWidth/2)) {			// 외벽 가로 중심을 기준으로 왼쪽일 경우
						if (oWY + (oWHeight/2) > oDY + (oDHeight/2)) {		// 외벽 세로 중심을 기준으로 위쪽일 경우
							oItemStartXY = 0;
						} else {
							oItemStartXY = 3;
						}
					} else {
						if (oWY + (oWHeight/2) > oDY + (oDHeight/2)) {		// 외벽 세로 중심을 기준으로 위쪽일 경우
							oItemStartXY = 1;
						} else {
							oItemStartXY = 2;
						}
					}

					ItemDelete(false);
					var itemCell = $(":input:radio[name=rdCell]:checked").val();
					var iAngle = 0;
					var cellInWidth = 850 / baseScale;							// Cell간 거리
					BoardInfo.ItemEditMode = e_ItemEditMode_Add;
					BoardInfo.AddItemStyle = e_ItemStyle_Cell;
					addItemWidth = 800 / baseScale;
					addItemHeight = 700 / baseScale;
					addItemCell = 850 / baseScale;
					addItemZ = 0;
					addItemType = "cell";
					addItemTypeName = "셀";
					if (itemCell == 0) {										// 출입문 기분 세로 방향
						addItemWidth = 700 / baseScale;
						addItemHeight = 800 / baseScale;
					}
					if (oItemStartXY == 1) {
						if (itemCell == 0) {
							var oNX1 = oWX + wEngWallCellWidth;
							var oNY1 = oWY + oWHeight - wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1 - addItemHeight;

							for (var i = 0; i < 1000; i++) {
								if (nY1 < (oWY + wEngWallCellWidth)) {
									if (nX1 + addItemWidth + addItemWidth + addItemCell < (oWX + oWWidth - wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = nX1 + addItemWidth + addItemCell;
										nY1 = oNY1 - addItemHeight;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nY1 - addItemCell < (oWY + wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nY1 = nY1 - addItemHeight;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						} else {
							var oNX1 = oWX + wEngWallCellWidth;
							var oNY1 = oWY + oWHeight - wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1 - addItemHeight;

							for (var i = 0; i < 1000; i++) {
								if (nX1 + addItemWidth > (oWX  + oWWidth - wEngWallCellWidth)) {
									if (nY1 - addItemHeight - addItemCell > (oWY + wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = oNX1;
										nY1 = nY1 - addItemHeight - addItemCell;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nX1 + addItemWidth + addItemCell > (oWX + oWWidth - wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nX1 = nX1 + addItemWidth;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						}

					} else if (oItemStartXY == 0) {
						if (itemCell == 0) {
							var oNX1 = oWX + oWWidth - wEngWallCellWidth - addItemWidth;
							var oNY1 = oWY + oWHeight - wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1 - addItemHeight;

							for (var i = 0; i < 1000; i++) {
								if (nY1 < (oWY + wEngWallCellWidth)) {
									if (nX1 - addItemWidth - addItemCell > (oWX + wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = nX1 - addItemWidth - addItemCell;
										nY1 = oNY1 - addItemHeight;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nY1 - addItemHeight < (oWY + wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nY1 = nY1 - addItemHeight;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						} else {
							var oNX1 = oWX + oWWidth - wEngWallCellWidth - addItemWidth;
							var oNY1 = oWY + oWHeight - wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1 - addItemHeight;

							for (var i = 0; i < 1000; i++) {
								if (nX1 < (oWX + wEngWallCellWidth)) {
									if (nY1 - addItemHeight - addItemHeight > (oWY + wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = oNX1;
										nY1 = nY1 - addItemHeight - addItemCell;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nX1 - addItemCell < (oWX + wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nX1 = nX1 - addItemWidth;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						}

					} else if (oItemStartXY == 3) {
						if (itemCell == 0) {
							var oNX1 = oWX + oWWidth - wEngWallCellWidth - addItemWidth;
							var oNY1 = oWY + wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1;

							for (var i = 0; i < 1000; i++) {
								if (nY1 + addItemHeight > (oWY + oWHeight - wEngWallCellWidth)) {
									if (nX1 - addItemWidth - addItemWidth > (oWX + wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = nX1 - addItemWidth - addItemCell;
										nY1 = oNY1;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nY1 + addItemHeight + addItemCell > (oWY + oWHeight - wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nY1 = nY1 + addItemHeight;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						} else {
							var oNX1 = oWX + oWWidth - wEngWallCellWidth - addItemWidth;
							var oNY1 = oWY + wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1;

							for (var i = 0; i < 1000; i++) {
								if (nX1 < (oWX + wEngWallCellWidth)) {
									if (nY1 + addItemHeight + addItemHeight + addItemCell < (oWY + oWHeight - wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = oNX1;
										nY1 = nY1 + addItemHeight + addItemCell;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nX1 - addItemWidth < (oWX + wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nX1 = nX1 - addItemWidth;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						}
					} else if (oItemStartXY == 2) {
						if (itemCell == 0) {
							var oNX1 = oWX + wEngWallCellWidth;
							var oNY1 = oWY + wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1;

							for (var i = 0; i < 1000; i++) {
								if (nY1 + addItemHeight > (oWY + oWHeight - wEngWallCellWidth)) {
									if (nX1 + addItemWidth + addItemWidth + addItemCell < (oWX + oWWidth - wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = nX1 + addItemWidth + addItemCell;
										nY1 = oNY1;
										oItemText = "Reserve1";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nY1 + addItemHeight + addItemCell > (oWY + oWHeight - wEngWallCellWidth)) {
									oItemText = "Reserve2";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nY1 = nY1 + addItemHeight;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						} else {
							var oNX1 = oWX + wEngWallCellWidth;
							var oNY1 = oWY + wEngWallCellWidth;
							var nW1 = addItemWidth;
							var nH1 = addItemHeight;
							var oItemText = "Reserve";
							var oItemTextNum = 1;
							var tmpJ = 0;
							nX1 = oNX1;
							nY1 = oNY1;

							for (var i = 0; i < 1000; i++) {
								if (nX1 + addItemWidth > (oWX + oWWidth - wEngWallCellWidth)) {
									if (nY1 + addItemHeight + addItemHeight + addItemCell < (oWY + oWHeight - wEngWallCellWidth)) {
										oItemTextNum += 1;
										tmpJ = 0;
										nX1 = oNX1;
										nY1 = nY1 + addItemHeight + addItemCell;
										oItemText = "Reserve";
									} else {
										break;
									}
								}
								var oItem = NewItem(nX1, nY1, nW1, nH1);
								if (nX1 + addItemWidth + addItemWidth > (oWX + oWWidth - wEngWallCellWidth)) {
									oItemText = "Reserve";

								}
								oItem.Text[0] = oItemText;

								oItem.DrawX = nX1;
								oItem.DrawY = nY1;
								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.ItemType = addItemType;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.LayerId = "L001";
								oItem.IsSelectable = true;
								oPanel.Items.push(oItem);

								tmpJ = tmpJ + 1;
								nX1 = nX1 + addItemWidth;
								oItemText = oItemTextNum + "-" + tmpJ;

							}
						}
					}
					ItemEditModeClear();
					Draw();
					// 초기화
					addItemWidth = 0;
					addItemHeight = 0;
					addItemZ = 0;
					addItemType = "";
					addItemTypeName = "";
				}
			}

		});

		$('#floorA1').on('click', function(e) {
			alert();
//			var itemVal = $(this).attr('value');
//			alert(itemVal);
		});

		$('#itemSearch').on('click', function(e) {
			//if ($('#txtSearch').val() != "") {
			itemSearchVal = $('#txtSearch').val();
			var param =  $("#searchForm").serialize();

			// 아이템 리스트
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
			//}
		});

		$(document).on('click', "[id^='floorLayer'] a", function(e){
			var result = confirm('다른 층으로 이동합니다. 작업된 내용이 있을 경우 저장되지 않습니다.\n그래도 이동하시겠습니까?');
			if(result) {
				var strFloorId = $(this).attr('value');
				var floorId = strFloorId.split("|^@^|");
				$("#floorId").val(floorId[0]);
				$("#version").val(floorId[1]);
				$("#drawingDatas").val("");
				//$("#layers").val("");
				$("#loader").css('display','Inline');
				$("#sisulNm").html("");
				$("#layerConent").html("");

				clear();


				SetCommand("SELECT_CLEAR", "", "");

				portKeyArr = [];
				floorkeyArr = [];
				floorIdArr = [];
				floorLinkArr = [];
				floorLinkDelFlag = false;
				portKeyBorderArr = [];


				firstDataFlag = true;

				setTimeout(DrawDataBind(),3000);

				// Layers
				//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLayersList', '', 'GET', 'Layers');

			}
		});
		// 아이템 리스트 클릭시
		$(document).on('click', "#data-baseItems tbody tr", function(e){
			if (!autoDrawFlag) {
				var itemVal = $(this).attr('value');
				var asItemVal = itemVal.split("|^@@^|");
				//for (var i = 0; i < oPanel.Items.length; i++) {
				for (var i = 0; i < asItemVal.length; i++) {
					var asItemOption = asItemVal[i].split("|^@^|");
					var asItemOptionId = asItemOption[0];
					var asItemOptionVal = asItemOption[1];
					if (asItemOptionId == 'STYLE') {
						addItemType = asItemOptionVal;
					} else if (asItemOptionId == 'WIDTH') {
						addItemWidth = asItemOptionVal;
					} else if (asItemOptionId == 'HEIGHT') {
						addItemHeight = asItemOptionVal;
					} else if (asItemOptionId == 'LENGTH') {
						addItemZ = asItemOptionVal;
					}
					else if (asItemOptionId == 'TYPENAME') {
						addItemTypeName = asItemOptionVal;
					}
				}

				//$("#data-baseItems tbody tr td").addClass("eClickBackgroundColor");
				$("#data-baseItems tbody tr").removeClass("eClickLayerBackgroundColor");
				$(this).addClass("eClickLayerBackgroundColor");

				//data-baseItems

				var oPage = GetPage(1);
				var oPanel = GetPanel(oPage, 1);
				if (oPanel.Items.length == 1 && addItemType != "wall") {
					alert("레이어 >기초평면 > 외벽  항목을 먼저 선택하여 주시기 바랍니다.");
					return;
				}

				if (addItemType == "image" && addItemTypeName.indexOf("소화기") != -1) {
					addItemType = "haron_1ea";
				}
				BoardInfo.AddItemStyle = ConvertItemStyle(addItemType);

				//console.log(addItemType);
				if (addItemType == "cableline" || addItemType == "straightline") {
					BoardInfo.AddItemStyle = e_ItemStyle_None;
					SetCommand('DESIGN_PANEL_PEN_STRAIGHT', 'PEN_COLOR|^@^|255,255,0,1|^@@^|PEN_WIDTH|^@^|2', '');
				} else {
					SetCommand("SELECT_CLEAR", "", "");
					BoardInfo.ItemEditMode = e_ItemEditMode_Add;
				}
			}
		});
		$(document).on('change', 'input[id=ckBookMarkAll]', function (e) {
			var ckFlag = $(this).is(":checked");
			bookMarkAll = ckFlag;
			var param =  $("#searchForm").serialize();
			// 아이템 리스트
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
		});
		// 	아이템 목록 검색
		$(document).on('change', 'input[id^=chBookMarkId]', function (e) {
			var ckFlag = $(this).is(":checked");
			var ckVal = $(this).val();
			$("#itemId").val(ckVal);
			var param =  $("#searchForm").getData();
			if (ckFlag == true) {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertBookMark', param, 'POST', 'insertBookMark');
			}
			else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteBookMark', param, 'POST', 'deleteBookMark');
			}
			ItemEditModeClear();
		});




//		$('#btnNew_Panel').on('click', function(e) {
//		//SetCommand('DESIGN_PANEL_NEW', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', '');
//		});

		$('#btnPopClose').on('click', function(e) {
			$("#layerProperties").fadeOut();
		});
		$('#btnLine').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				BoardInfo.AddItemStyle = e_ItemStyle_None;
				addItemType = "straightline";
				SetCommand('DESIGN_PANEL_PEN_STRAIGHT', 'PEN_COLOR|^@^|255,255,255,1|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});
		$('#btnCurve').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "curveline";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_CURVE', 'PEN_COLOR|^@^|rgba(255,255,255,1)|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});
		$('#btnTriangle').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "triangle";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_TRIANGLE', 'PEN_COLOR|^@^|rgba(255,255,255,1)|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});
		$('#btnCircle').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "circle";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_CIRCLE', 'PEN_COLOR|^@^|rgba(0,0,0,1)|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});
		$('#btnRect').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "square";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_SQUARE', 'PEN_COLOR|^@^|rgba(0,0,0,1)|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});
		$('#btnText').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "text";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_ADD_TEXT', '', '');
			}
		});
		$('#btnDim_Line').on('click', function(e) {
			var ckFlag = BaseEqCheck();
			if (!ckFlag) {
				addItemType = "dimensionline";
				addItemWidth = 500;
				addItemHeight = 500;
				SetCommand('DESIGN_PANEL_DIMENSIONLINE', 'PEN_COLOR|^@^|rgba(0,0,0,1)|^@@^|PEN_WIDTH|^@^|1', '');
			}
		});

		$('#btnCell').on('click', function(e) {
			if (layerArr[0] == 'L001') {
				var ckFlag = BaseEqCheck();
				if (!ckFlag) {
					addItemType = "cell";
					addItemWidth = 1000;
					addItemHeight = 500;
					SetCommand('DESIGN_PANEL_CELL', '', '');
				}
			} else {
				alert("해당 아이템은 기초평면 레이어를 활성화후 아이템을 선택하여 주시기 바랍니다.");
			}

		});
		$('#eqpRoleDivCdList').on('change', function(e) {
			//var target = $("#eqpRoleDivCdList");
			var strTxt = this.options[this.selectedIndex].text;
			$("#rackEq_Name").val(strTxt);
		});

		$('#eqpTypeGubun1').on('change', function(e) {
			//var target = $("#eqpRoleDivCdList");
			var strTxt = this.options[this.selectedIndex].text;
			//$("#rackEq_Name").val(strTxt);
			// 장비타입 구분 중분류
			var supCd = {supCd : this.options[this.selectedIndex].value};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun2');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', '', 'GET', 'typeGubun3');
		});
		$('#eqpTypeGubun2').on('change', function(e) {
			//var target = $("#eqpRoleDivCdList");
			var strTxt = this.options[this.selectedIndex].text;
			//$("#rackEq_Name").val(strTxt);
			// 장비타입 구분 중분류
			var supCd = {supCd : this.options[this.selectedIndex].value};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun3');
		});

		$('#btnBackgroundImageNew').on('click', function(e) {
			if (layerArr[0] == 'L001') {
				var validFiles = ["bmp","gif","png","jpg","jpeg"];
				var backGroundImageFile = $("#backgroundImage");
				backGroundImageFile.val('');
				backGroundImageFile.click();
			} else {
				alert("해당 아이템은 기초평면 레이어를 활성화후 아이템을 선택하여 주시기 바랍니다.");
			}
		});
		$('#btnImageSelect').on('click', function(e) {
			if (layerArr[0] == 'L001') {
				SetCommand("SELECT_CLEAR", "", "");
				BoardInfo.Selected.PageKey = 1;
				BoardInfo.Selected.PanelKey = 1;
				BoardInfo.Selected.ItemKeys = [];
				BoardInfo.PropertiesWindow.ItemKeys = [];
				BoardInfo.Selected.ItemKeys.push('0');
				BoardInfo.PropertiesWindow.ItemKeys.push('0');
				SetPropertiesWindow();
				Draw();
			} else {
				alert("해당 아이템은 기초평면 레이어를 활성화후 아이템을 선택하여 주시기 바랍니다.");
			}
		});
		$('#btnImageDelete').on('click', function(e) {
			var result = confirm('배경 이미지를 삭제하시겠습니까?');
			if(result) {
				var paramData = $('#searchForm').getData();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteFloorBg', paramData, 'POST', '');
				var oPage = GetPage(1);
				var oPanel = GetPanel(oPage, 1);
				if (oPage && oPanel) {
					var oItem = GetItem(oPanel, 0);
					oItem.BackImage = null;
					oItem.BackImageString = "";
					oItem.IsVisible = false;
				}
				BoardInfo.Selected.Clear();
				Draw();
			}
		});
		$('#btnBackgroundImageSave').on('click', function(e) {
			var fileChk = $("#backgroundImage").val();
			if (fileChk == null || fileChk == "") {
				alert("업로드할 파일을 선택해 주세요");
				return;
			}
			var param =  $("#searchForm").getData();
			BoardInfo.Selected.Clear();
			BoardInfo.Selected.PageKey = 1;
			BoardInfo.Selected.PanelKey = 1;
			BoardInfo.Selected.ItemKeys.push(0);
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
			if (oPage && oPanel) {
				var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
				if (oItem.BackImageString != "" && oItem.Key == 0) {
					var data = oItem.BackImageString.replace(/^data:image\/(png|jpg);base64,/, "");
					var x = oItem.X;
					var y = oItem.Y;
					var width = oItem.Width;
					var height = oItem.Height;
					var rotation = oItem.Angle;

					param.x = x;
					param.y = y;
					param.width = width;
					param.height = height;
					param.rotation = rotation;
					param.bgData = data;
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setFloorBgUpload', param, 'POST', 'FloorBgUpload');
				} else {
					alert("바탕화면 아이템이 삭제되었거나 생성되지 않았습니다.");
				}
			}
		});

		$('#backgroundImage').on('change', function(e) {
			var Url = window.URL || window.webkitURL;
			var url = Url.createObjectURL(e.target.files[0]);
			var img = new Image();
			img.src = url;

			img.onload = function() {
				var nImgW = img.naturalWidth;
				var nImgH = img.naturalHeight;
				var canvas2 = document.getElementById("Canvas2");
				canvas2.setAttribute("width", nImgW);
				canvas2.setAttribute("height", nImgH);

				var context2 = canvas2.getContext("2d");
				context2.drawImage(img, 0, 0, nImgW, nImgH);

				BoardInfo.Selected.Clear();

				BoardInfo.Selected.PageKey = 1;
				BoardInfo.Selected.PanelKey = 1;
				BoardInfo.Selected.ItemKeys.push(0);
				Draw();
				var oPage = GetPage(BoardInfo.Selected.PageKey);
				var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
				if (oPage && oPanel) {

					for (var i = 0; i < oPanel.Items.length; i++) {
						var oItem = oPanel.Items[i];
						if (i == 0 ) {
							minX = oItem.X;
							maxX = oItem.X;
							minY = oItem.Y;
							maxY = oItem.Y;
						}
						else {
							minX = Math.min(minX, oItem.X);
							maxX = Math.max(maxX, oItem.X);
							minY = Math.min(minY, oItem.Y);
							maxY = Math.max(maxY, oItem.Y);
						}
					}
					var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
					oItem.X = minX;
					oItem.Y = minY;


					oItem.Width = maxX - minX;
					oItem.Height = maxY - minY;

					if (oItem.Width < 100 || oItem.Height < 100) {
						oItem.Width = neFloorWidth/baseScale;
						oItem.Height = neFloorWidth/baseScale;
					}

					oItem.IsVisible = true;
					oItem.BackImage = null;
					oItem.BackImageString = canvas2.toDataURL();
					oItem.BackImage = new Image();
					oItem.BackImage.onload = function() {
						Draw();
					}
					oItem.BackImage.src = oItem.BackImageString;

					//$('#btnBackgroundImageSave').trigger('click');
					//SetBgImge();
				}
			}
		});
		$('[id^="btnImageView"]').click(function() {
			BoardInfo.Selected.Clear();
			BoardInfo.Selected.PageKey = 1;
			BoardInfo.Selected.PanelKey = 1;
			BoardInfo.Selected.ItemKeys.push(0);
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
			if (oPage && oPanel) {
				var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
				if ((oItem.BackImageString.length > 100) && oItem.TypeName == "background") {
					oItem.IsVisible = (oItem.IsVisible == false) ? true : false;
					if (oItem.IsVisible == false) {
						$('#btnImageView2').css('background-color','#fff');
					} else {
						$('#btnImageView2').css('background-color','#ccc');
					}
				}
				BoardInfo.Selected.Clear();
			}
			Draw();
		});
		$('[id^="btnWindow"]').on('click', function(e) {
			isWindow = (isWindow == 0) ? 1 : 0;
			if (isWindow == 1) {

				$('#divMove').width($(window).width() - 700);
				$('#divMove').height($(window).height() - 300);
				$('#divMove').offset({top:100, left:320});						// Resize icon이 보이지 않아 다시 한번 호출하기 위함.
				$('#divWindowBar').css('border','1px solid #000');
				$('#divWindowBar').css('display','block');
				$('#divCanvas').css('border','1px solid #000');
				$('#btnWindow2').css('background-color','#ccc');
			}
			else {
				$('#divWindowBar').css('display','none');
				$('#divMove').offset({top:37, left:0});
				$('#divMove').width($(window).width());
				$('#divMove').height($(window).height());
				$('#divCanvas').css('width','100%;');
				$('#divCanvas').css('height','100%;');
				$('#btnWindow2').css('background-color','#999933');
			}

			CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height());
		});

		$('#divWindowBar').mousedown(function(e) {
			isWindowDown = true;
			$('#divMove').draggable({disabled:false, containment:'#areaLimit'});
		});
		$('#divWindowBar').mousemove(function(e) {
			if (isWindowDown == true) {
				$('#divMove').draggable({disabled:false, containment:'#areaLimit'});
			}
		});
		$('#divWindowBar').mouseup(function(e) {
			isWindowDown = false;
			isWindowUp = true;
			$('#divMove').draggable({disabled:true});
		});
		$('#divWindowBar').mouseout(function(e) {
			if (isWindowDown == true) {
				isWindowDown = false;
				$('#divMove').draggable({disabled:true});
			}
		});

		$('#moveHandle').mousedown(function(e) {
			window.addEventListener('mousemove', startResize, false);
			window.addEventListener('mouseup', stopResize, false);
		});
		var box = document.getElementById("divMove");
		function startResize(e) {
			box.style.width = (e.clientX - box.offsetLeft) + 'px';
			box.style.height = (e.clientY - box.offsetTop) + 'px';
			CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height());
		}
		function stopResize(e) {
			window.removeEventListener('mousemove', startResize, false);
			window.removeEventListener('mouseup', stopResize, false);
		}
		// 메뉴 이벤트
		$('[id^="btnFullScreen"]').on('click', function(e) {
			var elem = document.body;
			if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
				if (elem.requestFullScreen) {
					elem.requestFullScreen();
				} else if (elem.mozRequestFullScreen) {
					elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullScreen) {
					elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				} else if (elem.msRequestFullscreen) {
					elem.msRequestFullscreen();
				}
				$('#btnFullScreen2').css('background-color','#ccc');
			} else {
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				$('#btnFullScreen2').css('background-color','#999933');
			}
//			if (isWindow == 0) {
//	$('#divMove').width($(window).width());
//$('#divMove').height($(window).height());
//$('#divCanvas').css('width','100%;');
//$('#divCanvas').css('height','100%;');
//CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height());
//			}

		});

		$('[id^="btnSave"]').click(function() {
			var d = new Date();
			var Version = $('#version').val();
			var tmpVersion = d.getFullYear().toString()+NumberPad(d.getMonth() + 1, 2)+NumberPad(d.getDate(), 2)+NumberPad(d.getHours(), 2)+NumberPad(d.getMinutes(), 2);
			//console.log(Version+"===="+tmpVersion);
			if (Version == tmpVersion) {
				alert("중복 저장 방지를 위하여 1분이내 재 저장 할 수 없습니다.\n\n잠시 후 다시 시도 하여 주시기 바랍니다.");
			} else {
				$("#loader").css('display','Inline');
				SetCommand('DESIGN_PANEL_SAVE', '', '');
			}
		});

		$('[id^="btnPrint"]').click(function() {
			var sisulCd = $("#sisulCd").val();
			var floorId = $("#floorId").val();
			var floorNm = pirntSubTitle;
			var paramData = {sisulCd :  sisulCd, floorId : floorId, floorNm : floorNm};
			$a.popup({
				title: '도면인쇄',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawPrintPop.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 1200,
				height : 1000,
				callback: function(data){

				}
			});


		});

		$('[id^="btnCopy"]').click(function() {
			if (BoardInfo.Selected.getIsExistItem) {
				// 선택아이템 Copy
				ItemCopy();
			} else {
				//alert("선택된 아이템이 없습니다.");
				alert("선택된 아이템이 없습니다.");
			}
		});
		$('[id^="btnPaste"]').click(function() {
			ItemPaste(e_PasteStyle_None, 0, 0);
		});

		$('[id^="btnDel"]').click(function() {
			ItemDelete(false);
		});

		$('[id^="btnUndo"]').click(function() {
			var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
			var sPageData = GetPageData(sPage, true);
			undoData(sPageData);
		});
		$('[id^="btnRedo"]').click(function() {
			var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
			var sPageData = GetPageData(sPage, true);
			redoData(sPageData);
		});
		$('[id^="btnAlign"]').click(function() {
			var id = this.id;
			if (BoardInfo.Selected.getIsExistItem) {
				var oPage = GetPage(BoardInfo.Selected.PageKey);
				var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
				if (oPage && oPanel) {
					var minX = 0;
					var minY = 0;
					var maxX = 0;
					var maxY = 0;
					for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
						var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[i]);
						if (i == 0 ) {
							minX = oItem.X;
							maxX = oItem.X;
							minY = oItem.Y;
							maxY = oItem.Y;
						} else {
							minX = Math.min(minX, oItem.X);
							maxX = Math.max(maxX, oItem.X);
							minY = Math.min(minY, oItem.Y);
							maxY = Math.max(maxY, oItem.Y);
						}
					}// for i
					for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
						var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[i]);
						if (id == 'btnAlignLeft') {
							oItem.X = minX;
						} else if (id == 'btnAlignRight') {
							oItem.X = maxX;
						} else if (id == 'btnAlignTop') {
							oItem.Y = minY;
						} else {
							oItem.Y = maxY;
						}
					}// for i
					Draw();
				}
			} else {
				//alert("선택된 아이템이 없습니다.");
				alert("선택된 아이템이 없습니다.");
			}
		});
		$('#btnDimension').on('click', function(e) {
			dimensionView = (dimensionView == false) ? true : false;
			Draw();
			if (!dimensionView) {
				$('#btnDimension').css('background-color','#ffff');
			} else {
				$('#btnDimension').css('background-color','#ccc');
			}
		});

		$('#btnDimension2').on('click', function(e) {
			dimensionAllView = (dimensionAllView == false) ? true : false;
			Draw();
			if (dimensionAllView) {
				$('#btnDimension2').css('background-color','#ffff');
			} else {
				$('#btnDimension2').css('background-color','#ccc');
			}
		});

		$('#btnOwner').on('click', function(e) {
			ownerView = (ownerView == false) ? true : false;
			Draw();
			if (ownerView) {
				$('#btnOwner').css('background-color','#ccc');
			} else {
				$('#btnOwner').css('background-color','#999933');
			}
		});

		$('#btnLabel').on('click', function(e) {
			labelView = (labelView == false) ? true : false;
			Draw();
			if (!labelView) {
				$('#btnLabel').css('background-color','#ffff');
			} else {
				$('#btnLabel').css('background-color','#ccc');
			}
		});
		$('#btnLabel90').on('click', function(e) {
			label90 = (label90 == false) ? true : false;
			Draw();
			if (label90) {
				$('#btnLabel90').css('background-color','#ffff');
			} else {
				$('#btnLabel90').css('background-color','#ccc');
			}
		});
		$('#btnLabelView').on('click', function(e) {
			labelView = (labelView == false) ? true : false;
			Draw();
			if (!labelView) {
				$('#btnLabel').css('background-color','#ffff');
			} else {
				$('#btnLabel').css('background-color','#ccc');
			}
//			labelView = true;
//			Draw();
//			$('#btnLabel').css('background-color','#ffff');
		});
		$('#btnLabelHidden').on('click', function(e) {
			labelView = false;
			Draw();
			$('#btnLabel').css('background-color','#ccc');
		});
		$('#btnDimensionView').on('click', function(e) {
			dimensionView = (dimensionView == false) ? true : false;
			Draw();
			if (!dimensionView) {
				$('#btnDimension').css('background-color','#ffff');
			} else {
				$('#btnDimension').css('background-color','#ccc');
			}
//
//
//			dimensionView = true;
//			Draw();
//			$('#btnDimension').css('background-color','#ffff');
		});
		$('#btnDimensionHidden').on('click', function(e) {
			dimensionView = false;
			Draw();
			$('#btnDimension').css('background-color','#ccc');
		});
		$('#btnLayerAdmin').on('click', function(e) {
			//SetCommand('DESIGN_PANEL_SAVE', '', '');
		});
		$('#btnFloorEdit').on('click', function(e) {
			var paramData = $('#searchForm').getData();
			paramData.insert = 'U';
			$a.popup({
				title: '층관리',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawMtsoFloorPop.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 440,
				height : 370,
				callback: function(data){
					if (data.Result == 'Success') {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorInfo', paramData, 'GET', 'Floor');
					}
				}
			});
			//SetCommand('DESIGN_PANEL_SAVE', '', '');
		});
		$('#btnFloorAdd').on('click', function(e) {
			var paramData = $('#searchForm').getData();
			paramData.insert = 'I';
			$a.popup({
				title: '층관리',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawMtsoFloorPop.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 440,
				height : 370,
				callback: function(data){
					if (data.Result == 'Success') {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorInfo', paramData, 'GET', 'Floor');
					}
				}
			});
		});
		$('#btnFloorDel').on('click', function(e) {
			var result = confirm('층 정보를 삭제하시겠습니까?');
			if(result) {
				var paramData = $('#searchForm').getData();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteDrawMstoFloor', paramData, 'POST', '');
			}
		});
		$('#btnLoad').on('click', function(e) {
			var paramData = $('#searchForm').getData();
			$a.popup({
				title: '상면불러오기',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawUpsdLoadPop.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 800,
				height : 500,
				callback: function(data){

				}
			});
		});
		$('#btnSize').on('click', function(e) {
			itemSizeFix = (itemSizeFix == false) ? true : false;
			Draw();
			if (itemSizeFix){
				$("#itemWidth").disabled = true;
				$("#itemHeight").disabled = true;
				$('#btnSize').css('background-color','#ccc');
			} else {
				$("#itemWidth").disabled = false;
				$("#itemHeight").disabled = false;
				$('#btnSize').css('background-color','#999933');
			}
		});

		$('#btnSnap').on('click', function(e) {
			itemSnapFix = (itemSnapFix == false) ? true : false;
			if (itemSnapFix){
				$('#btnSnap').css('background-color','#ccc');
			} else {
				$('#btnSnap').css('background-color','#999933');
			}
		});



		$('[id^="btnPicture"]').click(function() {
			var paramData = $('#searchForm').getData();
			$a.popup({
				title: '실사 사진',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawRealPic.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 800,
				height : 500
			});
		});
		$('#btnLayerAdmin').on('click', function(e) {
			var paramData = $('#searchForm').getData();
			$a.popup({
				title: '레이어 관리',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawLayerMgmt.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				width : 500,
				height : 600,
				callback: function(data){
					if (data.Result == 'Success') {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLayersList', '', 'GET', 'Layers');
					}
				}
			});
		});
		$('[id^="btnRequest"]').on('click', function(e) {
			var paramData = $('#searchForm').getData();
			$a.popup({
				title: '요청/승인',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdUseAprvMgmt.do',
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: false,
				resizable:false,
				width : 1000,
				height : 830,
			});
		});

		$('#btnHelp').on('click', function(e) {
			$a.popup({
				title: '도움말',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawToolHelp.do',
				data: paramData,
				iframe: false,
				modal: false,
				movable:true,
				windowpopup: true,
				resizable:false,
				width : 450,
				height : 320
			});
			//$a.draggable({disabled:false});
		});
		$('[id^="btnSpace"]').on('click', function(e) {
			spaceFlag = (spaceFlag == false) ? true : false;
			Draw();
			if(spaceFlag) {
				$('#btnSpace2').css('background-color','#ccc');
			} else {
				$('#btnSpace2').css('background-color','#999933');
			}
		});

		// 속성창 변경 이벤트
		$('#itemX').change(function(e) {
			var x = $("#itemX").val();
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'X', x);
		});
		$('#itemY').change(function(e) {
			var y = $("#itemY").val();
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Y', y);
		});

		$('#itemWidth').change(function(e) {
			var oWidth = $("#itemWidth").val();
//			if (!itemSizeFix) {
//				SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Width', oWidth);
//			} else {
//				alert("상단 메뉴중 아이템 크기고정 해제 후 입력하세요.");
//			}
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Width', oWidth);
		});
		$('#itemHeight').change(function(e) {
			var oHeight = $("#itemHeight").val();
//			if (!itemSizeFix) {
//				SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Height', oHeight);
//			} else {
//				alert("상단 메뉴중 아이템 크기고정 해제 후 입력하세요.");
//			}
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Height', oHeight);
		});
		$("#itemText").keyup( function() {
			var label = $("#itemText").val();
			if (label.length > 80) {
				label = label.substring(1,75) + "..";
			}
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Text', label);
		});
		$('#itemAngleRange').change(function(e) {
			$("#itemAngle").val($('#itemAngleRange').val());
			var angle = $("#itemAngle").val();
				SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Angle', angle);
		});
		$('#itemAngle').change(function(e) {
			$("#itemAngleRange").val($('#itemAngle').val());
			var angle = $("#itemAngle").val();
				SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Angle', angle);
		});
		$('#itemFontColor').change(function(e) {
			var fontColor = $("#itemFontColor").val();
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'TextColor', fontColor);
		});
		$('#itemBorderColor').change(function(e) {
			var lineColor = $("#itemBorderColor").val();
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'BorderColor', lineColor);
		});
		$('#itemFontSize').change(function(e) {
			var fontSize = $("#itemFontSize").val() + "px 돋음";
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'TextFont', fontSize);
		});
		$('#itemBorderWidth').change(function(e) {
			var borderWidth = $("#itemBorderWidth").val();
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'BorderWidth', borderWidth);
		});
		$('#itemTrans').change(function(e) {
			var alpha = $("#itemTrans").val();
			var sisulCd =  $("#sisulCd").val();
			var floorId =  $("#floorId").val();
			var param = {sisulCd:sisulCd, floorId:floorId, alpha:alpha};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateFloorBg', param, 'POST', 'UpdateFloorBg');
			SetCommand('DESIGN_ITEM_PROPERTY_CHANGE', 'Alpha', alpha);

		});

		if (canvas.addEventListener) {
			canvas.addEventListener ("mousewheel", OnEvtMouseWheel, false);
			canvas.addEventListener ("keydown", OnEvtKeyDown, false);
			canvas.addEventListener ("keyup", OnEvtKeyUp, false);
			canvas.addEventListener ("DOMMouseScroll", OnEvtMouseWheel, false);
		}
		else {
			if (canvas.attachEvent) {
				canvas.attachEvent ("onmousewheel", OnEvtMouseWheel);
			}
		}

		canvas.onmousemove = OnEvtMouseMove;
		canvas.onmousedown = OnEvtMouseDown;
		canvas.onmouseup = OnEvtMouseUp;
		canvas.onmouseout = OnEvtMouseOut;
		canvas.ondblclick = OnEvtDblClick;
		document.onscroll = OnEvtScroll;


		InitializeMember();
		InitializeBoard();

		m_strStarted = "STARTED";
		SetCommand('DESIGN_PANEL_NEW', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', '');
		CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height())


		$(document).on('click', '[id^="subTdIpdA"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			for (var i = 1; i < rowCount; i++) {
				if (trKey == i) {
					if ($("#tdIpd-datasA"+i).hasClass("eClickBackgroundColor")) {
						$("#tdIpd-datasA"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 등록하고자 하는 PORT번호를 선택하세요.");
					} else {
						$("#tdIpd-datasA"+i).addClass("eClickBackgroundColor");
						equipmentSelectFlag = true;
						equipmentSelectIpdType = "A";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdIpd-datasA"+i).removeClass("eClickBackgroundColor");
				}
				$("#tdIpd-datasB"+i).removeClass("eClickBackgroundColor");
			}
		});
		$(document).on('click', '[id^="subTdIpdB"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');

			for (var i = 1; i < rowCount; i++) {
				if (trKey == i) {
					if ($("#tdIpd-datasB"+i).hasClass("eClickBackgroundColor")) {
						$("#tdIpd-datasB"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 등록하고자 하는 PORT번호를 선택하세요.");
					} else {
						$("#tdIpd-datasB"+i).addClass("eClickBackgroundColor");
						equipmentSelectFlag = true;
						equipmentSelectIpdType = "B";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdIpd-datasB"+i).removeClass("eClickBackgroundColor");
				}
				$("#tdIpd-datasA"+i).removeClass("eClickBackgroundColor");
			}
		});
		$(document).on('click', '[id^="spanDelete"]', function(e){
			var conFirm = confirm("아이템을 삭제하시겠습니까?");
			if(conFirm) {
				var trKey = $(this).attr('value');
				var modelId = $("#modelId").val();
				var strIpd = trKey.split(":");
				var type = strIpd[0];
				var pos = strIpd[1];

				var param = {inId:modelId, type:type, pos:pos};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteIpdInfo', param, 'POST', 'DeleteIpdInfo');
				//EquipmentSelected();
			}
		});

		$(document).on('click', '[id^="subTdAcPanelL"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			$("#tdAcPanel-datasC0").removeClass("eClickBackgroundColor");
			for (var i = 1; i < rowCount; i++) {
				if (trKey == i) {
					if ($("#tdAcPanel-datasL"+i).hasClass("eClickBackgroundColor")) {
						$("#tdAcPanel-datasL"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 등록하고자 하는 PORT번호를 선택하세요.");
					} else {
						$("#tdAcPanel-datasL"+i).addClass("eClickBackgroundColor");

						equipmentSelectFlag = true;
						equipmentSelectIpdType = "L";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdAcPanel-datasL"+i).removeClass("eClickBackgroundColor");
				}
				$("#tdAcPanel-datasR"+i).removeClass("eClickBackgroundColor");
			}
		});

		$(document).on('change', '[id^="floorLink"]', function(e){
			var result = confirm('연결 또는 해제 하시겠습니까?');
			if(result) {
				floorLinkDelFlag = true;
				var inId = $('#modelId').val();
				var outId = $(this).val();
				var amp = 0;						// 연결 층 id
				if (!isNaN(outId)) {
					var type = 'F';
					var pos = outId;	// 선택하세요 선택 시 해당 floorid 값으로 pos를 지정해 삭제한다.
					var param = {inId:inId, type:type, pos:pos};

					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteAcPanelInfo', param, 'POST', 'DeleteAcPanelInfo');
				} else {
					var tmpPos = 0;
					if (floorLinkArr.length > 0) {
						for (var j = 0; j < floorLinkArr.length; j++) {
							if (outId == floorLinkArr[j].itemId) {
								if (!isNaN(parseInt(floorLinkArr[j].floorId))) {
									tmpPos = parseInt(floorLinkArr[j].floorId);
									break;
								}
							}
						}
					}
					var pos = tmpPos;
					var label = 'FloorLink';
					var type = 'F';	// 임의 적용

					var param = {inId:inId, outId:outId, pos:pos, label:label, type:type, amp:amp};
					//console.log(param);
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateAcPanelInfo', param, 'POST', 'saveAcPanel');
				}
			}
		});




		$(document).on('click', '[id^="subTdAcPanelR"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			$("#tdAcPanel-datasC0").removeClass("eClickBackgroundColor");
			for (var i = 1; i < rowCount; i++) {
				if (trKey == i) {
					if ($("#tdAcPanel-datasR"+i).hasClass("eClickBackgroundColor")) {
						$("#tdAcPanel-datasR"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 등록하고자 하는 PORT번호를 선택하세요.");
					} else {
						$("#tdAcPanel-datasR"+i).addClass("eClickBackgroundColor");
						equipmentSelectFlag = true;
						equipmentSelectIpdType = "R";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdAcPanel-datasR"+i).removeClass("eClickBackgroundColor");
				}
				$("#tdAcPanel-datasL"+i).removeClass("eClickBackgroundColor");
			}
		});
		$(document).on('click', '[id^="subTdAcPanelC"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			if (trKey == 0) {
				if ($("#tdAcPanel-datasC0").hasClass("eClickBackgroundColor")) {
					$("#tdAcPanel-datasC0").removeClass("eClickBackgroundColor");
					equipmentSelectFlag = false;

					//$("#spanMessege").html("  ■ 등록하고자 하는 PORT번호를 선택하세요.");
				} else {
					$("#tdAcPanel-datasC0").addClass("eClickBackgroundColor");
					equipmentSelectFlag = true;
					equipmentSelectIpdType = "C";
					equipmentSelectRowNum = 0;
					$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
				}
				for (var i = 1; i < rowCount; i++) {
					$("#tdAcPanel-datasL"+i).removeClass("eClickBackgroundColor");
					$("#tdAcPanel-datasR"+i).removeClass("eClickBackgroundColor");
				}
			} else {
				$("#tdAcPanel-datasC0").removeClass("eClickBackgroundColor");
			}
		});
		$(document).on('keyup', '[id^="acPanelInput"]', function(e){
			var tmpAmp = $(this).val();

			if (isNaN(tmpAmp) == false) {
				if (tmpAmp.length > 0) {

					var id = $(this).attr('id').split("_");

					var inId = $('#modelId').val();
					var pos = id[2];
					var type = id[1];
					var amp = tmpAmp;
					var param = {inId:inId, pos:pos, type:type, amp:amp, ampGubun:1};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateAcPanelInfo', param, 'POST', 'saveAcPanel');
					equipmentSelectFlag = false;
					$("#tdAcPanel-datasL"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
					$("#tdAcPanel-datasR"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
					$("#tdAcPanel-datasC"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
				}
			} else {
				alert("숫자만 입력가능합니다.")
			}

		});


		$(document).on('click', '[id^="spanAcDelete"]', function(e){
			var conFirm = confirm("아이템을 삭제하시겠습니까?");
			if(conFirm) {
				var trKey = $(this).attr('value');
				var modelId = $("#modelId").val();
				var strIpd = trKey.split(":");
				var type = strIpd[0];
				var pos = strIpd[1];

				var param = {inId:modelId, type:type, pos:pos};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteAcPanelInfo', param, 'POST', 'DeleteAcPanelInfo');
				//EquipmentSelected();
			}
		});



		$(document).on('keyup', '[id^="newRectifierInput"]', function(e){
			var tmpAmp = $(this).val();

			if (isNaN(tmpAmp) == false) {
				if (tmpAmp.length > 0) {

					var id = $(this).attr('id').split("_");

					var inId = $('#modelId').val();
					var pos = id[1];
					var type = "U";
					var amp = tmpAmp;
					var param = {inId:inId, pos:pos, type:type, amp:amp, ampGubun:1};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateNewRectifierInfo', param, 'POST', 'saveNewRectifier');
					equipmentSelectFlag = false;
				}
			} else {
				alert("숫자만 입력가능합니다.")
			}

		});

		$(document).on('click', '[id^="subTdRectifier"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			for (var i = 1; i < 41; i++) {
				//CRS1800
				if ($('#lv3').val() != "MR1" || ($('#lv3').val() == "MR1" && (i == 1 || i == 2  || i == 3 || i == 4 || i == 5 || i == 6 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11 || i == 12 || i == 13 || i == 14 || i == 15 || i == 26 || i == 27 || i == 28 || i == 29 || i == 30 || i == 31 || i == 32 || i == 33 || i == 34 || i == 35 || i == 36 || i == 37 || i == 38 || i == 39 || i == 40))) {
					if (trKey == i) {
						if ($("#tdRectifier-datas"+i).hasClass("eClickBackgroundColor")) {
							$("#tdRectifier-datas"+i).removeClass("eClickBackgroundColor");
							equipmentSelectFlag = false;

							$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br> ■ 등록하고자 하는 PORT번호를 선택하세요.");
						} else {
							$("#tdRectifier-datas"+i).addClass("eClickBackgroundColor");
							equipmentSelectFlag = true;
							equipmentSelectIpdType = "0";
							equipmentSelectRowNum = i;
							$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
						}
					} else {
						$("#tdRectifier-datas"+i).removeClass("eClickBackgroundColor");
					}
				}
			}
		});

		$(document).on('click', '[id^="spanRectifierDelete"]', function(e){
			var conFirm = confirm("아이템을 삭제하시겠습니까?");
			if(conFirm) {
				var trKey = $(this).attr('value');
				var modelId = $("#modelId").val();
				var param = {inId:modelId, amp:trKey};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRectifierInfo', param, 'POST', 'DeleteRectifierInfo');
				//EquipmentSelected();
			}
		});



		$(document).on('click', '[id^="tdNewRectifier-datas"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			for (var i = 1; i < 60; i++) {
				//CRS1800
				if (trKey == i) {
					if ($("#tdNewRectifier-datas"+i).hasClass("eClickBackgroundColor")) {
						$("#tdNewRectifier-datas"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br> ■ 등록하고자 하는 PORT번호 또는 장비를 선택하세요.");
					} else {
						$("#tdNewRectifier-datas"+i).addClass("eClickBackgroundColor");
						equipmentSelectFlag = true;
						equipmentSelectIpdType = "0";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdNewRectifier-datas"+i).removeClass("eClickBackgroundColor");
				}
			}
		});
		$(document).on('click', '[id^="subTdNewRectifier"]', function(e){
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			for (var i = 1; i < 60; i++) {
				//CRS1800
				if (trKey == i) {
					if ($("#tdNewRectifier-datas"+i).hasClass("eClickBackgroundColor")) {
						$("#tdNewRectifier-datas"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;

						$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br> ■ 등록하고자 하는 PORT번호를 선택하세요.");
					} else {
						$("#tdNewRectifier-datas"+i).addClass("eClickBackgroundColor");
						equipmentSelectFlag = true;
						equipmentSelectIpdType = "0";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■  연결하고자 하는 아이템을 도면에서 선택하세요.<br>  ■ 연결된 아이템이 있을 경우 <font style='color:red;'>삭제</font> 후 연결하세요.");
					}
				} else {
					$("#tdNewRectifier-datas"+i).removeClass("eClickBackgroundColor");
				}
			}
		});

		$(document).on('click', '[id^="newRectifierDelete"]', function(e){
			var conFirm = confirm("아이템을 삭제하시겠습니까?");
			if(conFirm) {
				var trKey = $(this).attr('value');
				var modelId = $("#modelId").val();
				var param = {inId:modelId, amp:trKey};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRectifierInfo', param, 'POST', 'DeleteNewRectifierInfo');
				//EquipmentSelected();
			}
		});

		$(document).on('click', '[id^="subTdRackA"]', function(e){
			var tmpi = 0;
			var tmpri = 0;
			var sPos = 0;
			var ePos = 0;
			var sUnit = 0;
			var dismantleFlag = "";
			var barcodeFlag = "";
			var selectPos = 0;
			var eqpId = "";
			$("#rackEq_inFlag").val("N");
			$("#rackEq_Name").val("");
			$("#rackEq_Unit").val("");
			var unitSize = $('#unitSize').val();
			//alert(unitSize);
			if (unitSize == "" || unitSize == null || unitSize == undefined) {
				unitSize = 1;
			}
			var maxNum = unitSize + 1;
			var rowCount = $('#mytable > tbody > tr').length;
			var trKey = $(this).attr('value');
			for (var i = 1; i < maxNum; i++) {
				if (trKey == i) {
					if ($("#tdRack-datasA"+i).hasClass("eClickBackgroundColor")) {
						$("#eqpTypeGubun1").show();
						$("#eqpTypeGubun2").show();
						$("#eqpTypeGubun3").show();
						$("#eqp_Dis").show();
						$("#eqp_Dis").val('');
						$("#rackEq_Cd").val('');
						$("#tdRack-datasA"+i).removeClass("eClickBackgroundColor");
						equipmentSelectFlag = false;
						$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>  ■ 등록하고자 하는 랙번호를 선택하세요.");
					} else {
						// 장비타입 구분 대분류
						var supCd = {supCd : 'D00001'};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun1');
						$('#eqpTypeGubun2').clear();
						$('#eqpTypeGubun3').clear();
						var option_data = [{cd: '', cdNm: '중분류'}];
						$('#eqpTypeGubun2').setData({
							data : option_data
						});
						var option_data2 = [{cd: '', cdNm: '소분류'}];
						$('#eqpTypeGubun3').setData({
							data : option_data2
						});



						$("#tdRack-datasA"+i).addClass("eClickBackgroundColor");
						var label = "";
						for (var j = 0; j < rackInArr.length; j++) {
							var strRackIn = rackInArr[j].split(":");
							sPos = strRackIn[0];
							ePos =  strRackIn[1];
							if (sPos == i) {
								label =  strRackIn[2];
								sUnit = parseInt(ePos) - parseInt(sPos) + 1;
								dismantleFlag = strRackIn[3];
								barcodeFlag = strRackIn[4];
								selectPos = sPos;
								eqpId = strRackIn[5];
							}
						}
						//alert("1>>>"+sUnit);
						if (label != undefined && label != "" && label != "undefined") {
							$("#rackEq_Name").val(label);
							if (sUnit < 0 || sUnit == 0) {
								sUnit = 1;
							}
							$("#rackEq_Unit").val(sUnit);
							$("#rackEq_inFlag").val("N");
							if (dismantleFlag != undefined && dismantleFlag != "" && dismantleFlag != "undefined") {
								$("#dismantleFlag").val(dismantleFlag);
							} else {
								$("#dismantleFlag").val("");
							}
							if (barcodeFlag != undefined && barcodeFlag != "" && barcodeFlag != "undefined") {
								$("#barcodeFlag").val(barcodeFlag);
							} else {
								$("#barcodeFlag").val("");
							}

						} else {
							$("#rackEq_inFlag").val("Y");
							$("#rackEq_Unit").val("1");
							$("#dismantleFlag").val("");
							$("#barcodeFlag").val("");
						}
						//equipmentSelectFlag = true;
						equipmentSelectIpdType = "A";
						equipmentSelectRowNum = i;
						$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 장비를 선택하세요. ");
						//eLoadBackgroundColor
						//strUrl+"?"+paramData);
						//if ($("#tdRack-datasA"+i).hasClass("eLoadBackgroundColor")) {
							//$("#spanMessege").html("  ■ 실장 장비를 변경하실 경우 <font style='color:red;'>삭제 후</font> 재 등록 하세요.");
							var floorId = $("#floorId").val();
							var mtsoId = $("#mtsoId").val();
							$a.popup({
								popid: 'EqpLkup',
								title: '실장 정보',
								url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawEqSeachPopup.do?mtsoId='+mtsoId+'&floorId='+floorId+'&eqpId='+eqpId+'&unitSize='+unitSize+'&unitCnt='+$("#rackEq_Unit").val()+'&sPos='+i+'&rackEq_inFlag='+$("#rackEq_inFlag").val()+'&rackId='+$("#modelId").val()+'&cstrGubun='+cstrGubun+'&cstrCd='+cstrCd+'&rackInTmpArr='+rackInTmpArr,
								modal: true,
								movable:true,
								windowpopup : false,
								width : 540,
								height : 830,
								callback : function(data) { // 팝업창을 닫을 때 실행

									var modelId = $('#modelId').val()
									//alert(modelId);
									var param = {rackId:modelId};
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
								}
							});
//						} else {
//							//$("#eqpRoleDivCdList").show();
//							$("#eqpTypeGubun1").show();
//							$("#eqpTypeGubun2").show();
//							$("#eqpTypeGubun3").show();
//							$("#eqp_Dis").show();
//							$("#eqp_Dis").val('');
//							$("#rackEq_Cd").val('');
//
//							$a.popup({
//								popid: 'EqpLkup',
//								title: '장비조회',
//								//url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do?mgmtGrpNm=SKT&repIntgFcltsCd='+$("#sisulCd").val()+'&ukeyMtsoId='+$("#sisulCd").val(),
//								//url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawEqSeachPopup.do?mgmtGrpNm=SKT&repIntgFcltsCd='+$("#sisulCd").val()+'&ukeyMtsoId='+$("#sisulCd").val(),
//								url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawEqSeachPopup.do?unitSize='+unitSize+'&unitCnt='+$("#rackEq_Unit").val()+'&sPos='+i+'&rackEq_inFlag='+$("#rackEq_inFlag").val()+'&modelId='+$("#modelId").val(),
//								modal: true,
//								movable:true,
//								windowpopup : false,
////								width : 950,
////								height : window.innerHeight * 0.83,
//								width : 530,
//								height : 580,
//								callback : function(data) { // 팝업창을 닫을 때 실행
////									if(data != null){
////										$("#tdRack-datasA"+i).removeClass("eClickBackgroundColor");
////										$("#modelNm").val(data.eqpRoleDivNm);
////										$("#eqpMdlId").val(data.eqpId);
////										$("#barCode").val(data.barNo);
////										var userId = $("#userId").val();
////										var param = {itemId : data.eqpId, regId : userId, barCode : data.barNo};
////										httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
////									}
//									var modelId = $('#modelId').val()
//									var param = {rackId:modelId};
//									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
//								}
//							});
						//}
					}
				} else {
					$("#tdRack-datasA"+i).removeClass("eClickBackgroundColor");
				}
				//$("#tdRack-datasB"+i).removeClass("eClickBackgroundColor");
			}
		});


		$(document).on('click', '[id^="spanRackDeleteA"]', function(e){
			var conFirm = confirm("아이템을 삭제하시겠습니까?");
			if(conFirm) {
				var trKey = $(this).attr('value');
				var modelId = $("#modelId").val();
				var userId = $("#userId").val();
				var param = {rackId:modelId, sPos:trKey, regId : userId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRactEq', param, 'POST', 'DeleteRactEq');
				//EquipmentSelected();
			}
		});


//		$(document).on('click', '[id=eqSearch]', function (e) {
//			var rowCount = $('#mytable > tbody > tr').length;
//			var eqFlag = false;
//			for (var i = 1; i < 45; i++) {
//				if ($("#tdRack-datasA"+i).hasClass("eClickBackgroundColor")) {
//					eqFlag = true;
//					break;
//				}
//			}
//			if (eqFlag) {
//				$a.popup({
//					popid: 'EqpLkup',
//					title: '장비조회',
//					//url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do?mgmtGrpNm=SKT&repIntgFcltsCd='+$("#sisulCd").val()+'&ukeyMtsoId='+$("#sisulCd").val(),
//					url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawEqSeachPopup.do?mgmtGrpNm=SKT&repIntgFcltsCd='+$("#sisulCd").val()+'&ukeyMtsoId='+$("#sisulCd").val(),
//					modal: true,
//					movable:true,
//					windowpopup : false,
//					width : 300,
//					height : 400,
//					callback : function(data) { // 팝업창을 닫을 때 실행
//						if(data != null){
//							$("#tdRack-datasA"+i).removeClass("eClickBackgroundColor");
//							$("#modelNm").val(data.eqpRoleDivNm);
//							$("#eqpMdlId").val(data.eqpId);
//							var userId = $("#userId").val();
//							var param = {itemId : data.eqpId, regId : userId};
//							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateBaseEqInfo', param, 'POST', 'BaseEq');
//						}
//					}
//				});
//			} else {
//				alert("랙 번호가 선택되지 않았습니다. \n먼저 랙번호를 선택하세요.");
//			}
//		});

		$(document).on('click', '[id=eqSave]', function (e) {
			var rowCount = $('#mytable > tbody > tr').length;
			var eqFlag = false;
			for (var i = 1; i < 46; i++) {
				if ($("#tdRack-datasA"+i).hasClass("eClickBackgroundColor")) {
					eqFlag = true;
					break;
				}
			}
			if (eqFlag) {
				if ($("#rackEq_Unit").val() == null || $("#rackEq_Unit").val() == "" || $("#rackEq_Unit").val() == "0") $("#rackEq_Unit").val("1");

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
							$("#rackEq_Cd").val(strVal1);
							$("#rackEq_Name").val(strTxt1);
						}
					} else{
						if ((strVal3 == null || strVal3 == "") && strLen3 == 1) {
							if (strVal2 == null || strVal2 == "") {
							} else {
								$("#rackEq_Cd").val(strVal2);
								$("#rackEq_Name").val(strTxt2);
							}
						}
					}
				} else {
					if (strVal3 == null || strVal3 == "") {
					} else {
						$("#rackEq_Cd").val(strVal3);
						$("#rackEq_Name").val(strTxt3);
					}
				}
				var systemCd = $("#rackEq_Cd").val();
				var description = $("#eqp_Dis").val();
				var rackId = $('#modelId').val();
				var sPos = equipmentSelectRowNum;
				var ePos = equipmentSelectRowNum + parseInt($("#rackEq_Unit").val()) - 1;
				var modelNm = $('#rackEq_Name').val();
				var unitSize = parseInt($('#unitSize').val());
				var inFlag = $("#rackEq_inFlag").val();

				var dismantleFlag = $("#dismantleFlag").val();
				var barcodeFlag =  $("#barcodeFlag").val();

				var saveFlag = true;
				if (sPos < ePos) {
					for(i=0;i<rackInTmpArr.length;i++) {
						if (sPos < parseInt(rackInTmpArr[i])) {
							if (ePos >= parseInt(rackInTmpArr[i])) {
								saveFlag = false;
								break;
							}
						}
					}
				}
				var cd = $("#rackEq_Cd").val();
				if (ePos > unitSize) {
					saveFlag = false;
				}
				if (!saveFlag) {
					alert("위치할 수 없는 랙 번호입니다.\n다시 시도하여 주시기 바랍니다.");
				} else {
						var modelId = 'TMP0000001'; //Temp 아이템임.
						var userId = $("#userId").val();
						var param = {rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm, systemCd:systemCd, description:description, dismantleFlag:dismantleFlag, barcodeFlag:barcodeFlag, regId : userId}
						var upFlag = false;
						for(i=0;i<rackInTmpArr.length;i++) {
							if (rackInTmpArr[i] == sPos) {
								upFlag = true;
								break;
							}
						}
						if (!upFlag) { // in or update ck
							if (cd == "" || cd == null) {
								alert("Dummy 분류가 선택 되지 않았습니다.\n다시 시도하여 주시기 바랍니다.");
							} else {
								httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertRactEq', param, 'POST', 'InsertRactEq');
							}
						} else {
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRactEq', param, 'POST', 'UpdateRactEq');
						}
				}
			} else {
				alert("랙 번호가 선택되지 않았습니다. \n먼저 랙번호를 선택하세요.");
			}
		});

	}
	function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
	//
	function BaseEqCheck() {
		var ckFlag = false;
		var oPage = GetPage(1);
		var oPanel = GetPanel(oPage, 1);
		if (oPanel.Items.length == 1) {
			alert("레이어 >기초평면 > 외벽  항목을 먼저 선택하여 주시기 바랍니다.");
			ckFlag = true;
		}
		return ckFlag;
	}
	// port등 데이터를 등록하기 위함
	function InsertEquipment(insertData) {
		alert(insertData);
	}


	function RectifierMapping() {
		$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 장비를 선택하세요.");

		for (var i = 0; i < rectifierArr.length; i++) {
			var strRectifier = rectifierArr[i].split(":");
			var outId = strRectifier[0];
			var portLabel =  strRectifier[1].substring(0,3);
			var amp =  strRectifier[2];
			$('#RectifierTitle'+amp).text(portLabel.replace("NONE","").replace("unde",""));    					//rectifierArr.push(outId+":"+portLabel+":"+amp);
			$("#tdRectifier-datas"+amp).addClass("eLoadBackgroundColor");
			$('#spanRectifierDelete'+amp).addClass("Icon Remove");
		}
	}
	function RectifierMapping2() {
		$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 장비를 선택하세요.");
		var strMessege = "■ 연결 목록<br>";
		for (var i = 0; i < rectifierArr.length; i++) {
			//ntconsole.log(rectifierArr[i]);
			//rectifierArr.push(type+":"+port+":"+amp+":"+portLabel);
			var strRectifier = rectifierArr[i].split(":");
			var type = strRectifier[0];
			var pos = strRectifier[1];
			var amp =  strRectifier[2];
			var portLabel =  strRectifier[3];

			//$('#newRectifierTitle'+amp).text(portLabel.replace("NONE","").replace("unde",""));
			if (type == "Z") {
				$("#tdNewRectifier-datas"+amp).addClass("eLoadBackgroundColor");
				$('#newRectifierDelete'+amp).addClass("Icon Remove");
				strMessege += amp + " : " + portLabel +", "
			} else if (type == "U") {
				$('#newRectifierInput_'+pos).val(amp);
			}
			//$("#spanMessege").html(strMessege);
		}
	}
	function AcPanelMapping() {
		$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 PORT번호를 선택하세요.");
		for (var i = 0; i < acPanelArr.length; i++) {
			var strIpd = acPanelArr[i].split(":");
			var pos =  strIpd[0];
			var outId = strIpd[1];
			var type = strIpd[2];
			var portLabel =  strIpd[3].substring(0,4);
			var amp =  strIpd[4];
			$('#acPanelInput_'+type+'_'+pos).val(amp);
			if (pos == 0) {
				portLabel = strIpd[3];
			}
			$('#AcPanelTitle'+type+pos).text(portLabel.replace("NONE","").replace("unde",""));
			$("#tdAcPanel-datas"+type+pos).addClass("eLoadBackgroundColor");
			$('#spanAcDelete'+type+pos).addClass("Icon Remove");
		}
	}
	function IpdMapping() {
		$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 PORT번호를 선택하세요.");
		for (var i = 0; i < ipdArr.length; i++) {
			var strIpd = ipdArr[i].split(":");
			var outId = strIpd[1];
			var type = strIpd[2];
			var pos =  strIpd[0];
			var portLabel =  strIpd[3].substring(0,7);
			$('#IpdTitle'+type+pos).text(portLabel.replace("NONE","").replace("undefine",""));
			$("#tdIpd-datas"+type+pos).addClass("eLoadBackgroundColor");
			$('#spanDelete'+type+pos).addClass("Icon Remove");
		}
	}

	function TableRowAdd() {

		//equipmentSelectFlag = false;
		var unitSize = $('#unitSize').val();
		var portCnt = $('#portCnt').val();


		$("#spanMessege").html("  ■ 장비 기본정보를 입력하세요.");
		$('#mytable > tbody > tr').remove();
		$('#mytable2 > tbody > tr').remove();
		if (unitSize != "" || unitSize != 0) {
			if ($('#type').val() == "std_double_rack" || $('#type').val() == "std_half_rack" || $('#type').val() == "std_integral_rack" || $('#type').val() == "std_rack" || $('#type').val() == "etc_box_rack"  || $('#type').val() == "exc_rack") {
				$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">[앞면]</td><td style="width:1px;background-color:#fff;"></td></tr>');
				var tmpi = 0;
				var strAppend = '';
				for (var i = 0; i < unitSize; i++) {
					tmpi = i+1;
					tmpri = unitSize - tmpi + 1;
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRack-datasA'+tmpri+'" style="width:100%;">';
					strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpri +'</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRackA" value="'+tmpri+'"><span id="RackTitleA'+tmpri+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRackDeleteA'+tmpi+'" value="A:'+tmpri+'" class="">&nbsp;</span></td>';
					strAppend += '<td  style="width:30px;height:20px;text-align:center;">'+tmpi+'</span></td>';
					strAppend += '</tr></table></td><td style="width:1px;background-color:#fff;"></td></tr>';
					$('#mytable > tbody:last').append(strAppend);
				}
			} else if ($('#type').val() == "ipd") {
				$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">PORT A</td><td style="width:1px;"></td><td  style="background-color:#cccccc;text-align:center;color:#000000;">PORT B</td></tr>');
				var tmpi = 0;
				var strAppend = '';
				for (var i = 0; i < portCnt; i++) {
					tmpi = i+1;
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdIpd-datasA'+tmpi+'" style="width:50%;">';
					strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdIpdA" value="'+tmpi+'"><span id="IpdTitleA'+tmpi+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanDeleteA'+tmpi+'" value="A:'+tmpi+'" class=""></span></td></tr></table></td>'
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdIpd-datasB'+tmpi+'" style="width:50%;">';
					strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdIpdB" value="'+tmpi+'"><span id="IpdTitleB'+tmpi+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanDeleteB'+tmpi+'" value="B:'+tmpi+'" class=""></span></td></tr></table>';
					strAppend += '</td></tr>';
					$('#mytable > tbody:last').append(strAppend);
				}
			} else if ($('#type').val() == "ac_panel" || $('#type').val() == "ele_tr" || $('#type').val() == "ele_pole_tr" || $('#type').val() == "ele_in_tr" || $('#type').val() == "ele_out_tr" || $('#type').val() == "ele_link" || $('#type').val() == "pwr_patch" || $('#type').val() == "utp_patch" || $('#type').val() == "panel_patch") {
				var strAppend = '';
				if ($('#type').val() == "ac_panel") {
					strAppend += '<tr style="border: 1px solid #ffffff;height:20px;"><td style="text-align:center;color:#fff;"  id="tdAcPanel-datasC0"  colspan="3">';
					strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">0</td>';
					strAppend += '<td  style="width:30px;height:20px;text-align:center;"><input type="text" id="acPanelInput_C_0" class="txt20" maxlength=3 style="background-color:#393F4F; color:white" ></td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdAcPanelC" value="0"><span id="AcPanelTitleC0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanAcDeleteC0" value="C:0" class=""></span></td></tr></table>'
					strAppend += '</td></tr>';
					$('#mytable > tbody:last').append(strAppend);
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">PORT L</td><td style="width:1px;"></td><td  style="background-color:#cccccc;text-align:center;color:#000000;">PORT R</td></tr>');
					var tmpi = 0;
					strAppend = '';
					for (var i = 0; i < portCnt; i++) {
						tmpi = i+1;
						strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
						strAppend += '<td id="tdAcPanel-datasL'+tmpi+'" style="width:50%;">';
						strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
						strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="acPanelInput_L_'+tmpi+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
						strAppend += '<td  style="height:20px;text-align:center;" id="subTdAcPanelL" value="'+tmpi+'"><span id="AcPanelTitleL'+tmpi+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
						strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanAcDeleteL'+tmpi+'" value="L:'+tmpi+'" class=""></span></td></tr></table></td>'
						strAppend += '<td style="width:1px;background-color:#fff;"></td>';
						strAppend += '<td id="tdAcPanel-datasR'+tmpi+'" style="width:50%;">';
						strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
						strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="acPanelInput_R_'+tmpi+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
						strAppend += '<td  style="height:20px;text-align:center;" id="subTdAcPanelR" value="'+tmpi+'"><span id="AcPanelTitleR'+tmpi+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
						strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanAcDeleteR'+tmpi+'" value="R:'+tmpi+'" class=""></span></td></tr></table>';
						strAppend += '</td></tr>';
						$('#mytable > tbody:last').append(strAppend);
					}
				} else {
					var nText = '';
					if ($('#type').val() == "ele_link") {
						nText = '장비 연결(분전반/정류기 등)';
					} else if ($('#type').val() == "pwr_patch" || $('#type').val() == "utp_patch" || $('#type').val() == "panel_patch") {
						nText = '장비 연결';
					} else {
						nText = '패치 연결(전력연결패치)';
					}
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">'+nText+'</td></tr>');
					var tmpi = 0;
					strAppend = '';
					for (var i = 0; i < 4; i++) {
						tmpi = i+1;
						strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
						strAppend += '<td id="tdAcPanel-datasL'+tmpi+'" style="width:100%;">';
						strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
						strAppend += '			 <td  style="width:2px;height:20px;text-align:center;"></td>';
						strAppend += '			 <td  style="height:20px;text-align:center;" id="subTdAcPanelL" value="'+tmpi+'"><span id="AcPanelTitleL'+tmpi+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
						strAppend += '			 <td  style="width:25px;height:20px;text-align:center;"><span id="spanAcDeleteL'+tmpi+'" value="L:'+tmpi+'" class=""></span></td></tr></table></td></tr>';
						$('#mytable > tbody:last').append(strAppend);
					}
				}


			}  else if ($('#type').val() == "rectifier_1" || $('#type').val() == "rectifier_2"  || $('#type').val() == "rectifier_3"  || $('#type').val() == "rectifier_4"  || $('#type').val() == "rectifier_5"  || $('#type').val() == "rectifier_6"  || $('#type').val() == "rectifier_7"  || $('#type').val() == "rectifier_8"  || $('#type').val() == "rectifier_9"  || $('#type').val() == "rectifier_10"  || $('#type').val() == "rectifier_11"  || $('#type').val() == "rectifier_12"  || $('#type').val() == "rectifier_13"  || $('#type').val() == "rectifier_14" ) {
				var strAppend = '';
				var tmpi = 1;
				var tmpi2 = 0;
				var tmpi3 = 0;
				var tmpi4 = 0;
				var tmpUnit = 0;
				var tmpType = $('#type').val();

				switch(tmpType)  {
				case "rectifier_1":
				case "rectifier_14":
					tmpUnit = 3;	//10
					break;
				case "rectifier_2" :
				case "rectifier_3" :
					tmpUnit = 10;	// 40
					break;
				case "rectifier_4" :
					tmpUnit = 2;	//6
					break;
				case "rectifier_5" :
					tmpUnit = 12;	//48
					break;
				case "rectifier_6" :
				case "rectifier_10" :
				case "rectifier_11" :
				case "rectifier_12" :
				case "rectifier_13" :
					tmpUnit = 13;	//50
					break;
				case "rectifier_7" :
					tmpUnit = 12;	// 45
					break;
				case "rectifier_8" :
				case "rectifier_9" :
					tmpUnit = 8;	// 30
					break;
				default :
						tmpUnit = 1;
						break;
			}

				for (var i = 0; i < tmpUnit; i++) {
					tmpi2 = tmpi + 1;
					tmpi3 = tmpi2 + 1;
					tmpi4 = tmpi3 + 1;
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdNewRectifier-datas'+tmpi+'" value="'+tmpi+'" style="width:25%;">';
					strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi +'</td>';
					strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="newRectifierInput_'+tmpi+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdNewRectifier" value="'+tmpi+'"><span id="newRectifierDelete'+tmpi+'" value="'+tmpi+'" class=""></span></td>';
					strAppend += '</tr></table></td>'
					if (tmpType == "rectifier_7" && tmpi > 43) {
						strAppend += '<td id="tdNewRectifier-datas'+tmpi2+'" value="'+tmpi2+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi4+'" value="'+tmpi4+'" style="width:25%;"></td></tr>';
					} else {
						strAppend += '<td id="tdNewRectifier-datas'+tmpi2+'" value="'+tmpi2+'" style="width:25%;">';
						strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi2 +'</td>';
						strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="newRectifierInput_'+tmpi2+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
						strAppend += '<td  style="height:20px;text-align:center;" id="subTdNewRectifier" value="'+tmpi2+'"><span id="newRectifierDelete'+tmpi2+'" value="'+tmpi2+'" class=""></span></td>';
						strAppend += '</tr></table>';
						strAppend += '</td>';
						if ((tmpType == "rectifier_1" || tmpType == "rectifier_14") && tmpi > 7) {
							strAppend += '<td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi4+'"  value="'+tmpi4+'" style="width:25%;"></td></tr>';
						} else if (tmpType == "rectifier_4" && tmpi > 3) {
							strAppend += '<td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi4+'" value="'+tmpi4+'" style="width:25%;"></td></tr>';
						} else if ((tmpType == "rectifier_6" || tmpType == "rectifier_10"  || tmpType == "rectifier_11"  || tmpType == "rectifier_12"  || tmpType == "rectifier_13" ) && tmpi > 47) {
							strAppend += '<td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi4+'" value="'+tmpi4+'" style="width:25%;"></td></tr>';
						} else if ((tmpType == "rectifier_8" || tmpType == "rectifier_9") && tmpi > 27) {
							strAppend += '<td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;"></td><td id="tdNewRectifier-datas'+tmpi4+'" value="'+tmpi4+'" style="width:25%;"></td></tr>';
						} else {
							strAppend += '<td id="tdNewRectifier-datas'+tmpi3+'" value="'+tmpi3+'" style="width:25%;">';
							strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi3 +'</td>';
							strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="newRectifierInput_'+tmpi3+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
							strAppend += '<td  style="height:20px;text-align:center;" id="subTdNewRectifier" value="'+tmpi3+'"><span id="newRectifierDelete'+tmpi3+'" value="'+tmpi3+'" class=""></span></td>';
							strAppend += '</tr></table>';
							strAppend += '</td>';
							strAppend += '<td id="tdNewRectifier-datas'+tmpi4+'" value="'+tmpi4+'" style="width:25%;">';
							strAppend += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpi4 +'</td>';
							strAppend += '<td  style="width:10px;height:20px;text-align:center;"><input type="text" id="newRectifierInput_'+tmpi4+'" class="txt20" maxlength=3 style="border:1px solid white;background-color:#393F4F; color:white" ></td>';
							strAppend += '<td  style="height:20px;text-align:center;" id="subTdNewRectifier" value="'+tmpi4+'"><span id="newRectifierDelete'+tmpi4+'" value="'+tmpi4+'" class=""></span></td>';
							strAppend += '</tr></table>';
							strAppend += '</td></tr>';
						}
					}
					$('#mytable > tbody:last').append(strAppend);
					tmpi = tmpi + 4;
				}
			} else if ($('#type').val() == "rectifier") {
				var strAppend = '';
				if ($('#lv3').val() == "MR2") {
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="border: 1px solid #ffffff;background-color:#393F4F;text-align:left;color:#fff;" colspan="7">전원분배 포트:100A</td></tr>');
					// 1번째
					strAppend = '';
					for (var i = 1; i < 37; i++) {
						if (i == 1) {
							strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
						}
						strAppend += '<td id="tdRectifier-datas'+i+'"style="border: 1px solid #ffffff;">';
						strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">'+i+'</td>';
						strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="'+i+'"><span id="RectifierTitle'+i+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
						strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete'+i+'" value="'+i+'" class=""></span></td></tr></table>';
						strAppend += '</td>';
						if (i != 4 && i != 8 && i != 12 && i != 16 && i != 20 && i != 24 && i != 28 && i != 32) {
							//strAppend += '<td style="width:1px;background-color:#fff;"></td>';
						}
						if (i == 4 || i == 8 || i == 12 || i == 16 || i == 20 || i == 24 || i == 28 || i == 32) {
							strAppend += '</tr>';
							$('#mytable > tbody:last').append(strAppend);
							if (i == 4) {
								$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="8">전원분배 포트:32A</td></tr>');
							}
							strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
						} else if (i == 36) {
							strAppend += '</tr>';
							$('#mytable > tbody:last').append(strAppend);
						}
					}

				} else if ($('#lv3').val() == "MR1") {
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="7">전원분배 포트:630A</td></tr>');
					// 1번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas1">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">1</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="1"><span id="RectifierTitle1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete1" value="1" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas2">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">2</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="2"><span id="RectifierTitle2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete2" value="2" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas3">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">3</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="3"><span id="RectifierTitle3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete3" value="3" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas4">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">4</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="4"><span id="RectifierTitle4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete4" value="4" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);

				} else if ($('#lv3').val() == "CRS2400") {
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:290px;"><td style="background-color:#393F4F;text-align:center;color:#fff;">전원분배 컨텐츠 협의중입니다.</td></tr>');
				} else if ($('#lv3').val() == "CRS1800") {
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="7">[상단]<br>전원분배 포트:100A</td></tr>');
					// 1번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas1">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">1</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="1"><span id="RectifierTitle1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete1" value="1" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas2">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">2</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="2"><span id="RectifierTitle2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete2" value="2" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas3">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">3</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="3"><span id="RectifierTitle3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete3" value="3" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas4">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">4</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="4"><span id="RectifierTitle4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete4" value="4" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);

					// 2 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas5">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">5</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="5"><span id="RectifierTitle5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete5" value="5" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas6">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">6</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="6"><span id="RectifierTitle6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete6" value="6" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas7">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">7</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="7"><span id="RectifierTitle7">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete7" value="7" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas8">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">8</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="8"><span id="RectifierTitle8">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete8" value="8" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 3 번째
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="7">전원분배 포트:50A</td></tr>');
					// 4 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas9">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">9</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="9"><span id="RectifierTitle9">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete9" value="9" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas10">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">10</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="10"><span id="RectifierTitle10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete10" value="10" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas11">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">11</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="11"><span id="RectifierTitle11">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete11" value="11" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas12">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">12</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="12"><span id="RectifierTitle12">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete12" value="12" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 5 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas13">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">13</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="13"><span id="RectifierTitle13">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete13" value="13" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas14">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">14</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="14"><span id="RectifierTitle14">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete14" value="14" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas15">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">15</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="15"><span id="RectifierTitle15">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete15" value="15" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 6 번째
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="7">[하단]<br>전원분배 포트:50A</td></tr>');

					// 7 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas26">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">26</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="26"><span id="RectifierTitle26">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete26" value="26" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas27">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">27</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="27"><span id="RectifierTitle27">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete27" value="27" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas28">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">28</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="28"><span id="RectifierTitle28">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete28" value="28" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas29">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">29</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="29"><span id="RectifierTitle29">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete29" value="29" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 8 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas30">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">30</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="30"><span id="RectifierTitle30">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete30" value="30" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas31">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">31</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="31"><span id="RectifierTitle31">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete31" value="31" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas32">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">32</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="32"><span id="RectifierTitle32">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete32" value="32" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas33">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">33</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="33"><span id="RectifierTitle33">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete33" value="33" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 9 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas34">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">34</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="34"><span id="RectifierTitle34">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete34" value="34" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas35">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">35</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="35"><span id="RectifierTitle35">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete35" value="35" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas36">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">36</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="36"><span id="RectifierTitle36">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete36" value="36" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas37">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">37</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="37"><span id="RectifierTitle37">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete37" value="37" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 10 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas38">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">38</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="38"><span id="RectifierTitle38">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete38" value="38" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
					// 11 번째
					$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#393F4F;text-align:left;color:#fff;" colspan="7">전원분배 포트:30A</td></tr>');
					// 12 번째
					strAppend = '';
					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRectifier-datas39">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">39</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="39"><span id="RectifierTitle39">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete39" value="39" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td id="tdRectifier-datas40">';
					strAppend += '<table><tr><td style="width:15px;height:20px;text-align:center;">40</td>';
					strAppend += '<td  style="height:20px;text-align:center;" id="subTdRectifier" value="40"><span id="RectifierTitle40">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRectifierDelete40" value="40" class=""></span></td></tr></table>';
					strAppend += '</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '<td style="width:1px;background-color:#fff;"></td>';
					strAppend += '<td>&nbsp;</td>';
					strAppend += '</tr>';
					$('#mytable > tbody:last').append(strAppend);
				}
			}

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				if (BoardInfo.Selected.ItemKeys.length == 1) {
					var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
					if (oItem.LayerId == "L003") {
						if (oItem.ItemType == "pwr_patch" || oItem.ItemType == "utp_patch" || oItem.ItemType == "panel_patch") {
							$('#mytable2 > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">[층간 연결 패치 선택]</td><td style="width:1px;background-color:#fff;"></td></tr>');
							var tmpi = 0;
							var strAppend2 = '';
							var floorCkId = '';
							var modelId = $('#modelId').val();	// 랙 아이디
							if (floorIdArr.length > 0) {
								//console.log(floorIdArr);
								for (var i = 0; i < floorIdArr.length; i++) {
									var tmp = floorIdArr[i].split(":");
									var tmpFloorId = tmp[0];
									var tmpFloorNm = tmp[1];

									if (isNaN(tmpFloorNm)) {
										tmpFloorNm = "-";
									} else {
										if (parseInt(tmpFloorNm) < 0) {
											tmpFloorNm = "B"+tmpFloorNm+"[F]&nbsp;&nbsp;";
										} else {
											tmpFloorNm = tmpFloorNm+"[F]&nbsp;&nbsp;";
										}
									}
									if (floorLinkArr.length > 0) {
										tmpi = i+1;
										var strSelectAppend = '<table><tr><td style="width:50px;height:30px;text-align:right;">'+tmpFloorNm+'</td>';
										strSelectAppend += '<td>';
										strSelectAppend += '<select id="floorLink'+tmpi+'" style="border:1px solid white;width:100%;height:23px;background-color:#393F4F; color:white">';
										strSelectAppend += '<option value="'+tmpFloorId+'">선택하세요</option>';
										//console.log("-----------"+floorLinkArr.length);
										for (var j = 0; j < floorLinkArr.length; j++) {
											if (tmpFloorId == floorLinkArr[j].floorId) {
												if (modelId == floorLinkArr[j].inId) {
													strSelectAppend += '<option value="'+floorLinkArr[j].itemId+'" selected>'+floorLinkArr[j].label+'</option>';
												} else {
													strSelectAppend += '<option value="'+floorLinkArr[j].itemId+'">'+floorLinkArr[j].label+'</option>';
												}
											}
										}
										strSelectAppend += '</select>';
										strSelectAppend += '</td>';
										strSelectAppend += '<td>&nbsp;</td>';
										strSelectAppend += '</tr></table>';

										strAppend2 = '<tr style="border: 1px solid #ffffff;height:20px;">';
										strAppend2 += '<td style="width:100%;">';

										strAppend2 += strSelectAppend;

										strAppend2 += '</td><td style="width:1px;background-color:#fff;"></td></tr>';
										$('#mytable2 > tbody:last').append(strAppend2);
									} else {
										strAppend2 = '<tr style="border: 1px solid #ffffff;height:20px;">';
										strAppend2 += '<td style="width:100%;text-align:center;">층 또는 연결 패치가 존재하지 않습니다</td><td style="width:1px;background-color:#fff;"></td></tr>';
										$('#mytable2 > tbody:last').append(strAppend2);
										break;
									}
								}
							} else { //등록된 연결 패치가 없습니다.(층 이동 등록 후 사용 가능)
								strAppend2 = '<tr style="border: 1px solid #ffffff;height:20px;">';
								strAppend2 += '<td id="" style="width:100%;">등록된 층 정보가 없습니다.</td></tr>';
								$('#mytable2 > tbody:last').append(strAppend2);
							}

//							var param = {rackId:modelId};
//							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
						} else {
							if (oItem.ItemType != "std_double_rack" && oItem.ItemType != "std_half_rack" && oItem.ItemType != "std_integral_rack" && oItem.ItemType != "std_rack" && oItem.ItemType != "etc_box_rack"  && oItem.ItemType != "exc_rack" && oItem.ItemType != "ele_tr" && oItem.ItemType != "ele_pole_tr"  && oItem.ItemType != "ele_in_tr" && oItem.ItemType != "ele_out_tr" && oItem.ItemType != "ele_link") {
								$('#mytable2 > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">[전용장비 및 부대장비]</td><td style="width:1px;background-color:#fff;"></td></tr>');
								var tmpi = 0;
								var strAppend2 = '';
								for (var i = 0; i < unitSize; i++) {
									tmpi = i+1;
									tmpri = unitSize - tmpi + 1;
									strAppend2 = '<tr style="border: 1px solid #ffffff;height:20px;">';
									strAppend2 += '<td id="tdRack-datasA'+tmpri+'" style="width:100%;">';
									strAppend2 += '<table><tr><td style="width:30px;height:20px;text-align:center;">'+ tmpri +'</td>';
									strAppend2 += '<td  style="height:20px;text-align:center;" id="subTdRackA" value="'+tmpri+'"><span id="RackTitleA'+tmpri+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
									strAppend2 += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRackDeleteA'+tmpi+'" value="A:'+tmpri+'" class="">&nbsp;</span></td>';
									strAppend2 += '<td  style="width:30px;height:20px;text-align:center;">'+tmpi+'</span></td>';
									strAppend2 += '</tr></table></td><td style="width:1px;background-color:#fff;"></td></tr>';
									$('#mytable2 > tbody:last').append(strAppend2);
								}
								var modelId = $('#modelId').val()
								var param = {rackId:modelId};
								httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
							}
						}
					}
				}
			}
		} else {
			$("#mytable").css('display','none');
		}
	}
	function RackInMapping() {
		$("#spanMessege").html("  ■ 연결도에 나타나지 않는 아이템은 <font style='color:red;'>삭제</font>하세요.<br>   ■ 등록하고자 하는 장비를 선택하세요."); //<br>   ■ <font style='color:red;'>검색된</font> 장비가 없을 경우 상단 <font style='color:red;'>입력창</font>을 이용하여 <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;등록하세요.

		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		var tableCk = 0;
		if (oPage && oPanel) {
			if (BoardInfo.Selected.ItemKeys.length == 1) {
				var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
				switch (oItem.ItemType) {
					case "std_double_rack":
					case "std_half_rack":
					case "std_integral_rack":
					case "std_rack":
					case "etc_box_rack":
					case "exc_rack":

						tableCk = 0;
						break;
					default :
						tableCk = 1;
						break;
				}
			}
		}

		if (tableCk == 1) {
			$('#mytable2 > tbody > tr').remove();
			$('#mytable2 > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">[전용장비 및 부대장비]</td><td style="width:1px;"></td></tr>');
		} else {
			$('#mytable > tbody > tr').remove();
			$('#mytable > tbody:last').append('<tr style="border: 1px solid #ffffff;height:20px;"><td style="background-color:#cccccc;text-align:center;color:#000000;">[앞면]</td><td style="width:1px;"></td></tr>');
		}

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
				var tmpCstrCd =  strRackIn[6];
				var stdNm =  strRackIn[7];
				var lastPos = parseInt(ePos);
				//console.log(stdNm)
				if (tmpri == lastPos) {
					rackInTmpArr.push(sPos);
					var loadClass = "eLoadBackgroundColor";
					if (tmpCstrCd == undefined || tmpCstrCd == "undefined" || tmpCstrCd == "" || tmpCstrCd == null) {
						loadClass = "eLoadBackgroundColor";
					} else {
						if (cstrCd == tmpCstrCd) {
							loadClass = "eLoadBackgroundColor2";
						}
					}
					if (stdNm != undefined && stdNm != "undefined" && stdNm != "" && stdNm != null) {
						loadClass = "eLoadBackgroundColor3";
						label = stdNm;
					}
					//loadClass = "eLoadBackgroundColor3";
						//sooji 수정
					var rowHeight = (parseInt(ePos) - parseInt(sPos)+1) * 25;
					var sePos = (parseInt(ePos) - parseInt(sPos)+1);

					strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
					strAppend += '<td id="tdRack-datasA'+sPos+'" style="width:100%;" class="'+loadClass+'">';
					if(sePos == '1'){
						strAppend += '<table><tr><td style="width:50px;height:'+rowHeight+'px;text-align:center;">'+sPos+'</td>';
					}else{
						strAppend += '<table><tr><td style="width:50px;height:'+rowHeight+'px;text-align:center;">'+sPos+'<br>('+sePos+')'+'</td>';
					}
					strAppend += '<td  style="width:80%;text-align:center;" id="subTdRackA" value="'+sPos+'"><span id="RackTitleA'+sPos+'">'+label+'</span></td>';

					strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRackDeleteA'+sPos+'" value="'+sPos+'" class="Icon Remove">&nbsp;</span></td>';
					strAppend += '<td  style="width:10px;height:20px;text-align:center;"></span></td>';
					strAppend += '</tr></table></td><td style="width:1px;background-color:#fff;"></td></tr>';
					if (tableCk == 1) {
						$('#mytable2 > tbody:last').append(strAppend);
					} else {
						$('#mytable > tbody:last').append(strAppend);
					}

					frstPos = sPos;
					tmpCkFlag = true;
					break;
				}

			}
			if (!tmpCkFlag) {

				strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
				strAppend += '<td id="tdRack-datasA'+tmpri+'" style="width:100%;">';
				strAppend += '<table><tr><td style="width:50px;height:20px;text-align:center;">'+ tmpri +'</td>';
				strAppend += '<td  style="width:80%;height:20px;text-align:center;" id="subTdRackA" value="'+tmpri+'"><span id="RackTitleA'+tmpri+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>';
				strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanRackDeleteA'+tmpi+'" value="A:'+tmpri+'" class="">&nbsp;</span></td>';
				strAppend += '<td  style="width:30px;height:20px;text-align:center;"></span></td>';
				strAppend += '</tr></table></td><td style="width:1px;background-color:#fff;"></td></tr>';
				if (tableCk == 1) {
					$('#mytable2 > tbody:last').append(strAppend);
				} else {
					$('#mytable > tbody:last').append(strAppend);
				}
				frstPos = 10000;
				tmpCkFlag = false;
			} else {
//				frstPos = 10000;
//				tmpCkFlag = false;
				if (frstPos == tmpri) {
					tmpCkFlag = false;
				}
			}

		}
	}
	function EquipmentSelected() {
		if (BoardInfo.Selected.getIsExistItem()) {
			var equipmentSelectFlag = false;
			var equipmentSelectKey = "";
			ipdArr = [];
			acPanelArr = [];
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				if (BoardInfo.Selected.ItemKeys.length == 1) {
					$("#eqpTypeGubun1").show();
					$("#eqpTypeGubun2").show();
					$("#eqpTypeGubun3").show();
					$("#eqp_Dis").show();
					$("#eqp_Dis").val('');
					$("#rackEq_Cd").val('');
					$("#btnEquipmentProperty").css('color','#1c58af');
					$("#btnEquipmentProperty").css('background-color','#ffffff');
					$("#btnEquipmentProperty").css('border-bottom','1px solid #ffffff');
					$("#layderEquipmentProperty").css('display','Inline');
					$("#btnItemProperty").css('color','#929292');
					$("#btnItemProperty").css('background-color','#DBDBDB');
					$("#btnItemProperty").css('border-bottom','1px solid #DBDBDB');
					$("#layderItemProperty").css('display','none');
					$("#layderbaseProperty").css('display','none');
					$("#layerEquipmentContent").css('display','none');

					$('#spanWidth').text("가로");
					$('#spanLength').text("세로");
					$('#spanHeight').text("높이");
					$('#spanWeight').text("중량(Kg)");

					$('#weight').css('display','Inline');
					var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
					$('#layerGubun').val(oItem.LayerId);
					$('#modelId').val(oItem.ItemId);
					$('#lv3').val(oItem.TypeName);
					$('#type').val(oItem.ItemType);

					var paramData = "modelId="+oItem.ItemId; //F35FEEC5-EBB4-E1FD-A682-A395D3F3BB72";//



					// 장비 기본정보 불러오기
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEquipmentInfo', paramData, 'GET', 'EquipmentInfo');
					if (oItem.LayerId == "L009" || oItem.LayerId == "L008" || oItem.LayerId == "L007") { //케이블
						//$('[id^="trEquipmentCable"]').css('display','table-row');
						$('#spanWidth').text("전체길이");
						$('#spanLength').text("추가길이");
						$('#spanHeight').text("직경 (Φ)");
						$('[id^="trVendor"]').css('display','none');
						$('[id^="trSerial"]').css('display','none');
						$('[id^="trCapacity"]').css('display','none');
						$('[id^="trPfactor"]').css('display','none');
						$('[id^="trVolt"]').css('display','none');
						$('[id^="trRvolt"]').css('display','none');
						$('[id^="trUnitSize"]').css('display','none');
						$("#layerEquipmentContent").css('display','none');
						$("#layerRackInputBox").css('display','none');
						$("#btnEqDetail").css('display','none');

//						$('#spanPortCnt').text("-");
//						$('#portCnt').css('display','none');
						//$("#trRackDetail").css('display','none');

					} else if (oItem.LayerId == "L003") {
						switch (oItem.ItemType) {
						case "std_double_rack":
						case "std_half_rack":
						case "std_integral_rack":
						case "std_rack":
						case "etc_box_rack":
						case "exc_rack":

							$('[id^="trVendor"]').css('display','table-row');
							$('[id^="trSerial"]').css('display','none');
							$('[id^="trCapacity"]').css('display','none');
							$('[id^="trPfactor"]').css('display','none');
							$('[id^="trVolt"]').css('display','none');
							$('[id^="trRvolt"]').css('display','none');
							$('[id^="trUnitSize"]').css('display','table-row');
							$('[id^="trlvNm"]').css('display','table-row');
							$('#spanPortCnt').text("");
							$('#portCnt').css('display','none');
							//$('#spanUnitSize').text("UNIT수");
							//$('#spanPortCnt').text("");
							//$('#portCnt').css('display','none');
							//$('#portCnt').attr("disabled", true);
							$("#layerEquipmentContent").css('display','block');
							//$("#layerRackInputBox").css('display','block');
							$("#btnEqDetail").css('display','block');
							//$("#trRackDetail").css('display','block');/
							break;
						case "rectifier":
							$('[id^="trVendor"]').css('display','table-row');
							$('[id^="trSerial"]').css('display','table-row');
							$('[id^="trCapacity"]').css('display','table-row');
							$('[id^="trPfactor"]').css('display','table-row');
							$('[id^="trVolt"]').css('display','table-row');
							$('[id^="trRvolt"]').css('display','table-row');
							$('[id^="trUnitSize"]').css('display','none');
							$('#weight').css('display','Inline');
//							$('#spanUnitSize').text("UNIT수");
//							$('#spanPortCnt').text("PORT수");
//							$('#portCnt').css('display','Inline');
							$('[id^="trlvNm"]').css('display','table-row');
							$("#layerEquipmentContent").css('display','block');
							//$("#layerRackInputBox").css('display','none');
							$("#btnEqDetail").css('display','block');

							//$("#trRackDetail").css('display','none');
							break;
						case "rectifier_1":
						case "rectifier_2":
						case "rectifier_3":
						case "rectifier_4":
						case "rectifier_5":
						case "rectifier_6":
						case "rectifier_7":
						case "rectifier_8":
						case "rectifier_9":
						case "rectifier_10":
						case "rectifier_11":
						case "rectifier_12":
						case "rectifier_13":
						case "rectifier_14":
							$('[id^="trVendor"]').css('display','table-row');
							$('[id^="trSerial"]').css('display','table-row');
							$('[id^="trCapacity"]').css('display','table-row');
							$('[id^="trPfactor"]').css('display','table-row');
							$('[id^="trVolt"]').css('display','table-row');
							$('[id^="trRvolt"]').css('display','table-row');
							$('[id^="trUnitSize"]').css('display','table-row');
							//$('#spanUnitSize').text("UNIT수");
							$('#spanPortCnt').text("");
							$('#portCnt').css('display','none');
							//$('#portCnt').attr("disabled", true);

							$('#weight').css('display','Inline');
							$('[id^="trlvNm"]').css('display','table-row');
							$("#layerEquipmentContent").css('display','block');
							//$("#layerRackInputBox").css('display','none');
							$("#btnEqDetail").css('display','block');
							//$("#trRackDetail").css('display','none');
							break;
						case "ac_panel":
						case "ipd":
							$('[id^="trVendor"]').css('display','table-row');
							$('[id^="trSerial"]').css('display','none');
							$('[id^="trCapacity"]').css('display','table-row');
							$('[id^="trPfactor"]').css('display','none');
							$('[id^="trVolt"]').css('display','none');
							$('[id^="trRvolt"]').css('display','none');
							$('[id^="trUnitSize"]').css('display','table-row');
							//$('#spanUnitSize').text("UNIT수");
							$('#spanPortCnt').text("PORT수");
							$('#portCnt').css('display','Inline');
							//$('#portCnt').attr("disabled", false);


							$('#spanWeight').text("");
							$('#weight').css('display','none');
							$('[id^="trlvNm"]').css('display','none');
							$("#layerEquipmentContent").css('display','block');
							//$("#layerRackInputBox").css('display','none');
							$("#btnEqDetail").css('display','block');
							//$("#trRackDetail").css('display','none');
							break;
						case "ele_tr":
						case "ele_pole_tr":
						//case "ele_in_tr":
						case "ele_out_tr":
						case "ele_link":
							eleLinkeFlag = true;
							$('[id^="trVendor"]').css('display','none');
							$('[id^="trSerial"]').css('display','none');
							$('[id^="trCapacity"]').css('display','none');
							$('[id^="trPfactor"]').css('display','none');
							$('[id^="trVolt"]').css('display','none');
							$('[id^="trRvolt"]').css('display','none');
							$('[id^="trUnitSize"]').css('display','none');
							$('#spanPortCnt').text("");
							$('#portCnt').css('display','none');
							$('[id^="trlvNm"]').css('display','none');
							$("#layerEquipmentContent").css('display','block');
							$("#layerRackInputBox").css('display','none');
							$("#btnEqDetail").css('display','none');
							break;
						case "pwr_patch":
						case "utp_patch":
						case "panel_patch":
							$('[id^="trVendor"]').css('display','none');
							$('[id^="trSerial"]').css('display','none');
							$('[id^="trCapacity"]').css('display','none');
							$('[id^="trPfactor"]').css('display','none');
							$('[id^="trVolt"]').css('display','none');
							$('[id^="trRvolt"]').css('display','none');
							$('[id^="trUnitSize"]').css('display','none');
							$('#spanPortCnt').text("");
							$('#portCnt').css('display','none');
							$('[id^="trlvNm"]').css('display','none');
							$("#layerEquipmentContent").css('display','block');
							$("#layerRackInputBox").css('display','none');
							$("#btnEqDetail").css('display','none');
							break;
						default:
							$('[id^="trVendor"]').css('display','table-row');
							$('[id^="trSerial"]').css('display','none');
							$('[id^="trCapacity"]').css('display','none');
							$('[id^="trPfactor"]').css('display','none');
							$('[id^="trVolt"]').css('display','none');
							$('[id^="trRvolt"]').css('display','none');
							$('[id^="trUnitSize"]').css('display','table-row');
							$('#spanPortCnt').text("");
							$('#portCnt').css('display','none');


							$('[id^="trlvNm"]').css('display','table-row');
							$("#layerEquipmentContent").css('display','block');
							//$("#layerRackInputBox").css('display','block');
							$("#btnEqDetail").css('display','block');
							//$("#trRackDetail").css('display','none');
							break;
						}
						$("#layerRackInputBox").css('display','none');
					} else {
						$('[id^="trVendor"]').css('display','none');
						$('[id^="trSerial"]').css('display','none');
						$('[id^="trCapacity"]').css('display','none');
						$('[id^="trPfactor"]').css('display','none');
						$('[id^="trVolt"]').css('display','none');
						$('[id^="trRvolt"]').css('display','none');
						$('[id^="trUnitSize"]').css('display','none');
						$('#spanPortCnt').text("");
						$('#portCnt').css('display','none');
						$('[id^="trlvNm"]').css('display','table-row');
						$("#layerEquipmentContent").css('display','none');
						$("#layerRackInputBox").css('display','none');
						$("#btnEqDetail").css('display','none');
					}
				} else {

					alert("장비 속성 변경은 아이템 1개 선택시만 가능합니다.");
					EquipmentClear();
				}
			}
		} else {
			alert("먼저 아이템을 선택하여 주시기 바랍니다.");
			EquipmentClear();
		}
	}

	function HistroySelected() {
		eleLinkeFlag = false;
		$("#btnItemProperty").css('color','#929292');
		$("#btnItemProperty").css('background-color','#DBDBDB');
		$("#btnItemProperty").css('border-bottom','1px solid #DBDBDB');
		$("#layderItemProperty").css('display','none');
		$("#layderbaseProperty").css('display','none');
		$("#btnEquipmentProperty").css('color','#929292');
		$("#btnEquipmentProperty").css('background-color','#DBDBDB');
		$("#btnEquipmentProperty").css('border-bottom','1px solid #DBDBDB');
		$("#layderEquipmentProperty").css('display','none');


		$("#btnHistroy").css('color','#1c58af');
		$("#btnHistroy").css('background-color','#ffffff');
		$("#btnHistroy").css('border-bottom','1px solid #ffffff');
		$("#layderHistroy").addClass("historySelect");
		$("#layderHistroy").css('display','Inline');
	}

	function EquipmentClear() {
		equipmentSelectFlag = false;
		eleLinkeFlag = false;
		$("#btnItemProperty").css('color','#1c58af');
		$("#btnItemProperty").css('background-color','#ffffff');
		$("#btnItemProperty").css('border-bottom','1px solid #ffffff');
		$("#layderItemProperty").css('display','Inline');
		$("#layderbaseProperty").css('display','none');
		$("#btnEquipmentProperty").css('color','#929292');
		$("#btnEquipmentProperty").css('background-color','#DBDBDB');
		$("#btnEquipmentProperty").css('border-bottom','1px solid #DBDBDB');
		$("#layderEquipmentProperty").css('display','none');


		$("#btnHistroy").css('color','#929292');
		$("#btnHistroy").css('background-color','#DBDBDB');
		$("#btnHistroy").css('border-bottom','1px solid #DBDBDB');
		$("#layderHistroy").removeClass("historySelect");
		$("#layderHistroy").css('display','none');


		$("#btnEqDetail").css('display','none');
		//$("#trRackDetail").css('display','none');

//		$('#layerGubun').val("");
//		$('#modelId').val("");
//		$('#lv1').val("");
//		$('#lv2').val("");
//		$('#lv3').val("");
//		$('#label').val("");
//		$('#height').val("");
//		$('#csType').val("");
//		$('#vendor').val("");
//		$('#modelNm').val("");
//		$('#serial').val("");
//		$('#capacity').val("");
//		$('#weight').val("");
//		$('#pFactor').val("");
//		$('#efficiency').val("");
//		$('#voltInput').val("");
//		$('#freqInput').val("");
//		$('#rvoltOutput').val("");
//		$('#mcurrentOutput').val("");
//		$('#manager').val("");
//		$('#description').val("");
//		$('#unitSize').val("");
	}

	function CanvasResize(args) {
		var arrArgs = GetCommandArgs(args, "WIDTH,HEIGHT")

		var canvas = document.getElementById("Canvas1");

		canvas.setAttribute("width", arrArgs[0]);
		canvas.setAttribute("height", arrArgs[1]);

		if (m_strStarted == "STARTED") {
			ClearEditing();

			SetScroll();
			Draw();
			SetScroll();
			Draw();
			SetProcData("CANVAS_RESIZE", "WIDTH|^@^|".concat(arrArgs[0], "|^@@^|HEIGHT|^@^|" ,arrArgs[1], "|^@@^|METHOD_NAME|^@^|CanvasResize"), "");
			setTimeout(SetLayerHeight(),3000);
		}
	}
	function SetLayerHeight() {
		var baseLeftHeight = 460;
		var layersDivHeight = $('#layerConent').height();
		var leftPeekDivHeight = $('#leftPeek').height();

		var leftHeight = leftPeekDivHeight - layersDivHeight - baseLeftHeight;
		$(".scrollbarLLayer").css('height',leftHeight+'px');

		var baseLeftHeight = 390;
		var rightPeekDivHeight = $('#rightPeek').height();
		var rightHeight = rightPeekDivHeight - baseLeftHeight;
		$(".scrollbarLLayer2").css('height', rightHeight+'px');

	}
	function InitializeMember() {
		//--- 편집모드
		// 편집모드
		e_EditMode_EditPage = 0;
		// 디자인모드-페이지
		e_EditMode_DesignPage = 1;
		// 디자인모드-패널
		e_EditMode_DesignPanel = 2;

		//--- 페이지 형식
		// 페이지형식
		e_PageStyle_Page = 0;
		// 이미지형식
		e_PageStyle_Image = 1;

		//--- 아이템 형식
		// None
		e_ItemStyle_None = 0;
		// 텍스트
		e_ItemStyle_Text = 1;
		//Check
		e_ItemStyle_Check = 2;
		// 사각형
		e_ItemStyle_Square = 3;
		// 원형
		e_ItemStyle_Circle = 4;
		// 직선
		e_ItemStyle_Straight = 5;
		// 삼각형
		e_ItemStyle_Triangle = 6;
		// 치수선
		e_ItemStyle_DimensionLine = 7;
		// 테이블
		e_ItemStyle_Table = 11;
		// 테이블 Row
		e_ItemStyle_TableRow = 12;
		// 테이블 Cell
		e_ItemStyle_TableCell = 13;
		// 곡선
		e_ItemStyle_Curve = 14;
		// Edit_Page 이미지
		e_ItemStyle_Image = 21;

		// 여기서부터는 도면에 쓰인 아이템 스타일이므로 추가해야 함.
		//장비/렉
		e_ItemStyle_AcPanel = 101;
		e_ItemStyle_StdReck = 102;
		e_ItemStyle_RectFier = 103;
		e_ItemStyle_Aircon = 104;
		e_ItemStyle_Battery471W = 105;
		e_ItemStyle_EtcBox = 106;
		e_ItemStyle_Generator = 107;
		e_ItemStyle_BatteryLithium = 108;
		e_ItemStyle_Battery_1 = 109;
		e_ItemStyle_Battery_2 = 110;
		e_ItemStyle_ExcReck	= 111;


		e_ItemStyle_PwrPatch	= 112;
		e_ItemStyle_UtpPatch	= 113;
		e_ItemStyle_PanelPatch	= 114;


		e_ItemStyle_EleTr		= 115;	// 한전 변압기
		e_ItemStyle_ElePoleTr	= 116;	// 인입전주
		e_ItemStyle_EleInTr		= 117;	// 자가변압기
		e_ItemStyle_EleOutTr	= 118;	// 외부변압기

		e_ItemStyle_EleLink	= 119;	// 연결단자


		// 기초평면
		e_ItemStyle_Cell = 201;
		e_ItemStyle_DoubleDoors = 202;
		e_ItemStyle_ConPillar = 203;
		e_ItemStyle_Haro1Ea = 204;
		e_ItemStyle_Beam = 205;
		e_ItemStyle_beamPillar = 206;
		e_ItemStyle_ConColumn = 207;
		e_ItemStyle_SlideDoor = 208;
		e_ItemStyle_LeftDoors = 209;
		e_ItemStyle_RightDoors = 210;
		e_ItemStyle_Door = 211;
		e_ItemStyle_Stairs = 212;
		e_ItemStyle_DoubleStairs = 213;
		e_ItemStyle_FluorescentLight = 214;
		e_ItemStyle_Haro2Ea = 215;
		e_ItemStyle_Cctv = 216;
		e_ItemStyle_Monitor = 217;
		e_ItemStyle_InnerWall = 218;
		e_ItemStyle_Wall = 219;
		// ojc덕트
		e_ItemStyle_Plus = 301;
		e_ItemStyle_OjcCurve = 302;
		e_ItemStyle_OjcP = 303;
		e_ItemStyle_OjcM = 304;
		e_ItemStyle_OjcT = 305;
		e_ItemStyle_OjcL = 306;
		e_ItemStyle_OjcD = 307;
		// 접지케이블 포설
		e_ItemStyle_CableLine = 401;

		//--- 아이템In 모양
		// None
		e_ItemInLineStyle_None = 0;
		// 가로선
		e_ItemInLineStyle_HLine = 1;
		// 세로선
		e_ItemInLineStyle_VLine = 2;
		// X 선
		e_ItemInLineStyle_XLine = 3;
		// + 선
		e_ItemInLineStyle_PLine = 4;
		// 원
		e_ItemInLineStyle_Ellipse = 5;
		// 대각선1
		e_ItemInLineStyle_Diagonal1 = 6;
		// 대각선2
		e_ItemInLineStyle_Diagonal2 = 7;

		//--- TextAlign
		e_TextAlign_LeftTop = 0;
		e_TextAlign_LeftMiddle = 1;
		e_TextAlign_LeftBottom = 2;
		e_TextAlign_CenterTop = 3;
		e_TextAlign_CenterMiddle = 4;
		e_TextAlign_CenterBottom = 5;
		e_TextAlign_RightTop = 6;
		e_TextAlign_RightMiddle = 7;
		e_TextAlign_RightBottom = 8;

		//--- CheckBoxStyle ---
		e_CheckBoxStyle_None = 0;
		e_CheckBoxStyle_Rectangle = 1;

		//--- CheckStyle ---
		e_CheckStyle_None = 0;
		e_CheckStyle_Check = 1;
		e_CheckStyle_Text = 2;
		e_CheckStyle_Circle = 3;
		e_CheckStyle_Rectangle = 4;
		e_CheckStyle_FillCircle = 5;
		e_CheckStyle_FillRectangle = 6;
		e_CheckStyle_Minus = 7;
		e_CheckStyle_Plus = 8;

		//--- 아이템 편집모드
		e_ItemEditMode_None = 0;
		e_ItemEditMode_Add = 1;
		e_ItemEditMode_Pen = 2;
		e_ItemEditMode_Eraser = 3;
		e_ItemEditMode_Tab1 = 4;
		e_ItemEditMode_Tab2 = 5;
		e_ItemEditMode_Straight = 6;    //STRAIGHT

		//--- 속성창의 라인 형식 ---
		e_LineFormat_Text = 0;
		e_LineFormat_Number = 1;
		e_LineFormat_Bool = 2;
		e_LineFormat_Color = 3;
		e_LineFormat_MultiText = 4;
		e_LineFormat_TextAlign = 5;
		e_LineFormat_CapStyle = 6;
		e_LineFormat_InLineStyle = 7;
		e_LineFormat_CheckBoxStyle = 8;
		e_LineFormat_CheckStyle = 9;
		e_LineFormat_Image = 10;
		e_LineFormat_Font = 11;

		//--- Copy, Paste 스타일
		e_PasteStyle_None = 0;
		e_PasteStyle_Right = 1;
		e_PasteStyle_Bottom = 2;
		e_PasteStyle_Set = 3;

		//--- Popup Menu ---
		e_PopupStyle_None = 0;
		e_PopupStyle_Simple = 1;
		e_PopupStyle_Date = 3;
		e_PopupStyle_Time = 4;

		e_PopupReserved_None = 0;
		e_PopupReserved_PageEditable = 1;
		e_PopupReserved_PageDate = 2;
		e_PopupReserved_PageTime = 3;
		e_PopupReserved_PageAdd = 4;
		e_PopupReserved_PageDelete = 5;
		e_PopupReserved_PageUndelete = 6;
		e_PopupReserved_PageIncomplete = 7;
		e_PopupReserved_PageCopy = 8;
		e_PopupReserved_PageCopyToday = 9;

		e_PopupReserved_PanelHide = 21;
		e_PopupReserved_PanelShow = 22;
		e_PopupReserved_PanelDelete = 23;
		e_PopupReserved_PanelSort = 24;
		e_PopupReserved_PanelRotateLeft = 25;
		e_PopupReserved_PanelRotateRight = 26;

		//--- Data처리 ---
		e_PanelDataStyle_PageAdd = 0;
		e_PanelDataStyle_PageLoad = 1;
		e_PanelDataStyle_PageSave = 2;

		//--- DataKeyEvent ---
		e_DataKeyEvent_PageAdd = 0;
		e_DataKeyEvent_PageLoad = 1;
		e_DataKeyEvent_PageSave = 2;

		m_sDebug = "";
	}

	function InitializeBoard() {
		BoardInfo = function () {
		};

		//--- 상태정의
		BoardInfo.MainContext = null;
		BoardInfo.CanvasWidth = 0;
		BoardInfo.CanvasHeight = 0;

		// 페이지들이 그려질 영역
		BoardInfo.PagesBounds = function () {
		};
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
		BoardInfo.IsSelectedMove = false;
		BoardInfo.ScrollDown = "";

		// 키정보
		BoardInfo.Key = function () {
		};

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

		// 편집객체 정보
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

		// 편집관련
		BoardInfo.Tab = function () {
		};
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

		// 선택객체 정보
		BoardInfo.Selected = function () {
		};
		BoardInfo.Selected.PageKey = "";
		BoardInfo.Selected.PanelKey = -1;
		BoardInfo.Selected.ItemKeys = [];
		BoardInfo.Selected.Points = [];

		// 선택내역 초기화
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

		// 선택된 아이템이 있는지 여부
		BoardInfo.Selected.getIsExistItem = function () {
			if (this.PageKey != "" && this.PanelKey != "" && this.ItemKeys.length > 0) {
				return true;
			}
			else {
				return false;
			}
		};

		// 선택된 페널이 있는지 여부
		BoardInfo.Selected.getIsExistPanel = function () {
			if (this.PageKey != "" && this.PanelKey != "") {
				return true;
			}
			else {
				return false;
			}
		};

		// 선택된 페널이 있는지 여부
		BoardInfo.Selected.getIsExistPage = function () {
			if (this.PageKey != "") {
				return true;
			}
			else {
				return false;
			}
		};

		// 팝업메뉴
		BoardInfo.Popup = function () {
		};

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

		// 디자인시 사용되는 프로퍼티창
		BoardInfo.PropertiesWindow = function () {
		};
		BoardInfo.PropertiesWindow.IsView = false;
		BoardInfo.PropertiesWindow.TitleWidth = 110;
		BoardInfo.PropertiesWindow.ValueWidth = 120;
		BoardInfo.PropertiesWindow.ScrollWidth = 1;
		BoardInfo.PropertiesWindow.LineHeight = 18;

		// 너비반환
		BoardInfo.PropertiesWindow.getWidth = function () {
			var nSum = this.TitleWidth + 1 + this.ValueWidth + 1 + this.ScrollWidth;
			return nSum;
		};

		// 프로퍼티창 영역
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
			//BoardInfo.PropertiesWindow.ScrollValue = 0;
			BoardInfo.PropertiesWindow.ScrollMaximum = 0;
			BoardInfo.PropertiesWindow.Lines = [];
			BoardInfo.PropertiesWindow.PageKey = "";
			BoardInfo.PropertiesWindow.PanelKey = "";
			BoardInfo.PropertiesWindow.ItemKeys = [];
			BoardInfo.PropertiesWindow.InputTagName = "";
			BoardInfo.PropertiesWindow.InputLineName = "";
			BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;
		};

		// 속성창이 빈 영역인지 확인
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

		//--- 기본정의
		BoardInfo.EditMode = e_EditMode_EditPage;
		BoardInfo.ItemEditMode = e_ItemEditMode_None;

		//--- 페이지타이틀
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

		//--- 아이템정의
		BoardInfo.BaseTextFont = "12px 돋움체";
		// 편집이 가능한 텍스트박스의 색상
		BoardInfo.TextEditBackColor = "rgba(255,255,192,0.5)";

		//--- 페이지정의
		BoardInfo.PageBackColor = "#DDDDDD";
		BoardInfo.PageSortAsc = true;
		BoardInfo.PageViewKindKeys = [];

		//--- 패널정의
		BoardInfo.PanelReduceHeight = 20;
		BoardInfo.PanelReduceBackColor = "rgba(200,200,200,1)";
		BoardInfo.PanelReduceForeColor = "rgba(0,0,0,1)";
		BoardInfo.RanelReduceTextFont = "12px 돋움체";

		//--- 페이지디자인 패널로드 정보
		BoardInfo.RequestLoadPages = function () {
		};

		BoardInfo.RequestLoadPages.List = [];

		BoardInfo.RequestLoadPages.Clear = function () {
			BoardInfo.RequestLoadPages.List = [];
		};

		BoardInfo.RequestLoadPages.Add = function (sPageKey, sPanelPageKey, nIndex) {
			var oInfo = function () {
			};

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
			;

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

		//--- Copy N Paste
		BoardInfo.CopyItems = [];

		//--- 스크롤 정의
		// 스크롤의 배경색
		BoardInfo.Scroll = function () {
		};
		BoardInfo.Scroll.BackColor = '#EAEAEA';
		BoardInfo.Scroll.ForeColor = '#B0B0B0';
		BoardInfo.Scroll.Width = 15;
		BoardInfo.Scroll.Height = 15;

		//--- 수직스크롤 정의
		BoardInfo.Scroll.VScroll = function () {
		};
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

		BoardInfo.Scroll.HScroll = function () {
		};
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

		//ProcData
		BoardInfo.ProcDatas = [];


		//--- Pages
		// 로드된 페이지들
		BoardInfo.Pages = [];
		// 보여질 페이지의 인덱스 배열
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
				}// for
			}// if

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
					}// if
				}// for i
			}// if

			return nWidth + 2;
		};

		//--- 출력 ----
		BoardInfo.Print = function () {
		};
		BoardInfo.Print.Width = 793;
		BoardInfo.Print.Height = 1122;

		BoardInfo.Print.TitleFont = "30px 돋움체";
		BoardInfo.Print.SubTitleFont = "15px 돋움체";

		//--- 로그 ---
		BoardInfo.Print.LogImage = null;

		//--- StoreText ---
		BoardInfo.StoreTextSource = "";
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

	function GetProcData() {
		if (BoardInfo.ProcDatas && BoardInfo.ProcDatas.length > 0) {
			var strData = BoardInfo.ProcDatas[0];

			BoardInfo.ProcDatas.shift();

			document.title = strData;
			return strData;
		}
		else
		{
			document.title = "EMPTY";
			return "EMPTY";
		}
	}

	function SetProcData(cmd, opt, val) {

		if (!(BoardInfo.ProcDatas === undefined)) {
			BoardInfo.ProcDatas.push(cmd + "|^@9@^|" + opt + "|^@9@^|" + val);
		}
	}


	function SplitString(source, splitWord, no) {
		var astrVals = source.split(splitWord);

		return astrVals[no];
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

	function ClearPageLayer() {

		//BoardInfo.Scroll.Clear();
		BoardInfo.Selected.Clear();
		BoardInfo.PropertiesWindow.Clear();
		BoardInfo.RequestLoadPages.Clear();

		BoardInfo.Pages = null;
		BoardInfo.Pages = [];
		BoardInfo.Views = [];
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
			}   // if

			return false;
		};

		oPage.Edit.getEditable = function() {
			if (!oPage.Edit.IsLocked && !oPage.Edit.IsDeleted) {
				return true;
			}

			return false;
		}

		// Canvas 기준의 위치정보
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
				}// for i
			}// if

			return nWidth;
		}

		oPage.getPanelMaxKey = function() {
			var nMax = 0;

			if (oPage.Panels) {
				for (var i = 0; i < oPage.Panels.length; i++) {
					if (nMax < oPage.Panels[i].Key) {
						nMax = oPage.Panels[i].Key;
					}
				}// for i
			}// if

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
				}// for i
			}// if

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
				}// for i
			}// if

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
				}// for i
			}// if

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


	// Panel접거나 표기
	function PanelSetExpand(oPanel, bExpand) {
		if (oPanel && oPanel.IsExpandable && oPanel.IsExpanded != bExpand) {
			oPanel.IsExpanded = bExpand;

			SetScroll();
			Draw();
		}
	}

	function SetPageKey(oPage, sPageKey) {
		if (oPage) {
			oPage.Key = sPageKey;

			for (var i = 0; i < oPage.Panels.length; i++) {
				var oPanel = oPage.Panels[i];

				if (oPanel) {
					SetPageKeyAndPanelKey(oPanel, null, sPageKey, oPanel.Key);
				}
			}// for i
		}// if
	}

	function SetPageKeyAndPanelKey(oPanel, oItem, sPageKey, nPanelKey) {
		if (oItem == null) {
			oPanel.PageKey = sPageKey;
			oPanel.Key = nPanelKey;

			for (var i = 0; i < oPanel.Items.length; i++) {
				SetPageKeyAndPanelKey(null, oPanel.Items[i], sPageKey, nPanelKey);
			}// for i
		}
		else {
			oItem.PageKey = sPageKey;
			oItem.PanelKey = nPanelKey;

			for (var i = 0; i < oItem.Childs.length; i++) {
				SetPageKeyAndPanelKey(null, oItem.Childs[i], sPageKey, nPanelKey);
			}// for i
		}// else
	}

	function GetItemMaxKey(oPanel, oItem) {
		var nMax = 0;

		if (oItem == null) {
			for (var i = 0; i < oPanel.Items.length; i++) {
				var oItem2 = oPanel.Items[i];

				if (oItem2.Key > nMax) {
					nMax = oItem2.Key;
				}

				var nMax2 = GetItemMaxKey(oPanel, oItem2);
				if (nMax2 > nMax) {
					nMax = nMax;
				}
			}// for i
		}// if (oItem == null...
				else {
					for (var i = 0; i < oItem.Childs.length; i++) {
						var oItem2 = oItem.Childs[i];

						if (oItem2.Key > nMax) {
							nMax = oItem2.Key;
						}

						var nMax2 = GetItemMaxKey(oPanel, oItem2);
						if (nMax2 > nMax) {
							nMax = nMax;
						}
					}// for i
				}

		return nMax;
	}

	function DesignNewItem(itemStyle)
	{
		BoardInfo.AddItemStyle = itemStyle;
		BoardInfo.ItemEditMode = e_ItemEditMode_Add;
	}

	function NewItem(nX, nY, nW, nH) {
		var oItem = function () { };

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
		//alert(BoardInfo.AddItemStyle)
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
		//oItem.LabelWidth = 0;
		//oItem.LabelHeight = 0;

		return oItem;
	}
	function SetBgImge() {
		var fileChk = $("#backgroundImage").val();
		if (fileChk == null || fileChk == "") {
			alert("업로드할 파일을 선택해 주세요");
			return;
		}
		var param =  $("#searchForm").getData();
		BoardInfo.Selected.Clear();
		BoardInfo.Selected.PageKey = 1;
		BoardInfo.Selected.PanelKey = 1;
		BoardInfo.Selected.ItemKeys.push(0);
		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		if (oPage && oPanel) {
			var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
			if (oItem.BackImageString != "" && oItem.Key == 0) {
				var data = oItem.BackImageString.replace(/^data:image\/(png|jpg);base64,/, "");
				var x = oItem.X;
				var y = oItem.Y;
				var width = oItem.Width;
				var height = oItem.Height;
				var rotation = oItem.Angle;
				param.x = x;
				param.y = y;
				param.width = width;
				param.height = height;
				param.rotation = rotation;
				param.bgData = data;
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/setFloorBgUpload', param, 'POST', 'FloorBgUpload');
			} else {
				alert("바탕화면 아이템이 삭제되었거나 생성되지 않았습니다.");
			}
		}
	}
	function GetCopyItem(oItem, nMaxKey) {
		var oItem2 = NewItem(0, 0, 0, 0);

		var asMembers = [ "PageKey", "PanelKey", "LayerId", "TypeName", "ParentItemKey", "Key", "DataKey", "Style", "Edit", "IsSelectable", "IsPrintable",
			"X", "Y", "Z", "Width", "Height", "Angle", "BackColor", "BackImageString", "BorderColor", "BorderWidth", "BorderDash",
			"TextFont", "TextColor", "TextAlign", "TextLineSpacing", "TextBorder", "TextMaxLine", "Text", "IsViewOutBound", "IsViewText",
			"IsBorderLeft", "IsBorderRight", "IsBorderTop", "IsBorderBottom", "IsUserSizable", "ChangeHeightItem", "ChangeTopItem",
			"TextFormat", "EditOnly", "IsVisible","Points","ItemType"];

		for (var i = 0; i < asMembers.length; i++) {
			var sName = asMembers[i];

			oItem2[sName] = oItem[sName];
		}// for i

		nMaxKey++;

		oItem2.Key = nMaxKey;

		for (var i = 0; i < oItem.Childs.length; i++) {
			var oItem3 = GetCopyItem(oItem.Childs[i], nMaxKey);

			if (oItem3) {
				oItem2.Childs.push(oItem3);
			}
		}// for i


		return oItem2;
	}

	function GetItemText(itemStyle, no) {

		var strRet = "";

		switch (itemStyle) {
		case e_ItemStyle_Text:
			strRet = "Text" + no;
			break;
		case e_ItemStyle_Table:
			strRet = "Table" + no;
			break;
		case e_ItemStyle_TableRow:
			strRet = "";
			break;
		case e_ItemStyle_TableCell:
			strRet = "";
			break;
		case e_ItemStyle_Check:
			strRet = "Check" + no;
			break;
		default:
			strRet = "Item" + no;
		}

		return strRet;
	}

	// 페이지 편집모드 전환
	function EditPageInit() {
		BoardInfo.EditMode = e_EditMode_EditPage;

		ItemEditModeClear();
		ClearEditing();
		ClearPage();

		SetScroll();
		Draw();
	}

	// 보여줘야하는 페이지종류를 정리
	function SetViewPageKind(sKind) {
		sKind = sKind.trim();

		if (sKind != "") {
			BoardInfo.PageViewKindKeys = [];

			if (sKind != "-1") {
				var asKinds = sKind.split(",");

				for (var i = 0; i < asKinds.length; i++) {
					var sKind2 = asKinds[i].trim();

					if (sKind2 != "" && BoardInfo.PageViewKindKeys.indexOf(sKind2) == -1) {
						BoardInfo.PageViewKindKeys.push(sKind2);
					}
				}
			}// if
		}// if
	}

	function SetViewPage() {
		ClearEditing();
		var asViews = [];

		for (var i = 0; i < BoardInfo.Pages.length; i++) {
			var oPage = BoardInfo.Pages[i];
			oPage.Edit.IsView = false;

			if (BoardInfo.PageViewKindKeys.length == 0 || BoardInfo.PageViewKindKeys.indexOf(oPage.Edit.KindKey) > -1) {
				var sPageKey = "0000000000".concat(oPage.Key);
				sPageKey = sPageKey.substr(sPageKey.length - 10, 10);

				var sIndex =  "0000000000".concat(i);
				sIndex = sIndex.substr(sIndex.length - 10, 10);

				var sValue = "".concat(oPage.Date, oPage.Time, sPageKey, ",", sIndex);

				oPage.Edit.IsView = true;
				asViews.push(sValue);
			}
		}// for i

		asViews.sort();
		BoardInfo.Views = [];

		if (BoardInfo.PageSortAsc) {
			for (var i = 0; i < asViews.length; i++) {
				var asView2 = asViews[i].split(",");
				var nIndex =parseInt(asView2[1]);

				BoardInfo.Views.push(nIndex);
			}
		}
		else {
			for (var i = asViews.length - 1; i >= 0; i--) {
				var asView2 = asViews[i].split(",");
				var nIndex =parseInt(asView2[1]);

				BoardInfo.Views.push(nIndex);
			}
		}

		SetScroll();
		Draw();
	}

	function EditPageSelectPage(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY")

		if (asOpts[0] != "") {
			var oPage = GetPage(asOpts[0]);

			if (oPage) {
				if (oPage.Key != BoardInfo.Selected.PageKey) {
					BoardInfo.Selected.Clear();
					BoardInfo.Selected.PageKey = oPage.Key;
				}

				EditPageGotoPage(oPage);
			}// if
		}// if
		else {
			if (BoardInfo.Selected.PageKey != "") {
				SetProcData("SELECTED_PAGE", "PAGE_KEY|^@^|".concat(BoardInfo.Selected.PageKey), "");
			}
		}
	}

	function EditPageGotoPage(oPage) {
		if (oPage) {
			var nScrollY = BoardInfo.Scroll.VScroll.Value + oPage.DrawY;

			SetScrollValue(0, nScrollY);
		}
	}

	function EditPageAdd(sOpt, sVal) {
		ClearEditing();
		// 0        1          2         3         4         5           6               7         8         9           10            11       12         13        14         15
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE,PAGE_DATE,PAGE_TIME,PAGE_KIND,PAGE_LOCKED,PAGE_LOCKEDNAME,PAGE_SIGN,VIEW_KIND,PAGE_SELECT,PAGE_MODIFIED,REG_NAME,PAGE_INOUT,PAGE_DEPT,PAGE_PRINT,PAGE_PRINTNAME")

		var oPage = PageLoad(sVal);
		if (oPage) {
			var sPageKey = asOpts[0];
			var sPageTitle = asOpts[1];
			var sPageDate = asOpts[2];
			var sPageTime = asOpts[3];
			var sPageKind = asOpts[4];
			var bPageLocked = (asOpts[5] == "1") ? true : false;
			var sPageLockedName = asOpts[6];
			var bPageSign = (asOpts[7] == "1") ? true : false;
			var sRegName = asOpts[11];
			var sInOut = asOpts[12];
			var sDept = asOpts[13];
			var bPrint = (asOpts[14] == "1") ? true : false;
			var sPrintName = asOpts[15];

			oPage.SheetKey = oPage.Key;
			oPage.Title = sPageTitle;
			oPage.Date = sPageDate;
			oPage.Time = sPageTime;

			oPage.Edit.KindKey = sPageKind;
			oPage.Edit.IsLocked = bPageLocked;
			oPage.Edit.LockedName = sPageLockedName;
			oPage.Edit.IsSign = bPageSign;

			oPage.Edit.RegName = sRegName;
			oPage.Edit.InOut = sInOut;
			oPage.Edit.Dept = sDept;
			oPage.Edit.IsPrinted = bPrint;
			oPage.Edit.PrintedName = sPrintName;

			SetPageKey(oPage, sPageKey);

			var asPageKeys = [];

			for (var i = 0; i < oPage.Panels.length; i++) {
				BoardInfo.RequestLoadPages.Add(oPage.Key, oPage.Panels[i].ExPageKey, i);
				asPageKeys.push(oPage.Panels[i].ExPageKey);
			}// for i

			for (var i = 0; i < asPageKeys.length; i++) {
				var sPageKey2 = asPageKeys[i];
				SetProcData("REQUEST_EDIT_PANEL", "PAGE_KEY|^@^|".concat(sPageKey2), "");
			}// for i

			oPage.Edit.setModify(false);

			var bExist = false;
			for (var i = 0; i < BoardInfo.Pages.length; i++) {
				var oPage2 = BoardInfo.Pages[i];

				if (oPage2.Key == oPage.Key) {
					BoardInfo.Pages[i] = null;
					BoardInfo.Pages[i] = oPage;
					bExist = true;
				}
			}// for i

			if (!bExist) {
				BoardInfo.Pages.push(oPage);
			}

			SetViewPageKind(asOpts[8])
			SetViewPage();

			if (asOpts[9] == "1") {
				BoardInfo.Selected.Clear();
				BoardInfo.Selected.PageKey = oPage.Key;
				EditPageGotoPage(oPage);
			}
		}
	}

	function EditPageAddImage(sOpt, sVal) {
		ClearEditing();
		// 0        1          2         3         4         5           6               7         8         9           10            11       12         13        14         15             16
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE,PAGE_DATE,PAGE_TIME,PAGE_KIND,PAGE_LOCKED,PAGE_LOCKEDNAME,PAGE_SIGN,VIEW_KIND,PAGE_SELECT,PAGE_MODIFIED,REG_NAME,PAGE_INOUT,PAGE_DEPT,PAGE_PRINT,PAGE_PRINTNAME,IMAGE_PATH")

		var sPageKey = asOpts[0];
		var sPageTitle = asOpts[1];
		var sPageDate = asOpts[2];
		var sPageTime = asOpts[3];
		var sPageKind = asOpts[4];
		var bPageLocked = (asOpts[5] == "1") ? true : false;
		var sPageLockedName = asOpts[6];
		var bPageSign = (asOpts[7] == "1") ? true : false;
		var sRegName = asOpts[11];
		var sInOut = asOpts[12];
		var sDept = asOpts[13];
		var bPrint = (asOpts[14] == "1") ? true : false;
		var sPrintName = asOpts[15];
		var sImagePath = asOpts[16];
		var oPage2 = null;

		if (sImagePath != "") {
			oPage2 = PageLoad(sVal);
			sVal = sImagePath;
		}

		var oPage = NewPage(sPageKey, sPageTitle);
		if (oPage) {

			oPage.SheetKey = oPage.Key;
			oPage.Title = sPageTitle;
			oPage.Date = sPageDate;
			oPage.Time = sPageTime;

			oPage.Edit.KindKey = sPageKind;
			oPage.Edit.IsLocked = bPageLocked;
			oPage.Edit.LockedName = sPageLockedName;
			oPage.Edit.IsSign = bPageSign;

			oPage.Edit.RegName = sRegName;
			oPage.Edit.InOut = sInOut;
			oPage.Edit.Dept = sDept;
			oPage.Edit.IsPrinted = bPrint;
			oPage.Edit.PrintedName = sPrintName;

			if (oPage2) {
				oPage.IsPrintable = oPage2.IsPrintable;
				oPage.HeadPrint = oPage2.HeadPrint;
				oPage.FootPrint = oPage2.FootPrint;

				oPage2 = null;
			}

			var oPanel = NewPanel(720, 1000)

			if (oPanel) {
				oPage.Panels.push(oPanel);
				SetPageKey(oPage, sPageKey);

				var bExist = false;
				for (var i = 0; i < BoardInfo.Pages.length; i++) {
					var oPage2 = BoardInfo.Pages[i];

					if (oPage2.Key == oPage.Key) {
						BoardInfo.Pages[i] = null;
						BoardInfo.Pages[i] = oPage;
						bExist = true;
					}
				}// for i

				if (!bExist) {
					BoardInfo.Pages.push(oPage);
				}

				oPage.Edit.setModify(true);

				SetViewPageKind(asOpts[8])
				SetViewPage();


				if (asOpts[9] == "1") {
					BoardInfo.Selected.Clear();
					BoardInfo.Selected.PageKey = oPage.Key;
					EditPageGotoPage(oPage);
				}

				var oImage2 = new Image();
				oImage2.onload = function () {
					var nImgW = oImage2.naturalWidth;
					var nImgH = oImage2.naturalHeight;

					var nRate = nImgW / oPanel.Width;
					var nImgH2 = nImgH / nRate;
					var nImgW2 = oPanel.Width;

					if (nImgH2 > oPanel.Height) {
						nRate = nImgH2 / oPanel.Height;
						nImgW2 = nImgW2 / nRate;
						nImgH2 = oPanel.Height;
					}

					oPanel.Height = nImgH2;
					oPanel.BackImageWidth = nImgW2;

					var canvas2 = document.getElementById("Canvas2");
					canvas2.setAttribute("width", nImgW);
					canvas2.setAttribute("height", nImgH);

					var context2 = canvas2.getContext("2d");
					context2.drawImage(oImage2, 0, 0, nImgW, nImgH);

					oPanel.BackImage = null;
					oPanel.BackImageString = canvas2.toDataURL();
					oPanel.BackImage = new Image();
					oPanel.BackImage.onload = function () {
						Draw();
					}
					oPanel.BackImage.src = oPanel.BackImageString;

					SetScroll();
					Draw();
				}//

				oImage2.src = sVal;
			}// if
		}// if
	}

	function EditPageSaveCheck(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY")
		var nCount = 0;

		if (asOpts[0] != "") {
			var oPage = GetPage(asOpts[0]);

			if (oPage && oPage.Edit.getSavable()) {
				nCount++;
			}

			SetProcData("EDIT_PAGE_SAVE_CHECK",  "METHOD_NAME|^@^|EditPageSaveCheck|^@@^|PAGE_KEY|^@^|" + asOpts[0], nCount);
		}
		else {
			for (var i = 0; i < BoardInfo.Pages.length; i++) {
				var oPage = BoardInfo.Pages[i];

				if (oPage.Edit.getSavable()) {
					nCount++;
				}
			}

			SetProcData("EDIT_PAGE_SAVE_CHECK",  "METHOD_NAME|^@^|EditPageSaveCheck", nCount);
		}
	}

	function GetPageInfoOptionString(oPage) {

		var sRetOpt = "";
		sRetOpt += GetCommandOption(false, "PAGE_KEY", oPage.Key);
		sRetOpt += GetCommandOption(true, "PAGE_TITLE", oPage.Title);
		sRetOpt += GetCommandOption(true, "PAGE_DATE", oPage.Date);
		sRetOpt += GetCommandOption(true, "PAGE_TIME", oPage.Time);
		sRetOpt += GetCommandOption(true, "PAGE_KIND", oPage.Edit.KindKey);
		sRetOpt += GetCommandOption(true, "PAGE_LOCKED", oPage.Edit.IsLocked ? "1" : "0");
		sRetOpt += GetCommandOption(true, "PAGE_LOCKEDNAME", oPage.Edit.LockedName);
		sRetOpt += GetCommandOption(true, "PAGE_SIGN", oPage.Edit.IsSign ? "1" : "0");
		sRetOpt += GetCommandOption(true, "PAGE_MODIFIED", oPage.Edit.getSavable() ? "1" : "0");
		sRetOpt += GetCommandOption(true, "PAGE_USE", oPage.Edit.IsDeleted ? "0" : "1");
		sRetOpt += GetCommandOption(true, "PAGE_INOUT", oPage.Edit.InOut);
		sRetOpt += GetCommandOption(true, "PAGE_DEPT", oPage.Edit.Dept);
		sRetOpt += GetCommandOption(true, "PAGE_VIEW", oPage.Edit.IsView ? "1" : "0");
		sRetOpt += GetCommandOption(true, "INCOMPLETE_YN", GetPageDrawIncomplete(oPage) ? "1" : "0");

		return sRetOpt;
	}

	function GetPageDrawIncomplete(oPage) {
		var bIncomplete = false;

		if (oPage) {
			for (var i = 0; i < oPage.Panels.length; i++) {
				var oPanel = oPage.Panels[i];

				if (oPanel) {
					for (var j = 0; j < oPanel.Items.length; j++) {
						var oItem = oPanel.Items[j];

						bIncomplete = GetDrawIncomplete(oItem);

						if (bIncomplete) {
							break;
						}
					}// for j

					if (bIncomplete) {
						break;
					}
				}
			}// for i
		}// if

		return bIncomplete;
	}


	function EditPageGetSource(sOpt) {
		ClearEditing();

		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY")
		var sPageKey = asOpts[0].trim();

		if (sPageKey == "") {
			sPageKey = BoardInfo.Selected.PageKey;
		}

		var oPage = GetPage(sPageKey);

		if (oPage) {
			if (BoardInfo.RequestLoadPages.ExistPageKey(sPageKey)) {
				SetProcData("EDIT_PAGE_GET_SOURCE_AGAIN", sOpt, "");
			}
			else {
				var sPageData = GetPageData(oPage, true);
				var sRetOpt = GetPageInfoOptionString(oPage);

				SetProcData("EDIT_PAGE_GET_SOURCE", sRetOpt, sPageData);
				//window.clipboardData.setData("Text", sPageData);
			}
		}// if

	}

	// 편집모드 : 페이지저장
	function EditPageSave() {
		ClearEditing();

		for (var i = 0; i < BoardInfo.Pages.length; i++) {
			var oPage = BoardInfo.Pages[i];

			if (oPage.Edit.getSavable()) {
				var sPageData = GetPageData(oPage, true);
				var sRetOpt = GetPageInfoOptionString(oPage);

				SetProcData("EDIT_PAGE_SAVE", sRetOpt, sPageData);
				//window.clipboardData.setData("Text", sRetOpt);

				for (var j = 0; j < oPage.Panels.length; j++) {
					PanelRun(oPage, oPage.Panels[j], null, oPage.Panels[j].RunPageSave, -1, -1);
					SetDataKeyEvent(oPage, oPage.Panels[j], e_DataKeyEvent_PageSave);
				}
			}
		}// for i

		SetProcData("EDIT_PAGE_SAVE", "PAGE_KEY|^@^|END", "");
	}

	function EditPageSaveOk(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY");
		ClearEditing();

		var oPage = GetPage(asOpts[0]);
		if (oPage) {
			oPage.Edit.setModify(false);
			Draw();
		}
	}

	// 페이지 삭제
	function EditPageDeletePage(sPageKey) {
		ClearEditing();
		var oPage = GetPage(sPageKey);

		if (oPage) {
			if (oPage.Edit.getEditable()) {

				if (confirm("".concat("삭제하시겠습니까?", "\n\n명칭:", oPage.Title, "\n날짜:", oPage.Date, "\n시간:", oPage.Time)) == true) {
					oPage.Edit.IsDeleted = true;
					oPage.Edit.setModify(true);
					SetProcData("ALERT_PAGE_DELETED", GetCommandOption(false, "PAGE_KEY", oPage.Key), "");
				}

				Draw();

			}
			else {
				SetProcData("WARNING", "METHOD_NAME|^@^|EditPageDeletePage", "편집권한이 없습니다.");
			}
		}
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|EditPageDeletePage", "삭제할 페이지가 없습니다.");
		}
	}

	function EditPageInfo(sPageKey) {
		if (sPageKey == "") {
			sPageKey = BoardInfo.Selected.PageKey;
		}

		var oPage = GetPage(sPageKey);
		if (oPage) {
			var sRetOpt = GetPageInfoOptionString(oPage);

			SetProcData("EDIT_PAGE_INFO", sRetOpt, "");
		}
		else
		{
			SetProcData("EDIT_PAGE_INFO", GetCommandOption(false, "PAGE_KEY", "END") , "");
		}
	}

	function EditPageInfoAll() {
		for (var i = 0; i < BoardInfo.Pages.length; i++) {
			var sPageKey = BoardInfo.Pages[i].Key;
			EditPageInfo(sPageKey);
		}// for i

		SetProcData("EDIT_PAGE_INFO", GetCommandOption(false, "PAGE_KEY", "END") , "");
	}

	// 펜모드
	function EditPagePenMode(sOpt) {
		ClearEditing();
		Draw();
		var asOpts = GetCommandArgs(sOpt, "PEN_COLOR,PEN_WIDTH");

		BoardInfo.ItemEditMode = e_ItemEditMode_Pen;
		BoardInfo.PenColor = "".concat("rgba(", asOpts[0], ")" );
		BoardInfo.PenWidth = parseInt(asOpts[1]);

		SetProcData("INFO_OCX", "", "PEN_ACTIVE");
	}
	// 직선모드 EDIT_PAGE_PEN_STRAIGHT
	function EditPagePenStraightMode(sOpt) {
		ClearEditing();
		Draw();
		var asOpts = GetCommandArgs(sOpt, "PEN_COLOR,PEN_WIDTH");
		BoardInfo.PenPositions = [];
		BoardInfo.ItemEditMode = e_ItemEditMode_Straight;
		BoardInfo.PenColor = "".concat("rgba(", asOpts[0], ")");
		BoardInfo.PenWidth = parseInt(asOpts[1]);
		//addItemType = "straightline";
	}
	// 직선 및 원형 모드
	function EditPageSquareMode(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PEN_COLOR,PEN_WIDTH,PEN_BACKGROUND_COLOR");
		lineColor = "".concat("rgba(", asOpts[0], ")");
		lineWidth = parseInt(asOpts[1]);
		InSideColor = "".concat("rgba(", asOpts[2], ")");
	}
	function EditPageCircleMode(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PEN_COLOR,PEN_WIDTH,PEN_BACKGROUND_COLOR");
		lineColor = "".concat("rgba(", asOpts[0], ")");
		lineWidth = parseInt(asOpts[1]);
		InSideColor = "".concat("rgba(", asOpts[2], ")");
	}
	// 지우개모드
	function EditPageEraserMode(sOpt) {
		ClearEditing();
		Draw();
		var asOpts = GetCommandArgs(sOpt, "ERASER_WIDTH");

		BoardInfo.ItemEditMode = e_ItemEditMode_Eraser;
		BoardInfo.PenWidth = parseInt(asOpts[0]);

		SetProcData("INFO_OCX", "", "PEN_INACTIVE");
	}

	function EditPagePrintLog(sVal) {
		BoardInfo.Print.LogImage = new Image();
		BoardInfo.Print.LogImage.onload = function () {
			SetProcData("EDIT_PAGE_PRINT_LOG_OK", "", "");
		}//

		BoardInfo.Print.LogImage.src = sVal;
	}

	function DesignPanelPrint(sOpt) {
		ClearEditing();
		PopupClear();

		var minX = 100000000, minY = 100000000, maxX = -100000000, maxY = -100000000;
		var oPage = GetPage(1);
		var oPanel = GetPanel(oPage, 1);
		var asImages = [];
		var tmpWidth = 0;
		var tmpHeight = 0;

		if (oPage && oPanel) {
			for (var i = 0; i < oPanel.Items.length; i++) {
				var oItem = oPanel.Items[i];
				//console.log(oItem.Text + "minX : " + minX +"---maxX : "+ maxX +"---minY : "+ minY +"---maxY : "+ maxY +"---Width : "+ oItem.Width +"---Height : "+ oItem.Height);
				if (oItem.Width > 5 && oItem.Height > 5) {
					if ((oItem.Angle > 45 && oItem.Angle < 125)  || (oItem.Angle > 235 && oItem.Angle < 315)) {
						tmpWidth = oItem.Height;
						tmpHeight = oItem.Width;
					} else {
						tmpWidth = oItem.Width;
						tmpHeight = oItem.Height;
					}
					//if (oItem.Key != "0") {
					if (i == 0 ) {
						minX = oItem.X;
						maxX = oItem.X + oItem.Width;
						minY = oItem.Y;
						maxY = oItem.Y + oItem.Height;
					}
					else {
						minX = Math.min(oItem.X, minX);
						maxX = Math.max(oItem.X + tmpWidth, maxX);
						minY = Math.min(oItem.Y, minY);
						maxY = Math.max(oItem.Y + tmpHeight, maxY);
					}
				}
				//}
					//console.log(oItem.Text + "minX : " + minX +"---maxX : "+ maxX +"---minY : "+ minY +"---maxY : "+ maxY +"---Width : "+ tmpWidth +"---Height : "+ tmpHeight);
			}


			var nPrintW = Math.round(maxX - minX) + 50;
			var nPrintH = Math.round(maxY - minY) + 50;

			var canvas2 = document.getElementById("Canvas2");
			canvas2.setAttribute("width", nPrintW);//  + 200
			canvas2.setAttribute("height", nPrintH);// + 200
			var context2 = canvas2.getContext("2d");
			if (oPage.IsPrintable) {
				if (oPanel.IsPrintable && oPanel.IsExpanded) {
					context2.clearRect(0, 0, nPrintW, nPrintH);
					context2.save();

					var nStartPos = 25;
					var nX = 25;
					var nY = nStartPos;
					var nW = oPage.getWidth();
					var nH = oPage.getHeight();

					nStartPos = (nY + nH);

					var HScroll = minX;
					var VScroll = minY;

					nX -= HScroll;
					nY -= VScroll;
					oPage.DrawX = nX;
					oPage.DrawY = nY;
					oPage.DrawW = nW;
					oPage.DrawH = nH;


					//alert(nX +"---"+nY +"---"+nPrintW +"---"+nPrintH+"---"+oPage.DrawX +"---"+oPage.DrawY);
					nPrintY = DrawPanel(context2, oPage, oPanel, nX, nStartPos, nPrintW, nPrintH, nY, nPrintW, nPrintH, false, true);
					//DrawPanel(context, oPage, oPanel, nX, nY, nW, nH, nPanelStartPos, nCanvasWidth, nCanvasHeight, bSelectedPage, bPrintable)
					context2.restore();
					var sImgSrc = canvas2.toDataURL();
					asImages.push(sImgSrc);
					var logo = '/tango-transmission-web/resources/images/upsd/skt.png';
					if (asImages.length == 1) {
						var d = new Date();
						var sImgSrc = asImages[0];
						var win = window.open('','Print','toolbar=no,location=no,directories=no,status=no,scrollbars=yes, resizable=yes, width=1000px, height=800px');



						//var oHtml = '<html xmlns="http://www.w3.org/1999/xhtml">';
						var oHtml = '<head>';
						oHtml += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">';
						oHtml += '<title> 도면 프린트 </title>';
//						oHtml += '<style>';
//						//oHtml += 'html { height: 100%; overflow: auto;}';
//						oHtml += '#main-container {height: 100%;padding: ;margin: 0;display: flex;flex-direction: column;}';
//						//oHtml += 'body {height: 100%;padding: 0;margin: 0;display: flex;flex-direction: column;}';
//						oHtml += 'header {background: aqua;flex: 0 0 100px;}';
//						oHtml += 'section {background: blue;flex: 1;display: flex;flex-direction: row;overflow: auto;}';
//						//oHtml += 'article {background: blanchedalmond;flex: 3;}';
//						oHtml += 'aside {background: #fff;flex: 0 0 200px;}';
//						oHtml += '#container {display: flex;flex-direction: column;justify-content: center;align-items: center;cursor: move;}';
//						oHtml += '.print-this-only {}';
//
//						oHtml += '@media print {';
//						//oHtml += 'html,';
//						//oHtml += 'body {height: 100%;width: 100%;margin: 0;overflow: hidden;display: block;background-color: #fff;}';
//						oHtml += '.print-this-only {background-color: yellow;top: 0;left: 0;margin: 0;}'; //overflow: hidden;
//						oHtml += '.print-this-only canvas {max-width: 100%;max-height: 100%;display: block;}';
//						oHtml += '.no-print,';
//						oHtml += '.no-print * {display: none !important;}';
//						oHtml += '.printOnly {display: block;}';
//						oHtml += '}';
//						oHtml += '</style>';
						oHtml += '</head>';

						//oHtml += '<body ng-app="ui.bootstrap.demo" ng-controller="DropdownController as vm">';
						oHtml += '<div id="main-container">';
						oHtml += '<article id="id">';
						oHtml += '<div id="container">';
						oHtml += '<div id="container" class="print-this-only" style="position:relative">';
						oHtml += '<img src=' + sImgSrc + '>';
						oHtml += '</div>';
						oHtml += '</div>';
						oHtml += '</article>';
						oHtml += '</div>';
						//oHtml += '</body>';
						//oHtml += '</html>';




//						var oHtml = "<html><body style='width:800px;height:600px;margin:0;padding:0;'>";
//						oHtml += "<div style='text-align:center;'>";
//						oHtml += " 		<div style='text-align:center;'><img src=" + sImgSrc + "></div>";
//						oHtml += "<div>";
//						oHtml += "</body></html>";
						win.document.body.innerHTML = oHtml;
						setTimeout(function() {
							win.print();
							win.close();
						},2000);
					}
					asImages = null;
					Draw();
				}
			}
		}
	}

	function DrawPrintTitle(context, oPage, nPrintW, nPrintH, sPatNo, sPatName, sPatSex, sPatAge, sPatBirth, sPrintUse, sCurDate, sCurTime, sCurIP, sUserName) {}
	// 엔터가 있는 텍스트를 엔터 기준으로 배열로 반환
	function GetTextArray(sText) {
		var asText = sText.split("\n");
		return asText;
	}
	// 텍스트 배열를 엔터로 구분해서 반환
	function GetTextArrayString(asText) {
		var sRet = "";

		for (var i = 0; i < asText.length; i++) {
			if (i > 0) {
				sRet += "\n";
			}

			sRet += asText[i];
		}// for i

		return sRet;
	}

	function GetTextHeightFromText(sText, nLineSpacing, sTextFont) {
		var asText = GetTextArray(sText);

		return GetTextHeightFromTextArray(asText, nLineSpacing, sTextFont);
	}

	function GetTextHeightFromTextArray(asText, nLineSpacing, sTextFont) {
		var nHeight = -1;

		var canvas = document.getElementById("Canvas1");
		var context = null;

		if (canvas.getContext) {
			context = canvas.getContext("2d");
			context.font = sTextFont;

			nHeight = 0;
			var strBase = "혫";
			var nTextHeight = context.measureText(strBase).width + context.measureText(strBase).width / 6;

			for (var i = 0; i < asText.length; i++) {
				nHeight += nTextHeight + nLineSpacing;
			}// for i
		}// if

		return nHeight;
	}// function


	// 페이지 Remove
	function EditPageRemove(sPageKey, bDeleted) {
		ClearEditing();
		if (bDeleted) {
			var bRemove = false;

			for (var i = BoardInfo.Pages.length - 1; i >= 0; i--) {
				if (BoardInfo.Pages[i].Edit.IsDeleted) {
					var sPageKey = BoardInfo.Pages[i].Key;
					BoardInfo.Pages[i] = null;
					BoardInfo.Pages.splice(i, 1);
					bRemove = true;

					SetProcData("EDIT_PAGE_REMOVE", "METHOD_NAME|^@^|EditPageRemove".concat("|^@@^|", "PAGE_KEY|^@^|", sPageKey), "");
				}
			}// for i

			if (bRemove) {
				SetViewPage();
			}
		}
		else {
			for (var i = BoardInfo.Pages.length - 1; i >= 0; i--) {
				if (BoardInfo.Pages[i].Key == sPageKey) {
					var sPageKey = BoardInfo.Pages[i].Key;
					BoardInfo.Pages[i] = null;
					BoardInfo.Pages.splice(i, 1);
					bRemove = true;

					SetProcData("EDIT_PAGE_REMOVE", "METHOD_NAME|^@^|EditPageRemove".concat("|^@@^|", "PAGE_KEY|^@^|", sPageKey), "");
					SetViewPage();
					break;
				}
			}// for i
		}
	}

	function SetDataKeyEvent(oPage, oPanel, nDataKeyEvent) {}

	function PanelRun(oPage, oPanel, oItem, sRun, nX, nY) {}

	function PanelDataLoad(oPage, oPanel, nDataIndex) {}

	function GetItemValueString(oItem) {
		var sRet = "";

		if (oItem) {
			if (oItem.Style == e_ItemStyle_Check) {
				if (oItem.Checked) {
					sRet = oItem.CheckValue;
				}
				else {
					sRet = oItem.UnCheckValue;
				}
			}
			else {
				sRet = GetTextArrayString(oItem.Text);
			}
		}// if

		return sRet;
	}

	function PageAddPanel(sVal, bDesign) {

		var oPage2 = PageLoad(sVal);

		if (oPage2 && !(oPage2.Panels === undefined) && oPage2.Panels) {
			var aoPanels = oPage2.Panels;
			var sExPageKey = oPage2.Key;
			var sExPageTitle = oPage2.Title;
			oPage2 = null;

			if (aoPanels && aoPanels.length > 0) {
				for (var i = 0; i < aoPanels.length; i++) {
					var oPanel = aoPanels[i];
					oPanel.ExPageKey = sExPageKey;

					var nIndex = BoardInfo.RequestLoadPages.GetIndex(sExPageKey);

					if (nIndex > -1) {
						var oReq = BoardInfo.RequestLoadPages.List[nIndex];
						var sReqPageKey = oReq.PageKey;
						var sReqIndex = oReq.PanelIndex;

						oReq = null;
						BoardInfo.RequestLoadPages.RemoveAt(nIndex);

						var oPage = GetPage(sReqPageKey);
						if (oPage) {
							SetPageKeyAndPanelKey(oPanel, null, oPage.Key, oPage.getPanelMaxKey() + 1);

							if (oPage.Panels.length > sReqIndex) {
								oPanel.ExpandTitle = oPage.Panels[sReqIndex].ExpandTitle;
								oPanel.IsExpandable = oPage.Panels[sReqIndex].IsExpandable;
								oPanel.IsExpanded = oPage.Panels[sReqIndex].IsExpanded;
								oPanel.IsPrintable = oPage.Panels[sReqIndex].IsPrintable;
								oPanel.IsPrintExpand = oPage.Panels[sReqIndex].IsPrintExpand;
								oPanel.Value = oPage.Panels[sReqIndex].Value;

								oPage.Panels[sReqIndex] = null;
								oPage.Panels[sReqIndex] = oPanel;
							}
							else {
								oPage.Panels.push(oPanel);
							}

							if (!bDesign) {
								PanelRun(oPage, oPanel, null, oPanel.RunPageAdd, -1, -1);
								SetDataKeyEvent(oPage, oPanel, e_DataKeyEvent_PageAdd);
							}
						}
					}
					else {
						if (BoardInfo.EditMode != e_EditMode_EditPage) {
							if (BoardInfo.Views.length > 0 && BoardInfo.Pages.length > BoardInfo.Views[0]) {
								var oPage = BoardInfo.Pages[BoardInfo.Views[0]];

								if (oPage) {
									SetPageKeyAndPanelKey(oPanel, null, oPage.Key, oPage.getPanelMaxKey() + 1);

									oPanel.ExpandTitle = sExPageTitle;
									oPage.Panels.push(oPanel);
								}
							}// if
						}// if
					}
				}// for i
			}// if

			aoPanels = null;
			SetScroll();
			Draw();
		}// if
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|PageAddPanel", "패널이 존재하지 않습니다.");
		}
	}

	// 디자인 페이지
	function DesignNewPage(strOpt) {
		var asOpts = GetCommandArgs(strOpt, "PAGE_KEY,PAGE_TITLE")

		BoardInfo.EditMode = e_EditMode_DesignPage;

		ClearEditing();
		ClearPage();

		var oPage = NewPage(asOpts[0], asOpts[1]);

		BoardInfo.Pages[0] = oPage;
		BoardInfo.Views[0] = 0;

		SetScroll();
		Draw();
	}

	// 디자인 페이지 : 선택패널 위로 이동
	function DesignPageUpPanel() {
		if (BoardInfo.EditMode == e_EditMode_DesignPage) {
			if (BoardInfo.Selected.getIsExistPanel()) {
				var oPage = GetPage(BoardInfo.Selected.PageKey);

				if (oPage) {
					var nIndex = GetPanelIndex(oPage, BoardInfo.Selected.PanelKey);

					if (nIndex > 0) {
						var oPanel = oPage.Panels[nIndex];
						oPage.Panels.splice(nIndex, 1);
						oPage.Panels.splice(nIndex - 1, 0, oPanel);

						Draw();
					}// if
				}// if
			}// if
		}
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|DesignPageUpPanel", "디자인모드[페이지]에서만 사용가능합니다.");
		}// if
	}

	// 디자인 페이지 : 선택패널 아래로 이동
	function DesignPageDownPanel() {
		if (BoardInfo.EditMode == e_EditMode_DesignPage) {
			if (BoardInfo.Selected.getIsExistPanel()) {
				var oPage = GetPage(BoardInfo.Selected.PageKey);

				if (oPage) {
					var nIndex = GetPanelIndex(oPage, BoardInfo.Selected.PanelKey);
					var nLastIndex = oPage.Panels.length - 1;

					if (nLastIndex > nIndex) {
						var oPanel = oPage.Panels[nIndex];
						oPage.Panels.splice(nIndex, 1);
						oPage.Panels.splice(nIndex + 1, 0, oPanel);

						Draw();
					}// if
				}// if
			}// if
		}
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|DesignPageDownPanel", "디자인모드[페이지]에서만 사용가능합니다.");
		}// if
	}

	// 디자인 페이지 : 선택패널 삭제
	function DesignPageDeletePanel() {
		if (BoardInfo.EditMode == e_EditMode_DesignPage) {
			if (BoardInfo.Selected.getIsExistPanel()) {
				var oPage = GetPage(BoardInfo.Selected.PageKey);

				if (oPage) {
					var nIndex = GetPanelIndex(oPage, BoardInfo.Selected.PanelKey);

					if (nIndex > -1) {
						oPage.Panels[nIndex] = null;
						oPage.Panels.splice(nIndex, 1);

						BoardInfo.Selected.Clear();
						BoardInfo.PropertiesWindow.Clear();

						SetScroll();
						Draw();
					}// if
				}// if
			}// if
		}
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|DesignPageDeletePanel", "디자인모드[페이지]에서만 사용가능합니다.");
		}// if
	}

	function DesignPanelPageKey(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE")

		if (BoardInfo.Pages.length > 0) {
			var oPage = BoardInfo.Pages[0];

			if (oPage) {
				oPage["Key"] = asOpts[0];
				oPage["Title"] = asOpts[1];

				SetPageKey(oPage, asOpts[0]);
				BoardInfo.PropertiesWindow.PageKey = asOpts[0];
			}
		}// if
	}

	// 디자인 새서식패널 추가
	function DesignNewPanel(strOpt) {
		var asOpts = GetCommandArgs(strOpt, "PAGE_KEY,PAGE_TITLE")

		BoardInfo.EditMode = e_EditMode_DesignPanel;

		ItemEditModeClear();
		ClearEditing();
		ClearPage();
		var oPage = NewPage(asOpts[0], asOpts[1]);
		//alert(window.innerWidth + "------" + window.innerHeight);
		var oPanel = NewPanel(5000, 5000);

		oPanel.PageKey = oPage.Key;
		oPanel.Key = oPage.getPanelMaxKey() + 1;

		oPage.Panels.push(oPanel);

		BoardInfo.Pages[0] = oPage;
		BoardInfo.Views[0] = 0;

		SetScroll();
		Draw();

		document.getElementById('Canvas1').focus();
		document.getElementById('Canvas1').click();
		return "";
	}

	// 페이지 로드로드
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
						}
						else if (asNums.indexOf(astrVals4[0]) > -1) {
							oPage[astrVals4[0]] = parseInt(astrVals4[1]);
						}
						else {
							oPage[astrVals4[0]] = astrVals4[1];
						}
					}// for i

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
						}
						else if (asNums.indexOf(astrVals4[0]) > -1) {
							oPanel[astrVals4[0]] = parseInt(astrVals4[1]);
						}
						else if (astrVals4[0] == "Datas") {
							// Datas
							var asDatas = astrVals4[1].split("|^@@^|");

							for (var k = 0; k < asDatas.length; k++) {
								oPanel.Datas.push(asDatas[k]);
							}// for k

							for (var k = oPanel.Datas.length - 1; k >= 0 ; k--) {
								var sData = oPanel.Datas[k];

								if (sData.trim() == "") {
									oPanel.Datas.splice(k, 1);
								}
								else {
									break;
								}
							}// for k
						}
						else if (astrVals4[0] == "Pens") {
							// 팬정보
							var asPens = astrVals4[1].split("|^@@^|");

							for (var k = 0; k < asPens.length; k++) {
								var asPens2 = asPens[k].split("|^@^|");

								var sColor = asPens2[0];
								var asPos = asPens2[1].split(":");
								var aoTotPos = [];

								for (var m = 0; m < asPos.length; m++) {
									var asPos2 = asPos[m].split(",");

									var oPos = GetPenPosition(parseInt(asPos2[0]), parseInt(asPos2[1]), parseInt(asPos2[2]));
									aoTotPos.push(oPos);
								}// for m

								var oPenMaster = GetPenMaster(sColor, aoTotPos);
								oPanel.Pens.push(oPenMaster);

								aoTotPos = null;
							}// for i

							asPens = null;
						}
						else {
							oPanel[astrVals4[0]] = astrVals4[1];
						}
					}// for i

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
						}
						else if (asNums.indexOf(astrVals4[0]) > -1) {
							if (astrVals4[1] == "NaN") {
								astrVals4[1] = "0";
							}
							if (astrVals4[0] == "Width" || astrVals4[0] == "Height") {
								oItem[astrVals4[0]] = parseFloat(astrVals4[1]);
							} else {
								oItem[astrVals4[0]] = parseInt(astrVals4[1]);
							}

						}
						else if (asMultis.indexOf(astrVals4[0]) > -1) {
							var astrVals5 = astrVals4[1].split("|^@^|");
							for (var k = 0; k < astrVals5.length; k++) {
								oItem[astrVals4[0]].push(astrVals5[k]);
							}
						}
						else {
							oItem[astrVals4[0]] = astrVals4[1];
						}
					}// for i

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
								SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "아이템을 적용할 아이템이 없습니다.\nITEM_KEY:" + oItem.ParentItemKey);
							}
						}
					}// if
					else {
						SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "아이템을 적용할 패널이 없습니다.\nPANEL_KEY:" + oItem.PanelKey);
					}

					break;
				}
				}// switch

			}// for i

			bErr = false;


		}

		if (bErr) {

			SetProcData("WARNING", "METHOD_NAME|^@^|DesignPanelLoad", "불러올 페이지가 없습니다.");
		}

		return oPage;
	}

	// 디자인 페이지저장
	function DesignPageSave() {
		SetCommand("SELECT_CLEAR", "", "");
		var bErr = true;
		SetPropertiesWindowValueChangeTag();

		if (BoardInfo.Views.length > 0) {
			var nPgIdx = BoardInfo.Views[0];

			if (BoardInfo.Pages.length > nPgIdx) {
				var oPage = BoardInfo.Pages[nPgIdx];

				var strPageData = GetPageData(oPage, true);
				if (strPageData != "") {

					var canvas = document.getElementById("Canvas1");
					var context = null;

					if (canvas.getContext) {
						context = canvas.getContext("2d");
						var strImage = canvas.toDataURL("image/png")
						SetProcData("DESIGN_PAGE_SAVE", strImage, strPageData);

						bErr = false;
					}

				}// if
			}// if
		}// if

		if (bErr) {
			SetProcData("WARNING", "METHOD_NAME|^@^|DesignPageSave", "저장 도중 오류가 발생하였습니다.");
		}
	}

	// 디자인 패널저장
	function DesignPanelSave() {


		var fileChk = $("#backgroundImage").val();
		if (fileChk != null && fileChk != "") {
			SetBgImge();
		}
		SetPropertiesWindowValueChangeTag();

		if (BoardInfo.Views.length > 0) {
			var nPgIdx = BoardInfo.Views[0];

			if (BoardInfo.Pages.length > nPgIdx) {
				var oPage = BoardInfo.Pages[nPgIdx];

				var strPageData = GetPageData(oPage, true);
				if (strPageData != "") {
					//SetProcData("DESIGN_PANEL_SAVE", "".concat("PAGE_KEY|^@^|", oPage.Key), strPageData);
					$('#drawingDatas').val(strPageData);
					//console.log($('#drawingDatas').val());
					if ($('#drawingDatas').val() != "") {
						var paramData = $('#searchForm').getData();
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateDrawData', paramData, 'POST', 'SaveDraw');
					}
				}// if
			}// if
		}// if

	}

	// 페이지 데이터 반환
	function GetPageData(oPage, bIncludeItem) {
		var strRet = "";

		if (oPage) {

			//--- Page NameAndValue
			var strRet = "PAGE_NAMEVALUE|^@3@^|";
			var astrMembers = [ "Key", "Title", "Style", "Date", "Time", "IsPrintable", "HeadPrint", "FootPrint", "SheetKey", "Value"];

			for (var i = 0; i < astrMembers.length; i++) {
				var strName = astrMembers[i];

				if (i > 0) {
					strRet += "|^@2@^|";
				}

				strRet = strRet.concat(strName, "|^@1@^|", oPage[strName])
			}// for i

			//--- Panels
			for (var i = 0; i < oPage.Panels.length; i++) {
				var oPanel = oPage.Panels[i];

				strRet += "|^@4@^|";
				strRet += GetPanelData(oPanel, bIncludeItem);

			}// for i -- Panels
		}
		else {
			strPageKey = "1";
			SetProcData("WARNING", "METHOD_NAME|^@^|GetPageData", "저장할 페이지가 없습니다.\nPAGE_KEY:" + strPageKey);
		}

		return strRet;
	}

	// 패널 데이터 반환
	function GetPanelData(oPanel, bIncludeItem) {
		var strRet = "";

		if (oPanel) {
			//--- Panel NameAndValue
			var strRet = "PANEL_NAMEVALUE|^@3@^|";
			var astrMembers = [ "PageKey", "Key", "BackColor", "Width", "Height", "IsPrintable", "ExpandTitle",
				"IsExpandable", "IsExpanded", "ExPageKey", "IsPrintExpand", "BackImageString", "BackImageWidth",
				"RunPageAdd", "RunPageLoad", "RunPageSave", "IsUserSizable", "UserMinHeight", "UserMaxHeight", "Value",
				"BackImageAngle"];

			for (var i = 0; i < astrMembers.length; i++) {
				var strName = astrMembers[i];

				if (i > 0) {
					strRet += "|^@2@^|";
				}

				strRet = strRet.concat(strName, "|^@1@^|", oPanel[strName])
			}// for i

			if (oPanel.Datas.length > 0) {
				strRet = strRet.concat("|^@2@^|", "Datas", "|^@1@^|");

				var sDatas = "";

				for (var i = 0; i < oPanel.Datas.length; i++) {
					if (i > 0) {
						sDatas = sDatas.concat("|^@@^|");
					}

					sDatas = sDatas.concat(oPanel.Datas[i]);
				}// for i

				strRet += sDatas;
			}

			if (oPanel.Pens.length > 0) {
				strRet = strRet.concat("|^@2@^|", "Pens", "|^@1@^|");

				var sPens = "";

				for (var i = 0; i < oPanel.Pens.length; i++) {
					if (i > 0) {
						sPens = sPens.concat("|^@@^|");
					}

					var aoPenMaster = oPanel.Pens[i];
					sPens = sPens.concat(aoPenMaster.Color, "|^@^|");

					for (var j = 0; j < aoPenMaster.Positions.length; j++) {
						if (j > 0) {
							sPens = sPens.concat(":");
						}

						var oPos = aoPenMaster.Positions[j];

						sPens = sPens.concat(oPos.X, ",", oPos.Y, ",", oPos.Width);
					}// for j
				}// for i

				strRet += sPens;
			}

			if (bIncludeItem) {
				//--- Item
				for (var i = 0; i < oPanel.Items.length; i++) {
					var oItem = oPanel.Items[i];

					strRet += "|^@4@^|";
					strRet += GetItemData(oItem);
				}// for i --- Item
			}// if (bIncludeItem) {
		}// if
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|GetPanelData", "저장할 패널이 없습니다.");
		}

		return strRet;
	}

	// 아이템 데이터 반환
	function GetItemData(oItem) {
		var strRet = "";

		if (oItem) {
			//--- Item NameAndValue
			var strRet = "ITEM_NAMEVALUE|^@3@^|";
			var astrMembers = [ "PageKey", "PanelKey", "LayerId", "TypeName", "ParentItemKey", "Key", "Style", "Edit", "IsSelectable", "IsPrintable",
				"X", "Y", "Z", "Width", "Height", "Angle", "BackColor", "BackImageString", "BorderColor", "BorderWidth",
				"TextFont", "TextColor", "TextAlign", "TextLineSpacing", "TextBorder", "TextMaxLine", "IsViewOutBound", "IsViewText", "IsVisible",
				"IsBorderLeft", "IsBorderRight", "IsBorderTop", "IsBorderBottom", "IsUserSizable", "TextFormat",
				"IsWrap", "DimensionTop", "DimensionLeft", "DimensionRight", "DimensionBottom", "DimensionWidth", "DimensionLength", "Alpha", "Points", "ItemType","ItemId","RackCount","UnitSize","MobileFlag"]; //, "LabelWidth", "LabelHeight"

			for (var i = 0; i < astrMembers.length; i++) {
				var strName = astrMembers[i];

				if (i > 0) {
					strRet += "|^@2@^|";
				}

				strRet = strRet.concat(strName, "|^@1@^|", oItem[strName])
			}// for i

			//--- 배열
			astrMembers = [ "Text" ];

			for (var i = 0; i < astrMembers.length; i++) {
				var strName = astrMembers[i];

				var strValue = "";
				for (var j = 0; j < oItem[strName].length; j++) {
					if (j > 0) {
						strValue += "|^@^|";
					}

					strValue += oItem[strName][j];
				}// for j

				strRet += "|^@2@^|".concat(strName, "|^@1@^|", strValue);
			}// for

			//--- Childs
			for (var i = 0; i < oItem.Childs.length; i++) {
				var oItem = oItem.Childs[i];

				strRet += "|^@4@^|";
				strRet += GetItemData(oItem);
			}// for i --- Childs

		}// if
		else {
			SetProcData("WARNING", "METHOD_NAME|^@^|GetItemData", "저장할 아이템이 없습니다.");
		}

		return strRet;
	}

	function SetScrollValueAdd(nH, nV) {
		nH += BoardInfo.Scroll.HScroll.Value;
		nV += BoardInfo.Scroll.VScroll.Value;
		SetScrollValue(nH, nV);
	}

	function SetScrollValue(nH, nV) {
		ClearEditing();
		PopupClear();
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

	function SetScroll()
	{
		//--- 스크롤 최대값 지정

		var nTHeight = BoardInfo.getViewsHeight();
		var nTWidth = BoardInfo.getViewsWidth();

		var bHorizontal = false;
		var bVertical = false;

		var nCanvasHeight = BoardInfo.CanvasHeight;
		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nPropertiesWidth = 0;

		// Properties 창을 표시한 조건이면 너비를 지정
		if (BoardInfo.EditMode == e_EditMode_DesignPage || BoardInfo.EditMode == e_EditMode_DesignPanel) {
			if (BoardInfo.PropertiesWindow.IsView) {
				nPropertiesWidth = BoardInfo.PropertiesWindow.getWidth();
			}
		}

		// 속성창 크기 지정
		if (nPropertiesWidth > 0) {
			BoardInfo.PropertiesWindow.X = nCanvasWidth - nPropertiesWidth;
			BoardInfo.PropertiesWindow.Y = 0;
			BoardInfo.PropertiesWindow.Width = nPropertiesWidth;
			BoardInfo.PropertiesWindow.Height = nCanvasHeight;
		}
		else {
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

		// 수직스크롤
		if (bVertical) {
			if (bHorizontal) {
				BoardInfo.Scroll.VScroll.Maximum = nTHeight - nPageScrollHeight + BoardInfo.Scroll.Height;

				BoardInfo.Scroll.VScroll.X = nPageScrollWidth - BoardInfo.Scroll.Width;
				BoardInfo.Scroll.VScroll.Y = 0;
				BoardInfo.Scroll.VScroll.Height = nPageScrollHeight - BoardInfo.Scroll.Height;
				BoardInfo.Scroll.VScroll.Width = BoardInfo.Scroll.Width;
			}
			else {
				BoardInfo.Scroll.VScroll.Maximum = nTHeight - nPageScrollHeight;

				BoardInfo.Scroll.VScroll.X = nPageScrollWidth - BoardInfo.Scroll.Width;
				BoardInfo.Scroll.VScroll.Y = 0;
				BoardInfo.Scroll.VScroll.Height = nPageScrollHeight;
				BoardInfo.Scroll.VScroll.Width = BoardInfo.Scroll.Width;
			}

			if (BoardInfo.Scroll.VScroll.Maximum < BoardInfo.Scroll.VScroll.Value) {
				BoardInfo.Scroll.VScroll.Value = BoardInfo.Scroll.VScroll.Maximum;
			}

			// 스크롤바
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

		}
		else {
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
			}
			else {
				BoardInfo.Scroll.HScroll.Maximum = nTWidth - nPageScrollWidth;

				BoardInfo.Scroll.HScroll.X = 0;
				BoardInfo.Scroll.HScroll.Y = nPageScrollHeight - BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Height = BoardInfo.Scroll.Height;
				BoardInfo.Scroll.HScroll.Width =  nPageScrollWidth;
			}

			if (BoardInfo.Scroll.HScroll.Maximum < BoardInfo.Scroll.HScroll.Value) {
				BoardInfo.Scroll.HScroll.Value = BoardInfo.Scroll.HScroll.Maximum;
			}

			// 스크롤바
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
		}
		else {
			BoardInfo.Scroll.HScroll.Clear();
		}

		BoardInfo.PagesBounds.X = 0;
		BoardInfo.PagesBounds.Y = 0;
		BoardInfo.PagesBounds.Width = BoardInfo.Scroll.VScroll.X;
		BoardInfo.PagesBounds.Height = BoardInfo.Scroll.HScroll.Y;
	}

	function GetNameValueArray(sVal) {
		var aNameValue = [];
		var asValue = sVal.split("|^@@^|");

		for (var i = 0; i < asValue.length; i++) {
			if (asValue[i] != "") {
				var asValue2 = asValue[i].split("|^@^|");

				if (asValue2[0].trim() != "") {
					aNameValue[asValue2[0].trim().toUpperCase()] = asValue2[1];
				}
			}
		}// for i

		return aNameValue;
	}

	function GetNameValueArrayList(sVal) {
		var aList = [];
		var asValue = sVal.split("|^@@@^|");

		for (var i = 0; i < asValue.length; i++) {
			if (asValue[i] != "" && asValue[i].indexOf("|^@@^|") > -1) {
				var aNameValue = GetNameValueArray(asValue[i])

				aList.push(aNameValue);
			}// if
		}// for i

		return aList;
	}

	function GetCommandArgs(args, argKeys) {
		var arrKeys = argKeys.toUpperCase().split(',');
		var arrValues = new Array();

		if (args && args.length > 0) {
			var arrVals = args.split('|^@@^|');

			for (var i = 0; i < arrVals.length; i++) {
				var arrVals3 = arrVals[i].split('|^@^|');

				arrValues[arrVals3[0].toUpperCase()] = arrVals3[1];
			}// for i

			for (var i = 0; i < arrKeys.length; i++) {
				arrKeys[i] = arrValues[arrKeys[i]];

				if (!arrKeys[i])
					arrKeys[i] = "";
			}
		}
		else
		{
			for (var i = 0; i < arrKeys.length; i++) {
				arrKeys[i] = "";
			}
		}

		return arrKeys;
	}

	function GetCommandOption(bSplit, sName, sValue) {
		var sOpt = "";

		if (bSplit) {
			sOpt = "|^@@^|";
		}

		return sOpt.concat(sName, "|^@^|", sValue);
	}

	//--- Canvas 발생 이벤트

	function OnEvtKeyUp(event) {
		BoardInfo.Key.Clear();

		BoardInfo.Key.IsCtrlKey = event.ctrlKey;
		BoardInfo.Key.IsShiftKey = event.shiftKey;
		BoardInfo.Key.IsAltKey = event.altKey;
	}

	function SetItemCheckGroup(oPanel, oItem, sCheckGroup, nKey) {
		sCheckGroup = sCheckGroup.toUpperCase();

		if (oItem == null) {
			//--- 패널 내의 아이템 검사
			for (var i = 0; i < oPanel.Items.length; i++) {
				var oItem2 = oPanel.Items[i];

				if (oItem2.Style == e_ItemStyle_Check && oItem2.Key != nKey && oItem2.CheckGroup.toUpperCase() == sCheckGroup) {
					if (oItem2.Checked != false){
						oItem2.Checked = false;

						var oPage = GetPage(oPanel.PageKey);

						if (oPage) {
							oPage.Edit.setModify(true);
							PanelRun(oPage, oPanel, oItem2, oItem2.ChangedValue, -1, -1);
						}
					}
				}

				SetItemCheckGroup(null, oItem2, sCheckGroup, nKey);
			}// for i
		}
		else {
			//--- 아이템 내의 아이템 검사
			for (var i = 0; oItem.Childs.length; i++) {
				var oItem2 = oItem.Childs[i];

				if (oItem2.Style == e_ItemStyle_Check && oItem2.Key != nKey && oItem2.CheckGroup.toUpperCase() == sCheckGroup) {
					if (oItem2.Checked != false){
						oItem2.Checked = false;

						var oPage = GetPage(oPanel.PageKey);

						if (oPage) {
							oPage.Edit.setModify(true);
							PanelRun(oPage, oPanel, oItem2, oItem2.ChangedValue, -1, -1);
						}
					}
				}

				SetItemCheckGroup(null, oItem2, sCheckGroup, nKey);
			}// for i
		}
	}

	function ItemCopy() {

		BoardInfo.CopyItems = [];

		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		var anCopyItemKeys = [];

		if (oPage && oPanel) {
			for (var i = 0; i < oPanel.Items.length; i++) {
				if (BoardInfo.Selected.ItemKeys.indexOf(oPanel.Items[i].Key) > -1) {
					var oItem = oPanel.Items[i];

					if (oItem && oItem.ParentItemKey == -1 && oItem.Key != 0) {
						var oItem2 = GetCopyItem(oItem, 1);

						BoardInfo.CopyItems.push(oItem2);
					}// if
				}// if
			}// for i

			SetProcData("INFORMATION", "METHOD_NAME|^@^|ItemCopy", BoardInfo.CopyItems.length + "건의 아이템이 복사되었습니다.");
			Draw();
		}// if
	}

	function ItemPaste(nPasteStyle, nX, nY) {
		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		var anCopyItemKeys = [];

		if (oPage && oPanel && BoardInfo.CopyItems.length > 0) {

			var nLeft = 0;
			var nTop = 0;
			var nRight = 0;
			var nBottom = 0;
			for (var i = 0; i < BoardInfo.CopyItems.length; i++) {

				var oItem = BoardInfo.CopyItems[i];

				if (i == 0) {
					nLeft = oItem.X;
					nTop = oItem.Y;
				}

				var nLeft2 = oItem.X;
				var nTop2 = oItem.Y;
				if (oItem.Angle == "90" ||oItem.Angle == "270" ) {
					var nRight2 = oItem.X + oItem.Height;
					var nBottom2 = oItem.Y + oItem.Width;
				} else {
					var nRight2 = oItem.X + oItem.Width;
					var nBottom2 = oItem.Y + oItem.Height;
				}


				if (nLeft > nLeft2) {
					nLeft = nLeft2;
				}

				if (nTop > nTop2) {
					nTop = nTop2;
				}

				if (nRight < nRight2) {
					nRight = nRight2;
				}

				if (nBottom < nBottom2) {
					nBottom = nBottom2;
				}
			}// for i

			nRight -= nLeft;
			nBottom -= nTop;

			for (var i = 0; i < BoardInfo.CopyItems.length; i++) {

				var oItem = BoardInfo.CopyItems[i];

				if (oItem && oItem.ParentItemKey == -1) {
					switch (nPasteStyle) {
					case e_PasteStyle_Right:
					{
						//oItem.X += oItem.Width;
						oItem.X += nRight;

						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0]) + nRight;
								var staightPosY = parseInt(staightPos[1]);
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}
						break;
					}
					case e_PasteStyle_Bottom:
					{
						//oItem.Y += oItem.Height;
						oItem.Y += nBottom;

						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0]);
								var staightPosY = parseInt(staightPos[1]) + nBottom;
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}


						break;
					}
					case e_PasteStyle_Set:
					{
						oItem.X += nX;
						oItem.Y += nY;

						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0])  + nX;
								var staightPosY = parseInt(staightPos[1]) + nY;
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}
						break;
					}
					default:
					{
						oItem.X += 10;
						oItem.Y += 10;

						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0]) + 10;
								var staightPosY = parseInt(staightPos[1]) + 10;
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}
					}
					}// switch

					var nItemRight = oItem.X + oItem.Width;
					var nItemBottom = oItem.Y + oItem.Height;

					if (nItemRight > oPanel.Width) {
						oItem.X = 5;
					}
					if (nItemBottom > oPanel.Height) {
						oItem.Y = 5;
					}
					oItem.ItemId = "";

					var oItem2 = GetCopyItem(oItem, GetItemMaxKey(oPanel, null));
					anCopyItemKeys.push(oItem2.Key);
					oPanel.Items.push(oItem2);

					if (oItem2.Style == e_ItemStyle_Check && oItem2.Checked && oItem2.CheckGroup != "") {
						SetItemCheckGroup(oPanel, null, oItem2.CheckGroup, oItem2.Key);
					}
				}// if
			}// for i
			if (anCopyItemKeys.length > 0) {
				BoardInfo.Selected.ItemKeys = [];
				BoardInfo.Selected.ItemKeys = anCopyItemKeys;
				Draw();
			}
			RefeshPropertiesWindow();
			EquipmentClear();
		}// if
	}

	function ItemDelete(bConfirm) {
		if (BoardInfo.Selected.getIsExistItem()) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				if (bConfirm) {
					if (BoardInfo.Selected.ItemKeys.length > 0) {
						if (confirm("삭제하시겠습니까?") == false) {
							return;
						}// if
					}// if
				}// if

				var aoItems = [];
				for (var i = 0; i < oPanel.Items.length; i++) {
					var oItem = oPanel.Items[i];
					if (itemSisulArr.length > 0) {
						if (itemSisulArr.indexOf(oItem.Key.toString()) == -1) {
							aoItems.push(oItem);
						}
						else {
							if (oItem.Key != "0") {
								oPanel.Items[i] = null;
							} else {
								aoItems.push(oItem);
							}
						}
					}
					else {
						if (BoardInfo.Selected.ItemKeys.indexOf(oItem.Key) == -1) {
							aoItems.push(oItem);
						}
						else {
							if (oItem.Key != "0") {
								oPanel.Items[i] = null;
							} else {
								aoItems.push(oItem);
							}
						}
					}// for i
					}


				oPanel.Items = aoItems;
				BoardInfo.Selected.Clear();
				BoardInfo.PropertiesWindow.Clear();

				oPage.Edit.setModify(true);

				Draw();
				itemSisulArr = [];
			}// if
		}// if
	}

	function OnEvtKeyDown(event) {

		BoardInfo.Key.IsCtrlKey = event.ctrlKey;
		BoardInfo.Key.IsShiftKey = event.shiftKey;
		BoardInfo.Key.IsAltKey = event.altKey;

		if (BoardInfo.EditMode == e_EditMode_EditPage) {

			switch (event.keyCode) {
			case 116:     // F5
			{
				return false;
				break;
			}
			case 9:     // Tab
			{
				if (SetTabProc(true, BoardInfo.Key.IsShiftKey)) {
					event.preventDefault();
				}
				break;
			}
			case 13:    // Enter
			{
				if (SetTabProc(false, BoardInfo.Key.IsShiftKey)) {
					event.preventDefault();
				}
				break;
			}
			case 27:    // ESC
			{
				PopupClear();
				ItemEditModeClear();
				MouseDownClear();
				Draw();
				break;
			}
			case 37:    //왼쪽
			{
				SetScrollValueAdd(-10, 0);
				break;
			}
			case 38:    //위쪽
			{
				SetScrollValueAdd(0, -10);
				break;
			}
			case 39:    //오른쪽
			{
				SetScrollValueAdd(10, 0);
				break;
			}
			case 40:    //아래쪽
			{
				SetScrollValueAdd(0, 10);
				break;
			}
			case 46:    // Del
			{
				ItemDelete(true);

				break;
			}// case 46:
			}// switch
		}
		else if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
			if (event.ctrlKey && !event.shiftKey && event.keyCode == 90) {
				var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
				var sPageData = GetPageData(sPage, true);
				undoData(sPageData);
			} else if (event.ctrlKey && event.shiftKey && event.keyCode == 90) {
				var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
				var sPageData = GetPageData(sPage, true);
				redoData(sPageData);
			}
			if ((BoardInfo.Selected.getIsExistPanel() || BoardInfo.Selected.getIsExistItem()) && BoardInfo.PropertiesWindow.InputTagName == "") {
				switch (event.keyCode) {
				case 27:    // Esc
				{
					MouseDownClear();

					if (BoardInfo.Selected.getIsExistItem()) {
						if (BoardInfo.Views.length > 0 && BoardInfo.Pages.length > BoardInfo.Views[0]) {
							var oPageSelPanel = BoardInfo.Pages[BoardInfo.Views[0]];

							if (oPageSelPanel && oPageSelPanel.Panels.length > 0) {
								BoardInfo.Selected.Clear();
								BoardInfo.Selected.PageKey = oPageSelPanel.Panels[0].PageKey;
								BoardInfo.Selected.PanelKey = oPageSelPanel.Panels[0].Key;

								RefeshPropertiesWindow();
							}
						}// if
					}// if

					Draw();

					break;
				}
				case 66:    // B ... 밑에 붙여넣기
				{
					if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						// 선택된 아이템 붙여넣기
						ItemPaste(e_PasteStyle_Bottom, 0, 0);
					}// if
					break;
				}
				case 67:    // C
				{
					if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						// 선택아이템 Copy
						ItemCopy();
					}
					break;
				}
				case 82:     // R ... 오른쪽에 붙여넣기
				{
					if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						// 선택된 아이템 붙여넣기
						ItemPaste(e_PasteStyle_Right, 0, 0);
					}// if
					break;
				}
				case 86:    // V
				{
					if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						// 선택된 아이템 붙여넣기
						ItemPaste(e_PasteStyle_None, 0, 0);
					}// if
					break;
				}
				case 37:    // 왼쪽 방향키
				{
					if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(1 * -1, 0);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(10 * -1, 0);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(1 * -1, 0);
							RefeshPropertiesWindow();
							Draw();
						}
					}
					else if (event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(10 * -1, 0);
							RefeshPropertiesWindow();
							Draw();
						}
					}

					break;
				}// case 37:
				case 38:    // 위쪽 방향키
				{
					if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
						if (BoardInfo.Selected.getIsExistItem()) {
							SelectedItemMove(0, 1 * -1);
							RefeshPropertiesWindow();
							Draw();
						}
						else if (BoardInfo.Selected.getIsExistPanel()) {
							var oPage = GetPage(BoardInfo.Selected.PageKey);
							var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
							if (oPage && oPanel) {
								var nHeight = oPanel.Height;
								nHeight--;

								if (nHeight < 25) {
									nHeight = 25;
								}

								if (nHeight != oPanel.Height) {
									oPanel.Height = nHeight;

									if (oPanel.Height < oPanel.UserMinHeight) {
										oPanel.UserMinHeight = oPanel.Height;
									}

									RefeshPropertiesWindow();
									SetScroll();
									Draw();
								}
							}// if
						}
					}
					else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(0, 10 * -1);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(0, 1 * -1);
							RefeshPropertiesWindow();
							Draw();
						}
					}
					else if (event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(0, 10 * -1);
							RefeshPropertiesWindow();
							Draw();
						}
					}

					break;
				}// case 38:
				case 39:    // 오른쪽 방향키
				{
					if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(1, 0);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(10, 0);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(1, 0);
							RefeshPropertiesWindow();
							Draw();
						}
					}
					else if (event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(10, 0);
							RefeshPropertiesWindow();
							Draw();
						}
					}

					break;
				}// case 39:
				case 40:    // 아래쪽 방향키
				{
					if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
						if (BoardInfo.Selected.getIsExistItem()) {
							SelectedItemMove(0, 1);
							RefeshPropertiesWindow();
							Draw();
						}
						else if (BoardInfo.Selected.getIsExistPanel()) {
							var oPage = GetPage(BoardInfo.Selected.PageKey);
							var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
							if (oPage && oPanel) {
								var nHeight = oPanel.Height;
								nHeight++;

								if (nHeight > 1000) {
									nHeight = 1000;
								}

								if (nHeight != oPanel.Height) {
									oPanel.Height = nHeight;

									RefeshPropertiesWindow();
									SetScroll();
									Draw();
								}
							}// if
						}
					}
					else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
						SelectedItemMove(0, 10);
						RefeshPropertiesWindow();
						Draw();
					}
					else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(0, 1);
							RefeshPropertiesWindow();
							Draw();
						}
					}
					else if (event.ctrlKey && event.shiftKey && !event.altKey) {
						if (!itemSizeFix) {
							SelectedItemSize(0, 10);
							RefeshPropertiesWindow();
							Draw();
						}
					}

					break;
				}// case 40
				case 46:    // Del
				{
					ItemDelete(false);
					break;
				}// case 46:
//					case 90:    // Undo
//				{
//				if (event.ctrlKey) {
//				alert();
//				var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
//				var sPageData = GetPageData(sPage, true);
//				undoData(sPageData);
//				} else if (event.ctrlKey && event.shiftKey) {
//				var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
//				var sPageData = GetPageData(sPage, true);
//				redoData(sPageData);
//				}
//				break;
//				}// case 46:
				}
			}// if
		}// if
	}

	function SelectedItemOjcSize(nX, nY, arrNum) {
		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {
						var arrPoints = oItem.Points.split(",");
						var asPoints = [];

						var limtX = 0;
						var limtX2 = 0;
						var limtX3 = 0;
						var limtX4 = 0;
						var limtY = 0;
						var limtY2 = 0;
						for (i = 0; i < arrPoints.length; i++) {
							var aslimtPos = arrPoints[i].split(":");
							if (i == 0) {
								limtX = aslimtPos[0];
							} else if (i == 2) {
								limtX2 = aslimtPos[0];
								limtY = aslimtPos[1];
							} else if (i == 3) {
								limtX4 = aslimtPos[0];
							} else if (i == 5) {
								limtX3 = aslimtPos[0];
								limtY2 = aslimtPos[1];
							}
						}
						if (arrNum == 10000) {	// top right
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 0 || i == 1 || i == 12) {
									var nX2 = parseInt(asPos[0]);
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 > limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 10003) {
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								var asPos = arrPoints[i].split(":");
								if (i == 3 || i == 4) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX2) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];

									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 10006) {
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 6 || i == 7) {
									var nX2 = parseInt(asPos[0]);
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 < limtY2) {
										nY2 = parseInt(asPos[1]);
									}
									//console.log(i);
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 10009) {
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 9 || i == 10) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 > limtX) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];

									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 10001) {	// top right
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 1 || i == 2 || i == 5 || i == 6) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];

									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 10004) {
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 4 || i == 5 || i == 8 || i == 9) {
									var nX2 = asPos[0];
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 < limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 20001) {	//T
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 0 || i == 1 || i == 8) {
									var nX2 = asPos[0];
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 > limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 20004) {	// T
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 3 || i == 4) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX3) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 20000) {	// T
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 0 || i == 7 || i == 8) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 > limtX3) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 20002) {	// T
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 1 || i == 2) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX4) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 20005) {	// T
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 4 || i == 5) {
									var nX2 = asPos[0];
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 < limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 30000) {	// L
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 0 || i == 1 || i == 6) {
									var nX2 = asPos[0];
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 > limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 30003) {	// L
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 3 || i == 4) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX2) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 30001) {	// L limtX
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 1 || i == 2) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 30004) {	// L
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 4 || i == 5) {
									var nX2 = asPos[0];
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 < limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 40001) {	// D
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 0 || i == 1 || i == 8) {
									var nX2 = parseInt(asPos[0]);
									var nY2 = parseInt(asPos[1]) + nY;
									if (nY2 > limtY) {
										nY2 = parseInt(asPos[1]);
									}
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 40002) {	//D
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 1 || i == 2) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX4) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						}else if (arrNum == 40005) {	//D
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 5 || i == 6) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX4) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 40004) {	// D
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 3 || i == 4) {
									var nX2 = parseInt(asPos[0]) + nX;
									if (nX2 < limtX) {
										nX2 = parseInt(asPos[0]);
									}
									var nY2 = asPos[1];
									var asNewPoint = nX2+":"+nY2;
									asPoints.push(asNewPoint);
								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						} else if (arrNum == 40006) {	// D
							for (i = 0; i < arrPoints.length; i++) {
								var asPos = arrPoints[i].split(":");
								if (i == 6 || i == 7) {

								} else {
									asPoints.push(arrPoints[i]);
								}
							}
						}
						oItem.Points = asPoints.toString();
						var afterArr = oItem.Points.split(",");
						for(i = 0; i < afterArr.length; i++) {
							var staightPos = afterArr[i].split(":");
							var staightPosX = staightPos[0];
							var staightPosY = staightPos[1];
							if (i == 0) {
								nPenX1 = staightPosX;
								nPenY1 = staightPosY;
								nPenX2 = staightPosX;
								nPenY2 = staightPosY;
							} else {
								nPenX1 = Math.min(nPenX1, staightPosX);
								nPenY1 = Math.min(nPenY1, staightPosY);
								nPenX2 = Math.max(nPenX2, staightPosX);
								nPenY2 = Math.max(nPenY2, staightPosY);
							}
						}
						oItem.X = nPenX1;
						oItem.Y = nPenY1;
						oItem.Width = nPenX2 - nPenX1;
						oItem.Height = nPenY2 - nPenY1;
					}
				}// for i
			}// if

		}

	}
	// 선택된 아이템 직선 포인트 이동
	function SelectedItemStraightMove(nX, nY, arrNum, isShiftKey) {
		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {
			arrNum = arrNum - 1000;
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {

						var arrPoints = oItem.Points.split(",");
						var asPos = arrPoints[arrNum].split(":");

//						if (isShiftKey) {
//							if (!baseDefCk) {
//								baseDefX = parseInt(asPos[0]);
//								baseDefY = parseInt(asPos[1]);
//								baseDefCk = true;
//								console.log(baseDefX+"<-======->"+baseDefY);
//							}
//							if (Math.abs(nX) > Math.abs(nY)) {
//								nY = 0;
//							}
//							else if (Math.abs(nX) < Math.abs(nY)) {
//								nX = 0;
//							}
//							//--- X ---
//							var nX2 = baseDefX + nX;
//							//--- Y ---
//							var nY2 = baseDefY + nY;
//						} else {
//							baseDefX = 0;
//							baseDefY = 0;
//							baseDefCk = false;
//							//--- X ---
//							var nX2 = parseInt(asPos[0]) + nX;
//							//--- Y ---
//							var nY2 = parseInt(asPos[1]) + nY;
//						}
//						if(BoardInfo.Key,isShiftKey){
//							(parseInt(asPos[0]) - nX) > (parseInt(asPos[1]) - nY)
//						}

						var canvasDiv = document.getElementById("divMove");
						if (isWindow == 1) {
							var nX2 = parseInt((BoardInfo.MouseMoveX - oPanel.DrawX)/scaleFactor) * scaleFactor;
							var nY2 = parseInt((BoardInfo.MouseMoveY - oPanel.DrawY)/scaleFactor) * scaleFactor;
						}
						else {
							var nX2 = parseInt((BoardInfo.MouseMoveX - oPanel.DrawX - canvasDiv.offsetLeft)/scaleFactor) * scaleFactor;
							var nY2 = parseInt((BoardInfo.MouseMoveY - oPanel.DrawY)/scaleFactor) * scaleFactor;
						}
//						var nY2 = parseInt(BoardInfo.MouseDownY - canvasDiv.offsetTop);
						//--- X ---
//						var nX2 = parseInt(asPos[0]) + nX;
//						//--- Y ---
//						var nY2 = parseInt(asPos[1]) + nY;

						if(BoardInfo.Key.IsShiftKey){
							if(oItem.Style == e_ItemStyle_Wall){
								if(arrNum - 1 >= 0){
									var asPosB = arrPoints[arrNum-1].split(":");
								} else { //시작점일경우
									var asPosB = arrPoints[arrPoints.length-2].split(":");
								}
								if(arrNum + 2 < arrPoints.length){
									var asPosA = arrPoints[arrNum+1].split(":");
								} else { //끝점일결우
									var asPosA = arrPoints[0].split(":");
								}
								var disB = Math.sqrt(Math.pow(asPosB[0] - nX2,2) + Math.pow(asPosB[1] - nY2,2));
								var disA = Math.sqrt(Math.pow(asPosA[0] - nX2,2) + Math.pow(asPosA[1] - nY2,2));
							} else {
								if(arrNum - 1 >= 0){
									var asPosB = arrPoints[arrNum-1].split(":");
									var disB = Math.sqrt(Math.pow(asPosB[0] - nX2,2) + Math.pow(asPosB[1] - nY2,2));
								} else { //시작점일경우
									var asPosB = 0;
								}
								if(arrNum + 1 < arrPoints.length){
									var asPosA = arrPoints[arrNum+1].split(":");
									var disA = Math.sqrt(Math.pow(asPosA[0] - nX2,2) + Math.pow(asPosA[1] - nY2,2));
								} else { //끝점일결우
									var asPosA = 0;
								}
							}

							if(asPosB != 0 && asPosA != 0){ //중간에있는 점일경우
								if(disA >= disB){ // 뒷점과 가깝다면
									//뒷점과 가깝더라도 앞점과 수평or수직을 이룬다면
									if(Math.abs(asPosA[0] - nX2) < 10){
										nX2 = parseInt(asPosA[0]);
									} else if(Math.abs(asPosA[1] - nY2) < 10){
										nY2 = parseInt(asPosA[1]);
									} else if(Math.abs(asPosB[0] - nX2) > Math.abs(asPosB[1] - nY2)){ //수평
										nY2 = parseInt(asPosB[1]);
									} else { //수직
										nX2 = parseInt(asPosB[0]);
									}
								} else { //앞점과 가깝다면
									//앞점과 가깝더라도 뒷점과 수평or수직을 이룬다면
									if(Math.abs(asPosB[0] - nX2) < 10){
										nX2 = parseInt(asPosB[0]);
									} else if(Math.abs(asPosB[1] - nY2) < 10){
										nY2 = parseInt(asPosB[1]);
									} else if(Math.abs(asPosA[0] - nX2) > Math.abs(asPosA[1] - nY2)){ //수평
										nY2 = parseInt(asPosA[1]);
									} else { //수직
										nX2 = parseInt(asPosA[0]);
									}

								}
							} else if(asPosB == 0){ // 끝점일경우
								if(Math.abs(asPosA[0] - nX2) > Math.abs(asPosA[1] - nY2)){ //수평
									nY2 = parseInt(asPosA[1]);
								} else { //수직
									nX2 = parseInt(asPosA[0]);
								}
							} else if(asPosA == 0){ //시작점일경우
								if(Math.abs(asPosB[0] - nX2) > Math.abs(asPosB[1] - nY2)){ //수평
									nY2 = parseInt(asPosB[1]);
								} else { //수직
									nX2 = parseInt(asPosB[0]);
								}
							}

							if(oItem.Style == e_ItemStyle_Wall){
								if(Math.abs(nX2 - asPosB[0]) < 50  && Math.abs(nY2 - asPosA[1]) < 50){
									nX2 = parseInt(asPosB[0]);
									nY2 = parseInt(asPosA[1]);
								} else if(Math.abs(nX2 - asPosA[0]) < 50  && Math.abs(nY2 - asPosB[1]) < 50){
									nX2 = parseInt(asPosA[0]);
									nY2 = parseInt(asPosB[1]);
								}
							}

						}


//						if (nX2 < 0) {
//							nX2 = 0;
//						}
//
//						if (nY2 < 0) {
//							nY2 = 0;
//						}

						var asNewPoint = nX2+":"+nY2;
						var asPoints = [];
						for (i = 0; i < arrPoints.length; i++) {
							if (i == arrNum) {
								asPoints.push(asNewPoint);
							} else {
								asPoints.push(arrPoints[i]);
							}
						}
						// 배열 마지막은 0값과 동일해야 함.
						if (oItem.Style == e_ItemStyle_Wall && arrNum == 0) {
							asPoints.pop();
							asPoints.push(asNewPoint);
						}


						oItem.Points = asPoints.toString();
						var afterArr = oItem.Points.split(",");
						for(i = 0; i < afterArr.length; i++) {
							var staightPos = afterArr[i].split(":");
							var staightPosX = staightPos[0];
							var staightPosY = staightPos[1];
							if (i == 0) {
								nPenX1 = staightPosX;
								nPenY1 = staightPosY;
								nPenX2 = staightPosX;
								nPenY2 = staightPosY;
							} else {
								nPenX1 = Math.min(nPenX1, staightPosX);
								nPenY1 = Math.min(nPenY1, staightPosY);
								nPenX2 = Math.max(nPenX2, staightPosX);
								nPenY2 = Math.max(nPenY2, staightPosY);
							}
						}
						oItem.X = nPenX1;
						oItem.Y = nPenY1;
						oItem.Width = nPenX2 - nPenX1;
						oItem.Height = nPenY2 - nPenY1;
					}
				}// for i
			}// if
		}// if
	}


	function IsIntersectSnapWithRect(x1, y1, w1, h1, nTarX, nTarY, nTarW, nTarH) {
		return ((( (nTarX < (x1 + w1)) && (x1 < (nTarX + nTarW))) && (nTarY < (y1 + h1))) && (y1 < (nTarY + nTarH)));
	}

	function SelectedItemSnapMove(nX, nY) {
		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
			var nParentX = oPanel.DrawX;
			var nParentY = oPanel.DrawY;

			if (oPage && oPanel) {
				if (BoardInfo.Selected.ItemKeys.length == 1) {
					var strItemKey = BoardInfo.Selected.ItemKeys[0];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {

						nW = oItem.Width;
						nH = oItem.Height;
						nA = oItem.Angle;
						nCenterX =  (parseInt(oItem.DrawX + nX) + 0.5) + nW / 2;
						nCenterY =  (parseInt(oItem.DrawY + nY) + 0.5) + nH / 2;
						//console.log(oItem.DrawX+"---"+oItem.DrawX);
						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall || oItem.Style == e_ItemStyle_DimensionLine) {
							SelectedItemMove(nX, nY);
						} else {
							var anItems = [];
							for (var i = oPanel.Items.length - 1; i >= 0; i--) {
								var targetItem = oPanel.Items[i];
								var nItemX = targetItem.DrawX - 15;
								var nItemY = targetItem.DrawY - 15;
								var nItemW = targetItem.DrawW + 30;
								var nItemH = targetItem.DrawH + 30;
								var nItemA = targetItem.Angle;
								var nItemCenterX =  (parseInt(nItemX) + 0.5) + nItemW / 2;
								var nItemCenterY =  (parseInt(nItemY) + 0.5) + nItemH / 2;

								if (targetItem.LayerId == layerArr[0] && targetItem.Key != strItemKey) {
									if (targetItem.Style == e_ItemStyle_Straight || targetItem.Style == e_ItemStyle_CableLine || targetItem.Style == e_ItemStyle_OjcP || targetItem.Style == e_ItemStyle_OjcT || targetItem.Style == e_ItemStyle_OjcL || targetItem.Style == e_ItemStyle_OjcD || targetItem.Style == e_ItemStyle_InnerWall || targetItem.Style == e_ItemStyle_Wall || targetItem.Style == e_ItemStyle_DimensionLine) {
										continue;
									}

									if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
										if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
											var bSel = IsIntersectWithRect2(nCenterX - nH / 2, nCenterY - nW / 2, nH, nW, nItemCenterX - nItemH / 2, nItemCenterY - nItemW / 2, nItemH, nItemW);
										} else {
											var bSel = IsIntersectWithRect2(parseInt(oItem.DrawX + nX), parseInt(oItem.DrawY + nY), nW, nH, nItemCenterX - nItemH / 2, nItemCenterY - nItemW / 2, nItemH, nItemW);
										}
									} else {
										if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
											var bSel = IsIntersectWithRect2(nCenterX - nH / 2, nCenterY - nW / 2, nH, nW, nItemX, nItemY, nItemW, nItemH);
										} else {
											var bSel = IsIntersectWithRect2(parseInt(oItem.DrawX + nX), parseInt(oItem.DrawY + nY), nW, nH, nItemX, nItemY, nItemW, nItemH);
										}
									}

									if (bSel && oItem.BackImageString.length < 100) {
										anItems.push(targetItem.Key);
									}
								}


							}
//							console.log("-----------------------------------");
							if (anItems.length > 0) {
								var cnt1 = 0;
								var targetKey = 0;
								for (var i = 0; i < anItems.length; i++) {
									var targetItem = GetItem(oPanel, anItems[i]);
									var nItemX = targetItem.DrawX - 15;
									var nItemY = targetItem.DrawY - 15;
									var nItemW = targetItem.DrawW + 30;
									var nItemH = targetItem.DrawH + 30;
									var nItemA = targetItem.Angle;
									var nItemCenterX =  (parseInt(nItemX) + 0.5) + nItemW / 2;
									var nItemCenterY =  (parseInt(nItemY) + 0.5) + nItemH / 2;

									if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											var rectX = Math.max(nCenterX - (nH / 2), nItemCenterX - (nItemH / 2));
											var rectY = Math.max(nCenterY - (nW / 2), nItemCenterY - (nItemW / 2));
											var rectW = Math.min((nCenterX - (nH / 2)) + nH, (nItemCenterX - (nItemH / 2)) + nItemH) - rectX;
											var rectH = Math.min((nCenterY - (nW / 2)) + nW, (nItemCenterY - (nItemW / 2)) + nItemW) - rectY;
										} else {
											var rectX = Math.max(nCenterX - (nH / 2), nItemX);
											var rectY = Math.max(nCenterY - (nW / 2), nItemY);
											var rectW = Math.min((nCenterX - (nH / 2)) + nH, nItemX + nItemW) - rectX;
											var rectH = Math.min((nCenterY - (nW / 2)) + nW, nItemY + nItemH) - rectY;
										}
									} else {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											var rectX = Math.max(parseInt(oItem.DrawX + nX), nItemCenterX - (nItemH / 2));
											var rectY = Math.max(parseInt(oItem.DrawY + nY), nItemCenterY - (nItemW / 2));
											var rectW = Math.min(parseInt(oItem.DrawX + nX) + nW, (nItemCenterX - (nItemH / 2)) + nItemH) - rectX;
											var rectH = Math.min(parseInt(oItem.DrawY + nY) + nH, (nItemCenterY - (nItemW / 2)) + nItemW) - rectY;
										} else {
											var rectX = Math.max(parseInt(oItem.DrawX + nX), nItemX);
											var rectY = Math.max(parseInt(oItem.DrawY + nY), nItemY);
											var rectW = Math.min(parseInt(oItem.DrawX + nX) + nW, nItemX + nItemW) - rectX;
											var rectH = Math.min(parseInt(oItem.DrawY + nY) + nH, nItemY + nItemH) - rectY;
										}
									}

									var rackM = rectW * rectH;
									if (cnt1 < rackM) {
										cnt1 = rackM;
										targetKey = targetItem.Key;
									}
								}
								if (targetKey != 0) {
									var tItem = GetItem(oPanel, targetKey);
									var nItemX = tItem.DrawX;
									var nItemY = tItem.DrawY;
									var nItemW = tItem.DrawW;
									var nItemH = tItem.DrawH;
									var nItemA = tItem.Angle;
									var nItemCenterX =  (parseInt(nItemX) + 0.5) + nItemW / 2;
									var nItemCenterY =  (parseInt(nItemY) + 0.5) + nItemH / 2;
									var drawYn = "0";
									// 왼쪽 기준으로 오른쪽
									if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(nCenterX - (nH / 2)) > nItemCenterX && parseInt(nCenterY - nW / 2) < nItemCenterY) {
//												var nX2 = nItemCenterX + nItemH - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterY - (nW / 2)) - parseInt(nItemCenterY - (nItemW / 2)));
												var rectY_A2 = Math.abs(parseInt(nCenterY - (nW / 2) + nW) - parseInt(nItemCenterY - (nItemW / 2) + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX + nItemH - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemCenterX + nItemH - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) + (nItemW - nW) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "1";
											}
										} else {
											if (parseInt(nCenterX - (nH / 2)) > nItemCenterX && parseInt(nCenterY - (nW / 2)) < nItemCenterY) {
//												var nX2 = nItemX + nItemW + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemY + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterY - (nW / 2)) - parseInt(nItemY));
												var rectY_A2 = Math.abs(parseInt(nCenterY - (nW / 2) + nW) - parseInt(nItemY + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX + nItemW + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemY + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemX + nItemW + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemY + ((nW / 2) - (nH / 2)) + (nItemH - nW) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "1";
											}
										}
									} else {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(oItem.DrawX + nX) > nItemCenterX && parseInt(oItem.DrawY + nY) < nItemCenterY) {
//												var nX2 = nItemCenterX + (nItemH / 2) - nParentX;
//												var nY2 = nItemCenterY - (nItemW / 2) - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawY + nY) - parseInt(nItemCenterY - (nItemW / 2)));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawY + nY + nH) - parseInt(nItemCenterY - (nItemW / 2) + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX + (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) - nParentY;
												} else {
													var nX2 = nItemCenterX + (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + (nItemW - nH) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "1";
											}

										} else {
											if (parseInt(oItem.DrawX + nX) > nItemCenterX && parseInt(oItem.DrawY + nY) < nItemCenterY ) {
												var rectY_A1 = Math.abs(parseInt(oItem.DrawY + nY) - parseInt(nItemY));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawY + nY + nH) - parseInt(nItemY + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX + nItemW - nParentX;
													var nY2 = nItemY - nParentY;
												} else {
													var nX2 = nItemX + nItemW - nParentX;
													var nY2 = nItemY + (nItemH - nH) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "1";
											}
										}
									}
									// 왼쪽 기준으로 아래쪽
									if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY - nW / 2) > nItemCenterY) {
//												var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemCenterY + nItemW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterX - (nH / 2)) - parseInt(nItemCenterX - (nItemH / 2)));
												var rectY_A2 = Math.abs(parseInt(nCenterX - (nH / 2) + nH) - parseInt(nItemCenterX - (nItemH / 2) + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY + nItemW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) + (nItemH - nH) - nParentX;
													var nY2 = nItemCenterY + nItemW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "2";
											}
										} else {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY - (nW / 2)) > nItemCenterY) {
//												var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemY + nItemH + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterX - (nH / 2)) - parseInt(nItemX));
												var rectY_A2 = Math.abs(parseInt(nCenterX - (nH / 2) + nH) - parseInt(nItemX + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemY + nItemH + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) + (nItemW - nH) - nParentX;
													var nY2 = nItemY + nItemH + ((nW / 2) - (nH / 2)) - nParentY;
												}

												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "2";
											}
										}
									} else {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(oItem.DrawX + nX) < nItemCenterX && parseInt(oItem.DrawY + nY) > nItemCenterY) {
//												var nX2 = nItemCenterX - (nItemH / 2) - nParentX;
//												var nY2 = nItemCenterY + (nItemW / 2) - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawX + nX) - parseInt(nItemCenterX - (nItemH / 2)));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawX + nX + nW) - parseInt(nItemCenterX - (nItemH / 2) + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY + (nItemW / 2) - nParentY;
												} else {
													var nX2 = nItemCenterX - (nItemH / 2) + (nItemH - nW)  - nParentX;
													var nY2 = nItemCenterY + (nItemW / 2) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "2";
											}

										} else {
											if (parseInt(oItem.DrawX + nX) < nItemCenterX && parseInt(oItem.DrawY + nY) > nItemCenterY ) {
//												var nX2 = nItemX - nParentX;
//												var nY2 = nItemY + nItemH - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawX + nX) - parseInt(nItemX));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawX + nX + nW) - parseInt(nItemX + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX - nParentX;
													var nY2 = nItemY + nItemH - nParentY;
												} else {
													var nX2 = nItemX  + (nItemW - nW) - nParentX;
													var nY2 = nItemY + nItemH - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "2";
											}
										}
									}

									// 오른쪽/위쪽 기준으로 왼쪽
									if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY - nW / 2) < nItemCenterY) {
//												var nX2 = nItemCenterX - nW - (nItemH / 2) - ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterY - (nW / 2)) - parseInt(nItemCenterY - (nItemW / 2)));
												var rectY_A2 = Math.abs(parseInt(nCenterY - (nW / 2) + nW) - parseInt(nItemCenterY - (nItemW / 2) + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - nW - (nItemH / 2) - ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemCenterX - nW - (nItemH / 2) - ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + ((nW / 2) - (nH / 2)) + (nItemW - nW) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "3";
											}
										} else {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY - (nW / 2)) < nItemCenterY) {
//												var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nH - nParentX;
//												var nY2 = nItemY + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterY - (nW / 2)) - parseInt(nItemY));
												var rectY_A2 = Math.abs(parseInt(nCenterY - (nW / 2) + nW) - parseInt(nItemY + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nH - nParentX;
													var nY2 = nItemY + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nH - nParentX;
													var nY2 = nItemY + ((nW / 2) - (nH / 2)) + (nItemH - nW) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "3";
											}
										}
									} else {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(oItem.DrawX + nX + nW) < nItemCenterX && parseInt(oItem.DrawY + nY) < nItemCenterY) {
//												var nX2 = nItemCenterX - nW - (nItemH / 2) - nParentX;
//												var nY2 = nItemCenterY - (nItemW / 2) - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawY + nY) - parseInt(nItemCenterY - (nItemW / 2)));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawY + nY + nH) - parseInt(nItemCenterY - (nItemW / 2) + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - nW - (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) - nParentY;
												} else {
													var nX2 = nItemCenterX - nW - (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY - (nItemW / 2) + (nItemW - nH) - nParentY;
												}

												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "3";
											}

										} else {
											if (parseInt(oItem.DrawX + nX + nW) < nItemCenterX && parseInt(oItem.DrawY + nY) < nItemCenterY ) {
//												var nX2 = nItemX - nW - nParentX;
//												var nY2 = nItemY - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawY + nY) - parseInt(nItemY));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawY + nY + nH) - parseInt(nItemY + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX - nW - nParentX;
													var nY2 = nItemY - nParentY;
												} else {
													var nX2 = nItemX - nW - nParentX;
													var nY2 = nItemY + (nItemH - nH) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "3";
											}
										}
									}


									if ((nA > 85 && nA < 95) || (nA > 265 && nA < 275)) {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY -( nW / 2) + nW) < nItemCenterY) {
//												var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemCenterY - nW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterX - (nH / 2)) - parseInt(nItemCenterX - (nItemH / 2)));
												var rectY_A2 = Math.abs(parseInt(nCenterX - (nH / 2) + nH) - parseInt(nItemCenterX - (nItemH / 2) + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemCenterY - nW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemCenterX - (nItemH / 2) + ((nH / 2) - (nW / 2)) + (nItemH - nH) - nParentX;
													var nY2 = nItemCenterY - nW - (nItemW / 2) + ((nW / 2) - (nH / 2)) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "4";
											}
										} else {
											if (parseInt(nCenterX - (nH / 2)) < nItemCenterX && parseInt(nCenterY - (nW / 2) + nW) < nItemCenterY) {
//												var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nParentX;
//												var nY2 = nItemY - nW + ((nW / 2) - (nH / 2)) - nParentY;
												var rectY_A1 = Math.abs(parseInt(nCenterX - (nH / 2)) - parseInt(nItemX));
												var rectY_A2 = Math.abs(parseInt(nCenterX - (nH / 2) + nH) - parseInt(nItemX + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) - nParentX;
													var nY2 = nItemY - nW + ((nW / 2) - (nH / 2)) - nParentY;
												} else {
													var nX2 = nItemX + ((nH / 2) - (nW / 2)) + (nItemW - nH) - nParentX;
													var nY2 = nItemY - nW + ((nW / 2) - (nH / 2)) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "Y";
											}
										}
									} else {
										if ((nItemA > 85 && nItemA < 95) || (nItemA > 265 && nItemA < 275)) {
											if (parseInt(oItem.DrawX + nX) < nItemCenterX && parseInt(oItem.DrawY + nY + nH) < nItemCenterY) {
//												var nX2 = nItemCenterX - (nItemH / 2) - nParentX;
//												var nY2 = nItemCenterY - nH - (nItemW / 2) - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawX + nX) - parseInt(nItemCenterX - (nItemH / 2)));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawX + nX + nW) - parseInt(nItemCenterX - (nItemH / 2) + nItemH));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemCenterX - (nItemH / 2) - nParentX;
													var nY2 = nItemCenterY - nH - (nItemW / 2) - nParentY;
												} else {
													var nX2 = nItemCenterX - (nItemH / 2) + (nItemH - nW) - nParentX;
													var nY2 = nItemCenterY - nH - (nItemW / 2) - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "4";
											}

										} else {
											if (parseInt(oItem.DrawX + nX) < nItemCenterX && parseInt(oItem.DrawY + nY + nH) < nItemCenterY ) {
//												var nX2 = nItemX - nParentX;
//												var nY2 = nItemY - nH - nParentY;
												var rectY_A1 = Math.abs(parseInt(oItem.DrawX + nX) - parseInt(nItemX));
												var rectY_A2 = Math.abs(parseInt(oItem.DrawX + nX + nW) - parseInt(nItemX + nItemW));
												if (rectY_A1 < rectY_A2) {
													var nX2 = nItemX - nParentX;
													var nY2 = nItemY - nH - nParentY;
												} else {
													var nX2 = nItemX + (nItemW - nW) - nParentX;
													var nY2 = nItemY - nH - nParentY;
												}
												oItem.X = nX2;
												oItem.Y = nY2;
												drawYn = "4";
											}
										}
									}


									if (drawYn == "0") {
										SelectedItemMove(nX, nY);
									} else {
										if (BoardInfo.EditMode == e_EditMode_EditPage) {
											oPage.Edit.setModify(true);
										}
									}

								} else {
									SelectedItemMove(nX, nY);
								}
							} else {
								SelectedItemMove(nX, nY);
							}

						}
					} else {
						SelectedItemMove(nX, nY);
					}

				} else {
					SelectedItemMove(nX, nY);
				}
			}


		}
//		var SnapYn = "N";
//		var nW = 0;
//		var nH = 0;
//		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {
//
//
//		}// if

		//console.log(nX+"---------------"+nY);
//		var SnapYn = "N";
//		var nW = 0;
//		var nH = 0;
//		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {
//
//			var oPage = GetPage(BoardInfo.Selected.PageKey);
//			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
//
//			if (oPage && oPanel) {
//				if (BoardInfo.Selected.ItemKeys.length == 1) {
//					var strItemKey = BoardInfo.Selected.ItemKeys[0];
//					var oItem = GetItem(oPanel, strItemKey);
//					if (oItem) {
//						nW = oItem.Width;
//						nH = oItem.Height;
//						nA = oItem.Angle;
//						cx =  (parseInt(oItem.X) + 0.5) + nW / 2;
//						cy =  (parseInt(oItem.Y) + 0.5) + nH / 2;
//					}
//					if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall || oItem.Style == e_ItemStyle_DimensionLine) {
//						SelectedItemMove(nX, nY);
//					} else {
//						for (var i = oPanel.Items.length - 1; i >= 0; i--) {
//
//							var tItem = oPanel.Items[i];
//							if (tItem) {
//								if (tItem.LayerId == layerArr[0] && tItem.Key != oItem.Key) {
//									var nItemX = tItem.DrawX - 10;
//									var nItemY = tItem.DrawY - 10;
//									var nItemW = tItem.DrawW + 20;
//									var nItemH = tItem.DrawH + 20;
//									var nItemA = tItem.Angle;
//
//									var trans_cx =  (parseInt(nItemX) + 0.5) + nItemW / 2;
//									var trans_cy =  (parseInt(nItemY) + 0.5) + nItemH / 2;
//
//									if (tItem.Style == e_ItemStyle_Straight || tItem.Style == e_ItemStyle_CableLine || tItem.Style == e_ItemStyle_OjcP || tItem.Style == e_ItemStyle_OjcT || tItem.Style == e_ItemStyle_OjcL || tItem.Style == e_ItemStyle_OjcD || tItem.Style == e_ItemStyle_InnerWall || tItem.Style == e_ItemStyle_Wall || tItem.Style == e_ItemStyle_DimensionLine) {
//										continue;
//									}
//
//									if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
//										var bSel1 = IsIntersectWithRect(parseInt(oItem.X + nX), parseInt(oItem.Y + nY), 5, 5, trans_cx - nItemH / 2, trans_cy - nItemW / 2, nItemH, nItemW);
//									} else {
//										if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//											var bSel1 = IsIntersectWithRect(parseInt(cx - (nH / 2) + nX), parseInt(cy - (nW / 2) + nY), 5, 5, nItemX, nItemY, nItemW, nItemH);
//										} else {
//											var bSel1 = IsIntersectWithRect(parseInt(oItem.X + nX), parseInt(oItem.Y + nY), 5, 5, nItemX, nItemY, nItemW, nItemH);
//										}
//									}
//
//									// 오른쪽 위
//									if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
//										var bSel2 = IsIntersectWithRect(parseInt(oItem.X + nX) + nW, parseInt(oItem.Y + nY), 5, 5, trans_cx - nItemH / 2, trans_cy - nItemW / 2, nItemH, nItemW);
//									} else {
//										var bSel2 = IsIntersectWithRect(parseInt(oItem.X + nX) + nW, parseInt(oItem.Y + nY), 5, 5, nItemX, nItemY, nItemW, nItemH);
//									}
//
//									// 왼쪽 아래
//									if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
//										var bSel3 = IsIntersectWithRect(parseInt(oItem.X + nX), parseInt(oItem.Y + nY) + nH, 5, 5, trans_cx - nItemH / 2, trans_cy - nItemW / 2, nItemH, nItemW);
//									} else {
//										var bSel3 = IsIntersectWithRect(parseInt(oItem.X + nX), parseInt(oItem.Y + nY) + nH, 5, 5, nItemX, nItemY, nItemW, nItemH);
//									}
//
//									// 오른쪽 아래
////									if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {	// 로테이션 된 영역 처리는 교집합 영역을 클릭시 선택 처리 되게 해야 함.
////										var bSel4 = IsIntersectWithRect(nX + nW, nY + nH, 1, 1, trans_cx - nItemH / 2, trans_cy - nItemW / 2, nItemH, nItemW);
////									} else {
////										var bSel4 = IsIntersectWithRect(nX + nW, nY + nH, 1, 1, nItemX, nItemY, nItemW, nItemH);
////									}
//
//									oItem.MobileFlag = 'N';
//									if (!bSel1 && !bSel2 && !bSel3) {  //|| bSel4
//										//SnapYn = "N";
//									}
//
//									if (bSel1) {
//										if (parseInt(oItem.X + nX) > trans_cx && parseInt(oItem.Y + nY) < trans_cy) { // 왼쪽 꼭지점이 중앙 오른쪽 위에 위치하였다면
//											if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = trans_cx + tItem.DrawH - (tItem.DrawH / 2) + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = trans_cy - (tItem.DrawW / 2) + ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = trans_cx + tItem.DrawH - (tItem.DrawH / 2) - 4;
//													var nY2 = trans_cy - (tItem.DrawW / 2) - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											} else {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = tItem.DrawX + tItem.DrawW + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = tItem.DrawY + ((nW / 2) - (nH / 2)) - 4;
//
//												} else {
//													var nX2 = tItem.DrawX + tItem.DrawW - 4;
//													var nY2 = tItem.DrawY - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//
//											}
//											SnapYn = "Y";
//											if (BoardInfo.EditMode == e_EditMode_EditPage) {
//												oPage.Edit.setModify(true);
//											}
//											break;
//										} else if (parseInt(oItem.X + nX) < trans_cx && parseInt(oItem.Y + nY) > trans_cy) {
//											if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = trans_cx - (tItem.DrawH / 2) + ((nH / 2) - (nW / 2))  - 4;
//													var nY2 = trans_cy  + tItem.DrawW - (tItem.DrawW / 2) + ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = trans_cx - (tItem.DrawH / 2) - 4;
//													var nY2 = trans_cy  + tItem.DrawW - (tItem.DrawW / 2) - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											} else {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = tItem.DrawX  + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = tItem.DrawY + tItem.DrawH + ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = tItem.DrawX - 4;
//													var nY2 = tItem.DrawY + tItem.DrawH - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											}
//											SnapYn = "Y";
//											if (BoardInfo.EditMode == e_EditMode_EditPage) {
//												oPage.Edit.setModify(true);
//											}
//											break;
//										}
//									}
//
//									if (bSel2) {
//										if (parseInt(oItem.X + nX + nW) < trans_cx && parseInt(oItem.Y + nY) < trans_cy) { // 오른쪽 꼭지점이 중앙 왼쪽 위에 위치하였다면
//											if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = trans_cx - nW - (tItem.DrawH / 2) - ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = trans_cy - (tItem.DrawW / 2) + ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = trans_cx - nW - (tItem.DrawH / 2) - 4;
//													var nY2 = trans_cy - (tItem.DrawW / 2) - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											} else {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = tItem.DrawX - nW + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = tItem.DrawY - ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = tItem.DrawX - nW - 4;
//													var nY2 = tItem.DrawY - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											}
//											SnapYn = "Y";
//											if (BoardInfo.EditMode == e_EditMode_EditPage) {
//												oPage.Edit.setModify(true);
//											}
//											break;
//										}
//									}
//
//
//									if (bSel3) {
//										if (parseInt(oItem.X + nX) < trans_cx && parseInt(oItem.Y + nY + nH) < trans_cy) { // 왼쪽 아래 꼭지점이 중앙 왼쪽 아래에 위치하였다면
//											if ((nItemA > 85 && nItemA < 95) ||(nItemA > 265 && nItemA < 275)) {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = trans_cx - (tItem.DrawH / 2) + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = trans_cy - nH - (tItem.DrawW / 2) - ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = trans_cx - (tItem.DrawH / 2) - 4;
//													var nY2 = trans_cy - nH - (tItem.DrawW / 2) - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											} else {
//												if ((nA > 85 && nA < 95) ||(nA > 265 && nA < 275)) {
//													var nX2 = tItem.DrawX + ((nH / 2) - (nW / 2)) - 4;
//													var nY2 = tItem.DrawY - nH - ((nW / 2) - (nH / 2)) - 4;
//												} else {
//													var nX2 = tItem.DrawX - 4;
//													var nY2 = tItem.DrawY - nH - 4;
//												}
//												oItem.X = nX2;
//												oItem.Y = nY2;
//											}
//											SnapYn = "Y";
//											if (BoardInfo.EditMode == e_EditMode_EditPage) {
//												oPage.Edit.setModify(true);
//											}
//											break;
//										}
//									}
//
//								}
//							}
//
//						}
//						if (SnapYn == "N") {
//							SelectedItemMove(nX, nY);
//						} else {
//							if (BoardInfo.EditMode == e_EditMode_EditPage) {
//								oPage.Edit.setModify(true);
//							}
//						}
//					}
//
//				} else {
//					SelectedItemMove(nX, nY);
//				}
//			}// if
//		}// if
	}

	// 선택된 아이템 이동
	function SelectedItemMove(nX, nY) {
		//console.log(nX+"---------------"+nY);
		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];
					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {
						// 모바일 랙 등록 일경우 Y Flag 값을 가지고 있으며, 무조건 아이템 이동이 있을 경우 N으로 처리함.
						oItem.MobileFlag = 'N';

						//--- X ---
						var nX2 = oItem.X + nX;
//						if (nX2 < 0) {
//							nX2 = 0;
//						}

						var nR2 = nX2 + oItem.Width;
						if (nR2 > oPanel.Width) {
							nX2 -= nR2 - (oPanel.Width);
						}

						oItem.X = nX2;

						//--- Y ---
						var nY2 = oItem.Y + nY;
//						if (nY2 < 0) {
//							nY2 = 0;
//						}

						var nB2 = nY2 + oItem.Height;
						if (nB2 > oPanel.Height) {
							nY2 -= nB2 - (oPanel.Height + 1);
						}

						oItem.Y = nY2;
						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0])  + nX;
								var staightPosY = parseInt(staightPos[1]) + nY;
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}
						if (BoardInfo.EditMode == e_EditMode_EditPage) {
							oPage.Edit.setModify(true);
						}
					}
				}// for i
			}// if
		}// if
	}

	function SelectedItemMove2(nX, nY) {
		//console.log(nX+"---------------"+nY);
		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];
					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {
						// 모바일 랙 등록 일경우 Y Flag 값을 가지고 있으며, 무조건 아이템 이동이 있을 경우 N으로 처리함.
						oItem.MobileFlag = 'N';

						//--- X ---
						var nX2 = oItem.X + nX;
//						if (nX2 < 0) {
//							nX2 = 0;
//						}

						var nR2 = nX2 + oItem.Width;
						if (nR2 > oPanel.Width) {
							nX2 -= nR2 - (oPanel.Width);
						}

						oItem.X = nX2;

						//--- Y ---
						var nY2 = oItem.Y + nY;
//						if (nY2 < 0) {
//							nY2 = 0;
//						}

						var nB2 = nY2 + oItem.Height;
						if (nB2 > oPanel.Height) {
							nY2 -= nB2 - (oPanel.Height + 1);
						}

						oItem.Y = nY2;
						if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
							//console.log(oItem.Points.toString());
							var arrPoints = oItem.Points.split(",");
							var asPoints = [];
							for (j = 0; j < arrPoints.length; j++) {
								var staightPos = arrPoints[j].split(":");
								var staightPosX = parseInt(staightPos[0])  + nX;
								var staightPosY = parseInt(staightPos[1]) + nY;
								asPoints.push(staightPosX+":"+staightPosY);
							}
							oItem.Points = asPoints.toString();
						}
						if (BoardInfo.EditMode == e_EditMode_EditPage) {
							oPage.Edit.setModify(true);
						}
						SelectedItemSnapMove(oItem.X, oItem.Y);
					}
				}// for i
			}// if
		}// if
	}

	function SelectedItemVertex(nW, nH) {
		//alert(nW);
		if (BoardInfo.Selected.getIsExistItem() && (nW != 0)) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {
						var oPoints = oItem.Points;
						if (oPoints == "") {
							oPoints = 0;
						}
						if ((oItem.Angle >= 0 && oItem.Angle < 90) || (oItem.Angle >= 270 && oItem.Angle < 360)) {
							var nV2 = oPoints + nW;
						}
						else {
							var nV2 = oPoints - nW;
						}

//						if (nV2 < 0) {
//							nV2 = 0;
//						}
						if (nV2 > oItem.Width) {
							nV2 = oItem.Width;
						}
						var nR2 = nV2 + oItem.X;
						if (nR2 > oPanel.Width) {
							nV2 -= nR2 - (oPanel.Width);
						}
						oItem.Points = nV2;
					}
				}// for i
			}// if
		}// if
	}
	// 선택된 아이템 크기변경
	function SelectedItemSize(nW, nH) {

		if (BoardInfo.Selected.getIsExistItem() && (nW != 0 || nH != 0)) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

			if (oPage && oPanel) {
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {
						//--- W ---
						var nW2 = oItem.Width + nW;

						if (nW2 < 2) {
							nW2 = 2;
						}

						var nR2 = nW2 + oItem.X;
						if (nR2 > oPanel.Width) {
							nW2 -= nR2 - (oPanel.Width);
						}

						oItem.Width = nW2;

						//--- 높이 ---
						var nH2 = oItem.Height + nH;

						if (nH2 < 2) {
							nH2 = 2;
						}

						var nB2 = nH2 + oItem.Y;
						if (nB2 > oPanel.Height) {
							nH2 -= nB2 - (oPanel.Height);
						}
						if (BoardInfo.Key.IsCtrlKey){
							oItem.Height = nW2;
						} else {
							oItem.Height = nH2;
						}
					}
				}// for i
			}// if
		}// if
	}

	function SelectedItemRotate(nX, nY, CtrlKeyYn) {

		if (BoardInfo.Selected.getIsExistItem() && (nX != 0 || nY != 0)) {

			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);



			if (oPage && oPanel) {
				nX = nX - oPanel.DrawX;
				nY = nY - oPanel.DrawY;
				for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
					var strItemKey = BoardInfo.Selected.ItemKeys[i];

					var oItem = GetItem(oPanel, strItemKey);
					if (oItem) {

						var cX =  (parseInt(oItem.X) + 0.5) + oItem.Width / 2;
						var cY =  (parseInt(oItem.Y) + 0.5) + oItem.Height / 2;

						var nA2 = Math.atan2(nY - cY, nX - cX) * 180 / Math.PI;
						nA2 += 90;
						if (nA2 < 0) { nA2 = 360 + nA2; }
						if (CtrlKeyYn && (nA2 >= 0 && nA2 < 45)) {
							nA2 = 45;
						} else if (CtrlKeyYn && (nA2 >= 45 && nA2 < 90)) {
							nA2 = 90;
						} else if (CtrlKeyYn && (nA2 >= 90 && nA2 < 135)) {
							nA2 = 135;
						} else if (CtrlKeyYn && (nA2 >= 135 && nA2 < 180)) {
							nA2 = 180;
						} else if (CtrlKeyYn && (nA2 >= 180 && nA2 < 225)) {
							nA2 = 225;
						} else if (CtrlKeyYn && (nA2 >= 225 && nA2 < 270)) {
							nA2 = 270;
						} else if (CtrlKeyYn && (nA2 >= 270 && nA2 < 315)) {
							nA2 = 315;
						} else if (CtrlKeyYn && (nA2 >= 315 && nA2 < 360)) {
							nA2 = 0;
						}
						oItem.Angle = nA2;

						if (BoardInfo.EditMode == e_EditMode_EditPage) {
							oPage.Edit.setModify(true);
						}
					}
				}// for i
			}// if
		}// if
	}

	function OnEvtMouseWheel(event) {

		if ('wheelDelta' in event) {
			if (event.wheelDelta > 0) {
				scaleFactor *= 1.1;
				scaleFactorText *= 1.1;
				Draw();
			}
			else {
				scaleFactor /= 1.1;
				scaleFactorText /= 1.1;
				Draw();
			}
			$('#scaleTitle').text((Math.round(scaleFactorText * 100)).toString() + "%");
			//$("#scaleTitle").innerHTML = Math.round(scaleFactor);
		}// if
	}

	function OnEvtMouseMove(event) {
		if (BoardInfo.IsMouseDown) {
			if ((event.button != 0 && event.button != 1 && event.button != 2) || event.buttons == 0) {
				MouseDownClear();
				Draw();
			}
		}
		var canvasDiv = document.getElementById("divMove");
		var nX = parseInt((event.x - canvasDiv.offsetLeft)/scaleFactor);
		if (isWindow == 1) {
			var nY = parseInt((event.y - canvasDiv.offsetTop - baseOffsetTop)/scaleFactor);
		}
		else {
			var nY = parseInt((event.y - canvasDiv.offsetTop)/scaleFactor);
		}

		BoardInfo.MouseMoveX = nX;
		BoardInfo.MouseMoveY = nY;
		if (addItemType == "straightline" || addItemType == "cableline") {
			$("#spanTooltip").text("  ■ CtrlKey+MouseDown : 직선 연결 가능");
			$("#layerTooltip").css('display','Inline');
			$("#layerTooltip").css('left', event.clientX + 20);
			$("#layerTooltip").css('top',event.clientY - 20);
		} else {
			$("#layerTooltip").css('display','none');
		}
		// cursor 변경
		if (BoardInfo.AddItemStyle == e_ItemStyle_None) {  // 패널 디자인 꼭지점 크기조정하기
			if (BoardInfo.Selected.getIsExistItem()) {

				var nPointNo = 0;
				if (BoardInfo.Selected.getIsExistPoint()) {
					for (var ip = 0; ip < BoardInfo.Selected.Points.length; ip++) {
						var sPoint = BoardInfo.Selected.Points[ip];
						var asPoint = sPoint.split(",");

						if (asPoint.length == 5) {
							var nPX = parseInt(asPoint[1]);
							var nPY = parseInt(asPoint[2]);
							var nPW = parseInt(asPoint[3]);
							var nPH = parseInt(asPoint[4]);

							var bContainer2 = IsIntersectWithRect(nPX, nPY, nPW, nPH, BoardInfo.MouseMoveX, BoardInfo.MouseMoveY, 1, 1);
							if (bContainer2) {
								nPointNo = parseInt(asPoint[0]);
								MouseCursor = nPointNo;
								switch (nPointNo) {
								case 1: { document.getElementById("Canvas1").style.cursor = "nw-resize"; break; }
								case 2: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 3: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 4: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 5: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 6: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 7: { document.getElementById("Canvas1").style.cursor = "pointer"; break; }
								case 8: { document.getElementById("Canvas1").style.cursor = "nw-resize"; break; }
								case 9: { document.getElementById("Canvas1").style.cursor = "move"; break; }
								case 10: { document.getElementById("Canvas1").style.cursor = "e-resize"; break; }
								default:
								{
									document.getElementById("Canvas1").style.cursor = "default";
									if (nPointNo > 999) {
										document.getElementById("Canvas1").style.cursor = "move";

										switch (nPointNo) {
										case 10000:
										case 10003:
										case 10006:
										case 10009:
										case 20000:
										case 20002:
										case 20005:
										case 20009:
										case 30000:
										case 30003:
											$("#spanTooltip").text("  ■ 노란색 꼭지점 : 길이 조절 가능");
											break;
										default:
											$("#spanTooltip").text("  ■ 붉은색 꼭지점 : 폭 조절 가능");
										break;
										}
										//if (oItem.Style != e_ItemStyle_Wall && oItem.Style != e_ItemStyle_InnerWall) {
											$("#layerTooltip").css('display','Inline');
											$("#layerTooltip").css('left', event.clientX + 20);
											$("#layerTooltip").css('top',event.clientY - 20);
											//}
									}
									break;
								}
								}
								break;
							}// if
							else {
								MouseCursor = 0;
								document.getElementById("Canvas1").style.cursor = "default";
							}
						}// if
					}// for ip
				}// if
			}
		}
		if (!BoardInfo.IsMouseDown && MouseDownStraight && BoardInfo.ItemEditMode == e_ItemEditMode_Straight) {
			if (BoardInfo.PenWebWrite) {
				//BoardInfo.MainContext.putImageData(lineBackup, 0, 0);
				BoardInfo.MainContext.clearRect(0, 0, 3000, 3000);
				Draw();
				BoardInfo.MainContext.beginPath();
				BoardInfo.MainContext.strokeStyle = "rgba(0,255,255,0.3)";
				BoardInfo.MainContext.lineWidth = 2;
				BoardInfo.MainContext.lineCap = "butt";
				BoardInfo.MainContext.lineJoin = "round";
				var oPageLine = GetPage(1);
				var oPanelLine = GetPanel(oPageLine, 1);
				BoardInfo.MainContext.moveTo((lineSx + oPanelLine.DrawX)*scaleFactor + 1, (lineSy + oPanelLine.DrawY)*scaleFactor + 1);
				if (BoardInfo.Key.IsShiftKey) {	// 대각선 이동 불가 처리
					var nDefX = ((lineSx + oPanelLine.DrawX)*scaleFactor + 1);
					var nDefY = ((lineSy + oPanelLine.DrawY)*scaleFactor + 1);
					if(Math.abs(nDefX - nX) > Math.abs(nDefY - nY)){
						BoardInfo.MainContext.lineTo(nX*scaleFactor, nDefY);
					}else{
						BoardInfo.MainContext.lineTo(nDefX, nY*scaleFactor);
					}
				} else {
					BoardInfo.MainContext.lineTo(nX*scaleFactor, nY*scaleFactor);
				}

//
//				BoardInfo.MainContext.moveTo(lineSx + 1, lineSy + 1);
//				BoardInfo.MainContext.lineTo(nX, nY);
				BoardInfo.MainContext.stroke();

				$("#hstTitle").val("아이템 직선 Point생성-변경");
			}
		}
		else if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "MIDDLE") {
			document.getElementById("Canvas1").style.cursor = "move";
			var nScrollX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
			BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
			var nRateX = nScrollX / (BoardInfo.Scroll.HScroll.Width - BoardInfo.Scroll.HScroll.BarW);
			nScrollX = Math.round(BoardInfo.Scroll.HScroll.Maximum * nRateX);
			var nScrollY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
			BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
			var nRateY = nScrollY / (BoardInfo.Scroll.VScroll.Height - BoardInfo.Scroll.VScroll.BarH);
			nScrollY = Math.round(BoardInfo.Scroll.VScroll.Maximum * nRateY);


			SetScrollValueAdd(-(nScrollX/5), -(nScrollY/5));

			return;
		}
		else if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "LEFT") {
			if (!BoardInfo.Selected.getIsExistItem() && BoardInfo.Key.IsShiftKey) {
				document.getElementById("Canvas1").style.cursor = "move";
				$("#hstTitle").val("아이템 X-Y좌표 이동");

				var nScrollX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
				BoardInfo.MouseDownX = BoardInfo.MouseMoveX;

				var nRateX = nScrollX / (BoardInfo.Scroll.HScroll.Width - BoardInfo.Scroll.HScroll.BarW);
				nScrollX = Math.round(BoardInfo.Scroll.HScroll.Maximum * nRateX);


				var nScrollY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
				BoardInfo.MouseDownY = BoardInfo.MouseMoveY;

				var nRateY = nScrollY / (BoardInfo.Scroll.VScroll.Height - BoardInfo.Scroll.VScroll.BarH);
				nScrollY = Math.round(BoardInfo.Scroll.VScroll.Maximum * nRateY);


				SetScrollValueAdd(-(nScrollX/5), -(nScrollY/5));

				return;
			}
			else {
				document.getElementById("Canvas1").style.cursor = "default";
			}

			if (BoardInfo.ItemEditMode == e_ItemEditMode_Add) {
				if (BoardInfo.AddItemStyle == e_ItemStyle_Image || BoardInfo.AddItemStyle == e_ItemStyle_Text) {
					Draw();

					var canvas = document.getElementById("Canvas1");
					var context = null;

					if (canvas.getContext) {
						context = canvas.getContext("2d");
						var oPanel = GetPanelFromXYXY(BoardInfo.MouseDownX, BoardInfo.MouseDownY, BoardInfo.MouseDownX + 1, BoardInfo.MouseDownY + 1);
//						var oPage = GetPage(1);
//						var oPanel = GetPanel(oPage, 1);
						if (oPanel) {
							context.strokeStyle = "rgba(255,187,0,1)";
							context.lineWidth = 1;
							context.lineCap = "butt";
							context.strokeRect(oPanel.DrawX, oPanel.DrawY, oPanel.DrawW, oPanel.DrawH);
						}// if
					}// if
				}
				else {
					Draw();
				}
			}
			else if (BoardInfo.ItemEditMode == e_ItemEditMode_Pen) {
				if (BoardInfo.PenWebWrite) {
					SetPenPositionInput(nX, nY);
				}
			}
			else if (BoardInfo.ItemEditMode == e_ItemEditMode_Eraser) {
				//if (BoardInfo.PenReady) {
					var oPage = GetPage(BoardInfo.PenPageKey);
					var oPanel = GetPanel(oPage, BoardInfo.PenPanelKey);

					if (oPage && oPanel && oPanel.Pens.length > 0) {

						var canvas = document.getElementById("Canvas1");
						var context = null;

						if (canvas.getContext) {
							context = canvas.getContext("2d");

							context.strokeStyle = "rgba(255,187,0,0.5)";
							context.lineWidth = 1;
							context.lineCap = "butt";
							context.strokeRect(oPanel.DrawX, oPanel.DrawY, oPanel.DrawW, oPanel.DrawH);

							var nEraserX = nX - (BoardInfo.PenWidth / 2);
							var nEraserY = nY - (BoardInfo.PenWidth / 2);
							var nEraserW = BoardInfo.PenWidth;
							var nEraserH = BoardInfo.PenWidth;

							var bDeleted = false;

							for (var i = oPanel.Pens.length - 1; i >= 0; i--) {
								var oPenMaster = oPanel.Pens[i];

								for (var j = 0; j < oPenMaster.Positions.length; j++) {
									var oPos = oPenMaster.Positions[j];

									var nPosX = oPos.X + oPanel.DrawX;
									var nPosY = oPos.Y + oPanel.DrawY;

									if (IsIntersectWithRect(nEraserX, nEraserY, nEraserW, nEraserH, nPosX, nPosY, 1, 1)) {
										oPanel.Pens.splice(i, 1);

										bDeleted = true;
										break;
									}
								}// for j
							}// for i

							if (bDeleted) {
								oPage.Edit.setModify(true);
								Draw();
							}

						}// if
					}// if (oPage && oPanel) {
					//}// if
			}
			else if (BoardInfo.ItemEditMode == e_ItemEditMode_None) {

				if (BoardInfo.SelectedResizeNo > 0) {
					var oPage = GetPage(BoardInfo.Selected.PageKey);

					if (oPage) {
						oPage.Edit.setModify(true);
					}
					var nDefX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
					var nDefY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;
					//alert(BoardInfo.ItemEditMode+"==="+e_ItemEditMode_None+"==="+oPage.Key);

					switch (BoardInfo.SelectedResizeNo) {
					case 1 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;

						SelectedItemMove(nDefX, nDefY);
						SelectedItemSize(nDefX * -1, nDefY * -1);
						Draw();

						break;
					}
					case 3 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;

						SelectedItemMove(0, nDefY);
						SelectedItemSize(nDefX, nDefY * -1);
						Draw();
						break;
					}
					case 6 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;

						SelectedItemMove(nDefX, 0);
						SelectedItemSize(nDefX * -1, nDefY);
						Draw();
						break;
					}
					case 8 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
						SelectedItemSize(nDefX, nDefY);

						Draw();
						break;
					}
					case 9 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
						SelectedItemRotate(BoardInfo.MouseMoveX, BoardInfo.MouseMoveY, BoardInfo.Key.IsCtrlKey);
						Draw();
						break;
					}
					case 10 :
					{
						MouseWay = true;
						BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
						BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
						SelectedItemVertex(nDefX * 1, nDefY * 1);
						Draw();
						break;
					}
					default:
					{
						if (BoardInfo.SelectedResizeNo > 999 && BoardInfo.SelectedResizeNo < 10000) {
							MouseWay = true;
							BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
							BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
							SelectedItemStraightMove(nDefX * 1, nDefY * 1, BoardInfo.SelectedResizeNo, BoardInfo.Key.IsShiftKey);
							Draw();
						} else if (BoardInfo.SelectedResizeNo > 9999) {
							MouseWay = true;
							BoardInfo.MouseDownX = BoardInfo.MouseMoveX;
							BoardInfo.MouseDownY = BoardInfo.MouseMoveY;
							SelectedItemOjcSize(nDefX * 1, nDefY * 1, BoardInfo.SelectedResizeNo);
							Draw();

						}
						break;
					}
					}// switch

				}
				else {
					Draw();
				}
			}// if
		}// if
		else if (!BoardInfo.IsMouseDown) {
			if (BoardInfo.EditMode == e_EditMode_EditPage) {}
		}// else if
	}

	function OnEvtMouseDown(event) {
		//alert(event.button);
		itemSisulArr = [];
		var canvasDiv = document.getElementById("divMove");
		var nEventX = parseInt((event.x - canvasDiv.offsetLeft)/scaleFactor);
		if (isWindow == 1) {
			var nEventY = parseInt((event.y - canvasDiv.offsetTop - baseOffsetTop)/scaleFactor);
		}
		else {
			var nEventY = parseInt((event.y - canvasDiv.offsetTop)/scaleFactor);
		}
		if (event.button == 0) {
			BoardInfo.IsMouseDown = true;
			BoardInfo.MouseDownButton = "LEFT";
			BoardInfo.MouseDownX = nEventX;
			BoardInfo.MouseDownY = nEventY;
			BoardInfo.ScrollDown = "";
		}
		else if (event.button == 1) {
			document.getElementById("Canvas1").style.cursor = "move";
			BoardInfo.IsMouseDown = true;
			BoardInfo.MouseDownButton = "MIDDLE";
			BoardInfo.MouseDownX = nEventX;
			BoardInfo.MouseDownY = nEventY;
			BoardInfo.ScrollDown = "";
		}
		else if (event.button == 2) {
			BoardInfo.IsMouseDown = true;
			BoardInfo.MouseDownButton = "RIGHT";
			BoardInfo.MouseDownX = nEventX;
			BoardInfo.MouseDownY = nEventY;
			BoardInfo.ScrollDown = "";
		}
		else {
			BoardInfo.IsMouseDown = false;
			BoardInfo.MouseDownButton = "";
			BoardInfo.MouseDownX = 0;
			BoardInfo.MouseDownY = 0;
			BoardInfo.ScrollDown = "";
		}

		if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "LEFT") {
			if (IsIntersectWithRect(BoardInfo.Scroll.VScroll.X, BoardInfo.Scroll.VScroll.Y, BoardInfo.Scroll.VScroll.Width, BoardInfo.Scroll.VScroll.Height, nEventX, nEventY, 1, 1)) {
				if (IsIntersectWithRect(BoardInfo.Scroll.VScroll.BarX, BoardInfo.Scroll.VScroll.BarY, BoardInfo.Scroll.VScroll.BarW, BoardInfo.Scroll.VScroll.BarH, nEventX, nEventY, 1, 1)) {
					BoardInfo.ScrollDown = "V";
				}
				else {
					var nValue = Math.floor(BoardInfo.CanvasHeight / 2);

					if (nEventY < BoardInfo.Scroll.VScroll.BarY) {
						//SetScrollValueAdd(0, nValue * -1);
					}
					else if (nEventY > (BoardInfo.Scroll.VScroll.BarY + BoardInfo.Scroll.VScroll.BarH)) {
						//SetScrollValueAdd(0, nValue);
					}
				}
			}
			else if (IsIntersectWithRect(BoardInfo.Scroll.HScroll.X, BoardInfo.Scroll.HScroll.Y, BoardInfo.Scroll.HScroll.Width, BoardInfo.Scroll.HScroll.Height, nEventX, nEventY, 1, 1)) {
				if (IsIntersectWithRect(BoardInfo.Scroll.HScroll.BarX, BoardInfo.Scroll.HScroll.BarY, BoardInfo.Scroll.HScroll.BarW, BoardInfo.Scroll.HScroll.BarH, nEventX, nEventY, 1, 1)) {
					BoardInfo.ScrollDown = "H";
				}
				else {
					var nValue = Math.floor(BoardInfo.CanvasWidth / 2);

					if (nEventX < BoardInfo.Scroll.HScroll.BarX) {
						//SetScrollValueAdd(nValue * -1, 0);
					}
					else if (nEventX > (BoardInfo.Scroll.HScroll.BarX + BoardInfo.Scroll.HScroll.BarW)) {
						//SetScrollValueAdd(nValue, 0);
					}
				}
			}
			else if (BoardInfo.EditMode == e_EditMode_DesignPanel && BoardInfo.AddItemStyle == e_ItemStyle_None) {
				var bNext = true;
				if (bNext) {
					/***********************************************************************
					 *   디자인 패널에서 pen 및 직선을 사용하기 위함.
					 ***********************************************************************/
					if (BoardInfo.ItemEditMode == e_ItemEditMode_Pen || BoardInfo.ItemEditMode == e_ItemEditMode_Eraser) {

						var oPanel = GetPanelFromXYXY(nEventX, nEventY, nEventX, nEventY);
						if (oPanel && oPanel.IsExpanded) {
							var oPage = GetPage(oPanel.PageKey);

							if (oPage && oPage.Edit.getEditable()) {
								if (BoardInfo.ItemEditMode == e_ItemEditMode_Pen || (oPanel.Pens.length > 0 && BoardInfo.ItemEditMode == e_ItemEditMode_Eraser)) {
									BoardInfo.PenPositions = [];
									BoardInfo.PenReady = true;
									BoardInfo.PenPageKey = oPanel.PageKey;
									BoardInfo.PenPanelKey = oPanel.Key;

									if (BoardInfo.Selected.PageKey != oPanel.PageKey) {
										BoardInfo.Selected.Clear();
										BoardInfo.Selected.PageKey = oPanel.PageKey;
									}

									SetPenPositionInput(nEventX, nEventY);
								}// if
							}// if
						}// if
					}//
					else if (BoardInfo.ItemEditMode == e_ItemEditMode_Straight) {
						//var oPanel = GetPanelFromXYXY(nEventX, nEventY, nEventX, nEventY);
						var oPage = GetPage(1);
						var oPanel = GetPanel(oPage, 1);
						if (oPanel && oPanel.IsExpanded) {
							var oPage = GetPage(oPanel.PageKey);
							if (oPage && oPage.Edit.getEditable()) {

								if (BoardInfo.ItemEditMode == e_ItemEditMode_Straight && !BoardInfo.PenReady) {
//									alert(BoardInfo.PenReady);
									//BoardInfo.PenPositions = [];

									BoardInfo.PenReady = true;
									BoardInfo.PenPageKey = oPanel.PageKey;
									BoardInfo.PenPanelKey = oPanel.Key;

									if (BoardInfo.Selected.PageKey != oPanel.PageKey) {
										BoardInfo.Selected.Clear();
										BoardInfo.Selected.PageKey = oPanel.PageKey;
									}
									if(BoardInfo.Key.IsShiftKey){
										if(Math.abs(lineSx - (nEventX - oPanel.DrawX)) < Math.abs(lineSy - (nEventY - oPanel.DrawY) )){
											lineSy = nEventY - oPanel.DrawY;
										} else {
											lineSx = nEventX - oPanel.DrawX;
										}
									} else {
										lineSx = nEventX - oPanel.DrawX;
										lineSy = nEventY - oPanel.DrawY;
									}
									//event.preventDefault();
									//SetPenStraightPositionInput(nEventX, nEventY, 0);
								}// if
							}// if
						}// if
					}//
					else {
						if (BoardInfo.Selected.getIsExistItem()) {

							var nPointNo = 0;
							var bContainer = false;
							if (BoardInfo.Selected.getIsExistPoint()) {

								for (var ip = 0; ip < BoardInfo.Selected.Points.length; ip++) {
									var sPoint = BoardInfo.Selected.Points[ip];
									var asPoint = sPoint.split(",");

									if (asPoint.length == 5) {
										var nPX = parseInt(asPoint[1]);
										var nPY = parseInt(asPoint[2]);
										var nPW = parseInt(asPoint[3]);
										var nPH = parseInt(asPoint[4]);

										var bContainer2 = IsIntersectWithRect(nPX, nPY, nPW, nPH, nEventX, nEventY, 1, 1);
										if (bContainer2) {
											nPointNo = parseInt(asPoint[0]);
											break;
										}// if
									}// if
								}// for ip
							}// if
							if (nPointNo > 0) {
								BoardInfo.IsSelectedMove = false;
								BoardInfo.SelectedResizeNo = nPointNo;
							}
							else {
								var bContainer = SelectedItemContains(nEventX, nEventY, 1, 1);
								BoardInfo.IsSelectedMove = bContainer;
								if (BoardInfo.Selected.ItemKeys.length == 1) {
									if (!bContainer) {
										portKeyArr = [];
										portKeyBorderArr = [];
									}
								}
							}
						}// if
						else
						{

							portKeyArr = [];
							portKeyBorderArr = [];
							ClearEditing();
						}
					}
				}
			}
		}
	}// function OnEvtMouseDown

	function OnEvtMouseOut(event) {
		if (BoardInfo.ScrollDown == "") {
			MouseDownClear();
			document.getElementById("Canvas1").style.cursor = "default";
			Draw();
		}
	}

	function OnEvtDblClick(event) {
		var nEvtX = event.x - event.target.offsetLeft;
		var nEvtY = event.y - event.target.offsetTop;
		var sMouseButton = "";

		if (event.button == 0) {
			sMouseButton = "LEFT";
		}
		else if (event.button == 2) {
			sMouseButton = "RIGHT";
		}

		if (sMouseButton == "LEFT") {
			if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
				if (BoardInfo.Selected.getIsExistItem()) {
					var strUrl = "";
					var strWidth = 0;
					var strHeight = 0;
					var winFlag = false;
					if (BoardInfo.Selected.ItemKeys.length == 1) {
						EquipmentSelected();

					}
				}
				SetPropertiesWindowValueChangeTag();
			}// if
			else if (BoardInfo.EditMode == e_EditMode_EditPage) {
				var oPage = GetPageFromXY(nEvtX, nEvtY);

				if (oPage && oPage.Edit.getEditable()) {
					if (oPage.Key == BoardInfo.Selected.PageKey) {
						var oPanel = GetPanelFromXYXY(nEvtX, nEvtY, nEvtX, nEvtY);

						PanelSetExpand(oPanel, true);
					}// if
				}// if
			}// else if
		}// if
	}// function OnEvtDblClick

	function OnEvtMouseUp(event) {

		$("#data-baseItems tbody tr").removeClass("eClickLayerBackgroundColor");
		document.getElementById("Canvas1").style.cursor = "default";
		var canvasDiv = document.getElementById("divMove");
		var nEventX = parseInt((event.x - canvasDiv.offsetLeft)/scaleFactor);
		if (isWindow == 1) {
			var nEventY = parseInt((event.y - canvasDiv.offsetTop - baseOffsetTop)/scaleFactor);
		}
		else {
			var nEventY = parseInt((event.y - canvasDiv.offsetTop)/scaleFactor);
		}
		if (BoardInfo.IsMouseDown) {
			if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_DesignPage) {
				if (equipmentSelectFlag) { // 장비 등록을 위한 선택임(드로윙툴에 영향을 주면 안됨)
					var nGetX = Math.abs(BoardInfo.MouseDownX - nEventX);
					var nGetY = Math.abs(BoardInfo.MouseDownY - nEventY);
					var bSelected = false;

					if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
						if (nGetX < 3 && nGetY < 3) {
							// 1개 선택 처리
							bSelected = SelectItem(bSelect, nEventX, nEventY, 1, 1, false)

						} else {
							// 1개 이상 선택 처리
							alert("드래그 선택을 제공하지 않습니다. 해당 아이템 1개만 선택 가능합니다.");
							return;
						}
					}// if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
				} else {
					if (BoardInfo.MouseDownButton == "LEFT") {
						EquipmentClear();
						if (MouseWay == true)           // 꼭지점 크기조정시 속성값 변경.
						{
							RefeshPropertiesWindow();
							MouseWay = false;
							baseDefCk = false;
						}
						SetPropertiesWindowValueChangeTag();
						var bProWin = IsIntersectWithRect(BoardInfo.PropertiesWindow.X, BoardInfo.PropertiesWindow.Y, BoardInfo.PropertiesWindow.Width, BoardInfo.PropertiesWindow.Height,
								BoardInfo.MouseDownX, BoardInfo.MouseDownY, 1, 1);

						if (BoardInfo.ItemEditMode == e_ItemEditMode_Add) {
//							if (newFloorFlag && layerArr[0] != 'L001' && addItemType != 'well') {
//								//alert("레이어 >기초평면  > 외벽  항목을 먼저 선택하여 주시기 바랍니다.");
//								alert("레이어 >기초평면 > 외벽  항목을 먼저 선택하여 주시기 바랍니다.1");
//								return;
//							}
							newFloorFlag = false;
							// 아이템 추가
							var nEditX1 = Math.min(BoardInfo.MouseDownX, nEventX);
							var nEditX2 = Math.max(BoardInfo.MouseDownX, nEventX);
							var nEditY1 = Math.min(BoardInfo.MouseDownY, nEventY);
							var nEditY2 = Math.max(BoardInfo.MouseDownY, nEventY);
							//var oPanel = GetPanelFromXYXY(nEditX1, nEditY1, nEditX2, nEditY2);
							var oPage = GetPage(1);
							var oPanel = GetPanel(oPage, 1);
							if (oPanel) {
								var nX1 = nEditX1;
								var nY1 = nEditY1;
								var nW1 = nEditX2 - nEditX1;
								var nH1 = nEditY2 - nEditY1;

								if (nW1 < 25) {
									nW1 = 25;
									if (addItemWidth > 25) {
										nW1 = addItemWidth/baseScale;
									}
								}
								if (nH1 < 25) {
									nH1 = 25;
									if (addItemHeight > 25) {
										nH1 = addItemHeight/baseScale;
									}
								}
								nX1 = nX1 - oPanel.DrawX;
								nY1 = nY1 - oPanel.DrawY;
								/***********************************************************************
								 *   디자인 패널에서 도형그리기 추가
								 ***********************************************************************/
								 if (BoardInfo.Key.IsCtrlKey) {	// 넓이 높이를 같게 처리하게 위함. 정사각형, 원 등.
									 nH1 = nW1
								 }
								if (itemSizeFix) {
									nW1 = addItemWidth/baseScale;
									nH1 = addItemHeight/baseScale;
								}


								var oItem = NewItem(nX1, nY1, nW1, nH1);

								oItem.PageKey = oPanel.PageKey;
								oItem.PanelKey = oPanel.Key;
								oItem.Style = BoardInfo.AddItemStyle;
								oItem.Key = GetItemMaxKey(oPanel, null) + 1;
								oItem.Z = addItemZ;
								oItem.ItemType = addItemType;
								oItem.LayerId = layerArr[0];
								//oItem.Text[0] = GetItemText(oItem.Style, oItem.Key);
								if (layerArr[0] == "L003") {
									oItem.Text[0] = addItemTypeName;
								} else {
									oItem.Text[0] = [];
								}
								oItem.SystemNm[0] = [];

								oItem.IsSelectable = true;

								oItem.DrawX = nEditX1;
								oItem.DrawY = nEditY1;
								oItem.DrawW = nW1;
								oItem.DrawH = nH1;
								if (BoardInfo.AddItemStyle == e_ItemStyle_Text) {
									oItem.IsViewText = true;
									oItem.TextAlign = e_TextAlign_CenterMiddle;
									var asOpts = GetCommandArgs("TEXT_COLOR|^@^|255,255,255,1|^@@^|TEXT_FONT|^@^|12px 돋음", "TEXT_COLOR,TEXT_FONT");
									if (asOpts[0] != "") {
										oItem.TextColor = "16777215";
									}
									if (asOpts[1] != "") {
										oItem.TextFont = asOpts[1];
									}
								}
								if (layerArr[0] == "L001") {
									if (addItemType == "innerwall") {

										oItem.Style = e_ItemStyle_InnerWall;
										oItem.BorderWidth = 4;
										var _a, _b, _c, _d, _e, _f, _g, _h;
										_a = parseInt(nX1);
										_b = parseInt(nY1);
										_c = parseInt(nX1 + nW1);
										_d = parseInt(nY1);
										_e = parseInt(nX1 + nW1);
										_f = parseInt(nY1 + nH1);
										_g = parseInt(nX1);
										_h = parseInt(nY1 + nH1);
										oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h;
									} else if (addItemType == "wall") {
										nW1 = neFloorWidth/baseScale;
										nH1 = neFloorHeight/baseScale;
										oItem.Width = nW1;
										oItem.Height = nH1;
										oItem.DrawW = nW1;
										oItem.DrawH = nH1;
										alert("외벽 아이템은 국소기준정보(면적) 비율에 맞게 그려집니다.\n가로 : "+nW1+"\n세로 : "+nH1);
										if (addItemTypeName.trim() == "기초외벽(ㅁ형)") {
											oItem.Style = e_ItemStyle_Wall;
											oItem.BorderWidth = 4;
											var _a, _b, _c, _d, _e, _f, _g, _h,_i,_j;
											_a = parseInt(nX1);
											_b = parseInt(nY1);
											_c = parseInt(nX1 + nW1);
											_d = parseInt(nY1);
											_e = parseInt(nX1 + nW1);
											_f = parseInt(nY1 + nH1);
											_g = parseInt(nX1);
											_h = parseInt(nY1 + nH1);
											_i = parseInt(nX1);
											_j = parseInt(nY1);
											oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j;
										} else  if (addItemTypeName.trim() == "외벽(ㄴ형)") {
											oItem.Style = e_ItemStyle_Wall;
											oItem.BorderWidth = 4;
											var _a, _b, _c, _d, _e, _f, _g, _h,_i,_j,_k,_l,_m,_n;
											_a = nX1;
											_b = nY1;
											_c = nX1 + parseInt(nW1/2);
											_d = nY1;
											_e = nX1 + parseInt(nW1/2);
											_f = nY1 + parseInt(nH1/2);
											_g = parseInt(nX1 + nW1);
											_h = nY1 + parseInt(nH1/2);
											_i = parseInt(nX1 + nW1);
											_j = parseInt(nY1 + nH1);
											_k = nX1;
											_l = parseInt(nY1 + nH1);
											_m = nX1;
											_n = nY1;
											oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n;
										}  else  if (addItemTypeName.trim() == "외벽(T형)") {

											oItem.Style = e_ItemStyle_Wall;
											oItem.BorderWidth = 4;
											var _a, _b, _c, _d, _e, _f, _g, _h,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r;
											_a = nX1;
											_b = nY1;
											_c = parseInt(nX1 + nW1);
											_d = nY1;
											_e = parseInt(nX1 + nW1);
											_f = nY1 + parseInt(nH1/3);
											_g = nX1 + parseInt(nW1/3 * 2);
											_h = nY1 + parseInt(nH1/3);
											_i = nX1 + parseInt(nW1/3 * 2);
											_j = parseInt(nY1 + nH1);
											_k = nX1 + parseInt(nW1/3);
											_l = parseInt(nY1 + nH1);
											_m = nX1 + parseInt(nW1/3);
											_n = nY1 + parseInt(nH1/3);
											_o = nX1;
											_p = nY1 + parseInt(nH1/3);
											_q = nX1;
											_r = nY1;
											oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n+","+_o +":"+_p+","+_q +":"+_r;
										}  else  if (addItemTypeName.trim() == "외벽(ㄷ형)") {

											oItem.Style = e_ItemStyle_Wall;
											oItem.BorderWidth = 4;
											var _a, _b, _c, _d, _e, _f, _g, _h,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r;
											_a = nX1;
											_b = nY1;
											_c = parseInt(nX1 + nW1);
											_d = nY1;
											_e = parseInt(nX1 + nW1);
											_f = nY1 + parseInt(nH1/3);
											_g = nX1 + parseInt(nW1/3);
											_h = nY1 + parseInt(nH1/3);
											_i = nX1 + parseInt(nW1/3);
											_j = nY1 + parseInt(nH1/3 * 2);
											_k = parseInt(nX1 + nW1);
											_l = nY1 + parseInt(nH1/3 * 2);
											_m = parseInt(nX1 + nW1);
											_n = parseInt(nY1 + nH1);
											_o = nX1;
											_p = parseInt(nY1 + nH1);
											_q = nX1;
											_r = nY1;
											oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n+","+_o +":"+_p+","+_q +":"+_r;
										} else  if (addItemTypeName.trim() == "외벽(한쪽모서리형)") {

											oItem.Style = e_ItemStyle_Wall;
											oItem.BorderWidth = 4;
											var _a, _b, _c, _d, _e, _f, _g, _h,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r;
											_a = nX1;
											_b = nY1;
											_c = nX1 + parseInt(nW1/3 * 2);
											_d = nY1;
											_e = parseInt(nX1 + nW1);
											_f = nY1 + parseInt(nH1/3);
											_g = parseInt(nX1 + nW1);
											_h = parseInt(nY1 + nH1);
											_i = nX1;
											_j = parseInt(nY1 + nH1);
											_k = nX1;
											_l = nY1;
											oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l;
										}
									}
								} else if (layerArr[0] == "L004" || layerArr[0] == "L005" || layerArr[0] == "L006") {
									oItem.BorderColor = "16776960";

									if (addItemType == "cableduct_d") {
										var xW = nW1/3;
										var yH = nH1/3;
										var strArrPoint
										var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;

										_a = nX1;
										_b = nY1;
										_c = nX1 + nW1;
										_d = nY1;

										_e = nX1 + nW1;
										_f = nY1 + yH;
										_g = nX1 + xW;
										_h = nY1 + yH;

										_i = nX1 + xW;
										_j = nY1 + (yH * 2);

										_k = nX1 + nW1;
										_l = nY1 + (yH * 2);

										_m = nX1 + nW1;
										_n = nY1 +  nH1;

										_o = nX1;
										_p = nY1 + nH1;

										_q = nX1;
										_r = nY1;
										oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n+","+_o +":"+_p+","+_q +":"+_r;

									} else if (addItemType == "cableduct_l") {
										var xW = nW1/3;
										var yH = nH1/3;
										var strArrPoint
										var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;

										_a = nX1;
										_b = nY1;
										_c = nX1 + xW;
										_d = nY1;

										_e = nX1 + xW;
										_f = nY1 + (yH * 2);

										_g = nX1 + nW1;
										_h = nY1 + (yH * 2);
										_i = nX1 + nW1;
										_j = nY1 + nH1;

										_k = nX1;
										_l = nY1 + nH1;

										_m = nX1;
										_n = nY1;

										oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n;

									} else if (addItemType == "cableduct_t") {
										var xW = nW1/3;
										var yH = nH1/3;
										var strArrPoint
										var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;

										_a = nX1;
										_b = nY1;
										_c = nX1 + nW1;
										_d = nY1;

										_e = nX1 + nW1;
										_f = nY1 + yH;

										_g = nX1 + (xW * 2);
										_h = nY1 + yH;
										_i = nX1 + (xW * 2);
										_j = nY1 + nH1;

										_k = nX1 + xW;
										_l = nY1 + nH1;

										_m = nX1 + xW;
										_n = nY1 +  yH;

										_o = nX1;
										_p = nY1 + yH;

										_q = nX1;
										_r = nY1;
										oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n+","+_o +":"+_p+","+_q +":"+_r;

									} else if (addItemType == "cableduct_p") {
										//nX1, nY1, nW1, nH1
										var xW = nW1/3;
										var yH = nH1/3;
										var strArrPoint
										var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
										_a = nX1 + xW;
										_b = nY1;

										_c = nX1 + (xW * 2);
										_d = nY1;

										_e = nX1 + (xW * 2);
										_f = nY1 + yH;

										_g = nX1 + nW1;
										_h = nY1 + yH;

										_i = nX1 + nW1;
										_j = nY1 + (yH * 2);

										_k = nX1 + (xW * 2);
										_l = nY1 + (yH * 2);

										_m = nX1 + (xW * 2);
										_n = nY1 + nH1;

										_o = nX1 + xW;
										_p = nY1 + nH1;

										_q = nX1 + xW;
										_r = nY1 + (yH * 2);

										_s = nX1;
										_t = nY1 + (yH * 2);

										_u = nX1;
										_v = nY1 + yH;

										_w = nX1 + xW;
										_x = nY1 + yH;

										_y = nX1 + xW;
										_z = nY1;

										oItem.Points = _a +":"+_b+","+_c +":"+_d+","+_e +":"+_f+","+_g +":"+_h+","+_i +":"+_j+","+_k +":"+_l+","+_m +":"+_n+","+_o +":"+_p+","+_q +":"+_r+","+_s +":"+_t+","+_u +":"+_v+","+_w +":"+_x+","+_y +":"+_z;
										//console.log(oItem.Points);
									}
								}

								if (addItemType == "fluorescent_light") {
									oItem.BorderColor = "6592255";
								}

								$("#hstTitle").val("아이템 생성("+addItemType+")");
								oPanel.Items.push(oItem);
								if (BoardInfo.AddItemStyle == e_ItemStyle_Text) {
									MemoFocusOut_Key.push(oItem.Key);
									var oPage = GetPage(oPanel.PageKey);
									//oPage.Edit.setModify(true);
									bRetItemEditing = EditPageEditItem2(oPage, oPanel, oItem, nEditX1, nEditY1, BoardInfo.MouseDownButton);
									//EditPageEditItem(oPage, nEditX1 + 2, nEditY1 + 2);
								}


//								if (addItemType == "ele_pole_tr" || addItemType == "ele_tr" || addItemType == "ele_in_tr" || addItemType == "ele_out_tr") {
//									var nX2 = nEditX1 + nW1 + 150;
//									var nY2 = nEditY1 + nH1;
//									var nW2 = nEditX2 - nEditX1;
//									var nH2 = nEditY2 - nEditY1;
//
//									nW2 = 800/baseScale;
//									nH2 = 100/baseScale;
//									nX2 = nX2 - oPanel.DrawX;
//									nY2 = nY2 - oPanel.DrawY;
//
//									if (itemSizeFix) {
//										nW2 = 800/baseScale;
//										nH2 = 200/baseScale;
//									}
//
//
//									var oItem2 = NewItem(nX2, nY2, nW2, nH2);
//
//									oItem2.PageKey = oPanel.PageKey;
//									oItem2.PanelKey = oPanel.Key;
//									oItem2.Style = 119;
//									oItem2.Key = GetItemMaxKey(oPanel, null) + 1;
//									oItem2.Z = addItemZ;
//									oItem2.ItemType = 'ele_link';
//									oItem2.LayerId = layerArr[0];
//									oItem2.Text[0] = '연결패치';
//									oItem2.SystemNm[0] = [];
//
//									oItem2.IsSelectable = true;
//
//									oItem2.DrawX = nEditX1 + nW1 + 150;
//									oItem2.DrawY = nEditY1 + nH1;
//									oItem2.DrawW = nW2;
//									oItem2.DrawH = nH2;
//									oPanel.Items.push(oItem2);
//								}
//




								// 초기화
								addItemWidth = 0;
								addItemHeight = 0;
								addItemZ = 0;
								addItemType = "";
								addItemTypeName = "";
								ItemEditModeClear();

							}
						}// if
						/***********************************************************************
						 *   디자인 패널에서 pen 및 직선을 사용하기 위함.
						 ***********************************************************************/
						else if (BoardInfo.ItemEditMode == e_ItemEditMode_Straight) {
							if (newFloorFlag && layerArr[0] != 'L001' && addItemType != 'wall') {
								//alert("레이어 >기초평면  > 외벽  항목을 먼저 선택하여 주시기 바랍니다.");
								alert("레이어 >기초평면  > 외벽  항목을 먼저 선택하여 주시기 바랍니다.1");
								return;
							}
							newFloorFlag = false;

							if (BoardInfo.MouseDownButton == "LEFT") {
								if (BoardInfo.ItemEditMode == e_ItemEditMode_Straight)
								{
									if (!MouseDownStraight) {
										StraightPositions.push(lineSx+":"+lineSy);
										MouseDownStraight = true;
										//lineBackup = BoardInfo.MainContext.getImageData(0, 0, 10000, 10000);
										return;
									} else {
										var nEditX1 = Math.min(BoardInfo.MouseDownX, nEventX);
										var nEditX2 = Math.max(BoardInfo.MouseDownX, nEventX);
										var nEditY1 = Math.min(BoardInfo.MouseDownY, nEventY);
										var nEditY2 = Math.max(BoardInfo.MouseDownY, nEventY);
										//var oPanel = GetPanelFromXYXY(nEditX1, nEditY1, nEditX2, nEditY2);
										var oPage = GetPage(1);
										var oPanel = GetPanel(oPage, 1);
										var nX1 = nEditX1;
										var nY1 = nEditY1;
										nX1 = nX1 - oPanel.DrawX;
										nY1 = nY1 - oPanel.DrawY;

										if(BoardInfo.Key.IsShiftKey){
											if(Math.abs(nX1 - StraightPositions.slice(-1)[0].split(":")[0]) >= Math.abs(nY1 - StraightPositions.slice(-1)[0].split(":")[1])){
												StraightPositions.push(nX1+":"+StraightPositions.slice(-1)[0].split(":")[1]);
											}else{
												StraightPositions.push(StraightPositions.slice(-1)[0].split(":")[0]+":"+nY1);
											}
										}else {
											StraightPositions.push(nX1+":"+nY1);
										}
										//lineSx = nEventX;
										//lineSy = nEventY;
										if (!BoardInfo.Key.IsCtrlKey) {
											event.preventDefault();
											MouseDownStraight = false;
											ItemEditModeClear();
											ClearEditing();
											//SetPenPosition();
											var nPenX1, nPenX2, nPenY1, nPenY2;
											for(i = 0; i < StraightPositions.length; i++) {
												var staightPos = StraightPositions[i].split(":");
												var staightPosX = staightPos[0];
												var staightPosY = staightPos[1];
												if (i == 0) {
													nPenX1 = staightPosX;
													nPenY1 = staightPosY;
													nPenX2 = staightPosX;
													nPenY2 = staightPosY;
												} else {
													nPenX1 = Math.min(nPenX1, staightPosX);
													nPenY1 = Math.min(nPenY1, staightPosY);
													nPenX2 = Math.max(nPenX2, staightPosX);
													nPenY2 = Math.max(nPenY2, staightPosY);
												}
											}
											var oPage = GetPage(1);
											var oPanel = GetPanel(oPage, 1);
//											console.log(nPenX1 + "---" + nPenY1 + "---" + nPenX2 + "---" + nPenY2);
											var oItem = NewItem(nPenX1, nPenY1, nPenX2 - nPenX1, nPenY2 - nPenY1);
											oItem.PageKey = oPanel.PageKey;
											oItem.PanelKey = oPanel.Key;
											if (addItemType == "cableline") {
												oItem.Style = e_ItemStyle_CableLine;
												if (layerArr[0] == "L007") {
													oItem.BorderColor = "6723840";
												} else if (layerArr[0] == "L008") {
													oItem.BorderColor = "10032332";
												} else if (layerArr[0] == "L009") {
													oItem.BorderColor = "16776960";
												}
												//console.log(oItem.BorderColor);
												oItem.BorderWidth = 2;
												oItem.Text[0] = addItemTypeName;
											} else {
												oItem.Style = e_ItemStyle_Straight;
												oItem.TypeName = "직선";
												oItem.BorderWidth = 2;
												oItem.Text[0] = [];
											}
											oItem.Key = GetItemMaxKey(oPanel, null) + 1;
											oItem.LayerId = layerArr[0];
											oItem.ItemType = addItemType;
											oItem.Points = StraightPositions.toString();
											oItem.IsSelectable = true;

											oItem.DrawX = nPenX1;
											oItem.DrawY = nPenY1;
											oItem.DrawW = nPenX2 - nPenX1;
											oItem.DrawH = nPenY2 - nPenY1;

											oPanel.Items.push(oItem);

											addItemType = "";
											StraightPositions = [];
										}
									}
								}
							}// if
						}
						else {
							var bSearchSelect = true;
							var bSelect = true;

							if (BoardInfo.Selected.getIsExistItem()) {

								if (BoardInfo.IsSelectedMove) {
									// 선택된 아이템 위에 마우스를 다운
									var nDefX = nEventX - BoardInfo.MouseDownX;
									var nDefY = nEventY - BoardInfo.MouseDownY;
									if (Math.abs(nDefX) < 3 && Math.abs(nDefY) < 3) {
										if (BoardInfo.Key.IsCtrlKey) {
											bSelect = false;
										}
										else {
											bSearchSelect = false;
										}
									}
									else {
										if (BoardInfo.Key.IsShiftKey) {
											// ShiftKey는 가로세로 한쪽만 이동
											if (Math.abs(nDefX) > Math.abs(nDefY)) {
												nDefY = 0;
											}
											else if (Math.abs(nDefX) < Math.abs(nDefY)) {
												nDefX = 0;
											}
										}// if

										if (BoardInfo.Key.IsCtrlKey) {
											// 아이템 복사
											ItemCopy();
											ItemPaste(e_PasteStyle_Set, nDefX, nDefY);
											bSearchSelect = false;
										}
										else {
											if (itemSnapFix) {
												SelectedItemSnapMove(nDefX, nDefY);
											} else {
												if (BoardInfo.Key.IsAltKey) {
													SelectedItemSnapMove(nDefX, nDefY);
													//SelectedItemMove2(nDefX, nDefY);

												} else {
													SelectedItemMove(nDefX, nDefY);
												}
											}

											//SelectedItemMove(nDefX, nDefY);

											bSearchSelect = false;
										}// else
									}// else
									var sPage = GetPageFromXYXY(nEventX, nEventY, nEventX + 1, nEventY + 1);
									var sPageData = GetPageData(sPage, true);
									var sCmd = "COMMAND_UNDODATA";
									SetProcData("COMMAND_UNDODATA", "COMMAND_NAME|^@^|".concat(sCmd, "|^@@^|METHOD_NAME|^@^|SetCommand"), sPageData);
								}
								else if (BoardInfo.SelectedResizeNo > 0) {
									bSelect = false;
									bSearchSelect = false;

									if (BoardInfo.Selected.ItemKeys.length == 1) {
										var oPage = GetPage(BoardInfo.Selected.PageKey);
										var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
										var strItemKey = BoardInfo.Selected.ItemKeys[0];
										var oItemOne = GetItem(oPanel, strItemKey);

										switch (BoardInfo.SelectedResizeNo) {
										case 2 :	// top
										{
											oItemOne.DimensionTop = (oItemOne.DimensionTop == 'N') ? 'Y' : 'N';
											break;
										}
										case 4 :	// left
										{
											oItemOne.DimensionLeft = (oItemOne.DimensionLeft == 'N') ? 'Y' : 'N';
											break;
										}
										case 5 :	// right
										{
											oItemOne.DimensionRight = (oItemOne.DimensionRight == 'N') ? 'Y' : 'N';
											break;
										}
										case 7 :	// bottom
										{
											oItemOne.DimensionBottom = (oItemOne.DimensionBottom == 'N') ? 'Y' : 'N';
											break;
										}
										}// switch
										RefeshPropertiesWindow();
									}
								}
								else {
									// 선택되지 않은 영역에서 마우스 다운
									if (!BoardInfo.Key.IsOnlyCtrlKey()) {
										BoardInfo.Selected.Clear();
									}
								}
							}

							var bChangeSelectPage = false;
							if (BoardInfo.Selected.getIsExistItem()) {
								// 선택된 아이템이 있다.
								if (BoardInfo.IsSelectedMove || BoardInfo.SelectedResizeNo > 0) {
									bChangeSelectPage = true;
								}
							}

							if (!bChangeSelectPage) {

								if (nGetX < 3 && nGetY < 3) {
									//var oPage = GetPageFromXY(nEventX, nEventY);
									var oPage = GetPage(1);
									//var oPanel = GetPanel(oPage, 1);
									if (oPage) {
										bSelect = !EditPageEditItem(oPage, nEventX, nEventY);
									}
									else {
										ClearEditing();
									}
								}// if
							}// if
							// 아이템 선택
							if (bSearchSelect) {
								var nGetX = Math.abs(BoardInfo.MouseDownX - nEventX);
								var nGetY = Math.abs(BoardInfo.MouseDownY - nEventY);
								var bSelected = false;

								if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
									if (nGetX < 3 && nGetY < 3) {
										// 1개 선택 처리
										bSelected = SelectItem(bSelect, nEventX, nEventY, 1, 1, false)

										//var oPage = GetPageFromXY(nEventX, nEventY);
										var oPage = GetPage(1);
										//var oPanel = GetPanel(oPage, 1);
										if (oPage) {
											bSelect = !EditPageEditItem(oPage, nEventX, nEventY);
											var asPage = GetPage(BoardInfo.Selected.PageKey);
											var asPanel = GetPanel(asPage, BoardInfo.Selected.PanelKey);
											var strItemKey = BoardInfo.Selected.ItemKeys[0];
											var asItemOne = GetItem(asPanel, strItemKey);

											SetPortItemList();
//											if (popOpenFlag) {
//	setParamData(asItemOne.ItemId, asItemOne.Text.toString().replace("NONE",""));
//}
										}
									}
									else {
										// 1개 이상 선택 처리
										var nEditX1 = Math.min(BoardInfo.MouseDownX, nEventX);
										var nEditX2 = Math.max(BoardInfo.MouseDownX, nEventX);
										var nEditY1 = Math.min(BoardInfo.MouseDownY, nEventY);
										var nEditY2 = Math.max(BoardInfo.MouseDownY, nEventY);

										bSelected = SelectItem(bSelect, nEditX1, nEditY1, nEditX2 - nEditX1, nEditY2 - nEditY1, true);
										if (bSelected && BoardInfo.Selected.ItemKeys.length == 1) {
											SetPortItemList();
										}
									}
								}// if (BoardInfo.EditMode == e_EditMode_DesignPanel) {


								if (!bSelected) {
									BoardInfo.Selected.Clear();
									//var oPage = GetPageFromXY(nEventX, nEventY);
									var oPage = GetPage(1);
									//var oPanel = GetPanel(oPage, 1);
									if (oPage) {
										BoardInfo.Selected.PageKey = oPage.PageKey;
										SetPropertiesWindow();
									}// if
									//var oPanel = GetPanelFromXYXY(nEventX, nEventY, nEventX + 1, nEventY + 1);
									var oPanel = GetPanel(oPage, 1);
									if (oPanel) {
										BoardInfo.Selected.PageKey = oPanel.PageKey;
										BoardInfo.Selected.PanelKey = oPanel.Key;
										SetPropertiesWindow();
									}
									else {
										//var oPage = GetPageFromXY(nEventX, nEventY);
										var oPage = GetPage(1);
										if (oPage) {
											BoardInfo.Selected.PageKey = oPage.PageKey;
											SetPropertiesWindow();
										}// if
										else {
											if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_DesignPage) {
												SetPropertiesWindow();
											}
										}
									}// else
								}// if
							}// if
						}// if
					}// if (BoardInfo.MouseDownButton == "LEFT") {
				}
			}// if
		}// if
		if (!equipmentSelectFlag) { // 장비 등록을 위한 선택임(드로윙툴에 영향을 주면 안됨)
			MouseDownClear();
			Draw();
		}
	}

	function SetPenPositionInput(nX, nY) {

		if (BoardInfo.PenReady) {

			if (BoardInfo.MainContext) {

				var oPos = GetPenPosition(parseInt(nX), parseInt(nY), BoardInfo.PenWidth);

				BoardInfo.PenPositions.push(oPos);

				BoardInfo.MainContext.beginPath();

				for (var i = 0; i < BoardInfo.PenPositions.length; i++) {
					var oPos1 = BoardInfo.PenPositions[i];

					if (i == 0)
						BoardInfo.MainContext.moveTo(oPos1.X + 0.5, oPos1.Y + 0.5);
					else
						BoardInfo.MainContext.lineTo(oPos1.X + 0.5, oPos1.Y + 0.5);
				}// if

				BoardInfo.MainContext.strokeStyle = BoardInfo.PenColor;
				BoardInfo.MainContext.lineWidth = BoardInfo.PenWidth;
				BoardInfo.MainContext.lineCap = "butt";
				BoardInfo.MainContext.stroke();
				BoardInfo.MainContext.closePath();

			}
		}
	}

	function SetPenStraightPositionInput(nX, nY, nStart) {
		if (BoardInfo.PenReady) {
			if (BoardInfo.MainContext) {
				var oPos = GetPenPosition(parseInt(nX), parseInt(nY), BoardInfo.PenWidth);
				BoardInfo.PenPositions.push(oPos);
			}
		}
	}
	function SetPenPosition() {
		if (BoardInfo.PenReady) {
			var oPage = GetPage(BoardInfo.PenPageKey);
			var oPanel = GetPanel(oPage, BoardInfo.PenPanelKey);

			if (oPage && oPanel) {
				var aoPoss = [];

				if (BoardInfo.Key.IsCtrlKey && BoardInfo.PenPositions.length > 1) {
					aoPoss.push(BoardInfo.PenPositions[0]);
					aoPoss.push(BoardInfo.PenPositions[BoardInfo.PenPositions.length - 1]);

					BoardInfo.PenPositions = aoPoss;
				}// if

				var nPanelX = oPanel.DrawX;
				var nPanelY = oPanel.DrawY;
				var nPanelW = oPanel.DrawW;
				var nPanelH = oPanel.DrawH;

				aoPoss = [];
				for (var i = 0; i < BoardInfo.PenPositions.length; i++) {
					var oPos = BoardInfo.PenPositions[i];

					if (IsIntersectWithRect(oPos.X, oPos.Y, 1, 1, nPanelX, nPanelY, nPanelW, nPanelH)) {
						oPos.X -= nPanelX;
						oPos.Y -= nPanelY;

						oPos.X = parseInt(oPos.X);
						oPos.Y = parseInt(oPos.Y);

						aoPoss.push(oPos);

					}
					else {
						if (aoPoss.length > 0) {
							var oPenMaster = GetPenMaster(BoardInfo.PenColor, aoPoss);
							oPanel.Pens.push(oPenMaster);
							oPage.Edit.setModify(true);
							aoPoss = [];
						}
					}
				}// for i
				if (aoPoss.length > 0) {
					var oPenMaster = GetPenMaster(BoardInfo.PenColor, aoPoss);
					oPanel.Pens.push(oPenMaster);

					oPage.Edit.setModify(true);
					aoPoss = [];
				}
			}// if
		}// if
	}

	function GetPenMaster(sColor, aoPos) {
		var oPenMaster = function() {};

		oPenMaster.Color = sColor;
		oPenMaster.Positions = aoPos;

		return oPenMaster;
	}

	function GetPenPosition(nX, nY, nWidth) {
		var oPos = function() {};

		oPos.X = nX;
		oPos.Y = nY;
		oPos.Width = nWidth;

		return oPos;
	}

	function EditPageEditItem(oPage, nEventX, nEventY) {
		var bRetItemEditing = false;

		ClearEditing();
		PopupClear();

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

	function PopupDraw(context, bFullDraw) {}

	// 팝업메뉴
	function PopupSet(oPage, oPanel, oItem, nX, nY) {}

	function PopupCompute(nX, nY) {}

	function PopupClear() {
		if (BoardInfo.Popup.IsShow) {
			BoardInfo.Popup.Style = e_PopupStyle_None;
			BoardInfo.Popup.IsShow = false;
			BoardInfo.Popup.Menus = [];
			BoardInfo.Popup.ColWidths = [];

			BoardInfo.Popup.PageKey = "";
			BoardInfo.Popup.PanelKey = -1;
			BoardInfo.Popup.ItemKey = -1;

			Draw();
		}
	}

	function PopupClick(nX, nY) {}

	function EditPanelAddImage(sOpt, sVal) {
		ClearEditing();
		try {
			if (sVal.length > 0) {
				//var oPage = GetPage(BoardInfo.PropertiesWindow.PageKey);
				//var oPanel = GetPanel(oPage, BoardInfo.PropertiesWindow.PanelKey);
				var oPage = GetPageFromXY(10, 10);
				var oPanel = GetPanelFromXYXY(10, 10, 10, 10);
				var nImgW = 723;
				if (oPage && oPanel) {
					oPanel.BackImage = null;
					oPanel.BackImageWidth = nImgW;
					oPanel.BackImageString = sVal;
					oPanel.BackImage = new Image();
					oPanel.BackImage.onload = function () {
						Draw();
					}
					oPanel.BackImage.src = oPanel.BackImageString;
				}
			}

		} catch (e) {
			//alert("이미지를 불러오지 못했습니다.\n" + e.toString());
			alert("이미지를 불러오지 못했습니다.\n" + e.toString());
		}
	}
	function SetBackImageRotate(oPage, nAngle) {}

	function PopupCheckMouseOver(nX, nY) {
		var bOver = false;

		if (BoardInfo.Popup.IsShow) {
			for (var i = 0; i < BoardInfo.Popup.Menus.length; i++) {
				var oMenu = BoardInfo.Popup.Menus[i];
				oMenu.IsMouseOver = false;

				if (oMenu.Title != "-----") {
					if (IsIntersectWithRect(oMenu.DrawX, oMenu.DrawY, oMenu.DrawW, oMenu.DrawH, nX, nY, 1, 1)) {
						oMenu.IsMouseOver = true;
						bOver = true;
					}// if
				}// if
			}// for i
		}// if

		return bOver;
	}

	function PopupSetAddMenu(sTitle, sValue, bActive, nReserved, sSubTitle, oPMenu) {}

	function ClearEditing()
	{
		if (BoardInfo.Editing.getIsEdit()) {
			var oPage = GetPage(BoardInfo.Editing.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Editing.PanelKey);

			if (oPage && oPanel) {
				var oItem = GetItem(oPanel, BoardInfo.Editing.ItemKey)

				if (oItem) {
					switch (BoardInfo.Editing.Style) {
					case "TEXT": {
						tagText.style.visibility = "hidden";

						var astrValues = tagText.value.toString().split("\n");
						var asText = GetTextArrayString(oItem.Text);

						if (astrValues != asText) {
							oItem.Text = [];

							for (var j = 0; j < astrValues.length; j++) {
								oItem.Text.push(astrValues[j]);
							}// for j

							oPage.Edit.setModify(true);
							PanelRun(oPage, oPanel, oItem, oItem.ChangedValue, -1, -1);
						}// if

						//--- 높이 계산 ---
						if (ItemHeightCompute(oPanel, oItem)) {
							event.preventDefault();
						}

						break;
					}// case "TEXT":
					}// switch

					oItem.IsEditing = false;
				}
			}

			BoardInfo.Editing.Clear();
		}

		StoreTextClear();
	}

	function ItemHeightCompute(oPanel, oItem) {
		var bPreventDefault = false;

		if (oPanel && oItem) {
			if (oPanel.IsUserSizable && oItem.IsUserSizable) {
				var nHeight = GetTextHeightFromTextArray(oItem.Text, oItem.TextLineSpacing, oItem.TextFont);

				if (nHeight > oItem.Height) {
					var nHeightAdd = nHeight - oItem.Height;

					if (oPanel.UserMaxHeight > oPanel.Height) {
						if (nHeightAdd > (oPanel.UserMaxHeight - oPanel.Height)) {
							nHeightAdd = oPanel.UserMaxHeight - oPanel.Height;
						}
					}
					else {
						nHeightAdd = 0;
					}

					if (nHeightAdd > 0) {
						oPanel.Height += nHeightAdd;
						oItem.Height += nHeightAdd;

						// 해당 아이템 Y축 변경
						if (oItem.ChangeTopItem != "") {
							var asItem = oItem.ChangeTopItem.split(",");

							for (var nItem = 0; nItem < asItem.length; nItem++) {
								var sItemNo = asItem[nItem].trim();

								if (sItemNo != "") {
									var nItemNo = parseInt(sItemNo);

									var oItem2 = GetItem(oPanel, nItemNo);

									if (oItem2) {
										oItem2.Y += nHeightAdd;
									}
								}
							}// for nItem
						}// if

						// 해당 아이템 높이 변경
						if (oItem.ChangeHeightItem != "") {
							var asItem = oItem.ChangeHeightItem.split(",");

							for (var nItem = 0; nItem < asItem.length; nItem++) {
								var sItemNo = asItem[nItem].trim();

								if (sItemNo != "") {
									var nItemNo = parseInt(sItemNo);

									var oItem2 = GetItem(oPanel, nItemNo);

									if (oItem2) {
										oItem2.Height += nHeightAdd;
									}
								}
							}// for nItem

						}// if

						SetScroll();
						Draw();
					}
					else {
						bPreventDefault = true;
					}
				}
			}// if (oPanel.IsUserSizable && oItem.IsUserSizable) {
		}

		return bPreventDefault;
	}

	// 아이템의 편집모두를 초기화
	function ItemEditModeClear() {
		BoardInfo.AddItemStyle = e_ItemStyle_None;
		BoardInfo.AddItemValue = "";
		BoardInfo.ItemEditMode = e_ItemEditMode_None;

		//SetProcData("INFO_OCX", "", "PEN_INACTIVE");
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

	function SetTabProc(bIsTab, bIsShift)
	{
		var bRet = false;

		if (BoardInfo.Tab.IsExist) {
			var oPage = GetPage(BoardInfo.Tab.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Tab.PanelKey);

			if (oPage && oPanel) {
				var oItem = GetItem(oPanel, BoardInfo.Tab.ItemKey);

				if (oItem) {
					var nItemKey2 = -1;

					if (bIsTab) {
						if (bIsShift) {
							nItemKey2 = oItem.TabFrom;
						}
						else {
							nItemKey2 = oItem.TabTo;
						}
					}
					else {
						if (bIsShift) {
							nItemKey2 = oItem.TabEnterFrom;
						}
						else {
							nItemKey2 = oItem.TabEnterTo;
						}
					}

					if (nItemKey2 > 0) {
						var oItem2 = GetItem(oPanel, nItemKey2);

						if (oItem2) {
							ClearEditing();

							if (oItem2.Style == e_ItemStyle_Check) {
								BoardInfo.Tab.ItemKey = oItem2.Key;
								bRet = true;
								Draw();
							}
							else {
								EditPageEditItem2(oPage, oPanel, oItem2, -1, -1, "LEFT");
								bRet = true;
							}
						}
					}//
				}// if
			}// if
		}// if

		return bRet;
	}

	// 선택된 아이템의 영역에 포함되는지 확인
	function SelectedItemContains(nX, nY, nW, nH) {
		var bRet = false;

		var nR = nX + nW;
		var nB = nY + nH;

//		var oTarPage = GetPageFromXY(nX, nY);
//		var oTarPanel = GetPanelFromXYXY(nX, nY, nR, nB);

		var oTarPage = GetPage(1);
		var oTarPanel = GetPanel(oTarPage, 1);


		if (oTarPage && oTarPanel) {
			var oSelPage = GetPage(BoardInfo.Selected.PageKey);
			var oSelPanel = GetPanel(oSelPage, BoardInfo.Selected.PanelKey);

			if (oSelPage && oSelPanel && oSelPage.Key == oTarPage.Key && oSelPanel.Key == oTarPanel.Key) {
				var astrKeys = BoardInfo.Selected.ItemKeys;

				for (var i = astrKeys.length - 1; i >= 0; i--) {
					var oItem = GetItem(oSelPanel, astrKeys[i]);

					if (oItem) {
						var nItemX = oItem.DrawX;
						var nItemY = oItem.DrawY;
						var nItemW = oItem.DrawW;
						var nItemH = oItem.DrawH;

						bRet = IsIntersectWithRect(nX, nY, nW, nH, nItemX, nItemY, nItemW, nItemH);

						if (bRet) {
							break;
						}
					}// if
				}// for i
			}// if
		}// if

		return bRet;
	}

	// 겹지는 부분이 있으면 True
	function IsIntersectWithRect(x1, y1, w1, h1, nTarX, nTarY, nTarW, nTarH) {
		if (w1 < 30 && h1 < 30) {
			return ((( (nTarX < (x1 + w1)) && (x1 < (nTarX + nTarW))) && (nTarY < (y1 + h1))) && (y1 < (nTarY + nTarH)));
		} else {
			//return ((nTarX > x1 && (nTarX + nTarW) < (x1 + w1)) && (nTarY < y1 && (nTarY + nTarH) < (y1 + h1)));
			return ((nTarX > x1 && (nTarX + nTarW) < (x1 + w1)) && (nTarY > y1 && (nTarY + nTarH) < (y1 + h1)));
			//return (nTarY > y1 && (nTarY + nTarH) < (y1 + h1));
			//console.log(x1+'----'+y1+'----'+w1+'----'+h1+'----'+nTarX+'----'+nTarY+'----'+nTarW+'----'+nTarH);
		}

	}

	function IsIntersectWithRect2(x1, y1, w1, h1, nTarX, nTarY, nTarW, nTarH) {
		return ((( (nTarX < (x1 + w1)) && (x1 < (nTarX + nTarW))) && (nTarY < (y1 + h1))) && (y1 < (nTarY + nTarH)));

	}

	function EditPageSelectItem(oPanel, nX, nY, nW, nH, bMultiSelect) {
		var retSelected = false;
		BoardInfo.Selected.ItemKeys = [];

		var anItems = [];

		if (oPanel && oPanel.IsExistSelectableItem) {
			if (oPanel.Items || oPanel.Items.length > 0) {

				for (var i = oPanel.Items.length - 1; i >= 0; i--) {
					var oItem = oPanel.Items[i];
					if (oItem.IsSelectable) {
						var nItemX = oItem.DrawX;
						var nItemY = oItem.DrawY;
						var nItemW = oItem.DrawW;
						var nItemH = oItem.DrawH;

						var bSel = IsIntersectWithRect(nX, nY, nW, nH, nItemX, nItemY, nItemW, nItemH);

						if (bSel) {
							// backimage 인 경우는 메뉴에서 클릭시에만 선택 가능하게 해야 함.
							if (!isBackgroundImage && oItem.Key != 0) {
								anItems.push(oItem.Key);
							}
							if (!bMultiSelect) {
								break;
							}
						}
					}// if
				}// for i

				if (anItems.length > 0) {
					// 선택처리

					BoardInfo.Selected.PageKey = oPanel.PageKey;
					BoardInfo.Selected.PanelKey = oPanel.Key;

					for (var i = 0; i < anItems.length; i++) {
						BoardInfo.Selected.ItemKeys.push(anItems[i]);
					}

					retSelected = true;
				}// if
			}// if
		}// if

		anItems = null;

		return retSelected;
	}

	// 영역에 있는 아이템 선택처리
	// bSelect : true(선택), false(중복아이템 선택취소)
	function SelectItem(bSelect, nX, nY, nW, nH, bMultiSelect) {
		var retSelected = false;

		var nR = nX + nW;
		var nB = nY + nH;

		//var oPage = GetPageFromXYXY(nX, nY, nR, nB);
		//var oPanelInfo = GetPanelFromXYXY(nX, nY, nR, nB);
		var oPage = GetPage(1);
		var oPanelInfo = GetPanel(oPage, 1);
		var anItems = [];

		if (oPage && oPanelInfo) {
			if (oPanelInfo.Items || oPanelInfo.Items.length > 0) {

				for (var i = oPanelInfo.Items.length - 1; i >= 0; i--) {

					var oItem = oPanelInfo.Items[i];
					if (autoDrawFlag && oItem.ItemType != "cell") {

					} else {
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

						if (bSel && oItem.LayerId == layerArr[0] && !(BoardInfo.Key.IsShiftKey)) { //(oItem.LayerId == layerArr[0]) <--- 변경--->oItem.Alpha == "1.0"
							if (oItem.Key == 0 && oItem.BackImageString.length < 100) {

							} else {
								anItems.push(oItem.Key);
							}
							if (!bMultiSelect) {
								break;
							}
						}
					}

				}
				if (equipmentSelectFlag) { // 장비 등록을 위한 선택임(드로윙툴에 영향을 주면 안됨)
					var label = "";
					if (bSel && oItem.LayerId == layerArr[0] && !(BoardInfo.Key.IsShiftKey)) {
						label = oItem.Text.toString().replace(",","").replace(",NONE","");
						if (label < 1) {
							label = oItem.TypeName;
						}
						if (($('#type').val() == "ele_tr" || $('#type').val() == "ele_pole_tr" || $('#type').val() == "ele_out_tr") && oItem.Style != e_ItemStyle_EleLink) {
								alert('연결 패치 아이템만 선택가능합니다.(ITEM 목록 > 인입전력 > 전력연결패치 아이템을 생성해 주세요.)');
						} else {
							var Yn = confirm("선택하신 아이템("+label+")을(를) 등록하시겠습니까?");
							if (Yn) {
								equipmentSelectKey = oItem.Key;
								if ($('#type').val() == "ipd") {
									var inId = $('#modelId').val();
									var outId = oItem.ItemId;
									var pos = equipmentSelectRowNum;
									var label = label;
									var type = equipmentSelectIpdType;
									var amp = "0";
									var param = {inId:inId, outId:outId, pos:pos, label:label, type:type, amp:amp};
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateIpdInfo', param, 'POST', 'saveIpdInfo');
									equipmentSelectFlag = false;
									$("#tdIpd-datasA"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
									$("#tdIpd-datasB"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");

								} else if ($('#type').val() == "ac_panel" ||$('#type').val() == "ele_link" || $('#type').val() == "ele_tr" || $('#type').val() == "ele_pole_tr"
									|| $('#type').val() == "ele_in_tr" || $('#type').val() == "ele_out_tr" || $('#type').val() == "pwr_patch" || $('#type').val() == "utp_patch" || $('#type').val() == "panel_patch" ) {
									var inId = $('#modelId').val();
									var outId = oItem.ItemId;
									var pos = equipmentSelectRowNum;
									var label = label;
									var type = equipmentSelectIpdType;
									var amp = "0";
									var param = {inId:inId, outId:outId, pos:pos, label:label, type:type, amp:amp};
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateAcPanelInfo', param, 'POST', 'saveAcPanel');
									equipmentSelectFlag = false;
									$("#tdAcPanel-datasL"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
									$("#tdAcPanel-datasR"+equipmentSelectRowNum).removeClass("eClickBackgroundColor");
								} else if ($('#type').val() == "rectifier" ) { //
									var inId = $('#modelId').val();
									var outId = oItem.ItemId;
									var pos = 0;
									var label = label;
									var type = 'Z';
									var amp = equipmentSelectRowNum;
									var param = {inId:inId, outId:outId, pos:pos, label:label, type:type, amp:amp};
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRectifierInfo', param, 'POST', 'saveRectifier');
									equipmentSelectFlag = false;
								} else if ($('#type').val() == "rectifier_1" || $('#type').val() == "rectifier_2" || $('#type').val() == "rectifier_3" || $('#type').val() == "rectifier_4" || $('#type').val() == "rectifier_5" || $('#type').val() == "rectifier_6" || $('#type').val() == "rectifier_7" || $('#type').val() == "rectifier_8" || $('#type').val() == "rectifier_9" || $('#type').val() == "rectifier_10" || $('#type').val() == "rectifier_11" || $('#type').val() == "rectifier_12" || $('#type').val() == "rectifier_13" || $('#type').val() == "rectifier_14") { //
									var inId = $('#modelId').val();
									var outId = oItem.ItemId;
									var pos = equipmentSelectRowNum;
									var label = label;
									var type = 'Z';
									var amp = equipmentSelectRowNum;
									var param = {inId:inId, outId:outId, pos:pos, label:label, type:type, amp:amp};
									httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateRectifierInfo', param, 'POST', 'saveNewRectifier');
									equipmentSelectFlag = false;
								}
							}
						}
					}
				} else {
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
							}// for i

							BoardInfo.Selected.ItemKeys = [];
							anItems.sort();

							for (var i = 0; i < anItems.length; i++) {
								if (BoardInfo.Selected.ItemKeys.indexOf(anItems[i]) == -1) {
									BoardInfo.Selected.ItemKeys.push(anItems[i]);
								}
								else {
									BoardInfo.Selected.ItemKeys.pop();
								}
							}// for i

							retSelected = true;
						}
					}// if
				}
			}// if
		}// if
		if (spaceFlag) {
			BoardInfo.Selected.Clear();
		}
		anItems = null;
		if (!equipmentSelectFlag) { // 장비 등록을 위한 선택임(드로윙툴에 영향을 주면 안됨)
			SetPropertiesWindow();
		}

		return retSelected;
	}

	function GetPanelFromXYXY(x1, y1, x2, y2) {
		var retPanel = null;
		var oPage = GetPageFromXYXY(x1, y1, x2, y2);

		if (oPage) {
			var nPanelStartPos = oPage.DrawY;

			if (BoardInfo.IsViewPageTitle) {
				nPanelStartPos += BoardInfo.PageTitleHeight;
			}

			for (var i = 0; i < oPage.Panels.length; i++) {
				var panelInfo = oPage.Panels[i];

				var nX2 = oPage.DrawX;
				var nY2 = nPanelStartPos;
				var nW2 = panelInfo.DrawW;
				var nH2 = panelInfo.DrawH;

				nPanelStartPos = (nY2 + nH2);

				var nRight = nX2 + nW2;
				var nBottom = nY2 + nH2;

				nX2 -= BoardInfo.Scroll.HScroll.Value;
				nY2 -= BoardInfo.Scroll.VScroll.Value;

				if (nRight >= x1 && nBottom >= y1 && nX2 <= x1 && nY2 <= y1) {
					if (nRight >= x2 && nBottom >= y2 && nX2 <= x2 && nY2 <= y2) {
						retPanel = panelInfo;
						break;
					}// if
				}// if
			}// for i
		}// if

		return retPanel;
	}

	function GetItemFromXY(oPanel, nX, nY) {
		var oItem  = null;

		for (var i = oPanel.Items.length - 1; i >= 0; i--) {
			var oItem2 = oPanel.Items[i];

			if (oItem2.IsVisible) {
				var nItemX = oItem2.DrawX;
				var nItemY = oItem2.DrawY;
				var nItemW = oItem2.DrawW;
				var nItemH = oItem2.DrawH;

				var bSel = IsIntersectWithRect(nX, nY, 1, 1, nItemX, nItemY, nItemW, nItemH);

				if (bSel) {
					oItem = oItem2;
					break;
				}
			}// if
		}// for i

		return oItem;
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
				else if (oItem.Child && oItem.Childs.length > 0) {
					retItem = GetItemAndChild(oPanel, oItem, strItemKey);

					if (retItem != null) {
						break;
					}
				}
			}// for i
		}// if

		return retItem;
	}

	function GetItemAndChild(oPanel, oItem, strItemKey) {
		var retItem = null;

		if (oItem == null) {
			if (oPanel.Items || oPanel.Items.length > 0) {
				for (var i = 0; i < oPanel.Items.length; i++) {
					var oItem2 = oPanel.Items[i];

					if (oItem2.Key == strItemKey) {
						retItem = oItem2;
						break;
					}
					else if (oItem2.Child && oItem2.Childs.length > 0) {
						retItem = GetItemAndChild(oPanel, oItem2, strItemKey);

						if (retItem != null) {
							break;
						}
					}
				}// for i
			}// if
		}
		else {
			for (var i = 0; i < oItem.Childs.length; i++) {
				var oItem2 = oItem.Childs[i];

				if (oItem2.Key == strItemKey) {
					retItem = oItem2;
					break;
				}
				else if (oItem2.Child && oItem2.Childs.length > 0) {
					retItem = GetItemAndChild(oPanel, oItem2, strItemKey);

					if (retItem != null) {
						break;
					}
				}
			}// for i
		}

		return retItem;
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
			}// for i
		}// if

		return retPage;
	}

	// 페이지의 패널배열의 순번을 반환 : 페이지객체, 패널키
	function GetPanelIndex(oPage, nPanelKey) {
		var nIndex = -1;

		if (oPage && nPanelKey > 0) {
			for (var i = 0; i < oPage.Panels.length; i++) {
				if (oPage.Panels[i].Key == nPanelKey) {
					nIndex = i;
					break;
				}
			}
		}

		return nIndex;
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
			}// for i
		}// if

		return retPanel;
	}

	function GetPageFromXY(x, y) {

		var retInfo = null

		if (BoardInfo.Views.length > 0) {
			var nStartPos = 0;

			for (var i = 0; i < BoardInfo.Views.length; i++) {
				var nPgIdx = BoardInfo.Views[i];
				var oPage = BoardInfo.Pages[nPgIdx];

				var nTitleHeight = 0;

				if (BoardInfo.IsViewPageTitle) {
					nTitleHeight = BoardInfo.PageTitleHeight;
				}

				var nX = 0;
				var nY = nStartPos;
				var nW = oPage.getWidth();
				var nH = oPage.getHeight() + nTitleHeight;

				nStartPos = (nY + nH);

				nX -= BoardInfo.Scroll.HScroll.Value;
				nY -= BoardInfo.Scroll.VScroll.Value;

				var nRight = nX + nW;
				var nBottom = nY + nH;

				if (nRight >= x && nBottom >= y && nX <= x && nY <= y) {
					retInfo = oPage;
					break;
				}
			}// for
		}// if

		return retInfo;
	}

	function GetPageFromXYWH(x, y, w, h) {
		var x2 = x + w;
		var y2 = y + h;

		return GetPageFromXYXY(x, y, x2, y2);
	}

	function GetPageFromXYXY(x1, y1, x2, y2) {

		var retInfo = null

		if (BoardInfo.Views.length > 0) {
			var nStartPos = 0;

			for (var i = 0; i < BoardInfo.Views.length; i++) {
				var nPgIdx = BoardInfo.Views[i];
				var oPage = BoardInfo.Pages[nPgIdx];

				var nTitleHeight = 0;

				if (BoardInfo.IsViewPageTitle) {
					nTitleHeight = BoardInfo.PageTitleHeight;
				}

				var nX = 0;
				var nY = nStartPos;
				var nW = oPage.getWidth();
				var nH = oPage.getHeight() + nTitleHeight;

				nStartPos = (nY + nH);

				nX -= BoardInfo.Scroll.HScroll.Value;
				nY -= BoardInfo.Scroll.VScroll.Value;

				var nRight = nX + nW;
				var nBottom = nY + nH;

				if (nRight >= x1 && nBottom >= y1 && nX <= x1 && nY <= y1) {
					if (nRight >= x2 && nBottom >= y2 && nX <= x2 && nY <= y2) {
						retInfo = oPage;
						break;
					}// if
				}// if
			}// for
		}// if

		return retInfo;
	}

	intDraw = 0;

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
			context.clearRect(0, 0, nCanvasWidth, nCanvasHeight);
			//if (!bPrintable) {	// 프린트가 아닐 경우만 출력한다.
			context.beginPath();
			var img = new Image();
			img.src = '/tango-transmission-web/resources/images/upsd/img_background_pattern.png';
			var pattern = context.createPattern(img, 'repeat');
			context.fillStyle = pattern;
			context.fillRect(0, 0, nCanvasWidth, nCanvasHeight);
			context.closePath();
			//}
			context.save();
			context.translate(2,2);
			context.scale(scaleFactor,scaleFactor);

			DrawPages(context);

			context.restore();

			//DrawPropertiesWindow(context);
			if (isWindow == 1) {
				//DrawScroll(context);
			}
			//DrawScroll(context);
			//PopupDraw(context, true);

			if (m_sDebug != "") {
				context.textBaseline = "middle";
				context.font = "12px Arial";
				context.fillStyle = "#ff0000";
				context.textAlign = "left";
				context.fillText(m_sDebug, 100, 10, 200);
			}// if
		}// if (context) {
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

				if (BoardInfo.IsViewPageTitle) {
					nTitleHeight = BoardInfo.PageTitleHeight;
				}

				var nX = 2;
				var nY = nStartPos;
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

				// 캔버스영역에 들어가는지 확인
				if (nRight > 0 && nBottom > 0 && nX < nCanvasWidth && nY < nCanvasHeight) {
					if (nW > 0 && nH > 0) {
						DrawPage(context, oPage, nPgIdx, nX, nY, nW, nH);
					}
				}
			}// for i
		}// if
	}

	function DrawPage(context, oPage, nPgIdx, nX, nY, nW, nH) {

		var nCanvasWidth = BoardInfo.CanvasWidth;
		var nCanvasHeight = BoardInfo.CanvasHeight;

		// 선택된 페이지 여부
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
		//console.log(nX+"----"+nY+"----"+nW+"----"+nH);
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

					// 아이템 출력
					DrawItems(context, oPanel, null, bSelectedPage, oPage.Edit.getEditable(), bPrintable);

					// Auto Drawing 시
					if(autoDrawFlag) {
						var wX = 0;
						var wY = 0;
						var wWidth = 0;
						var wHeight = 0;
						var wBorderWidth = 0;
						var wEngWallCellWidth = 1850 / baseScale;
						for (var i = 0; i < oPanel.Items.length; i++) {
							var oItem = oPanel.Items[i];
							if (oItem.ItemType == "wall") {
								wX = oPanel.DrawX + (parseInt(oItem.X) + 0.5);
								wY = oPanel.DrawY + (parseInt(oItem.Y) + 0.5);
								wWidth = oItem.DrawW;
								wHeight = oItem.DrawH;
								wBorderWidth = oItem.BorderWidth;;
							}
						}

						var cWidth = 10000;
						var cHeight = 10000;

						//console.log("DrawPanel---"+wX+"---"+wY+"---"+wEngWallCellWidth);
						var dashList = [5,5];
						var antOffset = 0;
						context.beginPath();
						context.save();
						context.setLineDash(dashList);
						context.lineDashOffset = antOffset;
						context.globalAlpha = 1.0;
						context.strokeStyle = "#facc2e";
						context.lineWidth = 2;
						context.lineCap = "butt";
						context.lineJoin = "round";
						// 상단
						context.moveTo(wX - 100, wY);
						context.lineTo(wX + wWidth + 100, wY);

						// 하단
						context.moveTo(wX - 100, wY + wHeight);
						context.lineTo(wX + wWidth + 100, wY + wHeight);
						// 좌
						context.moveTo(wX, wY - 100);
						context.lineTo(wX, wY + wHeight + 100);
						// 우
						context.moveTo(wX + wWidth, wY - 100);
						context.lineTo(wX + wWidth, wY + wHeight + 100);
						context.stroke();

						context.restore();
						context.closePath();
						context.setLineDash([0]);
						//*******************************
						var dashList = [5,5];
						var antOffset = 0;
						context.beginPath();
						context.save();
						context.setLineDash(dashList);
						context.lineDashOffset = antOffset;
						context.globalAlpha = 1.0;
						context.strokeStyle = "#ffff00";
						context.lineWidth = 2;
						context.lineCap = "butt";
						context.lineJoin = "round";
						// 상단
						context.moveTo(wX + wEngWallCellWidth - 100, wY + wEngWallCellWidth);
						context.lineTo(wX + wWidth - wEngWallCellWidth + 100 , wY + wEngWallCellWidth);

						// 하단
						context.moveTo(wX + wEngWallCellWidth - 100, wY + wHeight - wEngWallCellWidth);
						context.lineTo(wX + wWidth - wEngWallCellWidth + 100, wY + wHeight - wEngWallCellWidth);
						// 좌
						context.moveTo(wX + wEngWallCellWidth, wY + wEngWallCellWidth - 100);
						context.lineTo(wX + wEngWallCellWidth, wY + wHeight - wEngWallCellWidth + 100);
						// 우
						context.moveTo(wX + wWidth - wEngWallCellWidth, wY + wEngWallCellWidth - 100);
						context.lineTo(wX + wWidth - wEngWallCellWidth, wY + wHeight - wEngWallCellWidth + 100);
						context.stroke();

						context.restore();
						context.closePath();
						context.setLineDash([0]);
						//**********************************
						context.beginPath();
						context.save();
						context.lineWidth = 1;
						context.globalAlpha = 1.0;
						context.strokeStyle = "red";
						context.moveTo(wX, wY + wEngWallCellWidth + 50);
						context.lineTo(wX + wEngWallCellWidth, wY + wEngWallCellWidth + 50);

						context.moveTo(wX, wY + wEngWallCellWidth + 50);
						context.lineTo(wX + 11, wY + wEngWallCellWidth + 50 + 11);
						context.moveTo(wX, wY + wEngWallCellWidth + 50);
						context.lineTo(wX + 11, wY + wEngWallCellWidth + 50 - 11);
						context.moveTo(wX + wEngWallCellWidth, wY + wEngWallCellWidth + 50);
						context.lineTo(wX + wEngWallCellWidth - 11, wY + wEngWallCellWidth + 50 + 11);
						context.moveTo(wX + wEngWallCellWidth, wY + wEngWallCellWidth + 50);
						context.lineTo(wX + wEngWallCellWidth - 11, wY + wEngWallCellWidth + 50 - 11);
						context.stroke();
						context.restore();
						context.closePath();

						context.beginPath();
						context.save();
						context.globalAlpha = 1.0;
						context.font = "11px 돋음";
						context.fillStyle = "#fff";
						context.textAlign = "center";
						context.fillText("1850",wX + (wEngWallCellWidth/2) , wY + wEngWallCellWidth + 36);
						context.restore();
						context.closePath();


						context.beginPath();
						context.save();
						context.lineWidth = 1;
						context.globalAlpha = 1.0;
						context.strokeStyle = "red";
						context.moveTo(wX + wEngWallCellWidth + 50, wY);
						context.lineTo(wX + wEngWallCellWidth + 50, wY + wEngWallCellWidth);

						context.moveTo(wX + wEngWallCellWidth + 50, wY);
						context.lineTo(wX + wEngWallCellWidth + 50 - 11, wY + 11);
						context.moveTo(wX + wEngWallCellWidth + 50, wY);
						context.lineTo(wX + wEngWallCellWidth + 50 + 11, wY + 11);



						context.moveTo(wX + wEngWallCellWidth + 50, wY + wEngWallCellWidth);
						context.lineTo(wX + wEngWallCellWidth + 50 - 11, wY + wEngWallCellWidth - 11);
						context.moveTo(wX + wEngWallCellWidth + 50, wY + wEngWallCellWidth);
						context.lineTo(wX + wEngWallCellWidth + 50 + 11, wY + wEngWallCellWidth - 11);
						context.stroke();
						context.restore();
						context.closePath();
//
						context.beginPath();
						context.save();
						context.globalAlpha = 1.0;
						context.font = "11px 돋음";
						context.fillStyle = "#fff";
						context.textAlign = "center";
						context.fillText("1850",wX + wEngWallCellWidth + 50 + 36, wY + (wEngWallCellWidth/2));
						context.restore();
						context.closePath();
					}

					//--- 직선 임시 출력 ---
					if (StraightPositions.length > 1) {

						context.beginPath();
						context.strokeStyle = "rgba(255,255,255,1)";
						context.lineWidth = 2;
						context.globalAlpha = 1.0;
						context.lineCap = "butt";
						context.lineJoin = "round";
						for(i = 0; i < StraightPositions.length; i++) {
							var staightPos = StraightPositions[i].split(":");
							var staightPosX = oPanel.DrawX + parseInt(staightPos[0]);
							var staightPosY = oPanel.DrawY + parseInt(staightPos[1]);
							if (i == 0) {
								context.moveTo(staightPosX, staightPosY);
							} else {
								context.lineTo(staightPosX, staightPosY);
							}
						}
						context.stroke();
						context.closePath();
					}
					// Port 연결라인 표시
					if (portKeyArr.length > 0) {
						var dashList = [12,3,3,3];
						var antOffset = 0;
						context.beginPath();
						context.setLineDash(dashList);
						context.lineDashOffset = antOffset;
						context.lineWidth = 4;
						context.globalAlpha = 1.0;
						context.strokeStyle = "#FF8000";
						for(i = 0; i < portKeyArr.length; i++) {
							var portKey 	= portKeyArr[i].split(":");
							var oItemIn 	= GetItem(oPanel, parseInt(portKey[0]));
							var oItemOut 	= GetItem(oPanel, parseInt(portKey[1]));
							var oAmp		= portKey[2];
							var otype		= portKey[3];
							if (otype != "F") {
								var nInX = (parseInt(oItemIn.DrawX) + 0.5) + oItemIn.DrawW / 2;
								var nInY = (parseInt(oItemIn.DrawY) + 0.5) + oItemIn.DrawH / 2;
								var nOutX = (parseInt(oItemOut.DrawX) + 0.5) + oItemOut.DrawW / 2;
								var nOutY = (parseInt(oItemOut.DrawY) + 0.5) + oItemOut.DrawH / 2;
								context.moveTo(nInX, nInY);
								context.lineTo(nOutX, nInY);
								context.lineTo(nOutX, nOutY);
							}

						}
						context.stroke();
						context.closePath();
						context.setLineDash([0]);


						var dashList = [12,3,3,3];
						var antOffset = 0;
						context.beginPath();
						context.setLineDash(dashList);
						context.lineDashOffset = antOffset;
						context.lineWidth = 4;
						context.globalAlpha = 1.0;
						context.strokeStyle = "#088a29";
						for(i = 0; i < portKeyArr.length; i++) {
							var portKey 	= portKeyArr[i].split(":");
							var oItemIn 	= GetItem(oPanel, parseInt(portKey[0]));
							var oItemOut 	= portKey[1];
							var oAmp		= portKey[2];
							var otype		= portKey[3];

							var nInX = (parseInt(oItemIn.DrawX) + 0.5) + oItemIn.DrawW / 2;
							var nInY = (parseInt(oItemIn.DrawY) + 0.5) + oItemIn.DrawH / 2;
							if (otype == "F") {
								var canvasDiv = document.getElementById("divMove");
								var divTarget = $("#floorLayer1");
								if ($("#floorLayer1").hasClass(oItemOut) === true) {
									divTarget = $("#floorLayer1");
								} else if ($("#floorLayer2").hasClass(oItemOut) === true) {
									divTarget = $("#floorLayer2");
								} else if ($("#floorLayer3").hasClass(oItemOut) === true) {
									divTarget = $("#floorLayer3");
								} else if ($("#floorLayer4").hasClass(oItemOut) === true) {
									divTarget = $("#floorLayer4");
								} else if ($("#floorLayer5").hasClass(oItemOut) === true) {
									divTarget = $("#floorLayer5");
								}
								var divX		= divTarget.offset().left;
								var divY		= divTarget.offset().top;
								var nOutX = parseInt((divX - canvasDiv.offsetLeft + 10)/scaleFactor) + 75;
								if (isWindow != 1) {
									var nOutY = parseInt((divY - canvasDiv.offsetTop)/scaleFactor);
									context.moveTo(nInX, nInY);
									context.lineTo(nOutX, nInY);
									context.lineTo(nOutX, nOutY);
								}
							}
						}
						context.stroke();
						context.closePath();
						context.setLineDash([0]);
					}
					// 선택된 아이템 표시
					if (BoardInfo.Selected.getIsExistItem()) {
						//$("#layderItemProperty").css('display','Inline');
						$("#layderbaseProperty").css('display','none');
						if (oPage.Key == BoardInfo.Selected.PageKey && oPanel.Key == BoardInfo.Selected.PanelKey) {
							for (var j = 0; j < BoardInfo.Selected.ItemKeys.length; j++) {
								var strItemKey = BoardInfo.Selected.ItemKeys[j];
								var oItem = GetItem(oPanel, strItemKey);

								if (oItem) {
									if (oItem.Key == "0") {
										$('[id^="itemTrans"]').css('display','block');
									} else {
										$('[id^="itemTrans"]').css('display','none');
									}
									//if (oItem.Style != e_ItemStyle_Straight) {
										var trans_cx =  (parseInt(oItem.DrawX) + 0.5) + oItem.DrawW / 2;
										var trans_cy =  (parseInt(oItem.DrawY) + 0.5) + oItem.DrawH / 2;
										var angle = oItem.Angle;
										if (spaceFlag) {
												if (oItem.Style == e_ItemStyle_Cell || oItem.LayerId == "L003") {
											//if (oItem.Style == e_ItemStyle_Cell || oItem.Style == e_ItemStyle_StdReck) {
												context.save();
												context.translate(trans_cx, trans_cy);
												context.rotate(angle*Math.PI/180);
												context.globalAlpha = 1.0;
												context.fillStyle = "rgba(0,195,255,0.3)";
												context.fillRect(-oItem.DrawW/2, -oItem.DrawH/2, oItem.DrawW, oItem.DrawH);
												context.restore();
												context.closePath();
											}
										} else {
											context.save();
											context.translate(trans_cx, trans_cy);
											context.rotate(angle*Math.PI/180);
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(0,195,255,0.3)";
											context.fillRect(-oItem.DrawW/2, -oItem.DrawH/2, oItem.DrawW, oItem.DrawH);
											context.restore();
											context.closePath();
										}

										//}
								}// if
							}// for j
						}// if
					} else {
						if ($("#layderHistroy").hasClass("historySelect")) {
							$("#layderbaseProperty").css('display','none');
						} else {
							$("#layderItemProperty").css('display','none');
							$("#layderbaseProperty").css('display','Inline');
						}
					}


					if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_EditPage) {

						if (!spaceFlag && BoardInfo.Selected.ItemKeys.length == 1 && (oItem.Style != e_ItemStyle_Straight && oItem.Style != e_ItemStyle_CableLine && oItem.Style != e_ItemStyle_OjcP && oItem.Style != e_ItemStyle_OjcT && oItem.Style != e_ItemStyle_OjcL && oItem.Style != e_ItemStyle_OjcD && oItem.Style != e_ItemStyle_InnerWall && oItem.Style != e_ItemStyle_Wall)) {
							var strItemKey = BoardInfo.Selected.ItemKeys[0];
							var oItemOne = GetItem(oPanel, strItemKey);

							if (oItemOne) {
								var nPotW = 4;

								var nOneX = oItemOne.DrawX;
								var nOneY = oItemOne.DrawY;
								var nOneW = oItemOne.DrawW;
								var nOneH = oItemOne.DrawH;
								var nOneR = nOneX + nOneW;
								var nOneB = nOneY + nOneH;

								BoardInfo.Selected.ClearPoints();

								var trans_cx =  (parseInt(nOneX) + 0.5) + nOneW / 2;
								var trans_cy =  (parseInt(nOneY) + 0.5) + nOneH / 2;
								var angle = oItemOne.Angle;
								if (oItem.Style != e_ItemStyle_OjcM) {
									// 회전 포인트
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(102,153,102,1)";
									context.fillRect(-nOneW/2 + nOneW/2 - 5, -nOneH/2 - 50, 10, 10);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();


									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5) + nOneW/2,  (parseInt(nOneY) + 0.5) - 45 , angle);
									context.strokeStyle = "rgba(102,153,102,1)";
									context.globalAlpha = 1.0;
									context.lineWidth = 1;
									context.moveTo(pos.x, pos.y);
									context.lineTo(trans_cx, trans_cy);
									context.stroke();

									BoardInfo.Selected.Points.push("9,".concat(pos.x, ",", pos.y, ",", 15, ",", 15));
								}
								// 1번 -- > 8번만 사용함. 아이템 크기변경
								if (!itemSizeFix) {
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(0,255,255,0.7)";
									context.fillRect(nOneW/2 - 5, nOneH/2 -  5, 10, 10);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5) + nOneW,  (parseInt(nOneY) + 0.5) + nOneH, angle);
									if (angle >= 0 && angle < 90) {
										BoardInfo.Selected.Points.push("8,".concat(pos.x, ",", pos.y, ",", 10, ",", 10));
									} else if (angle >= 90 && angle < 180) {
										BoardInfo.Selected.Points.push("1,".concat(pos.x, ",", pos.y, ",", 10, ",", 10));
									} else if (angle >= 180 && angle < 270) {
										BoardInfo.Selected.Points.push("1,".concat(pos.x, ",", pos.y, ",", 10, ",", 10));
									} else {
										BoardInfo.Selected.Points.push("8,".concat(pos.x, ",", pos.y, ",", 10, ",", 10));
									}
								}
								if (oItemOne.Style != e_ItemStyle_Curve && oItemOne.Style != e_ItemStyle_Triangle && oItemOne.Style != e_ItemStyle_DimensionLine && oItemOne.Style != e_ItemStyle_Text && oItem.Style != e_ItemStyle_OjcM) {
									// 2번 치수선 Top
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(178,34,34,0.7)";
									context.fillRect(-nOneW/2 + nOneW/2 - 4, -nOneH/2 - 4, 8, 8);
									//context.arc(-nOneW/2, -nOneH/2, nPotW, 0, Math.PI * 2, true);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5) + nOneW/2,  (parseInt(nOneY) + 0.5) , angle);
									BoardInfo.Selected.Points.push("2,".concat(pos.x - 3, ",", pos.y - 3, ",", 10, ",", 10));
									// 5번 치수선 Reight
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(178,34,34,0.7)";
									context.fillRect(-nOneW/2 + nOneW - 4, -nOneH/2+ nOneH/2 - 4, 8, 8);
									//context.arc(-nOneW/2, -nOneH/2, nPotW, 0, Math.PI * 2, true);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5) + nOneW,  (parseInt(nOneY) + 0.5) + nOneH/2, angle);
									BoardInfo.Selected.Points.push("5,".concat(pos.x - 3, ",", pos.y - 3, ",", 10, ",", 10));
									// 4번 치수선 Left
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(178,34,34,0.7)";
									context.fillRect(-nOneW/2 - 4, -nOneH/2+ nOneH/2 - 4, 8, 8);
									//context.arc(-nOneW/2, -nOneH/2, nPotW, 0, Math.PI * 2, true);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5),  (parseInt(nOneY) + 0.5) + nOneH/2, angle);
									BoardInfo.Selected.Points.push("4,".concat(pos.x - 3, ",", pos.y, ",", 10, ",", 10));

									// 7번 치수선 Buttom
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(178,34,34,0.7)";
									context.fillRect(nOneW/2 - nOneW/2 - 4, nOneH/2 -  4, 8, 8);
									//context.arc(-nOneW/2, -nOneH/2, nPotW, 0, Math.PI * 2, true);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + 0.5) + nOneW/2,  (parseInt(nOneY) + 0.5) + nOneH, angle);
									BoardInfo.Selected.Points.push("7,".concat(pos.x - 3, ",", pos.y - 3, ",", 10, ",", 10));
								}
								if (!spaceFlag && oItemOne.Style == e_ItemStyle_Triangle) {
									// 2번 치수선 Top
									var vertex = oItemOne.Points;
									if (vertex == "") {
										vertex = 0;
									}
									context.beginPath();
									context.save();
									context.globalAlpha = 1.0;
									context.translate(trans_cx, trans_cy);
									context.rotate(angle*Math.PI/180);
									context.fillStyle = "rgba(178,34,34,0.7)";
									context.fillRect(-nOneW/2 + vertex - 4, -nOneH/2 - 4, 8, 8);
									//context.arc(-nOneW/2, -nOneH/2, nPotW, 0, Math.PI * 2, true);
									context.translate(-trans_cx, -trans_cy);
									context.rotate(-angle*Math.PI/180);
									context.restore();
									context.closePath();
									pos = GetPoint(trans_cx, trans_cy,  (parseInt(nOneX) + vertex + 0.5),  (parseInt(nOneY) + 0.5) , angle);
									BoardInfo.Selected.Points.push("10,".concat(pos.x - 3, ",", pos.y - 3, ",", 10, ",", 10));
								}
							}// if
						}
						else  if (!spaceFlag && BoardInfo.Selected.ItemKeys.length == 1 && (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD  || oItem.Style == e_ItemStyle_InnerWall  || oItem.Style == e_ItemStyle_Wall)) {
							var strItemKey = BoardInfo.Selected.ItemKeys[0];
							var oItemOne = GetItem(oPanel, strItemKey);
							if (oItemOne) {
								var arrPoints = oItemOne.Points.split(",");
								for (i = 0; i < arrPoints.length; i++) {
									if (oItem.Style == e_ItemStyle_Wall && (arrPoints.length -1) == i) {
										continue;
									}
									var staightPos = arrPoints[i].split(":");
									var staightPosX = oPanel.DrawX + parseInt(staightPos[0]);
									var staightPosY = oPanel.DrawY + parseInt(staightPos[1]);

									if (oItem.Style == e_ItemStyle_OjcP) {
										if (i == 1) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10001;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 4) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10004;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 0) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10000;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 3) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10003;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 6) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10006;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 9) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 10009;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}
									} else  if (oItem.Style == e_ItemStyle_OjcT) {
										if (i == 1) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20001;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 4) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20004;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 0) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20000;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 2) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20002;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}  else if (i == 5) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20005;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}  else if (i == 8) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 20008;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}
									} else  if (oItem.Style == e_ItemStyle_OjcD) {
										if (i == 1) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 40001;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 2) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 40002;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 4) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 40004;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 5) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 40005;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 6) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 40006;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
//											}  else if (i == 5) {
//											context.beginPath();
//											context.globalAlpha = 1.0;
//											context.fillStyle = "rgba(255,255,051,0.7)";
//											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
//											context.closePath();
//											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
//											var pointNum = 20005;
//											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
//											}  else if (i == 8) {
//											context.beginPath();
//											context.globalAlpha = 1.0;
//											context.fillStyle = "rgba(255,255,051,0.7)";
//											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
//											context.closePath();
//											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
//											var pointNum = 20008;
//											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}
									}  else  if (oItem.Style == e_ItemStyle_OjcL) {
										if (i == 1) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 30001;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 4) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(204,0,153,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 30004;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 0) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 30000;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										} else if (i == 3) {
											context.beginPath();
											context.globalAlpha = 1.0;
											context.fillStyle = "rgba(255,255,051,0.7)";
											context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
											context.closePath();
											pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
											var pointNum = 30003;
											BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
										}
									} else {
										context.beginPath();
										context.globalAlpha = 1.0;
										context.fillStyle = "rgba(178,34,34,0.7)";
										context.fillRect(staightPosX - 4, staightPosY - 4, 8, 8);
										context.closePath();
										pos = GetPoint(staightPosX, staightPosY,  8,  8 , 0);
										var pointNum = 1000 + i;
										BoardInfo.Selected.Points.push(pointNum+",".concat(staightPosX - 3, ",", staightPosY - 3, ",", 10, ",", 10));
									}
								}
							}
						}
					}
					// 선택되는 영역 표시
					if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_EditPage) {
						if (BoardInfo.ItemEditMode == e_ItemEditMode_Add || BoardInfo.ItemEditMode == e_ItemEditMode_None) {
							if (BoardInfo.IsMouseDown && BoardInfo.MouseDownButton == "LEFT") {
								if (BoardInfo.ItemEditMode == e_ItemEditMode_None && BoardInfo.IsSelectedMove) {
									if (BoardInfo.Selected.getIsExistItem()) {
										if (oPage.Key == BoardInfo.Selected.PageKey && oPanel.Key == BoardInfo.Selected.PanelKey) {
											var nDefX = BoardInfo.MouseMoveX - BoardInfo.MouseDownX;
											var nDefY = BoardInfo.MouseMoveY - BoardInfo.MouseDownY;

											if (BoardInfo.Key.IsShiftKey) {
												if (Math.abs(nDefX) > Math.abs(nDefY)) {
													nDefY = 0;
												}
												else if (Math.abs(nDefX) < Math.abs(nDefY)) {
													nDefX = 0;
												}
											}

											if (Math.abs(nDefX) > 2 || Math.abs(nDefY) > 2) {

												for (var k = 0; k < BoardInfo.Selected.ItemKeys.length; k++) {
													var oSelItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[k]);

													if (oSelItem && oSelItem.ParentItemKey == -1) {
														var nEditX = parseInt(oSelItem.DrawX + nDefX) + 0.5;
														var nEditY = parseInt(oSelItem.DrawY + nDefY) + 0.5;
														var nEditW = oSelItem.DrawW;
														var nEditH = oSelItem.DrawH;



														var trans_cx =  (nEditX) + nEditW / 2;
														var trans_cy =  (nEditY) + nEditH / 2;
														var angle = oSelItem.Angle;
														context.save();
														context.globalAlpha = 1.0;
														context.translate(trans_cx, trans_cy);
														context.rotate(angle*Math.PI/180);
														context.strokeStyle = "rgba(255,255,255,1)";
														context.lineWidth = 1;
														context.rect(-nEditW/2, -nEditH/2, nEditW, nEditH);
														context.stroke();
														context.fillStyle = "rgba(255,255,255,0.1)";
														context.fillRect(-nEditW/2, -nEditH/2, nEditW, nEditH);

														context.restore();
														context.closePath();
													}
												}// for k
											}
										}// if
									}// if
								}
								else {
									var bNext = true;

									if (BoardInfo.EditMode == e_EditMode_EditPage) {
										if (!oPanel.IsExistSelectableItem && BoardInfo.ItemEditMode != e_ItemEditMode_Add) {
											bNext = false;
										}
									}

									if (bNext) {
										var nEditX1 = Math.min(BoardInfo.MouseDownX, BoardInfo.MouseMoveX);
										var nEditX2 = Math.max(BoardInfo.MouseDownX, BoardInfo.MouseMoveX);
										var nEditY1 = Math.min(BoardInfo.MouseDownY, BoardInfo.MouseMoveY);
										var nEditY2 = Math.max(BoardInfo.MouseDownY, BoardInfo.MouseMoveY);

										//if (nX2 <= nEditX1 && nY2 <= nEditY1 && (nX2 + nW2) > nEditX2 && (nY2 + nH2) >= nEditY2) {
											if (BoardInfo.ItemEditMode == e_ItemEditMode_Add && BoardInfo.Key.IsCtrlKey) {
												context.beginPath();
												context.globalAlpha = 1.0;
												context.strokeStyle = "rgba(255,255,255,1)";
												context.lineWidth = 1;
												context.strokeRect(nEditX1 + 0.5, nEditY1 + 0.5, (nEditX2 - nEditX1) - 1, (nEditX2 - nEditX1) - 1);
												context.fillStyle = "rgba(255,255,255,0.1)";
												context.fillRect(nEditX1 + 0.5, nEditY1 + 0.5, (nEditX2 - nEditX1) - 1, (nEditX2 - nEditX1) - 1);
												context.closePath();
											} else {
												context.beginPath();
												context.globalAlpha = 1.0;
												context.strokeStyle = "rgba(255,255,255,1)";
												context.lineWidth = 1;
												context.strokeRect(nEditX1 + 0.5, nEditY1 + 0.5, (nEditX2 - nEditX1) - 1, (nEditY2 - nEditY1) - 1);
												context.fillStyle = "rgba(255,255,255,0.1)";
												context.fillRect(nEditX1 + 0.5, nEditY1 + 0.5, (nEditX2 - nEditX1) - 1, (nEditY2 - nEditY1) - 1);
												context.closePath();
											}
										//}// if
									}// if
								}
							}// if
						}// if
					}// if
				}
			}// if
		}// if

		return nPanelStartPos
	}

	//--- 아이템들를 그린다
	function DrawItems(context, parentPanel, parentItem, bSelectedPage, bEditable, bPrintable) {
		var nParentX = 0;
		var nParentY = 0;
		var nParentW = 0;
		var nParentH = 0;

		if (parentPanel && parentPanel.Items && parentPanel.Items.length > 0) {
			// 부모페널 기준으로 그리기.

			var appendStr = "";						// 시설 현황 목록을 작성한다.(활성화 된 목록만);
			if (!bPrintable) {
				$("#scrollbarTable2").html("");		// 시설 현황 목록 초기화
			}
			nParentX = parentPanel.DrawX;
			nParentY = parentPanel.DrawY;
			nParentW = parentPanel.DrawW;
			nParentH = parentPanel.DrawH;
			appendStr = "<table id='data-facilities' class='listTalbe'>";
			appendStr += "<colgroup>";
			appendStr += "	<col width='15px' ></col>";
			appendStr += "	<col width='50%' ></col>";
			appendStr += "	<col width='*'></col>";
			appendStr += "</colgroup>";
			appendStr += "<thead></thead>";
			appendStr += "<tbody>";
			for (var i = 0; i < parentPanel.Items.length; i++) {
				var oItem = parentPanel.Items[i];

				if (oItem) {

					if (oItem.IsSelectable) {
						parentPanel.IsExistSelectableItem = true;
					}

					if (bPrintable) {
						if (oItem.IsPrintable) {
							DrawItem(context, oItem, nParentX, nParentY, nParentW, nParentH, bSelectedPage, bEditable, bPrintable);
						}
					}
					else {
						if (layerArr.indexOf(oItem.LayerId) > -1) {
							if (oItem.LayerId == layerArr[0]) {

								var labelName = (oItem.Text).toString();
								var rsName = labelName.substr(0,13).replace(","," ");
								rsName = rsName.replace("NONE","");
//								if (rsName.indexOf("NONE") != -1) {
//									rsName = "-";
//								}
								if (oItem.Key != 0) {
									appendStr += "<tr value='"+oItem.Key+"'><td><input type='checkbox' id='ckSisulItem' value='"+oItem.Key+"' ></td><td>"+ oItem.TypeName +"</td><td>"+ rsName +"</td></tr>";
								}
							}

							DrawItem(context, oItem, nParentX, nParentY, nParentW, nParentH, bSelectedPage, bEditable, bPrintable);

							//console.log(">>>>>>>>>>"+firstDataFlag);
						}
					}
				}// if
			}// for i
			appendStr += "</tbody>";
			appendStr += "</table>";




			if (!bPrintable) {
				$("#scrollbarTable2").append(appendStr);

				$('input:checkbox[id="ckSisulItem"]').each(function() {
					for (var j = 0; j < itemSisulArr.length; j++) {
						if (this.value == itemSisulArr[j]) {
							if (this.checked) {
								this.checked = false;
							} else {
								this.checked = true;
							}
						}
					}// for i
				});

			}

			firstDataFlag = false;	// 무조건 false 처리함. 딱 1번만 실행해서 데이터를 보정하기 위함.

			if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
				if (BoardInfo.ItemEditMode == e_ItemEditMode_Tab1 || BoardInfo.ItemEditMode == e_ItemEditMode_Tab2) {
					DrawTabItems(context, parentPanel, null);
				}// if
			}// if
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

		if (autoDrawFlag) {	// Auto Drawing 시에는 외벽
			if (oItem.ItemType != "wall" && oItem.ItemType != "innerwall" && oItem.ItemType != "double_doors" && oItem.ItemType != "door_left" && oItem.ItemType != "door_right" && oItem.ItemType != "cell") {
				return;
			}
		}

		if (oItem.Style == e_ItemStyle_DimensionLine && dimensionAllView) { // 기존데이터 예외처리
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
		context.beginPath();
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

		if (bPrintable) {
			borderColor = '#000000';
			if (portKeyBorderArr.indexOf("|"+oItem.Key+"|") != -1) {
				borderColor = "#FF8000";
			}
		}
		// 공간정보(랙타입에서 레이어전체로 변경-20181114)
		if (spaceFlag == true && oItem.LayerId == "L003"  && oItem.Style != e_ItemStyle_DimensionLine) {
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			context.globalAlpha = alpha;
			if (oItem.RackCount > 0 && oItem.UnitSize > 0) {
				if (oItem.RackCount > 0 && oItem.UnitSize > 0) {
					var unitP = parseInt(oItem.RackCount)/parseInt(oItem.UnitSize) * 100;
				}

				context.fillStyle = "#00AFFF";
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.strokeStyle = borderColor;
			} else {
				context.fillStyle = "#FFBDA3";
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.strokeStyle = borderColor;
			}
			context.strokeStyle = borderColor;
			context.lineWidth = oItem.BorderWidth;
			context.strokeRect(-nW/2, -nH/2, nW, nH);

			context.restore();
			context.closePath();
		} else {
			switch(oItem.Style) {
			case e_ItemStyle_Cell:
				var dottX =  nW / 5;
				var dottY =  nH / 5;
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
				context.lineWidth =  oItem.BorderWidth + 2;
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
				context.lineWidth = oItem.BorderWidth;
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
				context.lineWidth =  oItem.BorderWidth + 2;
				context.moveTo(-nW/2, -nH/2);
				context.lineTo(-nW/2, -nH/2 + nH);
//				context.moveTo(-nW/2 + nW, -nH/2);
//				context.lineTo(-nW/2 + nW, -nH/2 + nH);
				context.stroke();
				context.restore();
				context.closePath();
				// curve
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.moveTo(-nW/2, -nH/2);
				context.quadraticCurveTo(-nW/2 + nW, -nH/2, -nW/2 + nW, -nH/2 + nH);
//				context.moveTo(-nW/2 + nW/2, -nH/2 + nH);
//				context.quadraticCurveTo(0, 0, -nW/2 + nW, -nH/2);
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
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.fillStyle = "rgba(100,100,100,0.5)";
				context.fillRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

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
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);

				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(-nW/2, -nH/2 + 4, nW, nH - 8);
				context.restore();
				context.closePath();




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
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
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
				break;
			case e_ItemStyle_Generator:




				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH);
				context.restore();
				context.closePath();

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

				if (eleLinkeFlag) {
					context.beginPath();
					context.save();
					context.translate(trans_cx, trans_cy);
					context.rotate(angle*Math.PI/180);
					context.globalAlpha = 0.5;
					context.fillStyle = "#b40431";
					context.lineWidth = oItem.BorderWidth;
					context.fillRect(-nW/2, -nH/2, nW, nH);
					context.restore();
					context.closePath();
				}
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
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.lineWidth = oItem.BorderWidth;
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.strokeRect(-nW/2, -nH/2, nW, nH - 4);
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
				break;
			case e_ItemStyle_beamPillar:
				var xW = nW/3;
				var yH = nH/2;
				var  intervalPxl = nW/3;
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
//						for(let v of strPoint) {
//							console.log(v);
//							if (v == ",") {
//								strF = true;
//								break;
//							}
//							if (v == ":") {
//								break;
//							}
//						}
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

//					context.save();
//					context.translate(trans_cx, trans_cy);
//					context.rotate(angle*Math.PI/180);
//					context.lineWidth = oItem.BorderWidth;
//					context.globalAlpha = alpha;
//					context.fillStyle = borderColor;
//					context.fillRect(-nW/2 + 12, -nH/2 + 20, nW - 24, -10);
//					context.restore();
//					context.closePath();


					context.stroke();
					context.closePath();
				}
				break;
			case e_ItemStyle_OjcM:
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
				context.strokeRect(parseInt(nX) + 0.5, parseInt(nY) + 0.5, nW, nH);
				context.closePath();
				break;
			case e_ItemStyle_OjcCurve:
				var xW = nW/3;
				var yH = nH/3;
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
				context.save();
				context.translate(trans_cx, trans_cy);
				context.rotate(angle*Math.PI/180);
				context.globalAlpha = alpha;
				context.strokeStyle = borderColor;
				context.lineWidth = oItem.BorderWidth;
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
					var DimensionLinColor = "#fff";
					if (bPrintable) {
						DimensionLinColor = '#000000';
					}
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
				//console.log(oItem.Text+"----"+oItem.BorderWidth);
				break;
			default:
				context.strokeStyle = "rgba(0,0,0,1)";
			context.lineWidth = oItem.BorderWidth;
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

		var DimensionColor = 'rgba(255,255,255,1)';
		if (bPrintable) {
			DimensionColor = '#000000';
		}
		if (!spaceFlag) {
			if (dimensionAllView && !autoDrawFlag && oItem.LayerId == "L003") {

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

			} else {
				if ((dimensionView && alpha == "1.0" && oItem.DimensionTop == "Y") || (autoDrawFlag && oItem.ItemType == "wall")){ //
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

				}

				if (dimensionView && alpha == "1.0" && oItem.DimensionBottom == "Y"){
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
				if ((dimensionView && alpha == "1.0" && oItem.DimensionRight == "Y") || (autoDrawFlag && oItem.ItemType == "wall")){
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
				if (dimensionView && alpha == "1.0" && oItem.DimensionLeft == "Y"){
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

		}
		if (oItem.BackImage != null) { //  && oItem.BackImage.complete
			context.save();
			context.translate(trans_cx, trans_cy);
			context.rotate(angle*Math.PI/180);
			if (layerArr[0] == "L001") {

				var itemTrans = $("#itemTrans").val();
				if (itemTrans == "") {
					itemTrans = 100;
				}
				itemTrans = itemTrans/100;
				context.globalAlpha = itemTrans;
			} else {
				context.globalAlpha = 0.2;
			}
			//
			context.drawImage(oItem.BackImage, -nW/2, -nH/2, nW -1, nH -1);
			context.restore();
			context.closePath();
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
		//console.log(oItem.Key);
		// 아이템 ID 출력
		var bDrawID = false;

		if (BoardInfo.EditMode == e_EditMode_DesignPage) {
			// 아이템의 ID를 출력
			if (BoardInfo.IsViewDesignItemID) {
				bDrawID = true;
			}
		}
		else if (BoardInfo.EditMode == e_EditMode_DesignPanel) {
			if (BoardInfo.ItemEditMode == e_ItemEditMode_Tab1 || BoardInfo.ItemEditMode == e_ItemEditMode_Tab2) {
				if (oItem.Edit) {
					bDrawID = true;
				}
			}
			else
			{
				if (BoardInfo.IsViewDesignItemID) {
					bDrawID = true;
				}
			}
		}// else if...

		if (bDrawID) {
			context.font = "8px Arial";

			var nWID = context.measureText(oItem.Key).width + 4;
			var nHID = 10;
			var nXID = nX - 1;
			var nYID = nY - 1;

			context.beginPath();

			if (oItem.Edit) {
				context.fillStyle = "rgba(47,237,40,1)";
			}
			else {
				context.fillStyle = "rgba(255,255,0,1)";
			}
			context.fillRect(nXID, nYID, nWID, nHID);

			context.strokeStyle = "Orange";
			context.lineWidth = 1;
			context.strokeRect(nXID + 0.5, nYID + 0.5, nWID, nHID);

			context.textBaseline = "middle";
			context.textAlign = "center";
			context.fillStyle = "#000000";
			context.fillText(oItem.Key, nXID + (nWID / 2), nYID + (nHID / 2));

			context.closePath();
		}// if
	}


	///mx, my = pivot, cx, cy = corner, angle in degrees
	function GetPoint(mx, my, cx, cy, angle) {

		var x, y, dist, diffX, diffY, ca, na;

		/// get distance from center to point
		diffX = cx - mx;
		diffY = cy - my;
		dist = Math.sqrt(diffX * diffX + diffY * diffY);

		/// find angle from pivot to corner
		ca = Math.atan2(diffY, diffX) * 180 / Math.PI;

		/// get new angle based on old + current delta angle
		na = ((ca + angle) % 360) * Math.PI / 180;

		/// get new x and y and round it off to integer
		x = (mx + dist * Math.cos(na) + 0.5)|0;
		y = (my + dist * Math.sin(na) + 0.5)|0;

		return {x:x, y:y};
	}

	function GetDrawIncomplete(oItem) {
		var bDrawIncomplete = false;

		if (oItem.IsIncomplete) {
			if (oItem.IncompleteKey == "") {
				if (oItem.Style == e_ItemStyle_Check) {
					if (!oItem.Checked) {
						bDrawIncomplete = true;
					}
				}
				else {
					var sValue = GetTextArrayString(oItem.Text).trim();

					if (sValue == "") {
						bDrawIncomplete = true;
					}
				}
			}// if
			else {
				var oPageIncom = GetPage(oItem.PageKey);

				if (oPageIncom) {
					var oPanelIncom = GetPanel(oPageIncom, oItem.PanelKey);

					if (oPanelIncom) {
						bDrawIncomplete = true;

						for (var nIncom = 0; nIncom < oPanelIncom.Items.length; nIncom++) {
							var oItemIncom = oPanelIncom.Items[nIncom];

							if (oItemIncom && oItemIncom.IsIncomplete && oItemIncom.IncompleteKey == oItem.IncompleteKey) {
								if (oItemIncom.Style == e_ItemStyle_Check) {
									if (oItemIncom.Checked) {
										bDrawIncomplete = false;
										break;
									}
								}
								else {
									var sValue = GetTextArrayString(oItemIncom.Text).trim();

									if (sValue != "") {
										bDrawIncomplete = false;
										break;
									}
								}
							}// if
						}// for nIncom
					}// if
				}// if
			}
		}// if

		return bDrawIncomplete;
	}

	function GetTextFormat(sText, sFormat) {

		if (sText && sText != "" && sFormat && sFormat != "" && sFormat && sFormat != "-1" && sFormat.indexOf(".") > -1) {
			var asFormat = sFormat.toUpperCase().split(".");

			if (asFormat.length == 2) {
				if (asFormat[0] == "D") {
					try {
						if (asFormat[1] == "MM-DD") {
							var asText = sText.split("-");

							if (asText.length == 3) {
								sText = "".concat(asText[1], "-", asText[2]);
							}
						}// if
						else if (asFormat[1] == "HH:MM") {
							var asText = sText.split(":");

							if (asText.length == 3) {
								sText = "".concat(asText[0], ":", asText[1]);
							}
						}// if
					}
					catch (err) {
					}
				}
			}// if
		}// if

		return sText;
	}

	function DrawTabItems(context, parentPanel, parentItem) {
		if (parentItem && parentItem.Childs && parentItem.Childs.length > 0) {
			// 부모아이템 기준으로 그리기.

			for (var i = 0; i < parentItem.Childs.length; i++) {
				var oItem = parentItem.Childs[i];

				DrawTabItem(context, parentPanel, oItem);
			}// for i
		}
		else if (parentPanel && parentPanel.Items && parentPanel.Items.length > 0) {
			// 부모페널 기준으로 그리기.
			for (var i = 0; i < parentPanel.Items.length; i++) {
				var oItem = parentPanel.Items[i];

				DrawTabItem(context, parentPanel, oItem);
			}// for i
		}
	}

	function DrawTabItem(context, oPanel, oItem) {
		if (oPanel && oItem) {
			if (oItem.Childs.length > 0) {
				DrawTabItems(context, oPanel, oItem);
			}

			var nItemTo = 0;

			if (BoardInfo.ItemEditMode == e_ItemEditMode_Tab1) {
				nItemTo = oItem.TabTo;
			}
			else if (BoardInfo.ItemEditMode == e_ItemEditMode_Tab2) {
				nItemTo = oItem.TabEnterTo;
			}

			if (nItemTo > 0) {
				var oItemTo = GetItem(oPanel, nItemTo);

				if (oItemTo) {
					var nMoveX = oItem.DrawX + (oItem.DrawW / 2);
					var nMoveY = oItem.DrawY + (oItem.DrawH / 2);
					var nToX = oItemTo.DrawX + (oItemTo.DrawW / 2);
					var nToY = oItemTo.DrawY + (oItemTo.DrawH / 2);

					context.beginPath();
					context.moveTo(nMoveX, nMoveY);
					context.lineTo(nToX, nToY);
					context.lineWidth = 5;
					context.linecap = "round";
					context.strokeStyle = "rgba(230,0,0, 0.5)";
					context.stroke();
					context.closePath();
				}// if
			}// if
		}// if
	}

	//--- 스크롤를 그리기
	function DrawScroll(context) {
		var bHDraw = BoardInfo.Scroll.HScroll.Maximum != 0;
		var bVDraw = BoardInfo.Scroll.VScroll.Maximum != 0;

		// 오른쪽 아래 빈 공간
		if (bHDraw && bVDraw) {
			var nX = BoardInfo.Scroll.VScroll.X;
			var nY = BoardInfo.Scroll.HScroll.Y;
			var nW = BoardInfo.Scroll.VScroll.Width;
			var nH = BoardInfo.Scroll.HScroll.Height;

			//context.beginPath();
			context.fillStyle = BoardInfo.Scroll.BackColor;
			context.fillRect(nX, nY, nW, nH);
		}// if

		var nHPage = 0;

		// 세로스크롤
		if (bVDraw) {
			//--- 스크롤배경
			var nX = BoardInfo.Scroll.VScroll.X;
			var nY = BoardInfo.Scroll.VScroll.Y;
			var nW = BoardInfo.Scroll.VScroll.Width;
			var nH = BoardInfo.Scroll.VScroll.Height;

			context.beginPath();
			context.fillStyle = '#EDECEC';
			context.fillRect(nX, nY, nW, nH);
			context.closePath();

			//--- 스크롤바
			var nXBar = BoardInfo.Scroll.VScroll.BarX + 2;
			var nWBar = BoardInfo.Scroll.VScroll.BarW - 3;
			var nHBar = BoardInfo.Scroll.VScroll.BarH;
			var nYBar = 0;

			var nBarRate = BoardInfo.Scroll.VScroll.Value / BoardInfo.Scroll.VScroll.Maximum;
			nYBar = Math.floor((nH - nHBar) * nBarRate);
			BoardInfo.Scroll.VScroll.BarY = nYBar;

			context.beginPath();
			context.fillStyle = BoardInfo.Scroll.ForeColor;
			context.fillRect(nXBar, nYBar, nWBar, nHBar);
			context.closePath();
		}// if

		// 가로스크롤
		if (bHDraw) {
			//--- 배경
			var nX = BoardInfo.Scroll.HScroll.X;
			var nY = BoardInfo.Scroll.HScroll.Y;
			var nW = BoardInfo.Scroll.HScroll.Width;
			var nH = BoardInfo.Scroll.HScroll.Height;

			context.beginPath();
			context.fillStyle = '#EDECEC';;
			context.fillRect(nX, nY, nW, nH);
			context.closePath();

			//--- 스크롤바
			var nXBar = 0;
			var nYBar = BoardInfo.Scroll.HScroll.BarY + 2;
			var nWBar = BoardInfo.Scroll.HScroll.BarW;
			var nHBar = BoardInfo.Scroll.HScroll.BarH - 3;

			var nBarRate = BoardInfo.Scroll.HScroll.Value / BoardInfo.Scroll.HScroll.Maximum;
			nXBar = Math.floor((nW - nWBar) * nBarRate);
			BoardInfo.Scroll.HScroll.BarX = nXBar;

			context.beginPath();
			context.fillStyle = BoardInfo.Scroll.ForeColor;
			context.fillRect(nXBar, nYBar, nWBar, nHBar);
			context.closePath();
		}// if
	}

	function OnEvtScroll(evt) {
		document.body.scrollLeft = 0;
		document.documentElement.scrollLeft = 0;
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		Draw();
	}

	//--- 속성창 정리 ---

	function SetPropertiesWindowValueChangeBegin(nX, nY, nOffsetX, nOffsetY) {

		SetPropertiesWindowValueChangeTag();

		if (BoardInfo.PropertiesWindow.Lines.length > 0) {
			for (var i = 0; i < BoardInfo.PropertiesWindow.Lines.length; i++) {
				var oLine = BoardInfo.PropertiesWindow.Lines[i];

				if (oLine) {
					var nLineX = oLine.ValueX;
					var nLineY = oLine.ValueY;
					var nLineR = oLine.ValueW + nLineX;
					var nLineB = oLine.ValueH + nLineY;

					if (nLineX <= nX && nLineY <= nY && nLineR >= nX && nLineB >= nY) {
						if (oLine.Editable) {
							switch (oLine.Format) {
							case e_LineFormat_Bool:
							{
								var bTrueFalse = false;

								if (oLine.Value == false) {
									bTrueFalse = true;
								}

								var bNext = true;

								if (oLine.Name == "IsUserSizable" && bTrueFalse && BoardInfo.PropertiesWindow.ItemKeys.length > 0) {
									var oPage = GetPage(BoardInfo.PropertiesWindow.PageKey);
									var oPanel = GetPanel(oPage, BoardInfo.PropertiesWindow.PanelKey);

									if (!oPanel.IsUserSizable) {
										alert("패널의 'IsUserSizable' 속성을 먼저 활성해야 합니다.");
										bNext = false;
									}
								}

								if (bNext) {
									oLine.Value = bTrueFalse;
									SetPropertiesWindowValueChangeFinal(oLine.Name, oLine.Value);
								}

								break;
							}
							case e_LineFormat_Number:
							{
								PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY);
								break;
							}
							case e_LineFormat_Color:
							{
								PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY);
								break;
							}
							case e_LineFormat_MultiText:
							{
								PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY);
								break;
							}
							case e_LineFormat_Font:
							{
								PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY);
								break;
							}
							default:
							{
								PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY);
								break;
							}
							}// switch

							Draw();
							break;
						}// if
					}// if
				}// if
			}// for i
		}// if
	}

	function PropertiesWindowActiveLine(oLine, nOffsetX, nOffsetY) {
		var strTagID = "";
		var nHeight = oLine.ValueH;
		var nWidth = oLine.ValueW;

		nHeight -= 3;
		nWidth -= 5;

		switch (oLine.Format) {
		case e_LineFormat_Number:
		{
			strTagID = "tagInputNumber";
			break;
		}
		case e_LineFormat_Color:
		{
			strTagID = "tagInputColor";
			break;
		}
		case e_LineFormat_MultiText:
		{
			strTagID = "tagInputMultiText";
			nHeight *= 3;
			break;
		}
		case e_LineFormat_TextAlign:
		{
			strTagID = "tagInputTextAlign";
			nHeight += 5;
			nWidth += 6;
			break;
		}
		case e_LineFormat_CapStyle:
		{
			strTagID = "tagInputCapStyle";
			nHeight += 5;
			nWidth += 6;
			break;
		}
		case e_LineFormat_InLineStyle:
		{
			strTagID = "tagInputInLineStyle";
			nHeight += 5;
			nWidth += 6;
			break;
		}
		case e_LineFormat_CheckBoxStyle:
		{
			strTagID = "tagInputCheckBoxStyle";
			nHeight += 5;
			nWidth += 6;
			break;
		}
		case e_LineFormat_CheckStyle:
		{
			strTagID = "tagInputCheckStyle";
			nHeight += 5;
			nWidth += 6;
			break;
		}
		case e_LineFormat_Image:
		{
			strTagID = "tagInputButton";

			nHeight = oLine.ValueH + 1;
			nWidth = oLine.ValueW + 1;

			break;
		}
		case e_LineFormat_Font:
		{
			strTagID = "tagInputText";
			break;
		}
		default:
		{
			strTagID = "tagInputText";
			break;
		}
		}// switch

		var input = document.getElementById(strTagID);
		input.style.posLeft = oLine.ValueX - 1;
		input.style.posTop = oLine.ValueY - 1;
		input.style.posWidth = nWidth;
		input.style.posHeight = nHeight;
		input.style.fontFamily = "돋움체";
		input.style.fontSize = "12px";

		input.style.posLeft += nOffsetX;
		input.style.posTop += nOffsetY;

		if (oLine.Format == e_LineFormat_MultiText) {
			var strValue = "";

			for (var i = 0; i < oLine.Value.length; i++) {
				if (i > 0) {
					strValue += "\n";
				}

				strValue += oLine.Value[i];
			}// for i

			input.value = strValue;
		} else {
			if (oLine.Code.toString() == "") {
				input.value = oLine.Value;
			} else {
				input.value = oLine.Code;
			}
		}

		input.style.visibility = "visible";
		input.focus();

		BoardInfo.PropertiesWindow.InputTagName = input.id;
		BoardInfo.PropertiesWindow.InputLineName = oLine.Name;
		BoardInfo.PropertiesWindow.InputFormat = oLine.Format;

		if (oLine.Format == e_LineFormat_Color) {
			// 팝업처리
			SetProcData("DESIGN_PANEL_POPUP_COLOR", "", oLine.Value);
		}
		else if (oLine.Format == e_LineFormat_Font) {
			// 팝업처리
			SetProcData("DESIGN_PANEL_POPUP_FONT", "", oLine.Value);
		}
		else {
			switch (input.id) {
			case "tagInputMultiText":
			case "tagInputText":
			case "tagInputNumber":
			{
				SetProcData("INFO_OCX", "", "TEXT_AREA_ACTIVE")
				break;
			}// case
//			case "tagInputColor":
//			{
//			// 팝업처리
//			SetProcData("DESIGN_PANEL_POPUP_COLOR", "", oLine.Value)
//			break;
//			}
			}// switch
		}// else
	}

	function OnEvtPropertiesWindowKeydown(event) {

		if (event.keyCode == 13) {
			SetPropertiesWindowValueChangeTag();
			Draw();
		}
	}

	function OnEvtPropertiesClick(event) {
		if (BoardInfo.PropertiesWindow.InputTagName != "") {
			var input = document.getElementById(BoardInfo.PropertiesWindow.InputTagName);

			input.style.position = "absolute";
			input.visibility = "hidden";
			input.style.visibility = "hidden";

			if (BoardInfo.PropertiesWindow.InputLineName == "BackImage") {
				tagFile.value = "";
				tagFile.click();

				if (tagFile.value != "") {
					var oImage = new Image();
					oImage.onload = function() {
						var nImgW = oImage.naturalWidth;
						var nImgH = oImage.naturalHeight;

						var canvas2 = document.getElementById("Canvas2");
						canvas2.setAttribute("width", nImgW);
						canvas2.setAttribute("height", nImgH);

						var context2 = canvas2.getContext("2d");
						context2.drawImage(oImage, 0, 0, nImgW, nImgH);

						var oPage = GetPage(BoardInfo.PropertiesWindow.PageKey);
						var oPanel = GetPanel(oPage, BoardInfo.PropertiesWindow.PanelKey);
						if (oPage && oPanel) {
							for (var i = 0; i < BoardInfo.PropertiesWindow.ItemKeys.length; i++) {
								var oItem = GetItem(oPanel, BoardInfo.PropertiesWindow.ItemKeys[i]);

								oItem.BackImage = null;
								oItem.BackImageString = canvas2.toDataURL();
								oItem.BackImage = new Image();
								oItem.BackImage.onload = function() {
									Draw();
								}
								oItem.BackImage.src = oItem.BackImageString;
							}// for i
						}
					}// function

					oImage.src = tagFile.value;
					tagFile.value = "";
				}// if
			}// if

			BoardInfo.PropertiesWindow.InputTagName = "";
			BoardInfo.PropertiesWindow.InputLineName = "";
			BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;

		}
	}

	function SetPropertiesWindowValueChangeTag() {
		if (BoardInfo.PropertiesWindow.InputTagName != "") {
			var input = document.getElementById(BoardInfo.PropertiesWindow.InputTagName);

			SetPropertiesWindowValueChangeFinal(BoardInfo.PropertiesWindow.InputLineName, input.value);
			input.style.position = "absolute";
			input.visibility = "hidden";
			input.style.visibility = "hidden";

			switch (input.id) {
			case "tagInputMultiText":
			case "tagInputText":
			case "tagInputNumber":
			case "tagInputColor":
			{
				SetProcData("INFO_OCX", "", "TEXT_AREA_INACTIVE")
				break;
			}// case
			}// switch

			BoardInfo.PropertiesWindow.InputTagName = "";
			BoardInfo.PropertiesWindow.InputLineName = "";
			BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;
		}
	}

	function SetPropertiesWindowValueChangeFinal(strName, strValue) {
		//if (BoardInfo.PropertiesWindow.Lines.length > 0) {
		var oPage = GetPage(BoardInfo.PropertiesWindow.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.PropertiesWindow.PanelKey);

		if (oPage) {
			var bChanged = false;

			if (oPanel && BoardInfo.PropertiesWindow.ItemKeys.length > 0) {
				if (strName == "Height" || strName == "Width") {
					if (strValue.trim() == "" || strValue.trim() == "0") {

						Draw();
						return;
					}
				}
				// 아이템 수정
				for (var i = 0; i < BoardInfo.PropertiesWindow.ItemKeys.length; i++) {
					var oItem = GetItem(oPanel, BoardInfo.PropertiesWindow.ItemKeys[i]);
					if (oItem) {
						switch (BoardInfo.PropertiesWindow.InputFormat) {
						case e_LineFormat_Number:
						{
							if (strValue == "NaN") {
								strValue = 0;
							}
							//alert(strName +"--- "+strValue);
							if (strName == "Width" ||strName == "Height" ) {
								if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
									alert("외벽 및 직선 종류는 넓이/높이 수치를 조정할 수 없는 아이템입니다.");
									return;
								} else {
//									if (strName == "Width" ) {
//										console.log(strValue);
//									}
									oItem[strName] = strValue  / baseScale;
									// 라벨 및 저장용 수치
//									if (strName == "Width") {
//										oItem["LabelWidth"] = strValue  / baseScale;
//									} else if (strName == "Height") {
//										oItem["LabelHeight"] = strValue  / baseScale;
//									}
								}
							} else {
								if (strName == "X" && oItem.Points.length > 0 && oItem.Points != "" && oItem.Points != undefined) {
									if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
										var arrPoints = oItem.Points.split(",");
										var asPoints = [];
										for (j = 0; j < arrPoints.length; j++) {
											var staightPos = arrPoints[j].split(":");
											var tmpX = parseInt(oItem.X) - parseInt(strValue);
											var staightPosX = parseInt(staightPos[0])  - tmpX;
											var staightPosY = parseInt(staightPos[1]);
											asPoints.push(staightPosX+":"+staightPosY);
										}
										oItem.Points = asPoints.toString();
									}
								} else if (strName == "Y" && oItem.Points.length > 0 && oItem.Points != "" && oItem.Points != undefined) {
									if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
										var arrPoints = oItem.Points.split(",");
										var asPoints = [];
										for (j = 0; j < arrPoints.length; j++) {
											var staightPos = arrPoints[j].split(":");
											var tmpY = parseInt(oItem.Y) - parseInt(strValue);
											var staightPosX = parseInt(staightPos[0]);
											var staightPosY = parseInt(staightPos[1])  - tmpY;
											asPoints.push(staightPosX+":"+staightPosY);
										}
										oItem.Points = asPoints.toString();
									}
								} else if (strName == "Angle") {
									if (oItem.Style == e_ItemStyle_Straight || oItem.Style == e_ItemStyle_CableLine || oItem.Style == e_ItemStyle_OjcP || oItem.Style == e_ItemStyle_OjcT || oItem.Style == e_ItemStyle_OjcL || oItem.Style == e_ItemStyle_OjcD || oItem.Style == e_ItemStyle_InnerWall || oItem.Style == e_ItemStyle_Wall) {
										strValue = 0;
									}
								}
								oItem[strName] = parseInt(strValue);
							}
							break;
						}
						case e_LineFormat_TextAlign:
						case e_LineFormat_InLineStyle:
						case e_LineFormat_CheckBoxStyle:
						case e_LineFormat_CheckStyle:
						{
							if (strValue == "") {
								strValue = 0;
							}

							oItem[strName] = parseInt(strValue);
							break;
						}
						case e_LineFormat_MultiText:
						{
							var astrValues = strValue.toString().split("\n");
							oItem[strName] = [];

							for (var j = 0; j < astrValues.length; j++) {
								oItem[strName].push(astrValues[j]);
							}// for j

							break;
						}
						default:
						{
//							if (strName != "BackImage") {
							oItem[strName] = strValue;

							if (oItem.Style == e_ItemStyle_Check && strName == "Checked" && strValue && oItem.CheckGroup != "") {
								SetItemCheckGroup(oPanel, null, oItem.CheckGroup, oItem.Key);
							}
							else if (oItem.Style == e_ItemStyle_Check && strName == "CheckGroup" && strValue != "" && oItem.Checked) {
								SetItemCheckGroup(oPanel, null, oItem.CheckGroup, oItem.Key);
							}
//							}

							break;
						}
						}// switch

						bChanged = true;
					}
				}// for i
			}
			else if (oPanel) {
				// 패널 수정

				if (BoardInfo.PropertiesWindow.InputFormat == e_LineFormat_Number) {
					oPanel[strName] = parseInt(strValue);
				}
				else {
					if (strName.indexOf("Data_") > -1) {
						var asData = strName.split("_");
						var nDataIdx = parseInt(asData[1]) - 1;

						if (oPanel.Datas.length <= nDataIdx) {
							oPanel.Datas.push(strValue);
						}
						else {
							oPanel.Datas[nDataIdx] = strValue;
						}
					}
					else {
						oPanel[strName] = strValue;
					}
				}

				bChanged = true;

				if (strName == "Height" || strName == "Width" || strName == "IsExpanded") {
					if (strName == "Height") {
						if (oPanel.Height < 25) {
							oPanel.Height = 25;

							if (oPanel.Height < oPanel.UserMinHeight) {
								oPanel.UserMinHeight = oPanel.Height;
							}
						}
					}

					SetScroll();
				}
				else if (strName == "UserMinHeight") {
					if (oPanel.UserMinHeight < 25) {
						oPanel.UserMinHeight = 25;
					}
				}
			}
			else {
				// 페이지 수정
				oPage[strName] = strValue;

				if (strName == "Key") {
					SetPageKey(oPage, strValue);
					BoardInfo.PropertiesWindow.PageKey = strValue;
				}

				SetProcData("INFORMATION", strName, strValue);

				bChanged = true;
			}

			if (bChanged) {
				for (var i = 0; i < BoardInfo.PropertiesWindow.Lines.length; i++) {
					var oLine = BoardInfo.PropertiesWindow.Lines[i];

					if (oLine && oLine.Name == strName) {
						switch (oLine.Format) {
						case e_LineFormat_TextAlign:
						{
							oLine.Value = GetTextAlignString(strValue);
							oLine.Code = strValue;
							break;
						}
						case e_LineFormat_InLineStyle:
						{
							oLine.Value = GetInLineStyleString(strValue);
							oLine.Code = strValue;
							break;
						}
						case e_LineFormat_CheckBoxStyle:
						{
							oLine.Value = GetCheckBoxStyleString(strValue);
							oLine.Code = strValue;
							break;
						}
						case e_LineFormat_CheckStyle:
						{
							oLine.Value = GetCheckStyleString(strValue);
							oLine.Code = strValue;
							break;
						}
						case e_LineFormat_MultiText:
						{
							var astrValues = strValue.toString().split("\n");

							oLine.Value = [];

							for (var j = 0; j < astrValues.length; j++) {
								oLine.Value.push(astrValues[j]);
							}// for j
							break;
						}
						default:
						{
							oLine.Value = strValue;
							break;
						}
						}// switch

						break;
					}// if
				}// for i
			}// if
		}// if
		//}// if
	}

	function RefeshPropertiesWindow() {

		BoardInfo.PropertiesWindow.Clear();
		SetPropertiesWindow();
	}

	function SetPropertiesWindow() {

		if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_DesignPage) {

			var bElse = true;

			if (BoardInfo.Selected.getIsExistItem() && BoardInfo.EditMode == e_EditMode_DesignPanel) {

				var bEqual1 = false;
				var bEqual2 = false;
				var bEqual3 = false;

				if (BoardInfo.Selected.PageKey == BoardInfo.PropertiesWindow.PageKey) {
					bEqual1 = true;
				}

				if (BoardInfo.Selected.PanelKey == BoardInfo.PropertiesWindow.PanelKey) {
					bEqual2 = true;
				}

				var astrKeys1 = BoardInfo.Selected.ItemKeys;
				var astrKeys2 = BoardInfo.PropertiesWindow.ItemKeys;

				if (astrKeys1.length == astrKeys2.length) {
					astrKeys1.sort();
					astrKeys2.sort();

					bEqual3 = true;
					for (var i = 0; i < astrKeys1.length; i++) {
						if (astrKeys1[i] != astrKeys2[i]) {
							bEqual3 = false;
							break;
						}// if
					}// for i
				}// if

				if (!bEqual1 || !bEqual2 || !bEqual3) {

					BoardInfo.PropertiesWindow.Clear();

					var oPage = GetPage(BoardInfo.Selected.PageKey);
					var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

					if (oPage && oPanel) {
						var bCheckExists = false;

						var aoItems = [];

						for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
							var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[i]);

							if (oItem) {
								aoItems.push(oItem);
								BoardInfo.PropertiesWindow.ItemKeys.push(oItem.Key);

								if (oItem.Style == e_ItemStyle_Check) {
									bCheckExists = true;
								}// if
							}
						}// for i

						BoardInfo.PropertiesWindow.PageKey = oPanel.PageKey;
						BoardInfo.PropertiesWindow.PanelKey = oPanel.Key;

						var strArr = GetMultiItemValue(aoItems, "Text");
						var strText = "";
						if (strArr.length > 0) {
							for (var i = 0; i < strArr.length; i++) {
								if (i ==0) {
									strText += strArr[i];
								} else {
									strText += "|^@^|"+strArr[i];
								}
							}
						}

						var strStyle = GetItemStyleString(GetMultiItemValue(aoItems, "Style"));

						var strTextAlign = GetTextAlignString(GetMultiItemValue(aoItems, "TextAlign"));
						var strInLine = GetInLineStyleString(GetMultiItemValue(aoItems, "InLineStyle"));
						//var strText = myTrim(GetMultiItemValue(aoItems, "Text").toString());

						var sFont = GetMultiItemValue(aoItems, "TextFont").split("px");
						var strFontSize = sFont[0].toString();
						// Property input data
						$('#spanTitle').text(GetMultiItemValue(aoItems, "TypeName"));
						$('#itemX').val(GetMultiItemValue(aoItems, "X"));
						$('#itemY').val(GetMultiItemValue(aoItems, "Y"));
						$('#itemWidth').val(Math.round(GetMultiItemValue(aoItems, "Width") * baseScale));				//LabelWidth
						$('#itemHeight').val(Math.round(GetMultiItemValue(aoItems, "Height") * baseScale));				//LabelHeight
						$('#itemLenght').val(GetMultiItemValue(aoItems, "Style"));
						$('#itemText').val(GetReplaceText(strText));
						$('#itemFontColor').val(GetRGBToHex(GetMultiItemValue(aoItems, "TextColor")));
						$('#itemFontSize').val(strFontSize);
						$('#itemBorderColor').val(GetRGBToHex(GetMultiItemValue(aoItems, "BorderColor")));
						$('#itemBorderWidth').val(GetMultiItemValue(aoItems, "BorderWidth"));
						$('#itemAngle').val(GetMultiItemValue(aoItems, "Angle"));
						$('#itemAngleRange').val(GetMultiItemValue(aoItems, "Angle"));
						//console.log(GetMultiItemValue(aoItems, "Width"));
						/***********************************
						 *	undo, redo 데이터 저장
						 ********************************* */
						$('#hstTitle').val("아이템 속성 변경");


						var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
						var sPageData = GetPageData(sPage, true);

						var d = new Date();
						if (d.getTime() > (undoDataTimeCk + 4000)) {
							setStorageData(sPageData);
						} else {
							undoDataTimeCk = d.getTime();
						}


						bElse = false;
					}
				}

			}

		}// if
	}

	function GetReplaceText(x) {
		var str = x;
		//alert(str);
		if (x.indexOf("NONE") != -1) {
			return "";
		} else {
			return str.replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n").replace("|^@^|","\n");
		}
	}

	// DB Int To RGB
	function GetDBToRGB(strRGBInt) {
		var red = strRGBInt >> 16;
		var green = strRGBInt - (red << 16) >> 8
		var blue = strRGBInt - (red << 16) - (green << 8);
		//return red, green, blue;
		return {red:red, green:green, blue:blue};
	}

	// Color hexToRGB
	function GethexToRGB (strHex)
	{
		var R = parseInt((cutHex(strHex)).substring(0,2),16);
		var G = parseInt((cutHex(strHex)).substring(2,4),16);
		var B = parseInt((cutHex(strHex)).substring(4,6),16);

		return "rgb("+R+", "+G+", "+B+")";
	}

	function GetComponentFromStr(numStr, percent) {
		var num = Math.max(0, parseInt(numStr, 10));
		return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
	}
	function GetrgbToHexInt(rgb) {
		var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
		var result, r, g, b, hex = "";
		if ( (result = rgbRegex.exec(rgb)) ) {
			r = GetComponentFromStr(result[1], result[2]);
			g = GetComponentFromStr(result[3], result[4]);
			b = GetComponentFromStr(result[5], result[6]);

			hex = "0x" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
		return hex;
	}


	function cutHex(strHex) {
		return (strHex.charAt(0) == "#") ? strHex.substring(1,7):strHex;
	}

	// Color RGBToHex
	function GetRGBToHex(strRGB) {

		var rgbFont =  GetDBToRGB(strRGB);
		var borderColor = "rgba("+rgbFont.red+", "+rgbFont.green+", "+rgbFont.blue+", 1)";

//		var rRGB = strRGB.replace("rgba(", "").replace(")", "").replace(" ", "")
//		var sRGB = rRGB.split(",");

		return "#"+toHex(rgbFont.red)+toHex(rgbFont.green)+toHex(rgbFont.blue);
	}

	function toHex(strRGB) {
		strRGB = parseInt(strRGB, 10);
		if (isNaN(strRGB)) return "00";
		strRGB = Math.max(0, Math.min(strRGB,255));
		return "0123456789ABCDEF".charAt((strRGB-strRGB%16)/16) + "0123456789ABCDEF".charAt(strRGB%16);
	}

	// 아이템의 스탈일를 문자로 반환
	function GetItemStyleString(strStyle) {
		if (strStyle == "...") {
			return "...";
		} else if (parseInt(strStyle) == e_ItemStyle_Text) {
			return "Text";
		} else if (parseInt(strStyle) == e_ItemStyle_Table) {
			return "Table";
		} else if (parseInt(strStyle) == e_ItemStyle_Check) {
			return "Check";
		}

		return "None";
	}

	function GetTextAlignString(strAlign) {
		if (strAlign == "...") {
			return "...";
		} else if (parseInt(strAlign) == e_TextAlign_LeftTop) {
			return "LeftTop";
		} else if (parseInt(strAlign) == e_TextAlign_LeftMiddle) {
			return "LeftMiddle";
		} else if (parseInt(strAlign) == e_TextAlign_LeftBottom) {
			return "LeftBottom";
		} else if (parseInt(strAlign) == e_TextAlign_CenterTop) {
			return "CenterTop";
		} else if (parseInt(strAlign) == e_TextAlign_CenterMiddle) {
			return "CenterMiddle";
		} else if (parseInt(strAlign) == e_TextAlign_CenterBottom) {
			return "CenterBottom";
		} else if (parseInt(strAlign) == e_TextAlign_RightTop) {
			return "RightTop";
		} else if (parseInt(strAlign) == e_TextAlign_RightMiddle) {
			return "RightMiddle";
		} else if (parseInt(strAlign) == e_TextAlign_RightBottom) {
			return "RightBottom";
		}

		return "None";
	}

	function GetInLineStyleString(strInLine) {
		if (strInLine == "...") {
			return "...";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_HLine) {
			return "HLine";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_VLine) {
			return "VLine";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_XLine) {
			return "XLine";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_PLine) {
			return "_PLine";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_Ellipse) {
			return "Ellipse";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_Diagonal1) {
			return "Diagonal1";
		} else if (parseInt(strInLine) == e_ItemInLineStyle_Diagonal2) {
			return "Diagonal2";
		}
		else {
			return "None";
		}
	}

	function GetCheckBoxStyleString(strCheckBox) {
		if (strCheckBox == "...") {
			return "...";
		} else if (parseInt(strCheckBox) == e_CheckBoxStyle_Rectangle) {
			return "Rectangle";
		}

		return "None";
	}

	function GetCheckStyleString(strCheck) {
		if (strCheck == "...") {
			return "...";
		} else if (parseInt(strCheck) == e_CheckStyle_Check) {
			return "Check";
		} else if (parseInt(strCheck) == e_CheckStyle_Text) {
			return "Text";
		} else if (parseInt(strCheck) == e_CheckStyle_Circle) {
			return "Circle";
		} else if (parseInt(strCheck) == e_CheckStyle_Rectangle) {
			return "Rectangle";
		} else if (parseInt(strCheck) == e_CheckStyle_FillCircle) {
			return "FillCircle";
		} else if (parseInt(strCheck) == e_CheckStyle_FillRectangle) {
			return "FillRectangle";
		} else if (parseInt(strCheck) == e_CheckStyle_Minus) {
			return "Minus";
		} else if (parseInt(strCheck) == e_CheckStyle_Plus) {
			return "Plus";
		}

		return "None";
	}

	// 페이지의 스타일를 텍스트로 반환
	function GetPageStyleString(nStyle) {

		if (nStyle == e_PageStyle_Page) {
			return "Page";
		}
		else if (nStyle == e_PageStyle_Image) {
			return "Image";
		}

		return 'Undefined';
	}

	function GetPropertiesWindowLine(strName, strValue, strCode, nFormat, bEditable) {
		var oLine = function() {};

		oLine.Name = strName;
		oLine.Value = strValue;
		oLine.Code = strCode;
		oLine.Format = nFormat;
		oLine.Editable = bEditable;

		oLine.NameX = 0;
		oLine.NameY = 0;
		oLine.NameW = 0;
		oLine.NameH = 0;

		oLine.ValueX = 0;
		oLine.ValueY = 0;
		oLine.ValueW = 0;
		oLine.ValueH = 0;

		return oLine;
	}

	// 여려개의 아이템들의 특정 속성의 값이 같으면 값을 틀리면 "..."를 반환
	function GetMultiItemValue(aoItems, strName) {
		var strValue = "";
//		if (strName == "Text") {
//		alert(aoItems[0][strName]);
//		}
		if (aoItems && aoItems.length > 0) {
			strValue = aoItems[0][strName];

			for (var i = 1; i < aoItems.length; i++) {
				var strValue2 = aoItems[i][strName];

				if (strValue != strValue2) {
					strValue = "";
					break;
				}// if
			}// for i
//			if (strName == "Text") {
//			alert(aoItems[0][strName]);
//			}
		}// if

		return strValue;
	}

	function DrawPropertiesWindow(context) {
		if (BoardInfo.EditMode == e_EditMode_DesignPanel || BoardInfo.EditMode == e_EditMode_DesignPage) {
			if (BoardInfo.PropertiesWindow.IsView && !BoardInfo.PropertiesWindow.IsEmptyBounds()) {
				var nX = BoardInfo.PropertiesWindow.X;
				var nY = BoardInfo.PropertiesWindow.Y;
				var nW = BoardInfo.PropertiesWindow.Width;
				var nH = BoardInfo.PropertiesWindow.Height;

				context.beginPath();
				context.fillStyle = "#A6A6A6";
				context.fillRect(nX, nY, nW, nH);
				context.closePath();

				if (BoardInfo.PropertiesWindow.Lines.length > 0) {

					var nOneLineHeight = BoardInfo.PropertiesWindow.LineHeight;
					var nNameWidth = BoardInfo.PropertiesWindow.TitleWidth;
					var nValueWidth = BoardInfo.PropertiesWindow.ValueWidth;

					var nStartY = BoardInfo.PropertiesWindow.Y + 1;
					nStartY -= BoardInfo.PropertiesWindow.ScrollValue;

					for (var i = 0; i < BoardInfo.PropertiesWindow.Lines.length; i++) {
						var oLine = BoardInfo.PropertiesWindow.Lines[i];

						//--- Name ---
						var nStartX = BoardInfo.PropertiesWindow.X + 1;

						context.fillStyle = "#D6D6D6";
						context.fillRect(nStartX, nStartY, nNameWidth, nOneLineHeight);
						oLine.NameX = nStartX;
						oLine.NameY = nStartY;
						oLine.NameW = nNameWidth;
						oLine.NameH = nOneLineHeight;

						context.textBaseline = "middle";
						context.font = "12px Arial";
						context.fillStyle = "#000000";
						context.textAlign = "left";
						context.fillText(oLine.Name, nStartX + 1, nStartY + (nOneLineHeight / 2), nNameWidth);

						//--- Value ---
						nStartX += nNameWidth + 1;

						if (oLine.Editable) {
							context.fillStyle = "#FFFFFF";
						}
						else {
							context.fillStyle = "#D6D6D6";
						}
						context.fillRect(nStartX, nStartY, nValueWidth, nOneLineHeight);
						oLine.ValueX = nStartX;
						oLine.ValueY = nStartY;
						oLine.ValueW = nValueWidth;
						oLine.ValueH = nOneLineHeight;

						context.textBaseline = "middle";
						context.font = "12px Arial";
						context.fillStyle = "#000000";
						context.textAlign = "left";
						//context.fillText(oLine.Value, nStartX + 1, nStartY + (nOneLineHeight / 2), nValueWidth);
						context.fillText(oLine.Value, nStartX + 1, nStartY + (nOneLineHeight / 2));

						//--- 다음줄 ---
						nStartY += nOneLineHeight + 1;
					}// for i
				}// if

			}// if
		}// if
	}

	//--- ContextMenu ---

	function DrawContextMenu(context) {

		if (BoardInfo.ContextMenu.IsView && BoardInfo.ContextMenu.Menus.length > 0) {

			var nX = BoardInfo.PropertiesWindow.X;
			var nY = BoardInfo.PropertiesWindow.Y;
			var nW = BoardInfo.PropertiesWindow.Width;
			var nH = BoardInfo.PropertiesWindow.Height;

			context.beginPath();
			context.fillStyle = "#A6A6A6";
			context.fillRect(nX, nY, nW, nH);
			context.closePath();

			if (BoardInfo.PropertiesWindow.Lines.length > 0) {

				var nOneLineHeight = BoardInfo.PropertiesWindow.LineHeight;
				var nNameWidth = BoardInfo.PropertiesWindow.TitleWidth;
				var nValueWidth = BoardInfo.PropertiesWindow.ValueWidth;

				var nStartY = BoardInfo.PropertiesWindow.Y + 1;
				nStartY -= BoardInfo.PropertiesWindow.ScrollValue;

				for (var i = 0; i < BoardInfo.PropertiesWindow.Lines.length; i++) {
					var oLine = BoardInfo.PropertiesWindow.Lines[i];

					//--- Name ---
					var nStartX = BoardInfo.PropertiesWindow.X + 1;

					context.fillStyle = "#D6D6D6";
					context.fillRect(nStartX, nStartY, nNameWidth, nOneLineHeight);
					oLine.NameX = nStartX;
					oLine.NameY = nStartY;
					oLine.NameW = nNameWidth;
					oLine.NameH = nOneLineHeight;

					context.textBaseline = "middle";
					context.font = "12px Arial";
					context.fillStyle = "#000000";
					context.textAlign = "left";
					context.fillText(oLine.Name, nStartX + 1, nStartY + (nOneLineHeight / 2), nNameWidth);

					//--- Value ---
					nStartX += nNameWidth + 1;

					if (oLine.Editable) {
						context.fillStyle = "#FFFFFF";
					}
					else {
						context.fillStyle = "#D6D6D6";
					}
					context.fillRect(nStartX, nStartY, nValueWidth, nOneLineHeight);
					oLine.ValueX = nStartX;
					oLine.ValueY = nStartY;
					oLine.ValueW = nValueWidth;
					oLine.ValueH = nOneLineHeight;

					context.textBaseline = "middle";
					context.font = "12px Arial";
					context.fillStyle = "#000000";
					context.textAlign = "left";
					context.fillText(oLine.Value, nStartX + 1, nStartY + (nOneLineHeight / 2), nValueWidth);

					//--- 다음줄 ---
					nStartY += nOneLineHeight + 1;
				}// for i
			}// if

		}// if
	}

	function GetContextMenuLine(strTitle, strValue, nFunc) {
		var oMenu = function() {};

		oMenu.Title = strTitle;
		oMenu.Value = strValue;
		oMenu.Func = nFunc;

		oLine.TitleX = 0;
		oLine.TitleY = 0;
		oLine.TitleW = 0;
		oLine.TitleH = 0;

		return oMenu;
	}

	function OnEvtMouseUpTextEdit(event) {
		if (event.button == 2) {
			SetProcData("REQUEST_POPUP_TEXT", "", "");
		}
	}

	function OnEvtKeyDownTextEdit(event) {
		var oPage = GetPage(BoardInfo.Editing.PageKey);

		if (oPage) {
			oPage.Edit.setModify(true);
		}

		if (event.keyCode == 9) {

			if (StoreTextSelect(event.target))
			{
				event.preventDefault();
			}

			if (SetTabProc(true, event.shiftKey)) {
				event.preventDefault();

				nIntervalKey9Count = 0;
				nIntervalKey9Handle = window.setInterval("SetTagTextFoucs()", 100);
			}
		}// if
	}

	function EditPageTabKey(sOpt) {
		var asOpts = GetCommandArgs(sOpt, "SHIFT_KEY");
		var bShift = false;

		if (asOpts[0] == "1") {
			bShift = true;
		}

		if (SetTabProc(true, bShift)) {
			nIntervalKey9Count = 0;
			nIntervalKey9Handle = window.setInterval("SetTagTextFoucs()", 100);
		}
	}

	function DataKeySetValue(sOpt, sVal) {
		var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PANEL_KEY,DATA_KEY");
		var sPageKey = asOpts[0];
		var sPanelKey = asOpts[1];
		var sDataKey = asOpts[2].toUpperCase();

		var oPage = GetPage(sPageKey);
		var oPanel = GetPanel(oPage, sPanelKey);
		if (oPage && oPanel) {
			for (var i = 0; i < oPanel.Items.length; i++) {
				var oItem = oPanel.Items[i];

				if (oItem.DataKey.toUpperCase() == sDataKey) {
					if (oItem.Style == e_ItemStyle_Check) {
						if (sVal == "1" || sVal.toUpperCase() == "TRUE") {
							oItem.Checked = true;
						}
						else {
							oItem.Checked = false;
						}
					}
					else {
						oItem.Text = [];
						oItem.Text.push(sVal);
					}
				}// if
			}// for i

			Draw();
		}// if
	}

	function DataKeyGetValue(sOpt) {}

	function OnEvtKeyUpTextEdit(event) {}

	function SetTagTextFoucs() {
		if (tagText.style.visibility == "visible") {
			tagText.focus();
			nIntervalKey9Count++;

			if (nIntervalKey9Count > 10) {
				window.clearInterval(nIntervalKey9Handle);
			}
			else {
				window.clearInterval(nIntervalKey9Handle);
			}
		}
		else {
			window.clearInterval(nIntervalKey9Handle);
		}
	}

	function OnEvtTextEdit(event) {
		/*
       var oPage = GetPage(BoardInfo.Editing.PageKey);

       if (oPage) {
           oPage.Edit.setModify(true);
       }
		 */

		if (event.keyCode == 13) {

			if (BoardInfo.EditMode == e_EditMode_EditPage) {
				if (BoardInfo.Editing.getIsEdit()) {
					var oPage = GetPage(BoardInfo.Editing.PageKey);
					var oPanel = GetPanel(oPage, BoardInfo.Editing.PanelKey);

					if (oPage && oPanel) {
						var oItem = GetItem(oPanel, BoardInfo.Editing.ItemKey)
						if (oItem) {
							//--- 사용구 검사 ---
							var input = event.target;

							//input.focus();
							var nEndPos = input.selectionEnd;
							var sValue = input.value;

							var nEnterPos = sValue.lastIndexOf("\n", nEndPos - 1);
							var nSpacePos = sValue.lastIndexOf(" ", nEndPos - 1) + 1;

							if (nEndPos > 0) {
								var nSelectBegin = 0;
								var nSelectFinal = nEndPos;

								if (nEnterPos > -1 || nSpacePos > -1) {
									nSelectBegin = Math.max(nEnterPos, nSpacePos);
								}

								var sTextKey = sValue.substr(nSelectBegin, nSelectFinal - nSelectBegin).trim();

								if (sTextKey != "") {
									var sOptRet = "";
									sOptRet += GetCommandOption(false, "PAGE_KEY", oPage.Key);
									sOptRet += GetCommandOption(true, "PANEL_KEY", oPanel.Key);
									sOptRet += GetCommandOption(true, "ITEM_KEY", oItem.Key);
									sOptRet += GetCommandOption(true, "TEXT_KEY", sTextKey);
									sOptRet += GetCommandOption(true, "BEGIN_POS", nSelectBegin);
									sOptRet += GetCommandOption(true, "FINAL_POS", nSelectFinal);

									//SetProcData("REQUEST_EDIT_PAGE_AUTOTEXT", sOptRet, "");

									//SetCommand("EDIT_PAGE_SET_TEXT", sOptRet, "가나다");
								}// if
							}// if

							var bNext = true;

							//--- 엔터처리 ---
							if (oItem.TextMaxLine > 0) {
								var asValue = sValue.toString().split("\n");

								if (asValue.length >= oItem.TextMaxLine) {
									SetTabProc(false, event.shiftKey);
									event.preventDefault();
									bNext = false;
								}// if

								asValue = null;
							}// if

							/// 높이계산해서 하는 부분 고민중

							sValue = null;
						}// if (oItem) {
					}// if
				}// if
			}// if if (BoardInfo.EditMode == e_EditMode_EditPage) {
		}// if
	}

	function StoreTextSelect(oTagText) {
		if (oTagText) {

			var sValue = oTagText.value;
			var nPos1 = sValue.indexOf("^|");

			if (nPos1 > -1) {
				var nPos2 = sValue.indexOf("|^", nPos1);

				if (nPos2 > -1) {
					var sSelectText = sValue.substr(nPos1, nPos2 - nPos1 + 2);
					var sSelectText2 = sSelectText.replace("^|", "").replace("|^", "");
					var asSelectText2 = sSelectText2.split(",");

					if (asSelectText2.length > 0) {
						StoreTextClear();
						BoardInfo.StoreTextSource = sSelectText;

						for (var i = 0; i < asSelectText2.length; i++) {
							var oOpt = document.createElement("option");
							oOpt.text = asSelectText2[i];
							tagStoreText.options.add(oOpt);
						}// for i

						var nLength = tagStoreText.options.length;
						if (nLength > 10) {
							nLength = 10;
						}

						var nBoxW = 100;
						var nBoxH = nLength * 20;
						var nBoxX = (BoardInfo.CanvasWidth - nBoxW) / 2;
						var nBoxY = (BoardInfo.CanvasHeight - nBoxH) / 2;

						tagStoreText.selectedIndex = -1;
						tagStoreText.multiple = true;
						tagStoreText.style.posLeft = nBoxX;
						tagStoreText.style.posTop = nBoxY;
						tagStoreText.style.posWidth = nBoxW;
						tagStoreText.style.posHeight = nBoxH;
						tagStoreText.style.visibility = "visible";
						tagStoreText.focus();

						return true;
					}
				}// if
			}// if
		}// if

		return false;
	}

	function StoreTextClear() {
		BoardInfo.StoreTextSource = "";
		tagStoreText.style.visibility = "hidden";

		while (tagStoreText.options.length > 0)
		{
			tagStoreText.options.remove(0);
		}
	}

	function OnEvtStoreTextChange() {
		if (BoardInfo.StoreTextSource != "" && tagStoreText.selectedIndex > -1) {
			var sReplace2 = tagStoreText.options[tagStoreText.selectedIndex].text;
			var sValue = tagText.value;

			if (sValue.indexOf(BoardInfo.StoreTextSource) > -1) {
				tagText.value = sValue.replace(BoardInfo.StoreTextSource, sReplace2);
				tagText.focus();
			}

			StoreTextClear();

			StoreTextSelect(tagText);
		}// if
	}

	function OnEvtStoreTextKeyDown(event) {
		switch (event.keyCode) {
		case 27:
		{
			StoreTextClear();
			break;
		}
		}
	}

	function SetPortItemList() {

		var oPage = GetPage(BoardInfo.Selected.PageKey);
		var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
		if (oPage && oPanel) {
			if (BoardInfo.Selected.getIsExistItem && BoardInfo.Selected.ItemKeys.length == 1 ) {
				var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
				var paramData = {itemId:oItem.ItemId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getInOutList', paramData, 'GET', 'InOut');
			}
		}
	}
	function rowFacilitiesClick() {
//		var sPage = GetPageFromXYXY(10, 10, 10 + 1, 10 + 1);
//		var sPageData = GetPageData(sPage, true);
//		BoardInfo.Selected.ItemKeys.push(strKey);
//		retSelected = true;
//		SetPropertiesWindow();
	}
	var popOpenFlag = false;
	var popItemID = '';

	$a.getParamData = function(popItemID) {
		popOpenFlag = true;
		if (popItemID != null || popItemID != "") {
			SetCommand("SELECT_CLEAR", "", "");
			BoardInfo.ItemEditMode = e_ItemEditMode_None;
			BoardInfo.AddItemStyle = e_ItemStyle_None;
			BoardInfo.Selected.PageKey = 1;
			BoardInfo.Selected.PanelKey = 1;
			var oPage = GetPage(BoardInfo.Selected.PageKey);
			var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
			for (var j = 0; j < oPanel.Items.length; j++) {
				var oItem = oPanel.Items[j];
				if (oItem.ItemId == popItemID) {
					var inKey = oItem.Key;
					BoardInfo.Selected.ItemKeys.push(oItem.Key);
				}
			}
			SetPropertiesWindow();
			MouseDownClear();
			Draw();
		}
	}

	function setParamData(popItemID, popItemLB) {
		popOpenFlag = true;
		if (popItemID == null || popItemID == "") {
		} else {
			if (popOpenFlag) {
				setTimeout(function(){var iframe = $("#iframeProperties").get(0); if(iframe) {$("#iframeProperties").prop('contentWindow').$a.addPwrPort(popItemID, popItemLB);}}, 1000);
				popOpenFlag = false;
			}
		}
	}

	// 이벤트 호출
	function SetCommand(sCmd, sOpt, sVal) {
		try {
			sCmd = sCmd.trim();

			//--- Opt ---
			while (sOpt.indexOf("|^@~@^|") > -1) {
				sOpt = sOpt.replace("|^@~@^|", "'");
			}

			while (sOpt.indexOf("|^@~~@^|") > -1) {
				sOpt = sOpt.replace("|^@~~@^|", "\\");
			}

			while (sOpt.indexOf("|^@~rn~@^|") > -1) {
				sOpt = sOpt.replace("|^@~rn~@^|", "\n");
			}

			while (sOpt.indexOf("|^@~n~@^|") > -1) {
				sOpt = sOpt.replace("|^@~n~@^|", "\n");
			}

			while (sOpt.indexOf("|^@~r~@^|") > -1) {
				sOpt = sOpt.replace("|^@~r~@^|", "\r");
			}

			while (sOpt.indexOf("|^@~t~@^|") > -1) {
				sOpt = sOpt.replace("|^@~t~@^|", "\t");
			}

			//--- Val ---
			while (sVal.indexOf("|^@~@^|") > -1) {
				sVal = sVal.replace("|^@~@^|", "'");
			}

			while (sVal.indexOf("|^@~~@^|") > -1) {
				sVal = sVal.replace("|^@~~@^|", "\\");
			}

			while (sVal.indexOf("|^@~rn~@^|") > -1) {
				sVal = sVal.replace("|^@~rn~@^|", "\n");
			}

			while (sVal.indexOf("|^@~n~@^|") > -1) {
				sVal = sVal.replace("|^@~n~@^|", "\n");
			}

			while (sVal.indexOf("|^@~r~@^|") > -1) {
				sVal = sVal.replace("|^@~r~@^|", "\r");
			}

			while (sVal.indexOf("|^@~t~@^|") > -1) {
				sVal = sVal.replace("|^@~t~@^|", "\t");
			}

			if (sCmd.substr(0, 5) == "EDIT_") {
				SetCommandEdit(sCmd, sOpt, sVal);
			}
			else {

				SetProcData("COMMAND_BEGIIN", "COMMAND_NAME|^@^|".concat(sCmd, "|^@@^|METHOD_NAME|^@^|SetCommandEdit"), "");
				switch (sCmd) {
				case "DATAKEY_SET_VALUE":
				{
					//DataKeySetValue(sOpt, sVal);
					break;
				}
				case "DATAKEY_GET_VALUE":
				{
					//DataKeyGetValue(sOpt);
					break;
				}
				case "DESIGN_PAGE_NEW":
				{
					DesignNewPage(sOpt);
					break;
				}
				case "DESIGN_PAGE_ADD_PANEL":
				{
					PageAddPanel(sVal, true);
					break;
				}
				case "DESIGN_PAGE_DELETE_PANEL":
				{
					DesignPageDeletePanel();
					break;
				}
				case "DESIGN_PAGE_UP_PANEL":
				{
					DesignPageUpPanel();
					break;
				}
				case "DESIGN_PAGE_DOWN_PANEL":
				{
					DesignPageDownPanel();
					break;
				}
				case "DESIGN_PAGE_SAVE":
				{
					DesignPageSave();
					break;
				}
				case "DESIGN_PAGE_LOAD":
				{
					SetPropertiesWindowValueChangeTag();
					BoardInfo.EditMode = e_EditMode_DesignPage;
					ClearEditing();
					ClearPage();
					var oPage = PageLoad(sVal);
					if (oPage) {

						var asPageKeys = [];

						for (var i = 0; i < oPage.Panels.length; i++) {
							BoardInfo.RequestLoadPages.Add(oPage.Key, oPage.Panels[i].ExPageKey, i);
							asPageKeys.push(oPage.Panels[i].ExPageKey);
						}// for i

						for (var i = 0; i < asPageKeys.length; i++) {
							var sPageKey = asPageKeys[i];
							SetProcData("REQUEST_DESIGN_PANEL", "PAGE_KEY|^@^|".concat(sPageKey), "");
						}// for i

						BoardInfo.Pages.push(oPage);
						BoardInfo.Views.push(BoardInfo.Pages.length - 1);

						asPageKeys = null;
					}

					SetScroll();
					Draw();
					break;
				}
				case "DESIGN_PANEL_PAGE_KEY":
				{
					DesignPanelPageKey(sOpt);
					break;
				}
				case "DESIGN_PANEL_NEW":
				{
					DesignNewPanel(sOpt);
					break;
				}
				case "DESIGN_PANEL_SAVE":
				{
					DesignPanelSave();
					break;
				}
				case "DESIGN_PANEL_PRINT":
				{
					DesignPanelPrint(sOpt);
					break;
				}
				case "DESIGN_PANEL_LOAD_LAYER":
				{
					//SetPropertiesWindowValueChangeTag();

					var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE");
					BoardInfo.EditMode = e_EditMode_DesignPanel;
					ClearEditing();
					ClearPageLayer();

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
//
					//SetScroll();
					Draw();
					break;
				}
				case "DESIGN_PANEL_LOAD":
				{
					SetPropertiesWindowValueChangeTag();

					var asOpts = GetCommandArgs(sOpt, "PAGE_KEY,PAGE_TITLE");
					BoardInfo.EditMode = e_EditMode_DesignPanel;
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

					BoardInfo.Scroll.HScroll.Value = baseX - 2;
					BoardInfo.Scroll.VScroll.Value = baseY - 2;


					SetScroll();
					Draw();
					if (rptYn) {
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
						MouseDownClear();
						EquipmentSelected();
						SetPortItemList();
						rptYn = false;

						alert("신고분류 : " + stdNm2 +"\n실장 정보에서 확인하세요.");

					} else {
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
							MouseDownClear();
							EquipmentSelected();
							SetPortItemList();
							itemSelectFlag = false;
						}
						if (mobileMoveFlag) {
							alert("미배치 장비가 포함되어 있습니다. 해당 장비를 도면내 위치를 지정해 주시기 바랍니다.");
							mobileMoveFlag = false;

							SetCommand("SELECT_CLEAR", "", "");
							BoardInfo.ItemEditMode = e_ItemEditMode_None;
							BoardInfo.AddItemStyle = e_ItemStyle_None;
							BoardInfo.Selected.PageKey = 1;
							BoardInfo.Selected.PanelKey = 1;
							for (var j = 0; j < mobileMoveItemKey.length; j++) {
								BoardInfo.Selected.ItemKeys.push(mobileMoveItemKey[j]);
								//$("input[id=ckSisulItem][value="+mobileMoveItemKey[j]+"]").attr("checked", true);
							}
							SetPropertiesWindow();
							MouseDownClear();
						}
					}
					break;
				}
				case "DESIGN_PANEL_ADD_TABLE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Table);
					break;
				}
				case "DESIGN_PANEL_ADD_TEXT":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Text);
					break;
				}
				case "DESIGN_PANEL_ITEM_DELETE":
				{
					if (BoardInfo.Selected.getIsExistItem()) {
						ItemDelete(true);
					}
					break;
				}
				case "DESIGN_PANEL_ITEM_COPY":
				{
					if (BoardInfo.Selected.getIsExistItem()) {
						ItemCopy();
					}
					break;
				}
				case "DESIGN_PANEL_ITEM_PASTE":
				{
					if (BoardInfo.Selected.getIsExistItem()) {
						ItemPaste(e_PasteStyle_None, 0, 0);
					}
					break;
				}
				case "DESIGN_PANEL_ITEM_DELETE":
				{
					if (BoardInfo.Selected.getIsExistItem()) {
						ItemDelete(true);
					}
					break;
				}
				case "DESIGN_PANEL_ITEM_SELECT":
				{
					SetCommand("SELECT_CLEAR", "", "");
					BoardInfo.ItemEditMode = e_ItemEditMode_None;
					BoardInfo.AddItemStyle = e_ItemStyle_None;
					Draw();
					break;
				}
				case "DESIGN_PANEL_SQUARE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Square);
					break;
				}
				case "DESIGN_PANEL_CURVE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Curve);
					break;
				}
				case "DESIGN_PANEL_TRIANGLE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Triangle);
					break;
				}
				case "DESIGN_PANEL_DIMENSIONLINE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_DimensionLine);
					break;
				}

				case "DESIGN_PANEL_CELL":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Cell);
					break;
				}

				case "DESIGN_PANEL_CIRCLE":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Circle);
					break;
				}
				case "DESIGN_PANEL_PEN_STRAIGHT":
				{
					SetCommand("SELECT_CLEAR", "", "");
					EditPagePenStraightMode(sOpt);
					break;
				}
				case "DESIGN_PANEL_ADD_BACKIMAGE":
				{
					//alert(sVal);
					EditPanelAddImage(sOpt, sVal);
					break;
				}
				case "DESIGN_PANEL_ADD_CHECK":
				{
					SetCommand("SELECT_CLEAR", "", "");
					strRet = DesignNewItem(e_ItemStyle_Check);
					break;
				}
				case "EDIT_PAGE_CHANGE_TEXT":
				{
					//alert();
					var asOpts = GetCommandArgs(sOpt, "TEXT_COLOR,TEXT_FONT");
					if (BoardInfo.Selected.getIsExistItem()) {
						var oPage = GetPage(BoardInfo.Selected.PageKey);
						var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);
						for (var i = 0; i < BoardInfo.Selected.ItemKeys.length; i++) {
							var strItemKey = BoardInfo.Selected.ItemKeys[i];
							var oItem = GetItem(oPanel, strItemKey);
							if (asOpts[0] != "") {
								oItem.TextColor = "rgba(" + asOpts[0] + ")";
							}
							if (asOpts[1] != "") {
								oItem.TextFont = asOpts[1];
							}
							//oPanel.Items.push(oItem);
							ItemEditModeClear();
						}
						Draw();
					}
					else {
						//alert("선택된 메모장이 없습니다.");
					}
					break;
				}
				case "DESIGN_PANEL_TAB_ADD1":
				case "DESIGN_PANEL_TAB_ADD2":
				case "DESIGN_PANEL_TAB_END":
				{
					break;
				}
				case "DESIGN_PANEL_POPUP_COLOR":
				{
					if (sVal != "") {
						if (BoardInfo.PropertiesWindow.InputTagName != "") {
							var input = document.getElementById(BoardInfo.PropertiesWindow.InputTagName);

							input.value = sVal;
						}
					}

					SetPropertiesWindowValueChangeTag();

					if (sVal != "") {
						Draw();
					}
					break;
				}
				case "DESIGN_PANEL_POPUP_FONT":
				{
					if (sVal != "") {
						if (BoardInfo.PropertiesWindow.InputTagName != "") {
							var input = document.getElementById(BoardInfo.PropertiesWindow.InputTagName);

							input.value = sVal;
						}
					}

					SetPropertiesWindowValueChangeTag();

					if (sVal != "") {
						Draw();
					}
					break;
				}
				case "DESIGN_ITEM_VIEW_ID":
				{
					var asOpts = GetCommandArgs(sOpt, "VIEW")
					var sValue = asOpts[0].trim().toUpperCase();

					if (sValue == "TRUE") {
						BoardInfo.IsViewDesignItemID = true;
					}
					else if (sValue == "FALSE") {
						BoardInfo.IsViewDesignItemID = false;
					}
					else {
						BoardInfo.IsViewDesignItemID = !BoardInfo.IsViewDesignItemID;
					}

					if (BoardInfo.IsViewDesignItemID) {
						sValue = "TRUE";
					}
					else {
						sValue = "FALSE";
					}
					Draw();
					break;
				}
				case "DESIGN_ITEM_VIEW_LAYOUT":
				{
					var asOpts = GetCommandArgs(sOpt, "VIEW")
					var sValue = asOpts[0].trim().toUpperCase();

					if (sValue == "TRUE") {
						BoardInfo.IsViewDesignItemLayout = true;
					}
					else if (sValue == "FALSE") {
						BoardInfo.IsViewDesignItemLayout = false;
					}
					else {
						BoardInfo.IsViewDesignItemLayout = !BoardInfo.IsViewDesignItemLayout;
					}

					if (BoardInfo.IsViewDesignItemLayout) {
						sValue = "TRUE";
					}
					else {
						sValue = "FALSE";
					}
					Draw();
					break;
				}
				case "SELECT_CLEAR":
				{
					EquipmentClear();
					if (BoardInfo && BoardInfo.Selected) {
						BoardInfo.Selected.Clear();
						//itemSisulArr = [];
						Draw();
					}
					break;
				}
				case "CANVAS_SIZE":
				{
					CanvasResize(sOpt);
					break;
				}
				case "MOUSE_POINT":
				{
					//alert(sVal);
					BoardInfo.PenWebWrite = false;
					var asPos = sVal.split(":");
					var nPosX = parseInt(asPos[0]);
					var nPosY = parseInt(asPos[1]);
					SetPenPositionInput(nPosX, nPosY);

					break;
				}
				case "DESIGN_ITEM_PROPERTY_CHANGE":
				{
					switch (sOpt) {
					case "Text":
					{
						BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_MultiText;
						break;
					}
					case "Angle":
					case "BorderWidth":
					case "X":
					case "Y":
					case "Width":
					case "Height":
					{
						//alert()
						BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Number;
						break;
					}
					default:
					{
						if (sOpt == "TextColor" || sOpt == "BorderColor") {
							sVal = parseInt(GetrgbToHexInt(GethexToRGB(sVal)));
						}
						BoardInfo.PropertiesWindow.InputFormat = e_LineFormat_Text;
					}
					}
					SetPropertiesWindowValueChangeFinal(sOpt, sVal); //
					Draw();
					break;
				}
				case "DESIGN_PANEL_TEXTINPUT":
				{

					break;
				}
				default:
				{
					SetProcData("COMMAND_UNDEFINED", "COMMAND_NAME|^@^|".concat(sCmd, "|^@@^|METHOD_NAME|^@^|SetCommand"), "");
					break;
				}
				}// switch

				SetProcData("COMMAND_FINAL", "COMMAND_NAME|^@^|".concat(sCmd, "|^@@^|METHOD_NAME|^@^|SetCommand"), "");
			}// if
		}// try
		catch (err) {
			SetProcData("ERROR", "METHOD_NAME|^@^|SetCommand", err);
		}
	}


	function drawItemCall() {
		// Canvas 데이터
		var param =  $("#searchForm").serialize();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getItemsList', param, 'GET', 'ItemsList');
		CanvasResize("WIDTH|^@^|"+$("#divCanvas").width()+"|^@@^|HEIGHT|^@^|"+$("#divCanvas").height())
	}

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		//Result floorBgUpload   upRactEq
		//$("#rackEq_Name").val(strTxt);


		if (flag == 'FloorLink') {
			floorLinkArr = [];
			for(var i=0; i<response.floorLink.length; i++){
				var resObj = response.floorLink[i];
				floorLinkArr.push(resObj);
			}
		} else if (flag == 'UpdateBaseInfo') {
			alert("저장이 완료되었습니다.");
		} else if (flag == 'RptInf') {
			if (response.rptInf.length > 0) {
				stdNm2 = response.rptInf[0].stdNm;
				$("#itemId").val(response.rptInf[0].rackId);
				rptYn = true;
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
		} else if (flag == 'eqpRoleDivCd') {
			$('#eqpRoleDivCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			//console.log(resObj);
    			if (i == 0) {
    				var tmpObj = {"comCd":"", "comCdNm":"선택하세요","comGrpCd":"C00148","useYn":"Y"};
    				option_data.push(tmpObj);
    			}
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCdList').setData({
                 data:option_data
    		});
		} else if (flag == 'DeleteRactEq') {
			var modelId = $('#modelId').val()
			var param = {rackId:modelId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
		} else if (flag == 'UpdateRactEq') {
			if(status == "success") {
				var result = response.upRactEq;
				if (result.length > 1) {
					var modelId = $('#modelId').val()
					var param = {rackId:modelId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
				}
			}
		} else if (flag == 'InsertRactEq') {
			if(status == "success") {
				var result = response.ractEq;
				if (result.length > 1) {
					var modelId = $('#modelId').val()
					var param = {rackId:modelId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
				}
			}
		} else if (flag == 'AccordEq') {
			if(status == "success") {
				var strAlert = "";
				$.each(response.accordEq, function(i, item){
					strAlert = response.accordEq[i].sisulNm +" > "+ response.accordEq[i].floorName +" > "+ response.accordEq[i].label.replace("|^@^|","");
				});
				alert("해당 장비는 "+strAlert+"\n에서 사용중인 장비입니다.");
				//EquipmentClear();
			}
		} else if (flag == 'BaseEq') {
			if(status == "success") {
				var result = response.saveEq;
				if (result.length > 1) {
					if (result == "Accord") {
						//alert("해당 장비는 등록된 장비입니다. 다시 선택하여 주시기 바랍니다.");
						var eqpMdlId = $("#eqpMdlId").val();
						var param = {itemId : eqpMdlId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAccordEq', param, 'GET', 'AccordEq');
					} else {
						$("#rackInId").val(result);
						var rackId = $('#modelId').val();
						var sPos = equipmentSelectRowNum;
						var ePos = equipmentSelectRowNum;
						var modelNm = $('#modelNm').val();
						var modelId = $("#eqpMdlId").val();
						var userId = $("#userId").val();
						if (modelId == "") {
							alert("장비 정보를 불러오지 못했습니다. 다시 시도 하여 주시기 바랍니다.");
						} else if (userId == "") {
							alert("로그인 정보를 상실하였습니다. 다시 로그인하여 주시기 바랍니다.");
						} else {

							var param = {regId : userId, rackId:rackId, sPos:sPos, ePos:ePos, modelId:modelId, modelNm:modelNm}
							httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertRactEq', param, 'POST', 'InsertRactEq');
							$("#eqpMdlId").val("");
						}

					}
				}
			}
		}else if (flag == 'saveRectifier') {
			if(status == "success") {
				var result = response.saveRectifier;
				if (result.length > 1) {
					var oPage = GetPage(BoardInfo.Selected.PageKey);
					var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

					if (oPage && oPanel) {
						if (BoardInfo.Selected.ItemKeys.length == 1) {
							var oItem = GetItem(oPanel, equipmentSelectKey);
							oItem.ItemId = result;
							Draw();
						}
					}
					var modelId = $('#modelId').val()
					var param = {inId:modelId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'RectifierList');
				}
			}
		} else if (flag == 'DeleteRectifierInfo') {
			if(status == "success") {
				var modelId = $('#modelId').val()
				var param = {inId:modelId};
				TableRowAdd();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'RectifierList');
				SetPortItemList();
			}
		} else if (flag == 'saveNewRectifier') {
			if(status == "success") {
				var modelId = $('#modelId').val()
				var param = {inId:modelId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'NewRectifierList');
			}
		} else if (flag == 'DeleteNewRectifierInfo') {
			if(status == "success") {
				var modelId = $('#modelId').val()
				var param = {inId:modelId};
				TableRowAdd();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'NewRectifierList');
				SetPortItemList();
				equipmentSelectFlag = false;
			}
		} else if (flag == 'DeleteAcPanelInfo') {
			if(status == "success") {
				var sisulCd = $('#sisulCd').val();
				var floorId = $('#floorId').val();
				var param = {sisulCd:sisulCd, floorId:floorId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorLink', param, 'GET', 'FloorLink');


				var modelId = $('#modelId').val()
				var param = {inId:modelId};
				if (floorLinkDelFlag != true) {	// 초기화가 되지 않아 임시적으로 처리함.
					TableRowAdd();
				} else {
					floorLinkDelFlag = false;
				}
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAcPanelList', param, 'GET', 'AcPanelList');
				//SetPortItemList();
			}
		}  else if (flag == 'DeleteIpdInfo') {
			if(status == "success") {
				var modelId = $('#modelId').val();
				var param = {inId:modelId};
				TableRowAdd();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getIpdList', param, 'GET', 'IpdList');
				SetPortItemList();
			}
		}  else if (flag == 'saveAcPanel') {
			if(status == "success") {
				var result = response.saveAcPanel;
				if (result.length > 1) {
					var oPage = GetPage(BoardInfo.Selected.PageKey);
					var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

					if (oPage && oPanel) {
						if (BoardInfo.Selected.ItemKeys.length == 1) {
							var oItem = GetItem(oPanel, equipmentSelectKey);
							if (oItem.ItemId.length < 10) {
								oItem.ItemId = result;
							}
							Draw();
						}
					}
					var modelId = $('#modelId').val();
					var param = {inId:modelId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAcPanelList', param, 'GET', 'AcPanelList');

					var sisulCd = $('#sisulCd').val();
					var floorId = $('#floorId').val();
					var param = {sisulCd:sisulCd, floorId:floorId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorLink', param, 'GET', 'FloorLink');
				}
			}
		} else if (flag == 'saveIpdInfo') {
			if(status == "success") {
				var result = response.saveIpd;
				if (result.length > 1) {
					var oPage = GetPage(BoardInfo.Selected.PageKey);
					var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

					if (oPage && oPanel) {
						if (BoardInfo.Selected.ItemKeys.length == 1) {
							var oItem = GetItem(oPanel, equipmentSelectKey);
							oItem.ItemId = result;
							Draw();
						}
					}
					var modelId = $('#modelId').val();
					//alert(modelId+"---"+oItem.ItemId);
					var param = {inId:modelId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getIpdList', param, 'GET', 'IpdList');

				}
			}
		}
		else if (flag == 'NewRectifierList') {
			if(status == "success") {
				rectifierArr = [];
				$.each(response.rectifierList, function(i, item){
					var type = response.rectifierList[i].type;
					var port = response.rectifierList[i].pos;
					var amp = response.rectifierList[i].amp;
					if (type == "Z") {
						var portLabel = response.rectifierList[i].portLabel;
					} else {
						var portLabel = "-";
					}
					rectifierArr.push(type+":"+port+":"+amp+":"+portLabel);
				});
				RectifierMapping2();
				SetPortItemList();
			}
		} else if (flag == 'RectifierList') {
			if(status == "success") {
				rectifierArr = [];
				$.each(response.rectifierList, function(i, item){
					var portLabel = response.rectifierList[i].portLabel;
					var outId = response.rectifierList[i].outId;
					var amp = response.rectifierList[i].amp;
					rectifierArr.push(outId+":"+portLabel+":"+amp);
				});
				//alert(rectifierArr.toString());
				RectifierMapping();
				SetPortItemList();
			}
		} else if (flag == 'AcPanelList') {
			if(status == "success") {
				acPanelArr = [];
				$.each(response.acPanelList, function(i, item){
					var pos = response.acPanelList[i].pos;
					var portLabel = response.acPanelList[i].portLabel;
					var outId = response.acPanelList[i].outId;
					var type = response.acPanelList[i].type;
					var amp = response.acPanelList[i].amp;
					acPanelArr.push(pos+":"+outId+":"+type+":"+portLabel+":"+amp);
				});
				AcPanelMapping();
				SetPortItemList();
			}
		} else if (flag == 'RackInList') {
			if(status == "success") {
				$("#eqpTypeGubun1").show();
				$("#eqpTypeGubun2").show();
				$("#eqpTypeGubun3").show();
				$("#eqp_Dis").show();
				$("#eqp_Dis").val('');
				$("#rackEq_Cd").val('');
				rackInArr = [];
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
				});

				RackInMapping();
				SetPortItemList();
			}
		} else if (flag == 'IpdList') {
			if(status == "success") {
				ipdArr = [];
				$.each(response.ipdList, function(i, item){
					var pos = response.ipdList[i].pos;
					var portLabel = response.ipdList[i].portLabel;
					var outId = response.ipdList[i].outId;
					var type = response.ipdList[i].type;
					//console.log(pos+":"+outId+":"+type+":"+portLabel);
					ipdArr.push(pos+":"+outId+":"+type+":"+portLabel);
				});
				IpdMapping();
				SetPortItemList();
			}
		} else if (flag == 'UpdateEquipmentInfo') {
			if(status == "success") {
				var result = response.saveEquipmentInfo;

				if (result.length > 0) {
					if (BoardInfo.Selected.getIsExistItem()) {
						var oPage = GetPage(BoardInfo.Selected.PageKey);
						var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

						if (oPage && oPanel) {
							if (BoardInfo.Selected.ItemKeys.length == 1) {
								var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
								oItem.ItemId = result;
								$('#modelId').val(oItem.ItemId);
								var paramData = "modelId="+oItem.ItemId; //F35FEEC5-EBB4-E1FD-A682-A395D3F3BB72";//
								// 장비 기본정보 불러오기
								httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEquipmentInfo', paramData, 'GET', 'EquipmentInfo');
							}
						}
					}
				}
			}
		} else if (flag == 'UpdateEquipmentInfo2') {
			if(status == "success") {
				var result = response.saveEquipmentInfo;

				if (result.length > 0) {
					if (BoardInfo.Selected.getIsExistItem()) {
						var oPage = GetPage(BoardInfo.Selected.PageKey);
						var oPanel = GetPanel(oPage, BoardInfo.Selected.PanelKey);

						if (oPage && oPanel) {
							if (BoardInfo.Selected.ItemKeys.length == 1) {
								var oItem = GetItem(oPanel, BoardInfo.Selected.ItemKeys[0]);
								//oItem.ItemId = result;
								//$('#modelId').val(oItem.ItemId);
								alert("장비 속성이 저장되었습니다."); //+oItem.ItemId
								var paramData = "modelId="+oItem.ItemId; //F35FEEC5-EBB4-E1FD-A682-A395D3F3BB72";//
								// 장비 기본정보 불러오기
								httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEquipmentInfo', paramData, 'GET', 'EquipmentInfo');
							}
						}
					}
				}
			}
		} else if(flag == 'TotalLvCode') {
			if (response.totalLvCode.length > 0) {
				$.each(response.totalLvCode, function(i, item){
					$('#lv1').val(response.totalLvCode[i].lv1);
					$('#lv2').val(response.totalLvCode[i].lv2);
				});
				if ($('#lv1').val().length == 0) {
					alert("해당 아이템은 장비 속성을 지원하지 않습니다.");
					EquipmentClear();
				} else {
					var layerGubun = $('#layerGubun').val();
					var modelId = $('#modelId').val();
					var lv1 = $('#lv1').val();
					var lv2 = $('#lv2').val();
					var lv3 =  $('#lv3').val();
					var label =  $('#lv3').val();
					var width = $('#itemWidth').val();
					var length = $('#itemHeight').val();
					var height = 0;									//$('#height').val();
					var csType = '';									//$('#csType').val();
					var vendor = '';//$('#vendor').val();
					var modelNm = $('#modelNm').val().replace(",","");
					var serial = '';//$('#serial').val();
					var capacity = '';//$('#capacity').val();
					var weight = '';//$('#weight').val();
					var pFactor = '';//$('#pFactor').val();
					var efficiency = '';//$('#efficiency').val();
					var voltInput = '';//$('#voltInput').val();
					var freqInput = '';//$('#freqInput').val();
					var rvoltOutput = '';//$('#rvoltOutput').val();
					var mcurrentOutput = '';//$('#mcurrentOutput').val();
					var manager = '';//$('#manager').val();
					var description = '';//$('#description').val();
					var unitSize = '';//$('#unitSize').val();
					var portCnt = '1';//$('#unitSize').val();
					if ($('#unitSize').val() == "") {
						if ($('#type').val() == "ipd" || $('#type').val() == "ac_panel"  || $('#type').val() == "ele_tr" || $('#type').val() == "ele_pole_tr" || $('#type').val() == "ele_in_tr" || $('#type').val() == "ele_out_tr" || $('#type').val() == "ele_link") {
							$('#unitSize').val("4");
						} else {
							$('#unitSize').val("1");
						}
						unitSize = $('#unitSize').val();
					}
					var param = {layerGubun:layerGubun, modelId:modelId, lv1:lv1, lv2:lv2, lv3:lv3, label:label, width:width, length:length, height:height, csType:csType, vendor:vendor, modelNm:modelNm, serial:serial, capacity:capacity, weight:weight, pFactor:pFactor, efficiency:efficiency, voltInput:voltInput, freqInput:freqInput, rvoltOutput:rvoltOutput, mcurrentOutput:mcurrentOutput, manager:manager, description:description, unitSize:unitSize, portCnt:portCnt };
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateEquipmentInfo', param, 'POST', 'UpdateEquipmentInfo');

					TableRowAdd();

				}
			} else {
				alert("해당 아이템은 장비 속성을 지원하지 않습니다.");
				EquipmentClear();
			}
		} else if(flag == 'EquipmentInfo') {
			if (response.equipmentInfo.length > 0) {
				$.each(response.equipmentInfo, function(i, item){
					$('#layerGubun').val(response.equipmentInfo[i].layerGubun);
					$('#lv1').val(response.equipmentInfo[i].lv1);
					$('#lv2').val(response.equipmentInfo[i].lv2);
					$('#lv1Nm').val(response.equipmentInfo[i].lv1Nm);
					$('#lv2Nm').val(response.equipmentInfo[i].lv2Nm);
					var label = "";
					if (response.equipmentInfo[i].label == "") {
						label = spanTitle.text();
					} else {
						label = response.equipmentInfo[i].label;
					}
					$('#label').val(label);
					$('#width1').val(response.equipmentInfo[i].width);
					$('#length1').val(response.equipmentInfo[i].length);
					$('#height1').val(response.equipmentInfo[i].height);
					$('#csType').val(response.equipmentInfo[i].csType).prop("selected",true);

					$('#vendor').val(response.equipmentInfo[i].vendor);
					$('#modelNm2').val(response.equipmentInfo[i].modelNm);
					$('#serial').val(response.equipmentInfo[i].serial);
					$('#capacity').val(response.equipmentInfo[i].capacity);
					$('#weight').val(response.equipmentInfo[i].weight);
					$('#pFactor').val(response.equipmentInfo[i].pFactor);
					$('#efficiency').val(response.equipmentInfo[i].efficiency);
					$('#voltInput').val(response.equipmentInfo[i].voltInput);
					$('#freqInput').val(response.equipmentInfo[i].freqInput);
					$('#rvoltOutput').val(response.equipmentInfo[i].rvoltOutput);
					$('#mcurrentOutput').val(response.equipmentInfo[i].mcurrentOutput);
					$('#manager').val(response.equipmentInfo[i].manager);

					$('#portCnt').val(response.equipmentInfo[i].portCnt);
					//console.log(response.equipmentInfo[i].portCnt);
					$('#description').val(response.equipmentInfo[i].description);
					var cstrStatCd = response.equipmentInfo[i].cstrStatCd;
					if (cstrStatCd == null || cstrStatCd == undefined || cstrStatCd == '') {
						cstrStatCd = '0';
					}
					$('#cstrStatCd').val(cstrStatCd);
					$('#cstrCd').val(response.equipmentInfo[i].cstrCd);


//					 if ($('#type').val() == "rectifier") {
//						 $('#unitSize').val("1");
//					 } else {
//						 $('#unitSize').val(response.equipmentInfo[i].unitSize);
//					 }
					 $('#unitSize').val(response.equipmentInfo[i].unitSize);
					 var tmpUnitSize = $('#unitSize').val();
					 if (tmpUnitSize == "" || tmpUnitSize == "0") {
						 $('#unitSize').val("1");
					 }

					TableRowAdd();
					if ($('#type').val() == "ipd") {
						var modelId = $('#modelId').val()
						var param = {inId:modelId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getIpdList', param, 'GET', 'IpdList');
					} else if ($('#type').val() == "ac_panel"  || $('#type').val() == "ele_tr" || $('#type').val() == "ele_pole_tr" || $('#type').val() == "ele_in_tr" || $('#type').val() == "ele_out_tr" || $('#type').val() == "ele_link" || $('#type').val() == "pwr_patch" || $('#type').val() == "utp_patch" || $('#type').val() == "panel_patch") {
						var modelId = $('#modelId').val()
						var param = {inId:modelId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getAcPanelList', param, 'GET', 'AcPanelList');
					} else if ($('#type').val() == "rectifier") {
						var modelId = $('#modelId').val()
						var param = {inId:modelId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'RectifierList');
					} else if ($('#type').val() == "rectifier_1" || $('#type').val() == "rectifier_2" || $('#type').val() == "rectifier_3" || $('#type').val() == "rectifier_4" || $('#type').val() == "rectifier_5" || $('#type').val() == "rectifier_6" || $('#type').val() == "rectifier_7" || $('#type').val() == "rectifier_8" || $('#type').val() == "rectifier_9" || $('#type').val() == "rectifier_10" || $('#type').val() == "rectifier_11" || $('#type').val() == "rectifier_12" || $('#type').val() == "rectifier_13" || $('#type').val() == "rectifier_14") {
						var modelId = $('#modelId').val()
						var param = {inId:modelId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRectifierList', param, 'GET', 'NewRectifierList');
					} else if ($('#type').val() == "std_double_rack" || $('#type').val() == "std_half_rack" || $('#type').val() == "std_integral_rack" || $('#type').val() == "std_rack"  || $('#type').val() == "etc_box_rack"  || $('#type').val() == "exc_rack") {
						var modelId = $('#modelId').val()
						var param = {rackId:modelId};
						httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRackInList', param, 'GET', 'RackInList');
					}
				});

			} else {
				var lv3 = $('#lv3').val();
				var type = $('#type').val();
				var param = {lv3:lv3,type:type};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getTotalLvCode', param, 'GET', 'TotalLvCode');
			}

		} else if(flag == 'csType') {
			var option_data = [{cd: '', cdNm: '선택'}];
			for(var i=0; i<response.csTypeList.length; i++){
				var resObj = response.csTypeList[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				orgIdL1: ''
			});
		} else if(flag == "ParamInfoSet") {
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
				DrawDataBind();
			}
		}
		else if(flag == "InOut") {
			if(status == "success") {
				portKeyArr = [];
				portKeyBorderArr = [];
				var tmpPortKeyBorderArr = [];

				$.each(response.InOutList, function(i, item){
					var inId 	= response.InOutList[i].inId;
					var outId 	= response.InOutList[i].outId;
					var amp		= response.InOutList[i].amp;
					var type	= response.InOutList[i].type;
					var pos		= response.InOutList[i].pos;
					var oPage = GetPage(1);
					var oPanel = GetPanel(oPage, 1);
					if (oPage && oPanel) {
						for (var j = 0; j < oPanel.Items.length; j++) {
							var oItem = oPanel.Items[j];
							if (oItem.ItemId == inId.trim()) {
								var inKey = oItem.Key;
							}
							if (oItem.ItemId == outId.trim()) {
								var outKey = oItem.Key;
							} else {
								if (type == 'F') {
									var outKey = pos;
								}
							}
						}
					}

					if (inKey != undefined && outKey != undefined) {
						var oItemIn = GetItem(oPanel, inKey);
						var oItemOut = GetItem(oPanel, outKey);
						if (type == 'F') {
							portKeyArr.push(oItemIn.Key+":"+outKey+":"+amp+":"+type);
							tmpPortKeyBorderArr.push("|"+oItemIn.Key+"|");			// 같은 값이 존재할 수 있어 구분자로 처리
							tmpPortKeyBorderArr.push("|"+outKey+"|");
						} else {
							portKeyArr.push(oItemIn.Key+":"+oItemOut.Key+":"+amp+":"+type);
							tmpPortKeyBorderArr.push("|"+oItemIn.Key+"|");			// 같은 값이 존재할 수 있어 구분자로 처리
							tmpPortKeyBorderArr.push("|"+oItemOut.Key+"|");
						}
					}
				});

				// 유니크값으로 변환
				$.each(tmpPortKeyBorderArr, function(i, el){
					if($.inArray(el, portKeyBorderArr) === -1) portKeyBorderArr.push(el);
				});
				Draw();
			}
		}
		else if(flag == "FloorBgUpload") {
			if(status == "success") {
				var result = response.Result;
				if (result > 0) {
					alert("저장이 완료되었습니다.");
				}
			}
		}
		else if(flag == "SaveDraw") {
			if(status == "success") {
				var result = response.saveDrawData;
				if (result > 0) {
					$("#version").val(result);
					$("#backgroundImage").val("");
					$("#drawingDatas").val("");
					alert("저장이 완료되었습니다.");
					$("#loader").css('display','none');
					var param =  $("#searchForm").serialize();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawHistroy', param, 'GET', 'DrawHistroy');


					//alert(param);
					// Canvas 데이터
					//clear();
					//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLayersList', '', 'GET', 'Layers');
					//location.reload();
					//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getItemsList', param, 'GET', 'ItemsList');
				}
			}
		}
		else if(flag == "FloorBg") {
			if(status == "success") {
				$.each(response.floorBg, function(i, item){
					if (response.floorBg[i].bgUrl != undefined) {
						tmpBgUrl = response.floorBg[i].bgUrl.replace("uploadFiles/","");
						bgRotation = response.floorBg[i].rotation;
						bgX = response.floorBg[i].x;
						bgY = response.floorBg[i].y;
						bgWidth = response.floorBg[i].width;
						bgHeight = response.floorBg[i].height;
						bgAlpha =  response.floorBg[i].alpha;
						$("#itemTrans").val(bgAlpha);

						$.ajax({
							url : '/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/viewImageBg',
							data : { img: encodeURIComponent(tmpBgUrl) },
							method : 'GET'
						}).complete(function(jqxhr, status) {
							if (status == "success") {
								bgUrl = "data:image/png;base64,"+jqxhr.responseText;
								//console.log(bgUrl)
							}
						})
						.fail(failCallback);
					}
				});
			}
			Draw();
			setTimeout(drawItemCall(),4000);

		}
		else if(flag == "Sisul") {
			if(status == "success") {
				var mtsoId = "";
				var sisulNm = "";
				var orgIdNm = "";
				var appendStr = "";
				$.each(response.sisulNm, function(i, item){
					mtsoId = response.sisulNm[i].mtsoId;
					sisulNm = response.sisulNm[i].sisulNm;
					orgIdNm = response.sisulNm[i].orgIdNm;
					workGubun = response.sisulNm[i].workGubun;
					upsdRackCnt 	= response.sisulNm[i].upsdRackCnt;
					upsdDemdRackCnt = response.sisulNm[i].upsdDemdRackCnt;
					if (sisulNm.length > 17) {
						sisulNm = sisulNm.substring(1,16) + "..";
					}
					appendStr = "&nbsp;&nbsp;"+sisulNm;

				});
				if (workGubun == "") workGubun = "SKT";
				$("#mtsoId").val(mtsoId);
				$("#workGubun").val(workGubun);
				$("#sisulNm").append(appendStr);
				pirntTitle = appendStr;
				if (parseInt(upsdRackCnt) > parseInt(upsdDemdRackCnt)) {
					//if(parseInt(upsdDemdRackCnt) > 0) {
						//setTimeout(alert('종국 Rack이 부족합니다.\n투자국사 관리에서 확인하여 주시기 바랍니다.'),4000);
					//}
				}

			}
		}
		else if(flag == "Floor") {
			if(status == "success") {
				var floorVal = "";
				var floorNumber = "";
				var floorNm = "";
				var floorId = $("#floorId").val();
				var style = "";
				neFloorWidth = 0;
				neFloorHeight = 0;
				//#floorLayer1
				$("#floorLayer1").css('display','none');
				$("#floorLayer2").css('display','none');
				$("#floorLayer3").css('display','none');
				$("#floorLayer4").css('display','none');
				$("#floorLayer5").css('display','none');
				floorIdArr = [];
				$.each(response.floorInfo, function(i, item){
					floorVal = response.floorInfo[i].floorName + '|^@^|'
					floorNumber = response.floorInfo[i].floorName + 'F'
					if (response.floorInfo[i].floorLabel.length > 7) {
						floorNm = '&nbsp;[' + response.floorInfo[i].floorLabel.substring(0,10)+".." + ']'
					} else {
						floorNm = '&nbsp;[' + response.floorInfo[i].floorLabel + ']'
					}


					if (floorId == response.floorInfo[i].floorId) {
						style = "color:#000;background-color:#ccc;";

						neFloorWidth  = response.floorInfo[i].neFloorWidth;
						neFloorHeight  = response.floorInfo[i].neFloorLength;
						//alert(neFloorWidth)
						if (neFloorWidth == '0' || neFloorWidth == '' || neFloorWidth == undefined || neFloorWidth == null || neFloorHeight == '0' || neFloorHeight== '' || neFloorHeight == undefined || neFloorHeight == null ) {
//							callMsgBox('','I', '누락된 층정보가 있습니다. 층 정보를 수정하세요.', function(msgId, msgRst){});
							alert('층국사의 가로,세로,층고,층국사중 누락된 정보가 있습니다.\n층목록에서 층ID 또는 라벨명을 클릭하여 수정하여 주시기 바랍니다.')
							$a.close();
						}
						
						$("#neFloorWidth").val(neFloorWidth);
						$("#neFloorHeight").val(neFloorHeight);
						baseScale = response.floorInfo[i].standardSize;
						scaleFactor = response.floorInfo[i].scaleFactor;

						$("#scaleFactor").val(scaleFactor);

						baseX = response.floorInfo[i].baseX;
						baseY = response.floorInfo[i].baseY;
						$("#baseX").val(baseX);
						$("#baseY").val(baseY);
						if (baseScale == null || baseScale == "0" ) {
							baseScale = 26.45;
						}
						pirntSubTitle = floorNumber+floorNm;
					}
					else {
						style="color:#ccc;background-color:#1e2325;";
						var tmpfloorId = response.floorInfo[i].floorId;
						var tmpfloorNm = response.floorInfo[i].floorName;
						floorIdArr.push(tmpfloorId+":"+tmpfloorNm);
					}
					var floor_ID = $("#floorId").val();
					var floorStyle = "color:#cccccc;";
					if (floor_ID == response.floorInfo[i].floorId) {
						floorStyle = "color:#000000;"
					}




					if (i == 0) {
						$("#floorLayer1").html("");
						$("#floorLayer1").addClass(response.floorInfo[i].floorId);
						$("#floorLayer1").css('display','Inline');
						if (floor_ID == response.floorInfo[i].floorId) {
							$("#floorLayer1").css('background-color','#dcdcdc');
							$("#floorLayer1").css('color','#000000');
						} else {
							$("#floorLayer1").css('background-color','#1e2325');
						}
						$("#floorLayer1").append("<a href='#' value="+response.floorInfo[i].floorId+"|^@^|"+response.floorInfo[i].version+" style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>");
					}
					else if (i == 1) {
						$("#floorLayer2").html("");
						$("#floorLayer2").addClass(response.floorInfo[i].floorId);
						$("#floorLayer2").css('display','Inline');
						if (floor_ID == response.floorInfo[i].floorId) {
							$("#floorLayer2").css('background-color','#dcdcdc');
							$("#floorLayer2").css('color','#000000');
						} else {
							$("#floorLayer2").css('background-color','#1e2325');
						}
						$("#floorLayer2").append("<a href='#' value="+response.floorInfo[i].floorId+"|^@^|"+response.floorInfo[i].version+" style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>");
						//$("#floorLayer2").append("<a href='/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do?sisulCd="+response.floorInfo[i].sisulCd+"&floorId="+response.floorInfo[i].floorId+"&version="+response.floorInfo[i].version+"&userId="+$("#userId").val()+"' style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>"); // value='" + floorVal + "'
					}
					else if (i == 2) {
						$("#floorLayer3").html("");
						$("#floorLayer3").addClass(response.floorInfo[i].floorId);
						$("#floorLayer3").css('display','Inline');
						if (floor_ID == response.floorInfo[i].floorId) {
							$("#floorLayer3").css('background-color','#dcdcdc');
							$("#floorLayer3").css('color','#000000');
						} else {
							$("#floorLayer3").css('background-color','#1e2325');
						}
						$("#floorLayer3").append("<a href='#' value="+response.floorInfo[i].floorId+"|^@^|"+response.floorInfo[i].version+" style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>");
					}
					else if (i == 3) {
						$("#floorLayer4").html("");
						$("#floorLayer4").addClass(response.floorInfo[i].floorId);
						$("#floorLayer4").css('display','Inline');
						if (floor_ID == response.floorInfo[i].floorId) {
							$("#floorLayer4").css('background-color','#dcdcdc');
							$("#floorLayer4").css('color','#000000');
						} else {
							$("#floorLayer4").css('background-color','#1e2325');
						}
						$("#floorLayer4").append("<a href='#' value="+response.floorInfo[i].floorId+"|^@^|"+response.floorInfo[i].version+" style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>");
					}
					else if (i == 4) {
						$("#floorLayer5").html("");
						$("#floorLayer5").addClass(response.floorInfo[i].floorId);
						$("#floorLayer5").css('display','Inline');
						if (floor_ID == response.floorInfo[i].floorId) {
							$("#floorLayer5").css('background-color','#dcdcdc');
							$("#floorLayer5").css('color','#000000');
						} else {
							$("#floorLayer5").css('background-color','#1e2325');
						}
						$("#floorLayer5").append("<a href='#' value="+response.floorInfo[i].floorId+"|^@^|"+response.floorInfo[i].version+" style='"+floorStyle+"'>" + floorNumber+floorNm + "</a>");
					}
				});
				//$("#sisulNm").append(appendStr);

			}
		}
		else if (flag == "DrawHistroy") {
			if(status == "success") {
				var appendStr = "";
				var checkFlag = "";
				var overlapItem = "";
				$("#layderHistroy").html("");		// 아이템 목록 초기화
				appendStr = "<table class='listTalbe'>";
				appendStr += "<colgroup>";
				appendStr += "	<col width='25%' ></col>";
				appendStr += "	<col width='*'></col>";
				//appendStr += "	<col width='10%'></col>";
				appendStr += "</colgroup>";
				appendStr += "<thead></thead>";
				appendStr += "<tbody>";
				$.each(response.drawHistroyList, function(i, item){
					var hstTitle = response.drawHistroyList[i].hstTitle;
					if (hstTitle == undefined || hstTitle == null || hstTitle == "") {
						hstTitle = "-";
					}
					appendStr += "<tr><td style='widht:100%;'>";

						appendStr += "<table class='historyTalbe' id='tblBt' value='"+response.drawHistroyList[i].itemHstSrno+"'>";
						appendStr += "<colgroup>";
						appendStr += "	<col width='10px'></col>";
						appendStr += "	<col width='25%' ></col>";
						appendStr += "	<col width='*'></col>";

						appendStr += "</colgroup>";
						appendStr += "<thead></thead>";
						appendStr += "<tbody>";
						appendStr += "<tr><td></td><td>작업일자</td><td>"+response.drawHistroyList[i].regDt+"("+response.drawHistroyList[i].regId+")</td></tr>";
						appendStr += "<tr><td></td><td>작업내용</td><td>"+hstTitle+"</td></tr>";
						appendStr += "</tbody>";
						appendStr += "</table>";

					appendStr += "</td></tr>";

				});

				appendStr += "</tbody>";
				appendStr += "</table>";
				$("#layderHistroy").append(appendStr);
			}
		}
		else if(flag == "BasicItemList") {
			if(status == "success") {
				var appendStr = "";
				var checkFlag = "";
				var overlapItem = "";
				$("#scrollbarTable").html("");		// 아이템 목록 초기화
				appendStr = "<table  id='data-baseItems' class='listTalbe'>";
				appendStr += "<colgroup>";
				appendStr += "	<col width='85px' ></col>";
				appendStr += "	<col width='*'></col>";
				appendStr += "	<col width='10%'></col>";
				appendStr += "</colgroup>";
				appendStr += "<thead></thead>";
				appendStr += "<tbody>";
				$.each(response.basicItemList, function(i, item){
					var chBookMarkId = "chBookMarkId_"+i;
					var lv2Nm = response.basicItemList[i].lv2Nm;
					var lv3 = response.basicItemList[i].lv3;
					var bookMark = response.basicItemList[i].bookmark;
					var itemId = response.basicItemList[i].itemId;
					var itemVal = "TYPENAME|^@^|"+response.basicItemList[i].lv3+"|^@@^|STYLE|^@^|"+response.basicItemList[i].type+"|^@@^|WIDTH|^@^|"+response.basicItemList[i].width+"|^@@^|HEIGHT|^@^|"+response.basicItemList[i].length+"|^@@^|Z|^@^|"+response.basicItemList[i].height;
					if (bookMark == "1") {
						checkFlag = "checked";
					} else {
						checkFlag = "";
					}
					var layerId = layerArr[0];
					//L004,L005
					if (response.basicItemList[i].layerGubun == layerId && overlapItem != lv3) {
						if (itemSearchVal != "" && lv3.indexOf(itemSearchVal) == 0) {
							if (bookMarkAll && checkFlag != "checked") { return; }
							appendStr += "<tr id='item_"+i+"'  value='"+itemVal+"'><td>"+lv2Nm+"</td><td>"+lv3+"</td><td><div class='check-rating-stars'><input type='checkbox' name='ckBookMark'  id='"+chBookMarkId+"' value='"+itemId+"' "+checkFlag+" ><label for='"+chBookMarkId+"'></label></div></td></tr>";
						}
						else if (itemSearchVal == "" ) {

							if (bookMarkAll && checkFlag != "checked") { return; }
							appendStr += "<tr id='item_"+i+"'  value='"+itemVal+"'><td>"+lv2Nm+"</td><td>"+lv3+"</td><td><div class='check-rating-stars'><input type='checkbox' name='ckBookMark'  id='"+chBookMarkId+"' value='"+itemId+"' "+checkFlag+" ><label for='"+chBookMarkId+"'></label></div></td></tr>";
						}
						overlapItem = lv3;
					}
				});

				appendStr += "</tbody>";
				appendStr += "</table>";
				$("#scrollbarTable").append(appendStr);
			}
		}
		else if(flag == 'Layers') {
			if(status == "success"){
				var layerId = "";
				var layerName = "";
				var viewYn = "N";
				var appendStr = "";
				var checkFlag = "";
				appendStr = "<table id='data-layers' class='listTalbe'>";
				appendStr += "<colgroup>";
				//appendStr += "	<col width='6px' ></col>";
				appendStr += "	<col width='93%'></col>";
				appendStr += "	<col width='*'></col>";
				appendStr += "</colgroup>";
				appendStr += "<thead></thead>";
				appendStr += "<tbody>";

				$.each(response.layersList, function(i, item){
					layerId = response.layersList[i].layerId;
					layerName = response.layersList[i].layerName;
					viewYn = response.layersList[i].viewYn;
					if (layerId == 'L010' || layerId == '2EABFD6D-4371-BFC7-BE53-E2CB7A73CF58' )  {
						viewYn = 'N';
					}
					if (layerId == 'L001' || layerId == 'L003'  || layerId == 'L004'  || layerId == 'L005'  || layerId == 'L006'  || layerId == 'L007'  || layerId == 'L008'  || layerId == 'L009')  {
						checkFlag = "checked";
					}
					else {
						checkFlag = "";
					}

					if (viewYn == 'Y') {
						appendStr += "<tr id='"+layerId+"' ><td value='"+layerId+"'>&nbsp;&nbsp;"+layerName+"</td><th value='"+layerId+"'><input type='checkbox'  id='ckLayerId' value='"+layerId+"' "+checkFlag+"></th></tr>";
					}

				});
				appendStr += "</tbody>";
				appendStr += "</table>";
				$("#layerConent").append(appendStr);

				bgUrl = "";
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

				$("#"+layerArr[0]).addClass("eClickLayerBackgroundColor");

				var param =  $("#searchForm").serialize();
				// 층간 연결정보
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorLink', param, 'GET', 'FloorLink');
				// 지역 > 국사명
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSisulNm', param, 'GET', 'Sisul');
				// 층 정보
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorInfo', param, 'GET', 'Floor');
				// Canvas 배경이미지 불러오기(상면데이터 호출 후 실행해야 함.)
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorBg', param, 'GET', 'FloorBg');


				// 아이템 리스트
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBasicItemList', param, 'GET', 'BasicItemList');
				// 장비타입
				//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/SKT', null, 'GET', 'eqpRoleDivCd');

				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawHistroy', param, 'GET', 'DrawHistroy');

				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRptInf', param, 'GET', 'RptInf');
				// 장비타입 구분 대분류
				var supCd = {supCd : 'D00001'};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'typeGubun1');
			}
		}
		else if(flag == 'ItemsList') {
			firstDataFlag = true;
			//dimension
			if(status == "success"){
				var pageDatas = "PAGE_NAMEVALUE|^@3@^|Key|^@1@^|1|^@2@^|Title|^@1@^|상면관리|^@2@^|Style|^@1@^|0|^@2@^|Date|^@1@^||^@2@^|Time|^@1@^||^@2@^|IsPrintable|^@1@^|true|^@2@^|HeadPrint|^@1@^|A|^@2@^|FootPrint|^@1@^|A|^@2@^|SheetKey|^@1@^||^@2@^|Value|^@1@^|";
				var panelDatas = "PANEL_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|Key|^@1@^|1|^@2@^|BackColor|^@1@^|rgba(255,255,255,1)|^@2@^|Width|^@1@^|5000|^@2@^|Height|^@1@^|5000|^@2@^|IsPrintable|^@1@^|true|^@2@^|ExpandTitle|^@1@^||^@2@^|IsExpandable|^@1@^|false|^@2@^|IsExpanded|^@1@^|true|^@2@^|ExPageKey|^@1@^||^@2@^|IsPrintExpand|^@1@^|false|^@2@^|BackImageString|^@1@^||^@2@^|BackImageWidth|^@1@^|5000|^@2@^|RunPageAdd|^@1@^||^@2@^|RunPageLoad|^@1@^||^@2@^|RunPageSave|^@1@^||^@2@^|IsUserSizable|^@1@^|false|^@2@^|UserMinHeight|^@1@^|5000|^@2@^|UserMaxHeight|^@1@^|1000|^@2@^|Value|^@1@^||^@2@^|BackImageAngle|^@1@^|0";
				if (bgUrl == "") {
					var itemDatas = "ITEM_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|PanelKey|^@1@^|1|^@2@^|LayerId|^@1@^|L001|^@2@^|TypeName|^@1@^|background|^@2@^|ParentItemKey|^@1@^|-1|^@2@^|Key|^@1@^|0";
					itemDatas += "|^@2@^|Style|^@1@^|3|^@2@^|ItemType|^@1@^|square|^@2@^|ItemId|^@1@^||^@2@^|Edit|^@1@^|true|^@2@^|IsSelectable|^@1@^|false|^@2@^|IsPrintable|^@1@^|true";
					itemDatas += "|^@2@^|X|^@1@^|400|^@2@^|Y|^@1@^|300|^@2@^|Z|^@1@^|0|^@2@^|Width|^@1@^|400|^@2@^|Height|^@1@^|300|^@2@^|Angle|^@1@^|0|^@2@^|BackColor|^@1@^|16777215";
					itemDatas += "|^@2@^|BackImageString|^@1@^|none|^@2@^|BorderColor|^@1@^|16777215|^@2@^|BorderWidth|^@1@^|0|^@2@^|TextFont|^@1@^|12px 돋움체|^@2@^|TextColor|^@1@^|16777215";
					itemDatas += "|^@2@^|TextAlign|^@1@^|4|^@2@^|TextLineSpacing|^@1@^|0|^@2@^|TextBorder|^@1@^|0|^@2@^|TextMaxLine|^@1@^|0|^@2@^|IsViewOutBound|^@1@^|false|^@2@^|IsViewText|^@1@^|true";
					itemDatas += "|^@2@^|IsVisible|^@1@^|false|^@2@^|IsBorderLeft|^@1@^|false|^@2@^|IsBorderRight|^@1@^|false|^@2@^|IsBorderTop|^@1@^|false|^@2@^|IsBorderBottom|^@1@^|false|^@2@^|IsUserSizable|^@1@^|true";
					itemDatas += "|^@2@^|TextFormat|^@1@^|-1|^@2@^|EditOnly|^@1@^|false|^@2@^|IsWrap|^@1@^|false|^@2@^|Text|^@1@^||^@^||^@2@^|DimensionTop|^@1@^|N|^@2@^|DimensionLeft|^@1@^|N";
					itemDatas += "|^@2@^|DimensionRight|^@1@^|N|^@2@^|DimensionBottom|^@1@^|N|^@2@^|DimensionWidth|^@1@^|0|^@2@^|DimensionLength|^@1@^|0|^@2@^|Alpha|^@1@^|1.0|^@2@^|Points|^@1@^||^@2@^|RackCount|^@1@^||^@2@^|UnitSize|^@1@^||^@2@^|MobileFlag|^@1@^|N|^@4@^|";
				} else {
					var itemDatas = "ITEM_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|PanelKey|^@1@^|1|^@2@^|LayerId|^@1@^|L001|^@2@^|TypeName|^@1@^|background|^@2@^|ParentItemKey|^@1@^|-1";
					itemDatas += "|^@2@^|Key|^@1@^|0|^@2@^|Style|^@1@^|3|^@2@^|ItemType|^@1@^|square|^@2@^|Edit|^@1@^|true|^@2@^|IsSelectable|^@1@^|false|^@2@^|IsPrintable|^@1@^|true";
					itemDatas += "|^@2@^|X|^@1@^|"+bgX+"|^@2@^|Y|^@1@^|"+bgY+"|^@2@^|Z|^@1@^|0|^@2@^|Width|^@1@^|"+bgWidth+"|^@2@^|Height|^@1@^|"+bgHeight+"|^@2@^|Angle|^@1@^|"+bgRotation+"|^@2@^|BackColor|^@1@^|16777215";
					itemDatas += "|^@2@^|BackImageString|^@1@^|"+bgUrl+"|^@2@^|BorderColor|^@1@^|16777215|^@2@^|BorderWidth|^@1@^|0|^@2@^|TextFont|^@1@^|12px 돋움체|^@2@^|TextColor|^@1@^|16777215";
					itemDatas += "|^@2@^|TextAlign|^@1@^|4|^@2@^|TextLineSpacing|^@1@^|0|^@2@^|TextBorder|^@1@^|0|^@2@^|TextMaxLine|^@1@^|0|^@2@^|IsViewOutBound|^@1@^|false";
					itemDatas += "|^@2@^|IsViewText|^@1@^|true|^@2@^|IsVisible|^@1@^|true|^@2@^|IsBorderLeft|^@1@^|false|^@2@^|IsBorderRight|^@1@^|false|^@2@^|IsBorderTop|^@1@^|false|^@2@^|IsBorderBottom|^@1@^|false";
					itemDatas += "|^@2@^|IsUserSizable|^@1@^|true|^@2@^|TextFormat|^@1@^|-1|^@2@^|EditOnly|^@1@^|false|^@2@^|IsWrap|^@1@^|false|^@2@^|Text|^@1@^|bg|^@^||^@2@^|DimensionTop|^@1@^|N";
					itemDatas += "|^@2@^|DimensionLeft|^@1@^|N|^@2@^|DimensionRight|^@1@^|N|^@2@^|DimensionBottom|^@1@^|N|^@2@^|DimensionWidth|^@1@^|0|^@2@^|DimensionLength|^@1@^|0";
					itemDatas += "|^@2@^|Alpha|^@1@^|1.0|^@2@^|Points|^@1@^||^@2@^|RackCount|^@1@^||^@2@^|UnitSize|^@1@^||^@2@^|MobileFlag|^@1@^|N|^@4@^|";
				}
				if (response.ItemsList.length == 0) {
					newFloorFlag = true;
				}
				$.each(response.ItemsList, function(i, item){
					if (response.ItemsList[i].typeName == "background") {
						return;
					}
					var _key = i + 1;
					var _parentItemKey = response.ItemsList[i].parentId;
					if (_parentItemKey == "") _parentItemKey = -1;

					var _label = response.ItemsList[i].label;
					if (_label == "" || _label == undefined || _label == null){
						_label = "|^@^|";
					}
					_label = _label.replace(/(\n|\r\n)/g, '|^@^|');
					var _itemType = ConvertItemStyle(response.ItemsList[i].itemType);
					var _rotation = response.ItemsList[i].rotation;
					var _dimensionTop = response.ItemsList[i].dimensionTopYn;
					var _dimensionLeft = response.ItemsList[i].dimensionLeftYn;
					var _dimensionRight = response.ItemsList[i].dimensionRightYn;
					var _dimensionBottom = response.ItemsList[i].dimensionBottomYn;
					/***************************************************************
					 * 	이전 데이터 치수선을 표현하기 위함. Start
					 * *************************************************************/

					if (response.ItemsList[i].dimensionTop == "1") _dimensionTop = 'Y';
					if (response.ItemsList[i].dimensionLeft == "1") _dimensionLeft = 'Y';
					if (response.ItemsList[i].dimensionRight == "1") _dimensionRight = 'Y';
					if (response.ItemsList[i].dimensionBottom == "1") _dimensionBottom = 'Y';
					/***************************************************************
					 * 	이전 데이터 치수선을 표현하기 위함. End
					 * *************************************************************/
					var _layerId = response.ItemsList[i].layerId;
					var _alpha = "1.0";

					var _rgbFont =  GetDBToRGB(response.ItemsList[i].fontcolor);
					var _fontcolor = "rgba("+_rgbFont.red+", "+_rgbFont.green+", "+_rgbFont.blue+", 1)";

					var _rgbLinecolor =  GetDBToRGB(response.ItemsList[i].linecolor);
					var _linecolor = "rgba("+_rgbLinecolor.red+", "+_rgbLinecolor.green+", "+_rgbLinecolor.blue+", 1)";

					var _typeName = response.ItemsList[i].typeName;// + "("+response.ItemsList[i].lv1+")";
					var _systemNm = response.ItemsList[i].systemNm;
					var _mobileFlag =  response.ItemsList[i].mobileFlag;
					if (_mobileFlag == 'Y') {
						mobileMoveItemKey.push(_key);
						mobileMoveFlag = true;
					}



					//|^@4@^|
					itemDatas += 		"ITEM_NAMEVALUE|^@3@^|PageKey|^@1@^|1|^@2@^|PanelKey|^@1@^|1|^@2@^|";
					itemDatas += 		"LayerId|^@1@^|"+_layerId+"|^@2@^|";
					itemDatas += 		"TypeName|^@1@^|"+_typeName+"|^@2@^|";
					itemDatas += 		"ParentItemKey|^@1@^|-1|^@2@^|";
					itemDatas += 		"Key|^@1@^|"+_key+"|^@2@^|";
					itemDatas += 		"Style|^@1@^|"+_itemType+"|^@2@^|";		//item Type  e_ItemStyle_Square
					itemDatas += 		"ItemType|^@1@^|"+response.ItemsList[i].itemType+"|^@2@^|";
					itemDatas += 		"ItemId|^@1@^|"+response.ItemsList[i].itemId+"|^@2@^|";
					itemDatas += 		"Edit|^@1@^|true|^@2@^|";
					itemDatas += 		"IsSelectable|^@1@^|true|^@2@^|";
					itemDatas += 		"IsPrintable|^@1@^|true|^@2@^|";

					itemDatas += 		"X|^@1@^|"+response.ItemsList[i].x+"|^@2@^|";
					itemDatas += 		"Y|^@1@^|"+response.ItemsList[i].y+"|^@2@^|";
					itemDatas += 		"Z|^@1@^|"+response.ItemsList[i].height+"|^@2@^|";

					itemDatas += 		"Width|^@1@^|"+response.ItemsList[i].width+"|^@2@^|";

					//itemDatas += 		"LabelWidth|^@1@^|"+ response.ItemsList[i].width +"|^@2@^|";
					itemDatas += 		"Height|^@1@^|"+response.ItemsList[i].length+"|^@2@^|";
					//itemDatas += 		"LabelHeight|^@1@^|"+ response.ItemsList[i].length +"|^@2@^|";
					itemDatas += 		"Angle|^@1@^|"+_rotation+"|^@2@^|";

					itemDatas += 		"BackColor|^@1@^|"+response.ItemsList[i].backgroundcolor+"|^@2@^|";

//					if (response.ItemsList[i].itemType == "panel_patch") {
//						itemDatas += 		"BackImageString|^@1@^|data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAACmCAYAAAAf1fenAAAgAElEQVR4Xu2dB5hVxfnGB0QRsSBBjYgK2LAkKhpjiy3EHhXsIlIEY9TEKEZFBezGbtSYqKCIvRBjjC32FgsixhILUhTRv4ICitJk+T+/7+x7d+7sabeAy7LnefbZ3XvPmTPlnferM9Ns4cKFC13TZT1AVzRr1qxeb4SfJ93XmLqx2dIGjHBQp0yZ4pZbbjm32mqrZY7r0gAIdcJSB4xw9D/88EPXsmVLt/baa2cCY2m6odEDI00M8N24ceNc69at3VprrVU07mnssDQwR6MGhj+AUqXQIT766CM3bNgw9+qrr5oImTt3rmvevLnbdddd3RFHHOFWWmkl0zXC5+P0j8bKIo0aGOGgMdAvv/yyO/30091pp/3R7bXXXg5R0qpVKwPBY4895m677TZ37733utVWWyNRIW1ijEYyHcQWI0aMcNdcc4176qmnXJs2bQwM48ePL+gY/P/f//7XnXTSSe7+++93q6yySqyV0ki6JbUZjZoxNLP5PX/+fLfddtu5++67z3Xs2LEw4DDG8ssv7zp06GAdVVNT4y677DL77Pe//32iCdvYwdGogaGBRn9APEyaNMmdcsopRSyA8okoARgC0nfffefWWWcd995777kf/ehHBQw06RiNZDpIhPD77LPPdvvss4/bZpttrHUa5Pfff9+tsMIK9czVfffd15144omuW7duBhjAtTRdjZoxPvnkE8cP1+OPP+623HJL165du6Lx/eKLL0xsrLzyygVLhBv+9a9/mQnLM4AIQDUxRiOZGhIN6A3nnHOO++Uvf+l+8YtfFDHABx98UPBj+CYt9w4YMMAddthhqe7yRtJV9ZrRqBlDrWXAL7roIjd79mwDiC8WfB2D+7l35syZbo011nDPPvus+/nPf15giqXBTG30LnFYAuqXo2rixIkmDu6++2632267xVolPANojj32WDd58mQTJ6H4WFrA0WgZ4//+7//M2sAXIRFxwAEHmA+Dn5/97Gc2OeTHQJ8ABFdeeaUbOHCge/vtt93GG29cpKg2VrER165cwEhzDavTIxpe4JDZXbp0cQsXRuHr5DD2QjdnzhyLbDZv3sJonoGs1hX6JygXFth9993d559/7k499RR39NFHuxkzZpjySb3vuusuN2zYTW7w4DPdueeeX68qX331lZs162sDWuvWKxVMWbWxFDbxfSzNmtXPfCju16gvF6dllAsYkr1xHYDj6LPPPjPHEBYdtn8005pbzCHOe0ij582b43r06OGOO+4416pVazd06FD3/PPPVwsXxgSAzo+aytG17bbbmoeTOiNePv30U7NelllmGXf88ccba2gQJF549ic/+Ylr1aqlAeLDDye4t956qwDm4oEuzumIm1i0/+mnn3ZTp04tMFpBvtfGaXiua9eubpNNNlusoLAJnScfgwo+99xz1smdO3cuGrw77rjD9ezZ0z5jxu+xxx7uH//4h/2/yy67WOPjrgcffMDdcMMwAxJh7xVXXNGcUNUKfysG4kdNNUDoGKoXg40CCnsBfADKj3/x3JtvvmnOMQEOVuzXr5/D35E0k9MYBHDyHEpuvB6z0FgXkXjaaae5/ffff7GKtVRgiM6mTJns1l57XeuI4cOHF3UaHXbGGWe4119/3e23337uxz/+sXvllVess3Ep/+53v4tt+KmnnuoefPBBh4OJa7PNNnNnnXWWO/TQQ6vCGj4wwhkLeNdff3339ddfu9GjR7tvvvnG7b333vZ7k002qQcMKnTttde6v/zlLwZkro022sj9+te/dpdeemlqfePYYtasWW6bbbY2nwqJQj4w6u5vbuJ1q622sjpynwBYisgqtzNzMcbkyR+5ddbpaDKZcHV4MfvOPfdc9+STT1ojEC833XST/cRd0PPOO+/s/v3vfxtwoHCAcuSRR7oXX3yxKrQJMBUD8UUg9QEEjzzyiFE4Mx93+BNPPGFheD7HS6pLkwNH10MPPeT+8Ic/GKth9hKdhUl9xkgaNF/UILaYNDCryvd9KHo3/QrwVNfFAYiCOMsSJVSGhhA7gA3oSJNBnhzE7pc5yEwktA0FbrjhhoXZwP0yIXn+jTfecFtssYXD84gowfNIJ+OAqoaS1alTJ8fMnDZtWq3+07wwCLDcT3/6U/sfRZR7Nt10U2OM6dOnu3XXXdfqrfry+4UXXnA77bSTKbDoTkRn1QZ/wARCv63qL31G/kfbtm3cww8/4nbeeacCCJdddlmbLNHV3Pwo+F9IB/CV0XJZoJTnMkUJDf3444+tsxAlMEaSazgN0XHf+bNInVdK5dPujXNchck3PC/lMq2sSmdqnue5x9d9qM8zzzzjLr74Yvfoo48WTapq9VFaOZmiRIwBMPr06ZMoHvI0norkva/SxseZq0nvT7MokuoRtqOSdulZlHXAoMsHhi9yFkfMJhMYVBL6RJTEKZ+VDuCiet5P8q1k0BZV/eLKJbXQt+LigLG46tNogYEoIZweZ64urs4t9T1NwCi1x8q4X65uZWaVUcRifyQOGH/6059MIV2wYEG9BOVFWcFGyxhJOsai7MxKy44DxiWXXFIwVystv5TnGy0wQquklE75oe4NgYG+ATCwShqUuaoOWlKVTxxcipqqLQ1ZEfWBQT3xY8hcbQJGFadrkknZUMEBMEgJ0AUw0DFwcOFv4YrzxVSxywpFNVpRksQQDRUU1EuMId/RSy+9ZOtg/vOf/1iGO95Wgo3V8AxngakIGOq0uXNnG1LbtVvdXMW4jcl97Nevj+UrhA4WP1uKF5bqAU2rZOh88ik1zQNLngUxGC03zOqIcpxcYVuzvLtZs12MAVPgBQ3FBzmo119//WJJSi4AQ5Ug7vHuu+9YpHTZZVtawAlgkOZ20EE93BVXXGV5DoSLuUhe+fbbb60RyHQihnQAMQfWZ/hXGMzyZzWzgDL4IYeD2AkXuRKYalx8zkATayCPQdQaDjpl8ByxB9am+gACxGuuuaZ9R6hdsRTdC5iImRB5zQKs6qx6UE/6YPXVV7dHiYiqX6m32sTnuvyYE5FlUg+p19ixY60NpCLAGDi78D4rjpMF9Eq/L2IMOo1g2NixYyxhpUOHdSzUTEj9hBNOcHvs8Ss3dOg5FvQi2siFv4BAGJ1E55JYQmdMmDChkITid2DYIX4DeI5727dvX8jLoIMAAheBMTqdQSP8naaQAdgWLVoUBsOfzZtvvrnljgBehf2pOyF3BpagoT94SZ2s+grQDDJJPAQSueg3Is1cDCiA5CIC7fslBCySluhvymHyMUkBBJFc3b843OFWH0VX/WDSxx9PMiojBwOTicpBc4iS4cNvLvST39lpVJwkWuKep/CksvLqBwImAE5zcOUtr9LZF4I/aXAlSvQ9/S5ghNHaatYpriwDhl5Kgg3XpEkTjDE6duxcYAzyB/r0Ocp0jEV1VcuKEMhD3Sdt5i+umegDX/VRuxVE0//oGtddd5275557fjg/hmiZDpow4UNjiM6d1y8wBgwCMG66aURJEdJyFNFKZ7KoPczbTAO03pknDJ9nYmS1Ie57+phkJ4H0B3dwhZT+yScfGzAkSqgglQ6tklIan8QGcTMo7HgftHkHBR0HUYK+Epp3SSIsT9lZYqFU1vPvb/AucVL5oDXS+Xwd4+ij+6aKkiydIc+MrfQePR/GSsphrlKBUsr9cfWJ0zHIWP/nP/9pyufi8F+oDbEOLlzgpPCF5maofJbSEXH3VmvmxpXtAyONrbLakMWKWQySxohh2XGM8YMqn2Hn4JcgOXfkyJGWvU1qHzZ1tYBBh5x88smWM8mFaaa8xviM6WRLJVTgNBAAg3wMREnWgiBfVKWBFf0D/w79w0XO6hVXXFHkpvYtKu4J350GUp8xuA/ls0EBgwZBXSTMkrn1zjvvWBZXNYGBznLssccYK11zzV/cmDFjrLPzWAd5ZnElYfc4cAg8O+ywQ2FJBFnwADp+XUjpG8nGRVcJoilWkqdvshgw7/dFns/wxTAFDiy8g4ccckhVU/vohPXW62TZ1+3bdygEj6qlC8RlcFVDf8ETzHoPPJk4r0jtr9YVAkNBND8ZOM+kqEZ9mtXU1CzMQuKiCLvTCeuv39mUWzysUGZco31qzhIzfofkZYxSOpp7AQYua+309/DDD+eOeGa9KysfI6kvqgGEsIwcywcW1i4f6GQLjm688cZcdJ81OxElnTqta2tJsH58+z1U6CRikuR3qGdwn78SLQv4aQpi2A4WGQEMXOdcAkZWGXkU4CxgLAoAJJWZI+xeU5sl3tEdddRR7pZbbqm4fnQSwECUwBT4S8hDYLV8ZJLV3+8qTSmM63RiKdC9koGTwJE3MiwdQ8BAsZ03b55t4ZQGvLyWl/pEWeL8z6RpkAuOolmwwAJKDB6dzCLgPDMwDj1+J+F+Z+U4gawVV1y5dq8r7f4fASNkCBTUX/3qV7Y1Ep1GtLVt27ZFq8bELijNWA/oRyHjEMTaeuut7XNiKegMX375pQWtiNoSBEuKBFOH77//3gJ01I/V8gKXX1/+fu2118yqg10oT2XyLoJ8CrYpwop19sADDxS6zvd8/iCxkiwKIKi27rqRKIlbu5r1fBJI+vbtbYwxYcIkY4o4Gep/hny/4YYb3OzZ37r773/ABgX6jWOMOFGiWU85iAAuPzcUsKLosdo9ztJQO1hGScIMimfcJNF79thzNzds2HC3dodOtY+yy88y1mYUy8GDBxctVA4BHK4rydJRssR3KRM6hyhhwVHdomYGploeODypdNC4ceNjfQ0+KNBt2NgEUUYYftSoUbbrDb4WdajfMVpw5EdX6RhmHqvUWWnP//4+Gj4w4spUfQAjLBBnkQgUPL/nXt1MJ1tn7c6WU7H99tva1gYChhZP65lw4CpdcJRHrwmZWXXIBQznamxrg7XWWjs1jF0Kc1DpAQOOtk5iE5Kki/tYV8HeFCyqZttnfB9///vfLamFHAaYLOzU8LgJLCucdJTHivWrrrrKXkmmF0AniQZ/Del0/fv3t+8QAzBDeAEMrBJYJ0mH4HOAccP1w1ybNm2N6b77bpbpT4gsLrZWwE9BfeJmcx5RkkeHSWMagdK/x8RentXukoFxs6gUMIT3ijEARlLl+ZytnpmdnAxAB8MYbP1MshB7aqAzhM/75qo8lmxjEF6UjZ6jfS/87xm0P/7xj/XYLAJGS/fww4/a7Ul1332P3dwpA091d999rwEQBRtP7LvvvmvPoB+deeaZ7qCDDrLEpNAcR48ixdJfPhD3riTGyRoblXXwwQdbTimpg8ccc0zEwFnAyCq83O+pVI8eB9hONQBD4AtnDoPKnpt0Krv03nzzzQVgsNXirbfeap3LTj/+xiICBgoznw8aNMi2Z+C9ZFaRacbnDAgMhELI4JGNtsEGG1izyElh0MLBABg4t7Q1VKio6v6tt+7qdtjhF9bpZIjhwQQY6DW8n+w02A7Acyllka2rKJ99wUirhDEJanKReoiSCntSFv/TDqwkstsEMN1H1hj38n5/gmuSU1d0Lnbt0ckMZQGjEgXIB5G2VujcuaMbP35iqijBEgJA6AbMYGifWA6Jsb/97W8tLxILRRd1RLEjL5XBDUEn5ZP7GCTEBR3ob5wifcS3JsQOmNqIQKwOWMvP+2CG08Hkjb7xxutuxowod7R79/3do4/+282ZM88sPV3hYOlzBhI9Bhc8jNG9e3cDKO/SvmfsQYJFxQ/gTipLZfIsIpB+6dCBdIQWZl3BYBzHgboAQDKB4St/pWi0eVgEYHTsuK7r3LlTpo7BJm78AJCLLrrAGrfeehvYtkzsTfW///0vaox30J2vB4T18a0SXxcJlU9fTPgTgtmL0gwAYC3/Pry5zPJzzjmvNv+VA3EWuB/9aFU3c+Y3juUh7NLnK6mqe2iSEmQEFDANjMnAahM87YqYp699ENZlt31vubNMnNmzI9HMxGDC5dIx/BdXiy0oU252nFxZyie747FnFemFiBMqPm3aV27IkCHu6quvtg3hQnOXWZ2kIGqrJeqRZK6m6TxiDB8YETgWmG+CVLyTThpoW0f16tXbLb98S8KSZqqWcimyyu9i0LD4qPRN7/02PfLIQ+6CCy6w/dOuvvpaO9ynIlES17A49IfasmhQz3/00UTLKUUBA6VcXbtu4bp1270w+/0ycAiRI4LJh4wdM2as0R7KUvguCmDwoOLQZc13nEKgXX8xV7WUMc6PobZhIUjJxQQlQwwLRowh0bPhhuvb7MaCYyNZto0cOXKEWXN5gYHSyR5l4XXccceaJZO3nLhJTXs43YnJePnll9vZLfQHIhrGyCVKVHAaU4SDEmrWkntQ1p133lmQxwsWzDdqFY2qHHQFzX5++2nzmHmk/gMm/AKUTfpeeFEWNMn3cQuOKIdVXcxClECUTpZNILtxc+NZ9S/uo7xwmSC6DkqeQIGi+tRTT5j+ATD4HH8JsxKwoBxmsS7fI6bwcQBGxAkiFCBefPFFtmsiYiRJtIfl++oAbWIZCG1BaZdYwc0vxigCBg/TWX/7299Me+VhdXhWQ7KoUTMOmc9M0P9ZipKvMIaNC7/zZajKZ0toBhxR4V9xpnca44X1DZ/3n0X3IMOegSUwqAvrA98IiqlEYVq/SYT4u+ugk51zztDaPdCKRVKSLujXDeZih0SUWPwmvpMSYACIesonyKExeBGJiwwffqOFwktROOOYg7gDgTcQqvNAhFI+w2wEgGyGmucKzcI0cLECjSgo1kEco9QpcnVxmaT7aJvfPigX0bbnnnsWHpGoxEJo3bqVu+22O4yVuPgOkGKaYlZiTYmV4iaeDwz6CdZjEZSAkcYYYRvo79tvv932Tvvzn/9s7KO66t3oXIjzWKuEyoBQNntFqQPxaWIiFDNxqMWSIO4A/cd1OtsjYnJhr4ciJQkoWQwW1iOJWvOW7zOGBhm/CiYfojGuPjjS0PLxuYTfs5Mysh1LQ4fqhPf4wECPwQnHkaDnnXdObawqWfEM2RUxxmo7vMRIg7gLgMvPU0+UyH9PXISBWmmlOr8AqEOWauZotvESrAvfgSJ5C9KZFWmpbzS2f/9+7vHHn7T6Yk/jU5BTKgRf1mD6nYKziLqgqKYxXxz4w4FCQYX9YDa+Q7ElHJ7EdNyz4447WnZaqHPx3XnnnWcMjWhB5IUzmLFAx+A3lgLvgTGGDh1cuzNzukXCeMFovXv3trFBYfU38A/bB2MkKp9aDgcwqBRh9rgLbZ6Ygi6UNv9UQr2UQUe+I1P9y6f/GTO+sgQdGv/551Mt4IQ3j6grzhddeUSaDwrC7VAn1gZeRQAaOrniGCy8hzJVFsBA90KBBBiscw3d2KonA4NYZo91HEg+wPmbvmFzWiieGBAzFh1Mz/uMIWAwAc8+e0gsMMKBxnrCvf3Xv/7V2Ma/4hguVD7tHrnEqQzKIWZkGjBoALMBOlSKG5o8OQogj6AWclSiIWkA6ATE1oUXXmg77rL0EVaiU9u1a+sGDvyj5ZnGLRgKy5TeguuZrYmgcWQ6g4JV07dvX6NKcjSS6hUOHoyHj4T9KVDM0YVgIZRIXOEcdsMWEXq3RE4cyzF76S8sKcDKM/QZFhhWEXoQW1ZLD/MZg3fzOcBAlDB5khKZ0G8AA3Glu+++07VtG+08kMW8ABOrBN1JsaEiYEBvMAZ6gRjDRxgeve23396oj0Hg4m/omktHUEBdmG46h0PKUt2sXmDUjDL28suvFiKcdJbMP2Q4YMOpxaCmsQYdDbUTMSXmQX0wPWVeYt5SLqBFM1dyTx3Aot1qqB9AGjLkbFsWANMwqGISRCjltGmzstt5511t9qIY1gdbVB4ThyjwiSeeZCISppCoBSB8D9XTr6yGJ0mHzPwkq4T92pUPE+o+tBdHH2PAO/OwrNqfaJVwg69jhMAASXQ8s4iBYsawQgqk4YiBbgmHg1gUWP5mdqA/YJW0aLFcwUxFf7nuumstgERZ06fPtNnHATO77rqziRC0dgaYSCr2O7EQzCw2oKUj1SkormjaBJnY2IVtEnr16mWiDZaAMbDXibOwoTsRVPwKxB84OpP4iMr6/PPPzGNJzABX+7777meJQOg7lAXIcE9D7Vht1BMg7r57N3fYYUeYaBHwOeyGAeTdAAgPKArrqquuai5oAAFDUBbKIfXmEGBMUkQQgAQE9KUYI7JKpHxGQyqdD0uSdjPREF+AYpECgxl8+OGHm9kF1SgVTQoig4zWjHKEIwZFis7liCmCOgCAo7CPOeZY2276wAMPtBkHEHbbbRebnXvssZcdhPPOO2/ZADKbP/vscxNXnAVCQg4dCTjQ8ikHsOFziVzPJ1lwjU7ic0CMwssMYlZSdza7R9dhoLgPcLAPBQuGCK3DcNSTTkUnWX755UxkjBgx0gDcsuWyFprfeONNDXQMMAopnf+Pf/zdBhPahuaZFNQNGQ+gYBnYB20f64AoMIDAbCTOQ+qhFl5RdwYf0QKoAUaxVXJeUQYdbaFPeB/vVtplKaAAYCUzBlo19Ibc5kLpZBDpCGYbOgXJL/wNiFCmEDWc5YHsXHnlFW2wAcQaa6xpeZYwDRV/663/2gw+9dTTjf6uuuoKo1T0E4I6zAA6EZlJg3ViMuADmHQe0U0uQuWUhXII8CRSMM+geoDI3wAAhXG99daz59ARMBkpi1xOOhoAvPnmGxa1ff/9cQYyGABwsv4F8NEHsBRZ7ugtDP7hh/e0esCmiEn0AhgNS4uy6QeAwjv4nD6j/ijogBHWQJxw0a8A+je/GWDgJkhIriugkY4BkwA+3o97gXb6aQelgKNkYMhSCU/8kWuXyCQDAuUys1EWyZpGa49M2u/NzGIm0nEMPGVFLu8F5tpl1uDoevvtNw1kdOjrr79h0VQ6TKl7koeIL94DW0DtvpXDYDLzYRc6HoWRmQdjUBYzy9/SCXqH5lWWvwUCpuEFF1xkZ5SQGoBoW3PNtQxMAJaBjq5In4DGDzigh7VHuo3MUN6LfkPfoLy/8spL5kDkbyYFAPFNVtgKRXeXXXYqhNmZVEwSJhaMStt5DsagTVlWV50+Vf+vkoGhtZMMJo1Fl8CdCv2xAptOgiFAL2YsgSJ0DmQ4MwvlE20a0cKs79RpPQMGZfEMGjB/Q78EnwDUvHnfmzOGmUzHIbsRFzABFzOHmYXyi5y2oampMZ8AgwcrwCjoJCihOJRQYmEgmAxWUYY3wIA9MLn9ZQCUxR4hDz30iA3QIYccZKLpiSeestmOf4CBZMCleKJPwXYst5TeIrFFripeRd4DQCgTywGmYgLAZgx6pBsstLzWSZM+NubA9ES3oz9gM8QvovCyyy4xk5fz0irdFrtkYCDjFNChkfzNYP3mN7+x35y+g3yExogTAADokgYyGAJGxBiHu6lTv7QEGr7X9k0MErNy0KDTrKzll1/BOoTFw4CLztYiYgYBzRvGgBWU8iZlC6UN5sLEhOopm4xuKFgxCoJZzD6eoQ3UDfOWsgQyWIt3IhrR8BkIBgTQk0q4zz57mbiD6fDqMmNJU0TX6d79wKJcC95Bv3FyE4oyfcrEIsEHkKDsaqsJzHYYCMb47rs5piAzsRDh6DUomdSNvoTF0H8Qjbj/ZcLG+SnS2KIsHUOMgQzTYEYbqPSrlXXOGq0QsYAjjZlGIkqY5Xje9t+/uzEGlcdnonS1iHplMkYatbY0RBxg7egCNJTBYGsJgGiYd2jrBjoToCCDKU+xCQZBoXIGDXagPAGD90R6zmxTEhGT/kVZ5HuSiSXFOxIlfU28vPba60WMASvxTkxVHQRI23faaUcbTOV2cE/UHzUm2tA9sIhoD8nEiGEi0oCQzwEIDEKb0UPog91261b4u6o6BrPY93zKhJWOoVmunXWgQiwHZvuee+5dyyi/tMaJTimPWYlJx0wBZFwqSyCiLOQ0lgIWEJ2nLCx/n444YIjOfWDAashvKc5yuj399JNum222LTAGwMCh5y8FCIGBSYnoYnYzMIBMwBHIECUMGOe1+qJEwGBtDr4hRBsKJCzJgPK94lQAg2fJnkekojMxsdAjMOfRwRhwvJn77bevGz16jDkAESWaHFnsEPd9LlFCA+T5TAMGu/f5QKn7vxgYlIf2PGjQmXa/1lKEwGDG0El0FkDQ9/5g06i8wIhmdh2D8DefkS/x859vVxIwAAJWiRjEBw7AYFAABkAmY8v3gioNUMDQ8VZiiPB/nh0x4ibTMRCDTBBOUkS0ARKAAKOQ2U2bAIl/JksWMOJEzSIDhrZgigbzl6ZbSDOHMRA9Z5452BglZB8xBt/RiRrMagGDDgUQYgyAse2221v/SZSkMQYDT51QGBEdiJYkxkBH6N07Mkl1RTrGM+6jjyLGEFAEDOkg6D5iDPpz7tz5JgYRQbwTPQdFHD0FkBJjQscjwqvNYcJBT9I3ws8zgVGKKIEhNJghMCRKqADxEIBxxhlnpQIjBEKlwIDyxT7SGyIF+mkTJaUAQwwhnQKgiEF8UYKuddRRfYryMxl42kIMilQG/Q8Q+BswwAoMtJZbIkpgB8xlrCHc8nhFqQfWlS4sQxR0rDMp1HFg8D8rizFKBYboH53jxhuH1yqM3cxHoeRVX5TQAaGOodhBtYERipJKdAyJEuV4hqJEyieDDDDidAyYU74LX6cQUPgMxqHeTDTMf37mz19g4gI9B6sH94Au3kPIAH0KJyI6iQY+6bcY2ldOMxkDBqhEx4i2fSTMHimf/LA1JOYXOoYvSsQ2i1qUoK9Qjzqr5EnTMfIwBr4HPK0AwWeIUDmlk9Ex8M5ecsllhbbLJPYZIxQl0jHEINSLslAoAUYUaGtvPg/6DCstdGYxCXG542Mh5qK9zDX4WSZs1YGh/T+TRAmNBGhYG2edNcQoVTqG2EYAUlnQPxp/paJEjCEdA/pHvEj5zAMMiQ4BAaAg78P/NZg4ou69d1Q9HYO2SPkMRYnPGDL7AQb+INghemdkRWkSxbY/RMgAABpzSURBVC0qBxz4cAh2YmnhIpC15jNMnBmbCYxSRAn5E/JFpAEDCo1jjNAqWRSiRM4xMQa/n3nmqZIZI1Q240QJg8nAonxK8Rb44nQMX/n0RYvEEnoZHuTIEqoDhgbZH2CfEUj6JcZy6aWXm1WT58oERpiPkWSuHt2/txt244jCrA7/F7LFGDJX06ySOGBobUjox0BPISwtB5dmhm+epukYoSiRg0sdHA580v++gwuFkVyPzTffMmCMnd0zzzxXjzHSgMFEAhgwBgG0jTfeuN7sDwfcBwdJSr169TQxSC6IEoCSQCJgxC44Egj8RJ1qAIPyECVYJTBM6BIXiLIYQw0v14/hK58+MKBecjBxOElpzGIIX5TQ+VIYARgbzBSbq+UDA6XT1yeydIXQ+iBrDDOXOAymbihSdD/AIEucuIwWf6VmcCUCo3braA1mGmOgfAKMLAdXGjCkJ9AwVk0BLrnERanyVSiukocxlNSb5hLHHI1jDJRCkpGUEIw4rSYw0DEQJXH6QSn+CnJAiK2QE4Koi9NPqscYJQAjNFcJQlG5vDqGlFF1EGF3xAhOqWqJEj/uwnvyihIpo9ILqJOWXai+ZKWVK0rEGD44fIUyzYGl+7iHuBE5KQQfyZoLL39dSb1FzemiZLAFfAoMUQIwfFEiHSNyNEWR2iRRIivFVyBhAYDBQIaDGTJEHsYIg2il6hj+omaUTxijWsAIGSOPEpnm3MJiwpRFOSXNQYuh1KeYu2WIkvKAkebHyMMYUH2e6GqlyqdAVikwUIpZqF1slVSPMfKAw78n1Dn4jglHkJJAHonHAkbsgiMeWFSMIT9GVqwkSccI8zGgPQaAwfQjouUwBsBjKwCUT18s5REloY4BY1AvlE9/y4JyRYkYI40FslzdYuPQtIUZYF4SjcjmR29DhGi1u5XrrytJNlfLYwwqJj8GaXGkxCWF3bOsEs0EIrCYrwweMQJf+SzVXMULSXCM5/yDcPMAAyecr2MADHQnQgPVskp893epbBF3v18v8lYRHwTgAAT6EaKx3jYIJZmrJekYkx1Wy/x5Cy1glBRdzQsMNGgl6lTCGHSSrJLQJ5IXGNIxKGvAMX3d+A8/KuyJXqd8RkE0gmAk6sjTmeTHoKwohB/loy7qi2x5xAgBucRFzbkdXCUAgw7pP6CP+36+M3PJzwZLUz7pzCQHl5/BJTotR5TkDbunObgwZ82P0b+3mzD+44qBIQsHkSSfT5b/ohzwqEzEHslWqWtXqw0MXk6eYr+jjypijDxWSVasJMyh8IFB+dqITF7TOAcXDEaGF0Dzd97BwcVzYoQsBrHBrDIwsG787PxFAQ5/45TY/TGylc+hBspyzFUxxry5NcYA5eoYoeczDRhxVkqS55OAU7l+DN8lDitWQ5SIMQCG2NVXIqsFEL8ceT5jt1pa1DpGqaJEYXkGlDR5KZlo04DCt0pChsjLGIgSXOKU52ech4k4SYxRpHwuAmCIMaQ0xkVGyxEj4TM/iOeT9HdodsXWbSzVvlTl0zdX6SCsElzReAWxJCqxSgAGsx7t3z8vJUt0hBldEiUzps+y5QbFVklpyidloXySBugzRpzpWQ1QUFdtAKvtHI1x85mrpYuSugyuSPk8Y9CQslL75BL3RUnox4hjiLyeTxgj9InkBYaSgy1RZ0AfN2TwubYYqlrA8Bkjb9JNOWBJ3FFnUeoY5C6ifJYLjLxZ4mGOZ15gxC0fyCNKcHD52znCimcPPd8SeKsNjHIGO+8z1DV1O8dKdAwGfviwW+oFxuTgUti91HyMStaVlAKMcpXPfLGSckRJf/N5hGuG8w52qfdVL1En8GM0ASPSC+KDaEsGMGL3+axUlDQBY8kDhnQ2X/msPIOriTFilyguyYyhIFpVM7iaGGPJYwzpIT5jsLUV1iRR16qYq03AWDKBIXEic5UQAYnD5Io2AaMCl3hjsEp8xsAKZLdEVr01AWMpBwYiReYqwGB3H3Y0MmCw2wzxCG7AhT1kyFmWu5g3S3xxihLqqFjJD50MvKQzhu9NJuxOTih9Sq5Is2+//XYhW/UQZqbDiYayNTG++iZgREdbZbnIFd9Ykq0S/BhsscB+qBaDqqmpWUjCLXtm0TBS8XT6QBMwlh5gkI/B1p1su0D8yICh/TDZkS/Pavfitaq7WixkcbnEm0RJqQ7v7PulYxRFVxcsWLCQ7Q9ZaofywcqxJsao25ytMYuS0FytlwzMukb26GbjjjybszUxRjFwlkQdw8/g0nkl9RYcET5mhRJbBiJKpEQ16RiNW8cQOGIPy0PHUBCN1ehNymf+tatLsrnqM4bOKylh+cBztplZmI4XipKsjVOa8jHyryvxU/uW+HyMJmBUO1YS5Xw2AcO2QGKP0F2rvs9n2roSLThqeBlcTcAwIxt51wQM7SVelyXexBhNwLD4hDbd1/KBJmA0AaMJGKUuOMq7fKCSRc1NOkbC2e6VJgM3WSVNVolZDuwd7h9LkbbJvO3a15+VaEMrWommUFC1g2hxK9HyLDhi45RwUbNWohXvqLNkLB+oymr3vMDQgqP+A/q6o3od7ThcL68o0eZsoSjh6CuO2CJvgBMOdZUrSjj3g3CzysJCKmWfT52AxBLFww490rZqbgJGre8hay/xAcf0c3Pn1Bjb5AWGb776+3zS8Zx9yolDnHtW7qJmLZDmsDzOBAEYKisrMSd2y+gBfdyH4ybZJrdxW0bn3VEn8nwuoSvR8jJGtHHKZNfv6N7u+/nNLHqbdMJRlh9Dvn3WWZIW4O+PUcmiZn/tqt6RFxg6nUA76kycMNmsi8rXrjZyYEiUAIz586IThcphDHkvtQB3UW61VIooKQqiVXF/jEbNGJKztmvfgL5u3tzSN2eL2+czVD41yytZ7Y65yl7iti9E7TFZ/mF4ebaMruaOOo0aGAwYP7JKYAw8e6VszgbDhBunIEpgjIa21VI19+Bq9MBgBpL4A2MIGJWIEsrjmEl202FXHU5XrtQqQe/B7ESR1ZXXXI3baomtHpZa5VOnDRQfljfMNlNnlkPH/imK5GP06HFQ4Wx3BiA84SjvzsACRjiYec1V3iMTk7oCDIEsTfn0N0pJOsiGhJeDDz60JOVTh+XpFMUGb5VwsBsD758xUjjqqvYgGw1u37693bBhw9yzzz5ftHG8rJK0YykEIh8YLH7i3ey3lXcv8VDH4H//We3axwDoKIm4fT5D5dM/TlM76MQdr4nJjnhjL3GO+9ZVd+5q8QawtBdQ6qRm/tfRV/QXO/M06CAaFfZNTBoSAaHu6CtO4xk+fHiuHXXC48Cli+Q5r0TrLPOuRAMMHDIHSPgbELIJm4DBoGk7x7iTmkMghGek+VaJgKG9xJVOUHdS88d2AF54ZHd4IG+DZwytRIs7EpNOYM9sjpSmc9ly+dBDDy0cu03j6h+vOcgYxdcx6BQB48svv7SyfvazrQxkYp/wvJI8JxxR5sEHH+jatm3r/va3Gwpnu/M5TMRSCS7ef/HFF1udfGBoA1h0CM4z3W+//dz48ePd66+/bolESSccxZ1XIsbAiQYL8L5bb73VxBfLNqgDdSo+RXEJ8GPEMYbOWWXwaSSzgtkQnkEi5ZPBZFHTAQf0KADDP16Tcvi55567rPPYXvG5514oOrlZ1JwGDO0Jyr2PPvqwW3XVVQsH44kxfFHCoDFQfnTVFyViDLyiU6d+7nr27FUwZ9mcPjzhiPPLXn751UQdgz6aOnWqHZvJQbotWrQwYCCSi/MxlgBgxB0+A2Nst90O7pRTTnEczAZVb7jhhrZZee/evW0MfT8GJ+scccQR7quvZhgwlLFFp0DvbHDO8Uy4vimrS5cuthS/Z8+eNkPROXRkE8rnQQf1cPfd9/eCJeF7Pu+66y53/PHHG5tR9iqrrGLngrFwW0ovegPfoWMcdthhtjcngx8qn5RFfceNG2ft4VzVO+64w2I1+DlGj37Fde26tZXFYXnU7dBDDy86kFeiAxBhhgIe2sI+FLSRRcRMPn449ZDvGrS5ivKJGKHCrH5v1mwZ98UXX9hh8507d3QjRoy0juJA+pkzZ7rXXnvNbbbZZnYA/Y477miHpdBhOLjwPbALHcdEChgci8Du+nQQ71lmmWVc165dbQ0ts4dFUBtttJExCOd5URYDR6ykVauWbvbsuXYshdzPxx13nB0xwSADJAaETsakbdu2jQ1a+/YdjB0AGxdMB53jWaUs6QWchsg2lIgPBlKgoo2cQs2pyFOmfOYeeOB+t+yyLe05sq7oBwCrOvGb04TYVmDatGkmijC1YS/+ZlLBHPQF9+i0wyVC+YQxAAZHX+laa6017VB6ztoimMUyPqwSjpL2zyhnMO0gm/593RmDONs90jE0yJQH0ADGm2++aTTLkUz8D/PQaegbGjAGeu+996w9yKb48Bnu4byv22+/3U7vYRdirBIGZPvtt7UD+6655ppCO8QYCrtrk3kNKmBkawDKA/zTp093K620ktt885/Y///5z8uueXOY0RkApXyyfYTvx6BeN910k+OIUQYfULFGFEAiFtkwlvb6F4zRoK0SZOy9995rW+/QYaxWYxYBFtBNB4F6/ubi8/XXX98BHM7bYKaiuSMmkK+bbfZTO+qRssaMGe3GjBnrLrzwQnsexW3WrK9tBjLjGWQOWbn00kuNgdjpBTMQxRHwIHZQDrk4uvrFF180al5uueWsrNmzvzUAtmrV2nFAH0zEuxBTMBvHjG+yyWaOLSAQCwwWF6vxXnjhBTvxB9AzmHPnznbz5s1zK6/cxsQnbHL33Xcaq3Xpsom1B+UbEFIn9hih7ZMnT7FyKYcf5XR+/XXUZ5MmfWz3YrZuuummxpDUmTPcUXobrLlKZ3JuFpTPQOl8dGYiAHj77bftgDUYY+LEiXaC0W233eaOOOIwm5lo+ieffLLr3r27DcoWW2zhyKegLMCzcGEz+/+rr76yDvzf/962QZ816zsDHR2pGMYbb7xhTMHhtCiMDNAHH3zgrrrqKkfonMHZf//9bQAQRV9+OdUoe6211jZQIqbI4WB2U9cTTzzRAIGoOemkk9yECRPsdB8UX8riSCh0H94BILGaqD9gpf2ffvqJAWnixI9sMzPeSRtgILEWYoOLtjPI1I26aKtp3jF27Fh7N++kH7gXZgPMDRYYNIpOGTlypNHzBhtsYAPNOWIwCX+DcsxCOoREHBqNXgJA8BfQ6XQmMwGgkRQDtbZr19b94Q8nm+hhQJihm2zSxeT/lVf+2UTL9ddfb8/R8egoJ5xwgsloXTAaIGGAERXM6l69etl7AR8DiCjiZAFmPhf1xovJO/3jK59//nmrM+eUomPABoAJMAAiWIyBv/nmm935559vzih2oEFswBYo2FzUl4GmXvQHgw/LcYYq5cFqMBz9RD+gGx1yyEHuuuuuM7Y6/vjfmYimnAYJDJRPXxeg0YgSZv+aa65pDeN7TC4URxS/1Vdf3WYv1gQ/yGRd8nAyY5kd77zzlimCdMKHHzJjFlg5MA0AAkyIDzoW+QyTUIaSaWT18D8UTscCABgMMAMwNgGhLJ7t0mVDt/vue5pYw4LSIBYJ91qxhLgDwCiF6D2Y2tSZsqhjJEK62ASBObl0KIyfvQUAKOeWW24xMMAYiDr1K0BmYn3wwftWRufOnaz96DMAu0ECAwcXl0w4dSAmXqdOnWx20fH+hUghXuADSgMZDgBA4CxQrIFjjjnGXX75ldZxXIgXNnFBlODg8q+wPvqOz9E7mNGYmZiHXOgTAAvvLAqff7/qGVdHyrvvvvuMFaR/0G5EGCzE7McC858VOKTACnz8D2O99957BUDKX4L4mz79S1N0mTQoszA0WWoNGhghOLDjkbvqVBQx5KbfCfqO2Ya236dPnxAX9v/MmdNNI2eWT5gwyfQHfARQLPqM/BP1QbUwdUCQ1eRtoPFzGBwKZhxDJIFMDMD3KNcAF32KtgAOzFyYQu0OgXvbbSPdkUceVdQn/j30GaJRAEKkMRnU1zBpgxUlMEbYcXEdqXhBOPu4Fw0dp5cOnAmft5B8//61jqoonoHsj5spaYMYx2yYgjBY1qzT4CQxG2UzUCiX6E7cr9MXFXOpY6EF9j2gfOyxxwv9p7rrXfSLDtmLmzG8jyur7rGzrYwPSz59IIvCfcqMm5GAhk5s3/7HAYWjSzg3Z853xgxQLA60NGBktTcETl5gZJUrYAAKwMGFOB037v1EMQfIxo0bX2AAf9LkBWKDAQaNDjdOKWWW+vcSwBo79r8W2cRbyoVdjwnqmtVEYqimmWn6X02f5t5790O7B5/D6aef4oYOjWZMJdeiBsbsOd8U/DeaFBr0jTbc2F199bVF4i6rLX7/iTEUic4ah6yys77PxRj+rn0UGFeptIqif+Cd/OSTT81SAQRo4ltuuaV76aUXi2YRzp3+A/q5Rx+JTlxeYYUV3WmnDVwigPGnP11o4qD+FVldcQwa3pvUj74o8cWQxF34WTnA8Z/RKYpFe3Cx1RIv9E840q59akhc5dJQyP0AhGAVHj0sGJxfxQ2oMa8fwHjs0SftO8QKMRYdwZmF9LTvFzVj4KdQJlgl9fSfVf8ADP5WHkzawJcDirC+IWNYmWwZzR+4s/nxGaNUQPgvxFmDLwIfAk4sYhehghflg/Zz/37sKXNRR4wRr3yW2vmLGhgk+MAYpTJqHBDCz8hv4VLAMU0x9lm9XJDEHq/pMwasQTQ03Po4VJ6S7H5f1hL2xpwDGFgleBBDeo2WFogxFrjWrVdagoBxoUWLswYtCdBJgOJ+Hxghayf9X+rE8QHlMwYeaHMk+sdrChg4qVZbbY3Cu/xGhN5Q/wXY/HgccUWzJO/MM8+0GcXs6tChvYWlcWqxpyjBMpJfrrn2z+7ZZ16sDXi1MvN2SRAlcYxR7owNZ732dMf/I31F9/BbuSm+Qy1rjOKAw1jiJWaciNEkntQsYJDcssoqq1qliFncf//99byZfoV5KV5KBh3nEiFzUK97AMqgQae5s8+OKBK3OsE57n/++Wfdq6++ZuWjY+BZlPJVzizQM4tLlFRSxxBI6i8GCPe+DwaxSNjvPkuj4JOGGDJzWh0pD68sYYDY7RwxV6VjMDByieO3J0biXwwermLFP/hN7ICI4FtvvWUuXVgHDyEgI3mGKCnuaSqCdxOdA2C88MJzBowlTfkUY1QCDJ8psgaPgCGxFT1D/5OvQnxKLI5XFm9vKcDgXlklAAPlv6B88iUfEmAiUgkQeKEqwY0RfdXYQ6DywQejJX01Nd+bc4rKkcU0atT9lsxy+OE9C2HqUaNGWVRT8QsxBi5xch+YIVkOrlJpmsbimazUe8h7ma3yfNJmLTvwzdU0RV2zvFx9JA40xH+oF2LZN2PrxiofZLkfdiXIR4SaCLYBS1aJZr+in2EjooZHyw4Jni233PIOc33KFJJNpljlzjrrDDdjxtfu2muvtlwLYgIonySl8JzC3AMHDrRMpm++mWmKKfItCRg+IEoBB8DgfaG+UkoZ6lpkPs4/nf8ul3i8HyPfgMSxRSl1w0eEiC63f1RLng/1kwIw/Er6Mix0qPiF1X3H4prmBow+fY5yr7wy2p1xxumuW7fdTQHFZOVCf4H6uIiAolhhrh577LEWnKIMFFeoTLM8bRZmUa90DPkC8tJ2XLl+rITvlV2eBYxSBjo/nOruLLd/wnf5jKYyC1ZJ3KDn68yaQh4louSpp56xxBMGn4QXdBR0DsLel1xyWaFOkovrrdepNlq7jIXF0V84YQkGSapTFij4ngRkHFDKMS2n49X+8847z4BNthf1JjmYxCQBIw8A4sRJtQY2HKc89cnqwwIwwsKyCq/7vhgYDz30iNtnn73c6NFjzKIhsWXfffc1ywYxRceSOU2m1ahR95qphNIKY9xzzz2W6LPVVlsWyU1frPmdGdc4DQDUD9CIzxRmQbNm9ojd04x6p1wLWxSUOtIKcdihUGMiksGFiCLlManfwkHHykDXwjyUucnbEanKYSkVvKWOWRxTxPUt92UyRtasnTbtC1vUwws++2yKpfWH1AQ4SDwhkZj7SAVE9yBvkvt1EVMhfZBEXrLQp0yZYl/5vpM4P0pch2677fbGVqTqoTSXc5GIQ6IQlhXue/JLdLGEATEZAjVKtokChfIz8Axm/PTpM4uqwT0siuKHi2QdMu2zJqVfSBwTldPWcJzrASOTYmpnnWYe+1+wXvPOO++0NP0onZ7RjCyYUE8pdGRNZMlo0FBWSbnDKkLJ1Wk7xFnCjsjS7nkHoEI5a9eunc1QX3fK0/EHHniwu/rqqwt5E8xqck8BefR8FChTP/hOp6h+ETsKJHp/XV0isEbgaWFJyOSmlGtFVVMsxTJGEt0kdSYKJMCIVm/vWKsb1ImXbPTW3Vu3SUqNKbEojr6jJwsQ/rtIxGW245aPA2hWvWSSksjL84hDst4roe/i2V0HDEBE7ier9RRAK6WtWW0p5/uSGCPuBVgeOFXQIfBv+PIzq0JhJwMMHTrPjA935ssqLw8w8pYBMKI1MmvZI+g/rEqr9gVjwJIsMFqcCcBZ7agIGJoBWBxkQ+OTwKNpVOSJnKxKiI5xieuQ3XfffbdoL8889O+/h/WmmL9K2C2VNfBVkKFO2gCDh5LMoqZS25XUdtWHZCUsKLzAuKYRp6W2NU//lnpPRcCQjKSzkMfQIAto5JbNqkwoFyVKKA9PrPbZKqejkkRJVp30feirwGHmb5WQt5y0+2gXi6pRkPEAMzGqBbxK61cxMDTb+Q1zkE2NvY/VkffSwKMTsBiIC+Vz8ODBRZu85i2P+8gjpaPRMWTJ+L+zymKBEEszcatTPwGjlDLS3oHnkvLJYsejSqzJV5B/aIBUDIyQotGssVCyriQWwI2N2Qq14j8Q8Eo1y3BuYa4iUiTa/MVAWfXje6KVmKoEr4gfsSo+NE/zlJN0DwuqYCGtWa2krGo/WzYwkmR2qQPoM44aF+e38M1eDXRaZ5BaCGOgY5QjitQO/9lqzuK0fiqnvg0GGKpIpY2oxPxL64xQ+ax2xzX28v4ff8RJ1x7adekAAAAASUVORK5CYII=|^@2@^|";
//					} else {
//						itemDatas += 		"BackImageString|^@1@^||^@2@^|";
//					}
					itemDatas += 		"BackImageString|^@1@^||^@2@^|";

					itemDatas += 		"BorderColor|^@1@^|"+response.ItemsList[i].linecolor+"|^@2@^|";
					itemDatas += 		"BorderWidth|^@1@^|"+response.ItemsList[i].linethickness+"|^@2@^|";
					itemDatas += 		"TextFont|^@1@^|"+response.ItemsList[i].fontsize+"px 돋움체|^@2@^|";
					itemDatas += 		"TextColor|^@1@^|"+response.ItemsList[i].fontcolor+"|^@2@^|";
					itemDatas += 		"TextAlign|^@1@^|4|^@2@^|";
					itemDatas += 		"Text|^@1@^|"+_label+"|^@2@^|";
					itemDatas += 		"SystemNm|^@1@^|"+_systemNm+"|^@2@^|";
					itemDatas += 		"TextLineSpacing|^@1@^|0|^@2@^|TextBorder|^@1@^|0|^@2@^|TextMaxLine|^@1@^|0|^@2@^|IsViewOutBound|^@1@^|false|^@2@^|IsViewText|^@1@^|true|^@2@^|IsVisible|^@1@^|true|^@2@^|";
					itemDatas += 		"IsBorderLeft|^@1@^|true|^@2@^|";
					itemDatas += 		"IsBorderRight|^@1@^|true|^@2@^|";
					itemDatas += 		"IsBorderTop|^@1@^|true|^@2@^|";
					itemDatas += 		"IsBorderBottom|^@1@^|true|^@2@^|";
					itemDatas += 		"IsUserSizable|^@1@^|false|^@2@^|";
					itemDatas += 		"TextFormat|^@1@^|-1|^@2@^|";
					itemDatas += 		"EditOnly|^@1@^|false|^@2@^|";
					itemDatas += 		"IsWrap|^@1@^|false|^@2@^|";

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
					itemDatas += 		"DimensionWidth|^@1@^|"+response.ItemsList[i].width * baseScale+"|^@2@^|";
					itemDatas += 		"DimensionLength|^@1@^|"+response.ItemsList[i].length * baseScale+"|^@2@^|";
					itemDatas += 		"Alpha|^@1@^|"+_alpha+"|^@2@^|";
					itemDatas += 		"Points|^@1@^|"+response.ItemsList[i].points+"|^@2@^|";
					itemDatas += 		"MobileFlag|^@1@^|"+_mobileFlag+"|^@2@^|";
					itemDatas += 		"UnitSize|^@1@^|"+response.ItemsList[i].unitSize+"|^@2@^|";


					itemDatas += 		"RackCount|^@1@^|"+response.ItemsList[i].rackCount;

					itemDatas += 		"|^@4@^|";

				});

				var sVal =pageDatas + "|^@4@^|" + panelDatas + "|^@4@^|" + itemDatas;
				$("#loader").css('display','none');

				SetCommand('DESIGN_PANEL_LOAD', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', sVal);

			}
		}
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if (jqxhr == 'SaveDraw') {

			alert("정상적으로 저장이 이루어지지 않았습니다.\n다시 시도하여 주시기 바랍니다.");
			$("#drawingDatas").val("");
			$("#loader").css('display','none');
		}
	}
	function DrawDataBind() {
		if ($("#sisulCd").val() == "" || $("#sisulCd").val().length == 0) {
			// 아이템 아이디로 시설코드, 층정보, 버젼 정보 구하기
			var item = $("#itemId").val();
			var paramData = {itemId:item};

			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getParamInfoSet', paramData, 'GET', 'ParamInfoSet');

		} else {

			$("#loader").css('display','Inline');
			// Layers
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLayersList', '', 'GET', 'Layers');
			// 지입/사입 구분 코드 목록 호출
			var supCd = {supCd : '009000'};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getComCode', supCd, 'GET', 'csType');
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





	var stackSize = 5;
	var stUndo = [];
	var stRedo = [];
	var lastSav;
	var L = localStorage;
	L.clear();

	function setStorageData(strVal){
		var mod = { l : 1 };
		var w = JSON.stringify(strVal);
		if(lastSav && JSON.stringify(lastSav) == w) return; //nothing changed, nothing to save
		if(lastSav) {
			stUndo.push(lastSav);
			if(stUndo.length > stackSize) stUndo.shift(); //removing the oldest one, if too many states have been saved
			mod.u = 1
		};

		if(stRedo.length > 0) { stRedo.length = 0; mod.r = 1};    //saving a new state invalidates the redo stack
		lastSav = JSON.parse(w);
		syncLS(mod);
	}

//	do an restore to last saved state
	function undoData(strVal){
		setStorageData(strVal);  //make sure any last minute changes are saved
		if(stUndo.length > 0 ) {
			stRedo.push(lastSav);
			lastSav = stUndo.pop();
			SetCommand('DESIGN_PANEL_LOAD_LAYER', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', lastSav);
			syncLS();  //sync all
		}
	}

	//doing the redo
	function redoData(strVal){
		setStorageData(strVal); //make sure any last minute changes are saved
		if(stRedo.length > 0) {
			stUndo.push(lastSav);
			lastSav = stRedo.pop();
			//extend(workObj,lastSav);
			SetCommand('DESIGN_PANEL_LOAD_LAYER', 'PAGE_KEY|^@^|1|^@@^|PAGE_TITLE|^@^|상면관리', lastSav);
			syncLS();  //sync all
		}
	}

	//clearing out the undo/redo stack
	function clear(){
		localStorage.clear();
		lastSav=false;
		stUndo.length=0;
		stRedo.length=0;
	}

	function syncLS(what){
		try {
			what = what || { u : 1, l : 1, r : 1 };
			if(what.u) L.stUndo = JSON.stringify(stUndo);
			if(what.r) L.stRedo = JSON.stringify(stRedo);
			if(what.l) L.lastSav = JSON.stringify(lastSav);
		} catch(err) {
			//console.log("undo Err");
		}

	}



});
