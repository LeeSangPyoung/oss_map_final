/**
 *
 * @author Administrator

 * @date 2023. 08. 21.
 * @version 1.0
 */

let eqpRoleDivCdGridColList = []; //주변국사 및 장비에서 장비타입으로 그리드 초기 컬럼 세팅용

let myDiagram;

let contextMenuTemplate;
let noContextMenuTemplate;

var lineDivVals = '';
var strNodeName = '';

var gNetBdgmSetData ={};


//검색 단어에 따라 검색 속도가 달라 먼저 검색한 단어가 나중에 표시되는 문제를 방지 하기 위해 따로 작성하였음
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
//			if ( $(el).find('.Textinput').length === 0 ){
//				$(el).append('<input class="Textinput">');
//			}
			if ( $(el).find('.Dropdown').length === 0 ){
				$(el).append('<ul class="Dropdown"></ul>');
			}
			el.textinput = $(el).find('.Textinput').first();
			el.dropdown = $(el).find('.Dropdown').first();
			$(el.dropdown).css('minWidth', $(el.textinput).outerWidth());
			$(el.dropdown).css('display', 'none');
//			el.fitwidth
//				? $(el.dropdown).width($(el.textinput).outerWidth()-2*parseInt($(el.textinput).css('border-left-width'))) // border 1px * 2 을 제하여 주어야 함
//				: $(el.dropdown).css('display', 'inline-block');
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');

			$(el.dropdown).css({
				'position':'absolute',
				'top': '29px',
				'left': '0px'
			});

/*			$(el.dropdown).css('top','25px');
			$(el.dropdown).css('left','0px');
*/
			$(el.dropdown).css('z-index','9999');

			$a.convert(el.textinput);
			$a.convert(el.dropdown);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);

			$(el.dropdown).addHandler($.alopex.widget.autocomplete._defaultHandler);
		},
		_defaultHandler : function(e){
			var el = e.currentTarget.parentElement.parentElement;
			el.lastKeyword = e.currentTarget.innerText;
			el.selected = e.currentTarget.data;

			if( typeof el.select === "function" ){
				el.select(e, el.selected);
			}
		},
		setOptions : function(el, data){
			$.extend(el, data);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
		},
		_keyupHandler : function(e){

			// [20160503 kjb - e.keyCode 이용해서 키보드의 기능키 등 불필요한  키 입력에 대해서는 return 처리]

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
					divEl.paramname? req.data[divEl.paramname[0]] = text : req.data = text;
					req.data[divEl.paramname[1]] = lineDivVals;
					req.data[divEl.paramname[2]] = gNetBdgmSetData.netBdgmNetDivVal;
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
				if ( data[i].searchId !== undefined ) {
					item.id = data[i].searchId;
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

	// 변경된 좌표 추적
	let changeNodes = {};
	let insertNodes = {};
	let deleteNodes = {};
	let savedKeyList= [];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();     //select 정보 세팅

    	initGrid();

    	initDiagram();

    	setEventListener();  //이벤트

    };

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	let mgmtSelected = "SKT";
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/NWCMGRP/getTopoloyTypCdList', null, 'GET', 'TopoloyTypCdData');  // 망구분 데이터
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/NWCMIMG/getTopoloyTypCdList', null, 'GET', 'ExampleData');  // 범례 데이터
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/eqpRoleDiv/C00148/'+ mgmtSelected, null, 'GET', 'eqpRoleDivCd'); // 장비타입
    }

    function getNodeTopoloyLink(param) {
		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/networktopo/getNodeTopoloyLink'
		  , data: param
		  , method:'POST'
		  , async:true
		  }).done(
			function(result) {

				$('#h2Title').text(param.netBdgmNm);

				drawNetworkToplogy(result);

			}.bind(this)
		);
    }

    function nodeDoubleClick(data, event) {
    	let param = {mtsoId: data.mtsoId, mtsoNm: data.mtsoNm, lineDivVals: data.lineDivVal, netBdgmNetDivVal: gNetBdgmSetData.netBdgmNetDivVal};

    	let width = 820, height = 870;

    	let left = (window.innerWidth /2) - (width/2);
    	let top  = (window.innerHeight/2) - (height/2);

    	var strTitle = strNodeName + "-" +data.mtsoNm;
    	param.title = strTitle;
		$a.popup({
			url: '/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoRadialPopup.do',
			title: strTitle,
			iframe: false,
			modal: false,
			data: param,
			windowpopup: true,
			width:  width,
			height: height,
			center: true,
			movable:true,    // 이동 가능
			resizable:true,     // 리사이즈
			center: false,
			other: "top="+top+",left="+left+",scrollbars=auto,resizable=yes",

			beforeCallback : function(data) { // 팝업창을 닫을 때 실행
				return true; //리턴값이 true가 아닌경우 팝업창이 닫히지 않고 중단됨. true일 경우는 callback함수가 호출된다.
			},
			callback : function(data) { // 팝업창을 닫을 때 실행

			}
		});
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	// Hide the context menu when clicking elsewhere
    	$(document).on('click', function() {
    		$('#contextMenuLink').hide();
    		$('#contextMenuLink').css('z-index', 1);
    	});

    	$("#contextMenuLink").on("click", function(e) {
    		e.stopPropagation();
    	});

    	$("#contextMenuLink ul li").on("click", function(e) {
    		let $context = $('#contextMenuLink');

    		let menuId = $(this).attr('id');
    		if(menuId === 'mapview') {	// 지도 조회
    			applyMapSearch();

    			let popParams = {};
    			popParams.fromEqpId = $context.data("fromEqpId");
    			popParams.toEqpId = $context.data("toEqpId");
    			popParams.fromMtsoId = $context.data("fromMtsoId");
    			popParams.toMtsoId = $context.data("toMtsoId");
    			popParams.lineDivVal = $context.data("lineDivVal");
    			applyLnMapSearch(popParams);
    		} else if (menuId === 'ring') {	// 링정보(구성)
    			let popParams = {};

//    			popParams.fromEqpId = $context.data("fromEqpId");
//    			popParams.toEqpId   = $context.data("toEqpId");

    			popParams.fromMtsoId = $context.data("fromMtsoId");
    			popParams.toMtsoId = $context.data("toMtsoId");

    			$a.popup({
        			url: "/tango-transmission-web/trafficintg/engineeringmap/RingInfoPopup.do", // 팝업에 표시될 HTML
        			iframe: true, // default,
        			modal: false,
    				movable:true,
        			windowpopup: true,
        			data: popParams,
        			width: 830,
        			height : 610,
    				callback : function(data) { // 팝업창을 닫을 때 실행

    		    	}
        		});
    		} else if (menuId === 'ringList') { // 링목록(GIS)
    			let popParams = {};
    			popParams.fromEqpId = $context.data("fromEqpId");
    			popParams.toEqpId   = $context.data("toEqpId");

    			$a.popup({
        			url: "/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoRingList.do", // 팝업에 표시될 HTML
        			iframe: true, // default,
        			modal: false,
    				movable:true,
        			windowpopup: true,
        			data: popParams,
        			width: 1000,
        			height : 650,
    				callback : function(data) { // 팝업창을 닫을 때 실행

    		    	}
        		});

    		}

    		$('#contextMenuLink').hide();
    		$('#contextMenuLink').css('z-index', 1);
    	});

    	if(myDiagram) {
        	myDiagram.addDiagramListener("SelectionMoved", function(e) {
        		e.subject.each(function(part) {

        			const nodeData = part.data;
        			const position = part.location;

        			if(nodeData.mtsoId && insertNodes[nodeData.mtsoId]) {
						insertNodes[nodeData.mtsoId].x = position.x;
						insertNodes[nodeData.mtsoId].y = position.y;
						return;
        			}

        			if(savedKeyList && savedKeyList.includes(nodeData.mtsoId)) {
            			changeNodes[nodeData.mtsoId] = {x: position.x, y:position.y, netBdgmId: nodeData.netBdgmId, netBdgmNodeSeq: nodeData.netBdgmNodeSeq
            					,mtsoNm: nodeData.mtsoNm, name: nodeData.name,	netBdgmNodeImgCd: nodeData.netBdgmNodeImgCd, source:nodeData.source};
        			}
        		})
        	});
    	}

    	$("#btnNodePopup").on('click', function(e) {
    		nodeDoubleClick();
    	});

 		//자동 검색
 		$("#idSelect").setOptions({
 			url : "/tango-transmission-tes-biz/transmisson/tes/engineeringmap/networktopo/searchMtsoNmList",
 			method : "get",
 			datatype: "json",
 			paramname : ["searchNm","lineDivVals", "netBdgmNetDivVal"],
// 			paramname : "searchNm",
 			minlength: 2,
 			noresultstr : "검색 결과가 없습니다.",
 			before : function(id, option){

 			}
 		});

 		//망 구성도 등록
    	$('#networkToplogyRegPopOpenBtn').on('click', function(e) {

    		$a.popup({
				popid : 'networkToplogyReg',
				title : '망 구성도 등록',
				url: '/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoEditPopup.do',
				data : '',
				modal : false,
				windowpopup: true,
				movable : true,
				width : 550,
				height : 475,
				callback : function() { // 팝업창을 닫을 때 실행
					$('#searchBtn').trigger('click');
				}
			});
//
//    		$a.popup({
//    			url: '/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoEditPopup.do',
//    			title: '망 구성도 등록',
//    			iframe: false,
//    			modal: false,
//    			windowpopup: true,
//    			width: 500,
//    			height: 500,
//    			center: true,
//    			movable:true,    // 이동 가능
//    			resizable:true,     // 리사이즈
//    			center: false,
//    			beforeCallback : function(data) { // 팝업창을 닫을 때 실행
//    				return true; //리턴값이 true가 아닌경우 팝업창이 닫히지 않고 중단됨. true일 경우는 callback함수가 호출된다.
//    			},
//    			callback : function(data) { // 팝업창을 닫을 때 실행
//    				$('#searchBtn').trigger('click');
//    			}
//    		});
    	});

    	// 망 구성도 수정
    	$('#networkToplogySavePopOpenBtn').on('click', function(e) {
    		let dataObj = AlopexGrid.trimData($('#netowrkTopologyTreeGrid').alopexGrid("dataGet" , {_state : {selected:true}}))[0];
    		if(dataObj == undefined){
    			alert("수정할 구성도를 선택해 주세요.");
				return;
    		}

			let param = {};
			param.netBdgmId = dataObj.nodeId;
			param.netBdgmNm = dataObj.nodeName;
			param.netBdgmNetDivVal = dataObj.parentNodeId;

    		$a.popup({
    			url: '/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoEditPopup.do' ,
    			title: '망 구성도 수정',
    			data: param,
    			iframe: false, // default,
    			modal : false,
				windowpopup: true,
				movable : true,
				width : 550,
				height : 475,
    			callback : function(data) { // 팝업창을 닫을 때 실행
    				$('#searchBtn').trigger('click');
    				$('#btnRefresh').trigger("click");
    			}
    		});
    	});

    	$('.button_ico15_grey, #btnSearchIdSch').on('click', function(e) {
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
					$('#searchMtsoId').val(data.mtsoId);
					$('#searchNm').val(data.mtsoNm);
				}
			});
    	});

    	// 국사 추가
    	$('#btnMtsoAdd').on('click', function(e) {

    		let dataObj = AlopexGrid.trimData($('#netowrkTopologyTreeGrid').alopexGrid("dataGet" , {_state : {selected:true}}))[0];
			if(!dataObj || !dataObj.nodeId) {
				alert("구성도를 선택해 주세요.");
				return;
			}

    		if(!$("#inputExample").val()) {
    			alert("범례를 선택해 주세요.");
    			$("#inputExample").focus();

    			return;
    		}

    		let mtsoNm = $("#searchNm").val();
    		let mtsoId = $('#searchMtsoId').val();

    		let getSelectedData = $("#idSelect").getSelectedData();
			if(mtsoNm && !mtsoId && getSelectedData) {
				mtsoId = getSelectedData.searchId;
			}

    		if(!mtsoNm || !mtsoId) {
    			alert("국사가 입력되지 않았습니다.");

    			$("#searchNm").focus();

    			return;
    		}

    		let param = {};
    		param.mtsoNm = mtsoNm;
    		param.mtsoId = mtsoId;
    		param.editYn = 'N';

    		if(savedKeyList && savedKeyList.includes(mtsoId)) {
        		$("#searchNm").val("");
        		$('#searchMtsoId').val("");

        		alert("이미 존재하는 국사 입니다.");

        		$("#searchNm").focus();

        		return;
    		}

    		$a.popup({
    			url: "/tango-transmission-web/trafficintg/engineeringmap/NetworkMtoEditPopup.do", // 팝업에 표시될 HTML
    			iframe: true, // default,
    			modal: false,
				movable:true,
    			windowpopup: true,
    			data: param,
    			height : 157,
				callback : function(data) { // 팝업창을 닫을 때 실행

					if(data == null) return;

		    		let node = {};
		    		node.key  = data.mtsoId;
		    		node.name = data.mtsoNm;
		    		node.x = 311;
		    		node.y = -150;
		    		node.mtsoId = data.mtsoId;
		    		node.mtsoNm = data.mtsoNm;
		    		node.netBdgmId = dataObj.nodeId;

		    		let inputExample = $("#inputExample").val();
		    		$("#selExampleList li").each(function() {
		    			let spanTxt = $(this).find('span').text();
		    			if(spanTxt == inputExample) {
		    				node.imgsrc = $(this).data('icon');
		    				node.netBdgmNodeImgCd  = $(this).data('value');
		    				return;
		    			}
		    		});

					addNetworkToploy(node);

		    		$("#searchNm").val("");
		    		$('#searchMtsoId').val("");
		    		$("#inputExample").val("");
				}
    		});
    	});

    	$('#mtsoCnclBtn').click(function() {
    		$('#divMtsoEdit').fadeOut();
    	});

    	// 캡처
    	$('#btnCap').on('click', function(e) {
        	if(myDiagram) {
        		let diagramImg = myDiagram.makeImageData({
        			scale : 1,
        			background: "white"
        		});

        		let byteString = atob(diagramImg.split(',')[1]);
        		let mimeString = diagramImg.split(',')[0].split(':')[1].split(',')[0];
        		let ab = new ArrayBuffer(byteString.length);
        		let ia = new Uint8Array(ab);
        		for(let i = 0 ; i < byteString.length; i++) {
        			ia[i] = byteString.charCodeAt(i);
        		}
        		let blob = new Blob([ab], {type: mimeString});

        		let link = document.createElement('a');
    			link.href = URL.createObjectURL(blob);
    			link.download = "diagram.png";
    			link.click();
        	}
    	});

    	// 인쇄
    	$('#btnPrint').on('click', function(e) {
        	if(myDiagram) {
        		let diagramImg = myDiagram.makeImage({
        			scale : 1,
        			maxSize: new go.Size(Infinity, Infinity)
        		});

        		let newWindow = window.open("");

        		setTimeout(function() {
	        		newWindow.document.write(diagramImg.outerHTML);
	        		newWindow.print();
        		}, 100);
        	}
    	});

    	$('#btnPosEdit').on('click', function(e) {
    		// show
    		$('#btnMtsoAdd').show();
    		$('#btnEditCncl').show();
    		$('#btnPosSave').show();
    		$('#spanInputMtsoNm').show();
    		$('#spanExampleList').show();

    		// hide
    		$('#btnPosEdit').hide();
    		$('#btnRefresh').hide();
    		$('#btnPrint').hide();
    		$('#btnCap').hide();
    		$('#btnMapView').hide();
    		$('#btnExample').hide();
    		$('#spanEqpRoleDivCdList2').hide();

    		myDiagram.nodeTemplate = contextMenuTemplate;
    	});

    	$('#btnEditCncl').on('click', function(e) {
    		// show
    		$('#btnPosEdit').show();
    		$('#btnRefresh').show();
    		$('#btnPrint').show();
    		$('#btnCap').show();
    		$('#btnMapView').show();
    		$('#btnExample').show();
    		$('#spanEqpRoleDivCdList2').show();

    		// hide
    		$('#btnMtsoAdd').hide();
    		$('#btnEditCncl').hide();
    		$('#btnPosSave').hide();
    		$('#spanInputMtsoNm').hide();
    		$('#spanExampleList').hide();

    		changeNodes = {};
			deleteNodes = {};
			insertNodes = {};

    		myDiagram.nodeTemplate = noContextMenuTemplate;

    		getNodeTopoloyLink(gNetBdgmSetData);

    	});

    	$('#btnPosSave').on('click', function(e) {
    		let params = [];

    		//update
    		for(const key in changeNodes) {
    			if(changeNodes.hasOwnProperty(key)) {
    	    		let param = {};
    				param.netBdgmId = changeNodes[key].netBdgmId;
    				param.netBdgmNodeSeq = changeNodes[key].netBdgmNodeSeq;
    				param.xcrdLocVal = changeNodes[key].x;
    				param.ycrdLocVal = changeNodes[key].y;
    				param.netBdgmNodeDispNm = changeNodes[key].mtsoNm;
    				param.netBdgmNodeImgCd  = changeNodes[key].netBdgmNodeImgCd;
    				param.flag = "update";

    				params.push(param);
    			}
    		}

    		for(const key in insertNodes) {
    			if(insertNodes.hasOwnProperty(key)) {
    	    		let param = {};
    				param.netBdgmId  = insertNodes[key].netBdgmId;
    				param.netBdgmNodeDivVal = "M"; // 망구성도노드구분값 M : 국사
    				param.netBdgmNodeImgCd  = insertNodes[key].netBdgmNodeImgCd;
    				param.netBdgmNodeMtsoId = insertNodes[key].mtsoId;
    				param.netBdgmNodeDispNm = insertNodes[key].mtsoNm;

    				param.xcrdLocVal = insertNodes[key].x;
    				param.ycrdLocVal = insertNodes[key].y;

    				param.flag = "insert";

    				params.push(param);
    			}
    		}

    		for(const key in deleteNodes) {
    			if(deleteNodes.hasOwnProperty(key)) {
    	    		let param = {};
    				param.netBdgmId      = deleteNodes[key].netBdgmId;
    				param.netBdgmNodeSeq = deleteNodes[key].netBdgmNodeSeq;
    				param.flag = "delete";

    				params.push(param);
    			}
    		}

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/networktopo/saveNodeTopoloyLinks'
			  , data: params
			  , method:'POST'
			  , async:true
			  }).done(
				function(result) {
					if(result.code === "ok") {
						alert("저장 되었습니다.");
					} else {
						alert("저장 실패하였습니다.");
					}

					changeNodes = {};
					deleteNodes = {};
					insertNodes = {};

					$('#btnRefresh').trigger("click");


		    		$("#searchNm").val("");
		    		$('#searchMtsoId').val("");
		    		$("#inputExample").val("");

//		    		myDiagram.nodeTemplate = noContextMenuTemplate;

		    		$('#btnEditCncl').trigger("click");
				}.bind(this)
			);


    	});

    	$('#selExampleList, #buttonExampleList').on('click', 'li', function() {
    		let value = $(this).data('value');
    		let text  = $(this).text().trim();

//    		alert('Selected: ' + text + ' (Value: ' + value + ')');
    	});

    	$('#eqpRoleDivCdList2').change(function() {
    		let dataObj = AlopexGrid.trimData($('#netowrkTopologyTreeGrid').alopexGrid("dataGet" , {_state : {selected:true}}))[0];

			if($.TcpUtils.isEmpty(dataObj)) {
				return;
			}

			let netBdgmEqpDivVals = "";
			$('#eqpRoleDivCdList2 :selected').each(function(i){
				var $this = $(this);
				if($this && $this.length){
					netBdgmEqpDivVals += $this.val() + "|";
				}
			});

	   		if(netBdgmEqpDivVals && netBdgmEqpDivVals.length) {
		   		netBdgmEqpDivVals = netBdgmEqpDivVals.substring(0, netBdgmEqpDivVals.length - 1);
	   		}

			let param = {};
			param.netBdgmId = dataObj.nodeId;
			param.netBdgmNm = dataObj.nodeName;
			param.netBdgmNetDivVal = dataObj.parentNodeId;
			param.netBdgmEqpDivVals = netBdgmEqpDivVals;

			getNodeTopoloyLink(param);
		});

    	$('#btnRefresh').on('click', function(e){

    		let dataObj = AlopexGrid.trimData($('#netowrkTopologyTreeGrid').alopexGrid("dataGet" , {_state : {selected:true}}))[0];

    		if (dataObj == undefined )
    			return;

    		if(!dataObj.nodeId) {
				return;
			}

			let netBdgmEqpDivVals = "";
			$('#eqpRoleDivCdList2 :selected').each(function(i){
				var $this = $(this);
				if($this && $this.length){
					netBdgmEqpDivVals += $this.val() + "|";
				}
			});

	   		if(netBdgmEqpDivVals && netBdgmEqpDivVals.length) {
		   		netBdgmEqpDivVals = netBdgmEqpDivVals.substring(0, netBdgmEqpDivVals.length - 1);
	   		}

			let param = {};
			param.netBdgmId = dataObj.nodeId;
			param.netBdgmNm = dataObj.nodeName;
			param.netBdgmNetDivVal = dataObj.parentNodeId;
			param.netBdgmEqpDivVals = netBdgmEqpDivVals;

			getNodeTopoloyLink(param);
    	});

		$('#netowrkTopologyTreeGrid').on('click', '.bodycell', function(e){

			let dataObj = AlopexGrid.parseEvent(e).data;

			if(!dataObj.nodeId) {
				return;
			}

			let param = {};
			param.netBdgmId = dataObj.nodeId;
			param.netBdgmNm = dataObj.nodeName;
			param.netBdgmNetDivVal = dataObj.parentNodeId;

			strNodeName = dataObj.nodeName;
			lineDivVals = dataObj.netBdgmLineDivVal;

			let mgmtSelected = "SKT";
	    	Util.jsonAjax({
				url: '/transmisson/tes/commoncode/eqpRoleDivByNetTopology/C00148/'+ mgmtSelected
			  , data: param
			  , method:'GET'
			  , async:true
			  }).done(
				function(result) {

					let $select = $('#eqpRoleDivCdList2');
					$select.clear();
		    		let option_data =  [];

		    		$.each(result, function(index, item) {
		    			option_data.push({
							"comCd"		:item.comCd,
							"comCdNm"	:item.comCdNm
							});
		    		});

		    		$select.setData({
		                 data: option_data
		    		});

				}.bind(this)
			);

			let netBdgmEqpDivVals = "";
			$('#eqpRoleDivCdList2 :selected').each(function(i){
				var $this = $(this);
				if($this && $this.length){
					netBdgmEqpDivVals += $this.val() + "|";
				}
			});

	   		if(netBdgmEqpDivVals && netBdgmEqpDivVals.length) {
		   		netBdgmEqpDivVals = netBdgmEqpDivVals.substring(0, netBdgmEqpDivVals.length - 1);
	   		}

	   		if(netBdgmEqpDivVals) {
		   		param.netBdgmEqpDivVals = netBdgmEqpDivVals;
	   		}

	   		// 선택한 망구성도정보 전역 변수로 저장
	   		gNetBdgmSetData = param;


	   	// show
    		$('#btnPosEdit').show();
    		$('#btnRefresh').show();
    		$('#btnPrint').show();
    		$('#btnCap').show();
    		$('#btnMapView').show();
    		$('#btnExample').show();
    		$('#spanEqpRoleDivCdList2').show();

    		// hide
    		$('#btnMtsoAdd').hide();
    		$('#btnEditCncl').hide();
    		$('#btnPosSave').hide();
    		$('#spanInputMtsoNm').hide();
    		$('#spanExampleList').hide();

    		myDiagram.nodeTemplate = noContextMenuTemplate;

			getNodeTopoloyLink(param);

		});

		let btnExampleClicked = false;
		$('#btnExample').on('click', function(e) {
			$ul = $('#buttonExampleList');

			if($ul.css("display") == 'none' || !$ul.css("display") || !btnExampleClicked) {
//				$ul.show();
		    	let zindex = getMaxZIndex() + 1;
		    	$ul.css({
		    		'display': 'block',
		    		'z-index': zindex
		    	});
			} else {
//				$ul.hide();
				$ul.css({
		    		'display': 'none',
		    		'z-index': 1
		    	});
			}

			btnExampleClicked = true;
		});

    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	 //조회
    	 $('#searchBtn').on('click', function(e) {
			let param = {};
    		//망구분 -> MULTI SELECT 처리
			param.netBdgmNetDivVal = $("#topoloyTypCd").val();
			//장비타입 -> MULTI SELECT 처리
			param.netBdgmEqpDivVal = $("#eqpRoleDivCdList1").val();
    		//구성도명
			param.netTopoNm = $('#netTopoNm').val();

			getTreeNode(param, 'Y');
    	 });

    	 //지도표시
    	 $('#networkToplogyMapView, #btnMapView').on('click', function(e) {
    		 applyMapSearch();
    	 });
	};

	//지도 표시
	function applyMapSearch() {

		if(window.opener){
			//선택된 구성도 정보
			let dataObj = AlopexGrid.trimData($('#netowrkTopologyTreeGrid').alopexGrid("dataGet" , {_state : {selected:true}}));

			if(dataObj.length === 0) {
				callMsgBox('','W', "선택된 구성도가 없습니다." , function(msgId, msgRst){});
				return;
			}

			let paramObj = [];
			let param = {};
			param.nodeId = dataObj[0].nodeId;
			param.nodeName = dataObj[0].nodeName;
			param.parentNodeId = dataObj[0].parentNodeId;
			param.lineDivVal = dataObj[0].netBdgmLineDivVal;
			paramObj.push(param);
			opener.randerMapView(paramObj, param.nodeId);

		}else{
			callMsgBox('','W', "부모창이 존재하지 않아 지도표시가 불가능합니다." , function(msgId, msgRst){});
		}


	}

	//선로 조회
	function applyLnMapSearch(data) {
		opener.randerLnMapView(data);
	}

	let netowrkTopologyTreeGrid;

	/*==========================*
	 *  그리드 생성
	 *==========================*/
	function initNetowrkTopologyTreeGrid(data) {

    	$("#netowrkTopologyTreeGrid").alopexGrid({
    		pager: false,
    		autoColumnIndex : true,
    		height : 500,
    		enableDefaultContextMenu:false,
    		disableTextSelection : true,
    		columnMapping : [
    			{
    				key : "nodeName",
    				title : "구성도명",
    				width : 150,
    				align : "left",
    				treeColumn : true,
    				treeColumnHeader : true
    			}, {
    				key : "nodeId",
    				title : "노드ID",
            		hidden: true
    			}, {
    				key : "parentNodeId",
    				title : "부모노드ID",
        			hidden: true
    			}, {
    				key : "nodeExpended",
    				title : "노드 초기 펼쳐짐여부",
    				width : 150,
    				hidden: true
    			}
    		],
    		tree : {
    			useTree : true,
    			idKey : "nodeId", //노드를 지시하는 유일한 값이 저장된 키값
    			parentIdKey : "parentNodeId", //자신의 상위(parent) 노드를 지시하는 ID가 저장된 키값
    			expandedKey : "nodeExpended" //데이터가 그리드에 입력되는 시점에 초기 펼쳐짐 여부를 저장하고 있는 키값

    			//노드의 초기 펼쳐짐 여부를 인식하는 값의 형태는 expandedValue 옵션에 저장되어 있으며
    			//다른 형태의 값을 사용해야 한다면 이 옵션값을 변경하십시오. 순서대로 펼쳐짐/닫힘 입니다.
    			//expandedValue : ["true", "false"]

    			//최 상위 노드들의 parentIdKey 에 지정되어야 하는 값.
    			//rootNodeParentIdValue : ""
    		},
    		data : data
    	});

//    	$('.pager-center').hide();
	}

	function getTreeNode(param, SEARCH) {

		Util.jsonAjax({
			url: '/transmisson/tes/engineeringmap/networktopo/getTreeNode'
		  , data: param
		  , method:'POST'
		  , async:true
		  }).done(
			function(result) {
				if(SEARCH === 'Y') {
					$('#netowrkTopologyTreeGrid').alopexGrid('dataSet', result, "");
				} else {
					initNetowrkTopologyTreeGrid(result);
				}

				// 노드 전부 펼치기
				$('#netowrkTopologyTreeGrid').alopexGrid('expandTreeNode');

		    	$('.pager-center').hide();

			}.bind(this)
		);
	}

	function initGrid() {
		let param = {};
		getTreeNode(param, 'N');
    }

	/*-----------------------------*
     *  범례 ul > li tag 생성
     *-----------------------------*/
	function makeLiExampleList($ul, response) {
		let height = (response.TopoTypData.length * 32) + 'px';
		$ul.css({
			'width' :'200px',
			'height':height,
			'align-item':'center'
			});

		$ul.empty();

		$.each(response.TopoTypData, function(index, item) {
			let value = item.comCd;
			let text = item.comCdNm;
			let imgsrc = item.etcAttrVal1.replace("/transmission-web", "../..") + item.comCd + '.png';

			let $li = $('<li>', {
				'data-value': value,
				'data-icon' : imgsrc,
				css: {
					display: 'flex',
					cursor : 'pointer',
					valign : 'middle',
					'align-items' : 'center'
				}
			});

			let $img = $('<img>', {
				src: imgsrc,
				alt: text,
				css: {
					width:  '20px'
				,	height: '20px'
				,	marginRight: '5px'
				,	valign: 'middle'
				}
			});

			let $text = $('<span>').text(text);
			$li.append($img).append($text);
			$ul.append($li);
		});
	}

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){

    	if(flag == "searchTreeNode") {
    		netowrkTopologyTreeGrid = response.treeNode;
    	}

    	/*...........................*
		  망구분데이터셋팅
		 *...........................*/
		if(flag =='TopoloyTypCdData'){
			const $select = $('#topoloyTypCd');
			$select.empty();

			$select.append($('<option>', {
				value: "",
				text : "전체"
			}));

			$.each(response.TopoTypData, function(index, item) {
    			$select.append($('<option>', {
    				value: item.comCd,
    				text: item.comCdNm
    			}));
    		});
		}

		if(flag === 'ExampleData') {
			makeLiExampleList($('#buttonExampleList'), response);
			makeLiExampleList($('#selExampleList'),    response);
		}

		if(flag == "eqpRoleDivCd") {
			let $select = $('#eqpRoleDivCdList1');
			$select.clear();
    		let option_data =  [];

    		option_data.push({
				"comCd"		:"",
				"comCdNm"	:"전체"
			});

    		$.each(response, function(index, item) {
    			option_data.push({
					"comCd"		:item.comCd,
					"comCdNm"	:item.comCdNm
					});
    		});

			$('#eqpRoleDivCdList1').setData({
                 data: option_data
    		});

			let $select2 = $('#eqpRoleDivCdList2');
			$select2.clear();

    		$('#eqpRoleDivCdList2').setData({
                 data:option_data.filter(function(item) {
	     				return item.comCdNm != "전체";
	     			})
    		});
    	}
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){

    };

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

    function getMaxZIndex() {
    	let max = Math.max.apply(null, $.map($('body *'), function(e, n) {
    		if($(e).css('position') !== 'static') {
    			return parseInt($(e).css('z-index')) || 1;
    		}
    	}));

    	return max;
    }

    function initDiagram(data) {
    	const $ = go.GraphObject.make;

    	let myContextMenu =
    		$(go.Adornment, "Vertical",
    				$("ContextMenuButton",
    				$(go.TextBlock,"국사 수정"),
    				{click: mtsoNodeMod }
    				),
    			$("ContextMenuButton",
    				$(go.TextBlock,"국사 삭제"),
    				{click: mtsoNodeDelete }
    			)

    		);

    	myContextMenuTemp = myContextMenu
    	myDiagram = $(go.Diagram, "myDiagramDiv", {
    		initialContentAlignment: go.Spot.Center,
    		"undoManager.isEnabled": true,
    		"allowZoom": true,
    		"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
    		"viewportBoundsChanged": function(e) {
    			let currentScale = e.diagram.scale;
    			e.diagram.nodes.each(function(node) {
    				node.scale = Math.max(0.5, Math.min(2, currentScale)); // 0.5 ~ 2배 사이로 제한
    			});
    		}
    	});
    	myDiagram.layout = $(go.Layout);

    	// 다이어그램 노드 템플릿 정의
    	contextMenuTemplate =
    		$(go.Node, "Auto",
        			{selectionAdornmentTemplate:
        				$(go.Adornment,"Auto",
        					$(go.Shape, "RoundedRectangle",
        					{fill: null, stroke: "dodgerblue", strokeWidth: 3}),
        					$(go.Placeholder)
        				)
        			},
        			{doubleClick: function(e, node) {
        					nodeDoubleClick(node.data, e)
        				}
        			},
    				{contextMenu: myContextMenu}, //노드에 컨텍스트 메뉴 적용
    				{locationSpot: go.Spot.Center},
    				new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    				new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    				//{click: (e, obj) => alert("Node clicked: " + obj.part.data.key)},
	    			$(go.Panel, "Vertical",
        				$(go.Picture, new go.Binding("source"),
        						{ desiredSize: new go.Size(40, 40)}),
        				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
	        		)
    		);

    	noContextMenuTemplate =
    		$(go.Node, "Auto",
        			{selectionAdornmentTemplate:
        				$(go.Adornment,"Auto",
        					$(go.Shape, "RoundedRectangle",
        					{fill: null, stroke: "dodgerblue", strokeWidth: 3}),
        					$(go.Placeholder)
        				)
        			},
        			{doubleClick: function(e, node) {
        					nodeDoubleClick(node.data, e)
        				}
        			},
    				{locationSpot: go.Spot.Center},
    				new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    				new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
//    				{click: (e, obj) => alert("Node clicked: " + obj.part.data.key)},
	    			$(go.Panel, "Vertical",
        				$(go.Picture, new go.Binding("source"),
        						{ desiredSize: new go.Size(40, 40)}),
        				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
	        		)
    		);


    	myDiagram.nodeTemplate = noContextMenuTemplate;

    	function linkLineInfo(link){
				var textBlock = link.part.findObject("linkLineInfo");
				var linkData = link.part.data;

				var linkTextData = "";

				if (textBlock) {


					if (textBlock.text != "") {
						textBlock.visible = false;
						textBlock.text = linkTextData;
					} else {

						var param ={};
						param.fromMtsoId = linkData.fromMtsoId;
						param.toMtsoId = linkData.toMtsoId;
						param.lineDivVals = linkData.lineDivVal;

						Util.jsonAjax({
							url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getGisRingLnInfo'
						  , data: param
						  , method:'GET'
						  , async:true
						  }).done(
							function(result) {
								if (result != null) {

									var linkDataTemp = result.result.lnInfo.split(",");
									var uniuqeineDivVals = [...new Set(linkDataTemp)]

									linkTextData = uniuqeineDivVals.join(",");

									textBlock.visible = true;
									textBlock.text = linkTextData;
								}


							}.bind(this)
						);
						textBlock.visible = true;
						textBlock.text = linkTextData;
					}
				}
    	}


    	myDiagram.linkTemplate =
    		$(go.Link,
    			{
	    			routing: go.Link.Normal,
	    			corner: 0,
	    			curviness: 0,
	    			relinkableFrom: true,
	    			relinkableTo: true,
//	    			toShortLength: 0,
	    			contextClick: function(e, obj) {
	    				if (gNetBdgmSetData.netBdgmNetDivVal == "RONT") {
	    					let mousePt = e.diagram.lastInput.viewPoint;
	    					showContextMenu(e, "Link", mousePt.x + 30, mousePt.y, obj.part.data);
	    				}
	    			}
    			},
    			$(go.Shape),
    			$(go.Shape, {toArrow: "", stroke: null}), //화살표 제거
    			$(go.TextBlock,
			            { textAlign: "left",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "red",
	    				  name:  "linkLineInfo",
	    				  segmentIndex: 1,
	    				  segmentOffset: new go.Point(0, -10),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "linkLabelText")
	    		),
	    		new go.Binding("points").makeTwoWay(),
    			{
    				// GIS 라인 정보 표시 제거 - 20250108
    				//click: function(e, obj) {linkLineInfo(obj)}
    			}
    		);

    	myDiagram.model = new go.GraphLinksModel();
    }



    function showContextMenu(e, menudiv, x, y, data) {
    	let $contextMenu = $("#contextMenu"+menudiv);
    	let zindex = getMaxZIndex() + 1;
    	$contextMenu.css({
    		'top'  : y + 'px',
    		'left' : x + 'px',
    		'display': 'block',
    		'z-index': zindex
    	});

    	$contextMenu.data("key",  data.key);
    	$contextMenu.data("type", menudiv);
    	if(menudiv == "Link") {
    		$contextMenu.data("fromEqpId",  data.fromEqpId);
    		$contextMenu.data("toEqpId"  ,  data.toEqpId);
    		$contextMenu.data("fromMtsoId",  data.fromMtsoId);
    		$contextMenu.data("toMtsoId"  ,  data.toMtsoId);
    		$contextMenu.data("lineDivVal"  ,  data.lineDivVal);
    	}

    	e.diagram.toolManager.contextMenuTool.isShowingContextMenu = false;

    	$(document).on("click.hideMenu", function() {
    		$contextMenu.hide();
    		$(document).off("click.hideMenu");
    	});
    }

    function addNetworkToploy(data) {

    	if(savedKeyList && savedKeyList.includes(data["mtsoId"])) {
    		return;
    	}

    	let nodeData= {
    			key:  data["key"],
    			name: data["name"],
    			x: data["x"],
    			y: data["y"],
    			loc: data["x"] + " " + data["y"],
    			mtsoId: data["mtsoId"],
    			mtsoNm: data["mtsoNm"],
    			source: data["imgsrc"],
    			netBdgmNodeImgCd:  data["netBdgmNodeImgCd"],
    			netBdgmId: data["netBdgmId"]

    	};

    	insertNodes[data["key"]] = nodeData;

    	myDiagram.model.addNodeData(nodeData);
    }

    function drawNetworkToplogy(data) {
    	savedKeyList= [];

   		if(data) {
   			let node = [];
   			let link = [];
   			let preNetBdgmId;
   			let preNetBdgmNodeSeq;
			$.each(data, function(index, item) {

				savedKeyList.push(item.netBdgmNodeMtsoId);

				let imgsrc = item.imgSrc.replace("/transmission-web", "../../").replace("PNG","png");
				node.push({
					key: item.mtsoId,
					netBdgmId: item.netBdgmId,
					netBdgmNodeSeq: item.netBdgmNodeSeq,
					name: item.netBdgmNodeDispNm,
	    			mtsoId: item.netBdgmNodeMtsoId,
	    			mtsoNm: item.netBdgmNodeDispNm,
	    			lineDivVal: item.netBdgmLineDivVal,
					loc: item.xcrdLocVal+" "+item.ycrdLocVal,
					source: imgsrc,
	    			x: item.xcrdLocVal,
	    			y: item.ycrdLocVal,
	    			netBdgmNodeImgCd: item.netBdgmNodeImgCd
				});
    		});

			let lineParam = {};
			if(data.length > 0){
				lineParam.lineDivVals = data[0].netBdgmLineDivVal || '';
				if (data[0].netBdgmNetDivVal == 'MW') {
					lineParam.mwDiv = 'MW';
				}
				if (data[0].netBdgmNetDivVal == 'RONT') {
					lineParam.rontDiv = 'RONT';
				}
			}
			lineParam.eqpRoleDivCds = ($("#eqpRoleDivCdList2").val() == null) ? [] : $("#eqpRoleDivCdList2").val();

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/networktopo/getTopologyNodeLinkList'
			  , data: Util.convertQueryString(lineParam)
			  , method:'GET'
			  , async:false
			  }).done(
				function(result) {

					$.each(result, function(index, item) {
						link.push(
								{ from		: item.fromNetBdgmNodeMtsoId
								, to  		: item.toNetBdgmNodeMtsoId
								, fromEqpId : item.eqpId
								, toEqpId   : item.toEqpId
								, fromMtsoId : item.fromNetBdgmNodeMtsoId
								, toMtsoId   : item.toNetBdgmNodeMtsoId
								, lineDivVal   : item.lineDivVal
								, curviness : 10
//								, linkLabelText : ""
								}
								);
					});

					$.each(result, function(index, item) {
						$.each(link, function(idx, lnk) {
							if(lnk.from == item.toNetBdgmNodeMtsoId && lnk.to == item.fromNetBdgmNodeMtsoId) {
								lnk.curviness= -10;
							}
						});
					});
				}.bind(this)
			);

        	//다이어그램 데이터 설정
        	myDiagram.model =
        		new go.GraphLinksModel(
        			node,
        			link
        			);
    	}
    }

    function mtsoNodeDelete(e, obj){

    	let contextmenu = obj.part;
		let part = contextmenu.adornedPart;
		if(part != null) {
			let item = part["je"];

			let key = item.key;
			let mtsoId = item.mtsoId;

			if(savedKeyList && savedKeyList.includes(mtsoId)) {
				deleteNodes[mtsoId] = {netBdgmId:item.netBdgmId, netBdgmNodeSeq:item.netBdgmNodeSeq};
			}

			e.diagram.remove(part);
		}
    }

    function mtsoNodeMod(e, obj){

    	let param = {};
		param.mtsoNm = obj.part.data.mtsoNm;
		param.mtsoId = obj.part.data.mtsoId;
		param.netBdgmNodeImgCd = obj.part.data.netBdgmNodeImgCd;
		param.editYn = 'Y';

		const nodata = obj.part.data;
		const position = obj.part.location;

    	$a.popup({
			url: "/tango-transmission-web/trafficintg/engineeringmap/NetworkMtoEditPopup.do", // 팝업에 표시될 HTML
			iframe: true, // default,
			modal: false,
			movable:true,
			windowpopup: true,
			data: param,
			height : 255,
			callback : function(data) { // 팝업창을 닫을 때 실행

				if(data == null) return;

				myDiagram.model.setDataProperty(nodata,"name",data.mtsoNm);
				myDiagram.model.setDataProperty(nodata,"mtsoNm",data.mtsoNm);
				myDiagram.model.setDataProperty(nodata,"source",data.source);
				myDiagram.model.setDataProperty(nodata,"netBdgmNodeImgCd",data.netBdgmNodeImgCd);


				if(savedKeyList && savedKeyList.includes(nodata.mtsoId)) {
        			changeNodes[nodata.mtsoId] = {x: position.x, y:position.y, netBdgmId: nodata.netBdgmId, netBdgmNodeSeq: nodata.netBdgmNodeSeq
        					,mtsoNm: data.mtsoNm, name: data.name,	netBdgmNodeImgCd: data.netBdgmNodeImgCd, source:data.source};
    			}

			}
		});


    }
});