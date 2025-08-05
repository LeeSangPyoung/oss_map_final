<!DOCTYPE html>
<%@ page pageEncoding="utf-8"%>
<html>
<head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />-->
    <title>유선 엔지니어링 맵</title>
    <%@include file="/WEB-INF/views/sub_common/Header.jsp"%>

    <script type="text/javascript">
/*         var engineJsUrl = GLOBAL_GIS_ENGINE_IP + "/mapgeo/build/mapgeo.js";
        var engineCssUrl = GLOBAL_GIS_ENGINE_IP + "/mapgeo/build/mapgeo.min.css";
        var mapGeoJS = '<script type="text/javascript" src=' + engineJsUrl + '>';
        var mapGeoCSS = '<link rel="stylesheet" href=' + engineCssUrl + '>';
        $('head').append(mapGeoJS);
        $('head').append(mapGeoCSS); */
    </script>

    <link rel="stylesheet" href="../../resources/css/engmap.css" type="text/css" media="screen" />


    <style>
        .menu_layer_tree .Checkbox {
            margin: 4px 0 2px 2px;
        }

        .alopexgrid .pager .page-button {
            display: inline-block;
            width: 22px;
            height: 23px;
            background:transparent; !important
        }

        /* map 표현 object와 겹치는 label text의 위치를 조정하기 위해서 추가 */
        .leaflet-text-icon{
          margin-top: 10px !important;
        }

        .alopex_overlay {
            opacity: 0 !important;
        }

        .alopexgrid-cell.bodycell.row-highlight-orange{
		    background-color : #F29661 !important;
		}

		.context-menu {
			position: absolute;
			display: none;
			z-index: 9999;
			background: white;
			border: 1px solid #ccc;
			padding: 5px;
			list-style: none;
			margin: 0;
			font-size: 14px;
			box-shadow: 0 2px 6px rgba(0,0,0,0.2);

		}

		.context-menu li {
			padding: 4px 10px;
			cursor: pointer;
			white-space: nowrap;
		}

		.context-menu li:hover{
			background-color: #eee;
		}

		.context-menu img {
			width: 16px;
			vertical-align: middle;
			margin-right: 6px;
		}

		.custom-zoomslider {
		    left: auto !important;
			position: absolute !important;
			top: 80px !important;
			right: 10px !important;
			width: 36px;
			background: white;
			border: 1px solid #999;
			border-radius: 4px;
			box-shadow: 0 0 4px rgba(0,0,0,0.3);
			z-index: 1000;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 4px;
		}

		.zoom-level-label {
			font-size: 13px;
			font-weight: bold;
			margin-bottom: 6px;
			color: #000;
		}

		.custom-zoomslider .custom-button {
			all:unset;
			width: 100%;
			height: 20px;
			font-size: 16px;
			cursor: pointer;
			background: #f0f0f0;
			border: 1px solid #ccc;
			border-radius:4px;
			text-align: center;
			line-height: 20px;
		}

		.custom-zoomslider .zoom-in-btn:hover,.custom-zoomslider .zoom-out-btn:hover {
			background: #ddd;
		}

		.custom-zoomslider .zoom-slider-container {
			width: 20px;
			height: 260px;
			position: relative;
			background: #e0e0e0;
			border: 1px solid #999;
			box-sizing: content-box;
			margin: 4px 0;
		}

		.custom-zoomslider .zoom-slider-bar {
			position: relative;
			width: 100%;
			height: 125px;
			overflow:hidden;
			background: #eee;
		}

		.custom-zoomslider .zoom-slider-enabled {
			position: absolute;
			bottom: 0;
			width: 100%;
			background: rgba(0,86,204,0.7);
			transition: height 0.1s ease;
		}

		.custom-zoomslider .zoom-slider-knob {
			position: absolute;
			left: -2px;
			width: 24px;
			height: 12px;
			background: #0057e7;
			border: 1px solid #333;
			border-radius: 2px;
			cursor: grab;
			z-index: 10;
			top:0;
			transform: translateY(-50%);
		}

		.map-tool-group {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 4px;
		}

		.tool-button-wrap {
			position: relative;
			margin: 4px 0;
		}

		.custom-zoomslider .tool-button {
			all:unset;
			width: 36px;
			height: 24px;
			font-size: 16px;
			cursor: pointer;
			background: #f0f0f0;
			border: 1px solid #ccc;
			border-radius:4px;
			text-align: center;
			line-height: 24px;
		}

		.tool-button img {
			width: 20px;
			height: 20px;
		}

		.tool-button-wrap.expandable {
			position: relative;
		}

		.tool-expand-panel {
			position: absolute;
			right: 100%;
			top: 0;
			background-color: white;
			box-shadow: 0 0 4px rgb(0,0,0,0,2);
			padding: 4px;
			border-radius: 4px;
			z-index: 1000;
			display: none;
		}

		.tool-button-wrap.open .tool-expand-panel {
			display: flex;
		}

		.tool-expand-panel .expand-btn {
			width: 60px;
			padding: 6px 8px;
			margin-bottom: 4px;
			font-size: 13px;
			white-space: nowrap;
			display:block;
		}

		.trail-label {
			background-color: white;
			border: 1px solid black;
			padding: 4px 6px;
			font-size: 12px;
			white-space: nowrap;
			border-radius: 4px;
			box-shadow: 0 0 3px rgba(0,0,0,0.3);
		}

		.trail-btn {
			width: 24px;
			height: 24px;
			background-size: 16px 16px;
			background-repeat: no-repeat;
			background-position: center;
			background-color: white;
			border: 1px solid #ccc;
			border-radius: 4px;
			cursor: pointer;
			box-shadow: 0 0 2px rgba(0,0,0,0.2);
		}

		.trail-action-box {
			display: flex;
			gap:4px;
			align-items: center;
		}

		.trail-close-btn {
			background-image: url('<%=request.getContextPath()%>/resources/images/titlebar_buttons_close.png');
		}

		.trail-restart-btn {
			background-image: url('<%=request.getContextPath()%>/resources/images/restart.png');
		}

		.ol-popup {
			position: absolute;
			background: white;
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 8px;
			box-shadow: 0 2px 12px rgba(0,0,0,0.3);
			max-width: 300px;
			min-width: 200px;
			z-index: 10000;
			transform: translate(-50%,-100%);
		}

		.ol-popup:after, ol-popup:before {
			content: "";
			position: absolute;
			bottom: -10px;
			left: 50%;
			margin-left: -8px;
			border-style: solid;
			border-width: 10px 8px 0;
			border-color: white transparent transparent transparent;
		}

		.ol-popup-closer {
			position: absolute;
			top: 6px;
			right: 8px;
			text-decoration: none;
			background: none;
			border: none;
			font-size: 18px;
			color: #888;
			cursor: pointer;
		}

		.ol-popup-closer:after {
			content: "x";
		}

		.ol-popup-closer:hover {
			color: #000;
		}


    </style>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/ol.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/ol-ext.min.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/turf.min.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/proj4.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/mapgeo2.src.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/Util.js?20240813"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/LayerTreeControl.js?20240911"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/NetworkLayerControl.js?20241015"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/ZoomControl.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/ExtnlCalnControl.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/MtsoInvtSlmtControl.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/TopologyMap.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath() %>/resources/js/constructprocess/common/TcpMessage.js"></script>
    <link rel="stylesheet" href="../../resources/css/engmap/index.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/ol.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/test/ol-ext.min.css" type="text/css" media="screen" />
</head>

<body>

    <div id="wrap">
    <input type="hidden" id="adtnAttrVal" name="adtnAttrVal" data-bind="value: adtnAttrVal" value="${userInfo.adtnAttrVal}">
        <!-- header -->
        <div id="header">
            <h1><a href="#"></a></h1>
            <h2 id="intgDsnTitle">유선 엔지니어링 맵</h2>
        </div>
        <!-- //header -->

        <!-- menu open -->
        <div id="pathTraceMenuBox" class="menu_box" style="width:224px;">
            <ul id="pathTraceMenu" class="menu_box_list">
<!--                 <li id="pathSimuIntg"><a href="#">국사투자 시뮬레이션</a></li> -->
                <li id="pathDsnRont"><a href="#">기간망 선번장</a></li>
                <li id="pathDsnMw"  ><a href="#">M/W 구간</a></li>
                <li id="pathMwLno"  ><a href="#">M/W 선번장</a></li>
                <li id="pathMwPktTrf"  ><a href="#">M/W 선번 트래픽</a></li>
                <li id="pathBckbnCoreTraffic"><a href="#">백본 CORE 대표 Traffic</a></li>
                <li id="pathBckbnUpfTraffic"><a href="#">백본  UPF Traffic</a></li>
<!--                <li id="pathSimuPtp"><a href="#">PTP 시뮬레이션</a></li>
                <li id="pathSimuFront"><a href="#">프론트홀 시뮬레이션</a></li>
                <li id="pathSimuBack"><a href="#">백홀 시뮬레이션</a></li>
                <li id="pathSimuRont"><a href="#">기간망 시뮬레이션</a></li>
                <li id="pathSimuMtso"><a href="#">국사 시뮬레이션</a></li> -->
            </ul>
        </div>
        <!--  //menu open -->

        <!-- container -->
        <div id="container">

            <!--Splitter-->
            <div id="splitter" class="splitter_panel">

                <!-- left_panel -->
                <div id="engmap_left_panel" class="left_panel" style="height:calc(100% - 45px); width:0px; background: #dce0e4; overflow:hidden" >
                    <div id="engmap_left_menu" class="left_menu menu_aside">
                        <a href="#" id="engmap_menu_btn" class="menu_btn">메뉴</a>
                        <ul>
                            <li class="left_list_01" id="leftBtnMapLayer"><a href="#">맵 레이어</a></li>
                            <li class="left_list_02" id="leftBtnNetworkLayer"><a href="#">망 레이어</a></li>
                            <li class="left_list_03" id="leftBtnNetworkTopo"><a href="#">망 구성도</a></li>
                            <li class="left_list_04" id="leftBtnConfig"><a href="#">구성정보</a></li>
                            <li class="left_list_05" id="leftBtnAround"><a href="#">주변정보</a></li>
                            <li class="left_list_06" id="leftBtnCoverage"><a href="#">커버리지</a></li>
                            <li class="left_list_07" id="leftBtnWreDsn"><a href="#">유선설계</a></li>
<%--                         <atho:btn btnAtho="${AUTH_INS}"> --%>
                            <li class="left_list_06" id="leftBtnMtsoInvt"><a href="#">국사설계</a></li>
<%--                         </atho:btn> --%>
                        </ul>
                    </div>

                    <!-- left-contents -->
                    <div id="engmap_left-contents" class="left-contents menu_layer">
                        <!-- 맵 레이어 -->
                        <div id="mapLayerTreeMenu" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>Map Layer</h3>
                            </div>
                            <div id="div_tree_layer" style="overflow: auto; height: 883px;"></div>
                        </div>

                        <!-- 망 레이어 -->
                        <div id="networkLayerTreeMenu" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>망 레이어</h3>
                            </div>
                            <div id="div_network_layer" style="overflow: auto; height: 883px;background-color: #fff"></div>
                        </div>

                        <!-- 구성정보 -->
                        <div id="configBox" class="menu_layer_item_configbox">
                            <div class="menu_layer_tit">
                                <h3>구성정보</h3>
                            </div>
                            <div id="div_configbox" style="overflow: auto;">
                                <span id="tab"></span>
                                <div class="Tabs tabs ltabs" id="leftTab">
                                    <ul>
                                        <li data-content="#tab-3" style="font-size: 13px">링 조회</li>
                                        <li data-content="#tab-4" style="font-size: 13px">회선 조회</li>
                                        <li data-content="#tab-5" style="font-size: 13px">국사 조회</li>
                                    </ul>
                                    <div class="Margin-top-5" id="tab-3">
                                        <form id="searchRingForm" name="searchRingForm">
                                            <input type="hidden" id="ringPageNo" name="pageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="ringRowPerPage" name="rowPerPage" data-bind="value: rowPerPage">
                                            <input type="hidden" id="firstRowIndex" name="firstRowIndex" data-bind="value: firstRowIndex">
                                            <input type="hidden" id="lastRowIndex" name="lastRowIndex" data-bind="value: lastRowIndex">
                                            <div class="condition_box">
                                                <div class="basic_condition">
                                                    <div class="condition">
                                                        <span class="Label label">망종류</span>
                                                        <div class="Divselect divselect">
                                                            <select id="topoSclCd" name="topoSclCd" data-bind-option="value:text"   data-bind="options:data, selectedOptions: topoSclCd" data-type="select"></select> <span></span>
                                                        </div>
                                                        <span class="Label label">망구분</span>
                                                        <div class="Divselect divselect">
                                                            <select id="ntwkTypCd" name="ntwkTypCd" data-bind-option="value:text" data-bind="options:data, selectedOptions: ntwkTypCd" data-type="select"></select> <span></span>
                                                        </div>
                                                    </div>

                                                    <div class="condition_ty2">
                                                        <label for=""> <span class="Label label">링이름</span>
                                                          <input type="text" name="ntwkLineNm" id="ntwkLineNm" data-bind="value: ntwkLineNm" class="textinput4">
                                                        </label>
                                                        <Button id="ringListSearBtn" class="Button button2">조회</Button>
                                                    </div>

                                                </div>
                                            </div>
                                            <div id="ringList">
                                                <div id="ringListGrid"></div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="Margin-top-5" id="tab-4">
                                        <form id="searchLineForm" name="searchLineForm">
                                            <input type="hidden" id="linePageNo"        name="pageNo"           data-bind="value: pageNo">
                                            <input type="hidden" id="lineRowPerPage"    name="rowPerPage"       data-bind="value: rowPerPage">
                                            <input type="hidden" id="lineFirstRowIndex" name="firstRowIndex"    data-bind="value: firstRowIndex">
                                            <input type="hidden" id="lineLastRowIndex"  name="lastRowIndex"     data-bind="value: lastRowIndex">
                                            <div class="condition_box">
                                                <div class="basic_condition">
                                                    <div class="condition">
                                                        <span class="Label label">회선대분류</span>
                                                        <div class="Divselect divselect">
                                                            <select id="svlnLclCd" name="svlnLclCd" data-bind-option="value:text"   data-bind="options:data, selectedOptions: svlnLclCd" data-type="select"></select> <span></span>
                                                        </div>
                                                        <span class="Label label">회선소분류</span>
                                                        <div class="Divselect divselect">
                                                            <select id="svlnSclCd" name="svlnSclCd" data-bind-option="value:text" data-bind="options:data, selectedOptions: svlnSclCd" data-type="select"></select> <span></span>
                                                        </div>
                                                    </div>

                                                    <div class="condition_ty2">
                                                        <label for=""> <span class="Label label">회선명</span>
                                                          <input type="text" name="svlnNm" id="svlnNm" data-bind="value: svlnNm" class="textinput4">
                                                        </label>
                                                        <Button id="lineListSearBtn" class="Button button2">조회</Button>
                                                    </div>

                                                </div>
                                            </div>
                                            <div id="lineList">
                                                <div id="lineListGrid"></div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="Margin-top-5" id="tab-5">
                                        <form id="searchMtsoForm" name="searchMtsoForm">
                                            <input type="hidden" id="mtsoPageNo" name="pageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="mtsoRowPerPage" name="rowPerPage" data-bind="value: rowPerPage">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition"><!-- 국사 관리그룹 -->
                                                        <span class="Label label"><spring:message code='label.managementGroup'/></span>
                                                        <div class="Divselect divselect">
                                                        <select id="mgmtGrpNm" name="mgmtGrpNm" data-bind-option="comCdNm:comCdNm" data-bind="options:data, selectedOptions: mgmtGrpNm" data-type="select"></select><span></span>
                                                        </div>
                                                        <span class="Label label">국사 유형</span>
                                                        <select class="Multiselect" name="mtsoTypCdList" id="mtsoTypCdList" data-bind="options:data, selectedOptions: mtsoTypCdList" data-bind-option="comCd:comCdNm" data-type="select" ></select>
                                                    </div>

                                                    <div class="condition_ty2">
                                                        <!-- 국사 상태 -->
                                                        <span class="Label label"><spring:message code='label.mobileTelephoneSwitchingOfficeStatus'/></span>
                                                        <div class="Divselect divselect">
                                                            <select id="mtsoStatCd" name="mtsoStatCd" data-bind-option="comCd:comCdNm" data-bind="options:data, selectedOptions: mtsoStatCd" data-type="select"></select> <span></span>
                                                        </div>
                                                        <label for="mtsoNm"> <!-- 국사명 -->
                                                        <span class="Label label"><spring:message code='label.mobileTelephoneSwitchingOfficeName' /></span>
                                                          <input type="text" name="mtsoNm" id="mtsoNm" data-bind="value: mtsoNm" class="textinput2">
                                                        </label>
                                                    </div>

                                                    <div class="condition_ty2">
                                                        <label for="bldAddr"> <!-- 주소 -->
                                                        <span class="Label label">주소</span>
                                                          <input type="text" name="bldAddr" id="bldAddr" data-bind="value: bldAddr" class="textinput3">
                                                          <Button id="mtsoListSearBtn" class="Button button2" >조회</Button>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="mtsoList">
                                                <div id="mtsoListGrid"></div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div style="visibility: hidden;" id="container"></div>
                            </div>
                        </div>

                        <!-- 주변정보 -->
                        <div id="AroundBox" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>주변정보</h3>
                            </div>

                            <div id="div_around_layer" style="overflow: auto; height: 883px;">
                                <span id="tab"></span>
                                <div class="Tabs tabs ltabs" id="leftTab1">
                                    <ul>
                                        <li data-content="#tab-1" style="font-size: 13px">주변 국사 및 장비</li>
                                        <li data-content="#tab-2" style="font-size: 13px">주변 링</li>
                                    </ul>
                                    <div class="Margin-top-5" id="tab-1">
                                        <form id="orgSearchmtsoNmForm" name="orgSearchmtsoNmForm">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition">
                                                        <span class="Label label"><spring:message code='label.managementGroup'/></span>
                                                        <div class="Divselect divselect">
                                                        <select id="mgmtGrpNm1" name="mgmtGrpNm1" data-bind-option="comCdNm:comCdNm" data-bind="options:data, selectedOptions: mgmtGrpNm" data-type="select"></select><span></span>
                                                        </div>
                                                        <span class="Label label">국사 유형</span>
                                                        <select class="Multiselect" name="mtsoTypCdList1" id="mtsoTypCdList1" data-bind="options:data, selectedOptions: mtsoTypCdList" data-bind-option="comCd:comCdNm" data-type="select" ></select>
                                                    </div>
                                                    <div class="condition_ty2">
                                                        <span class="Label label">장비 타입</span>
                                                        <select class="Multiselect" name="eqpRoleDivCdList1" id="eqpRoleDivCdList1" data-bind="options:data, selectedOptions: eqpRoleDivCdList" data-bind-option="comCd:comCdNm" data-type="select">
                                                        </select>
                                                        <Button id="tab-1MtsoSearchBtn" class="Button button2" >조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="orgList">
                                                <div id="orgListGrid"></div>
                                            </div>
                                            <div id="eqpList">
                                                <div id="eqpListGrid"></div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="Margin-top-5" id="tab-2">
                                        <form id="orgsearchRingForm" name="orgsearchRingsetRingListGridForm">
                                            <div class="condition_box">
                                                <div class="basic_condition">
                                                    <div class="condition">
                                                        <span class="Label label">망종류</span>
                                                        <select class="Multiselect" name="topoSclCdList" id="topoSclCdList" data-bind="options:data, selectedOptions: topoSclCdList" data-bind-option="topoSclCd:topoSclNm" data-type="select"></select>
                                                    </div>
                                                    <div class="condition_ty2">
                                                        <span class="Label label">망구분</span>
                                                        <select class="Multiselect" name="ntwkTypCdList" id="ntwkTypCdList" data-bind="options:data, selectedOptions: ntwkTypCdList" data-bind-option="ntwkTypCd:ntwkTypNm" data-type="select"></select>
                                                    <Button id="tab-2RingSearchBtn" class="Button button2">조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="rangeRing">
                                                <div id="rangeRingGrid"></div>
                                            </div>

                                            <div id="ringEqp">
                                                <span class="Label label">FDF 여부</span>
                                                <label class="ImageRadio_imageRadio2">
                                                    <input type="radio" name="searchFDFYN" id="searchFDFYN" class="Radio" value="y">
                                                    <span class="Label label">제외</span>
                                                </label>
                                                <label class="ImageRadio_imageRadio2">
                                                    <input type="radio" name="searchFDFYN"  class="Radio" value="" checked>
                                                    <span class="Label label">포함</span>
                                                </label>
                                            </div>
                                            <div id="ringEqpListGrid"></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 커버리지 -->
                        <div id="CoverageBox" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>커버리지</h3>
                            </div>
                            <div id="div_coverage_layer" style="overflow: auto; height: 883px;">
                                <div id="menuContainer2">
                                    <span id="tab2"></span>
                                    <div style="visibility: hidden;" id="container2"></div>
                                    <div class="Tabs tabs" id="rightTab1">
                                        <ul>
                                            <li data-content="#tab-6" style="font-size: 13px">커버리지 설계</li>
                                            <li data-content="#tab-7" style="font-size: 13px">커버리지 조회</li>
                                            <li data-content="#tab-8" style="font-size: 13px">커버리지 통계</li>
                                        </ul>
                                        <div class="Margin-top-5" id="tab-6">
                                            <form id="searchCovDsnForm" name="searchCovDsnForm">
                                            <input type="hidden" id="userId" name="userId" value="${userInfo.userId}">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                	<div class="condition">
                                                        <span class="Label label" style="width:85px">전송실</span>
                                                        <select class="Multiselect" name="tmofList5" id="tmofList5" data-bind="options:data, selectedOptions: tmofList5" data-bind-option="mtsoId:mtsoNm" data-type="select">
                                                        </select>
                                                        <span class="Label label" style="width:75px">국사명</span>
                                                        <input type="text" name="mtsoNm5" id="mtsoNm5" data-bind="value: mtsoNm" class="Textinput textinput w150">
                                                    </div>
                                                    <div class="condition_ty2">
                                                        <span class="Label label" style="width:85px">커버리지명</span>
                                                        <input type="text" name="coverrageTerrNm5" id="coverrageTerrNm5" data-bind="value: coverrageTerrNm" class="Textinput textinput" style="width:179px">
                                                        <span class="Label label" style="width:75px">주소</span>
                                                        <input type="text" name="bldAddr5" id="bldAddr5" data-bind="value: bldAddr" class="Textinput textinput w150">
                                                        <Button id="searchBtn5" class="Button button2" >조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="covDsnList">
                                                <div id="covDsnListGrid"></div>
                                            </div>
                                            </form>
                                            <div class="button_box" style="padding: 5px 0">
                                                <button type="button" id="btnCovReg" class="Button button bg_blue">등록</button>
                                                <button type="button" id="btnCovMod" class="Button button bg_blue">수정</button>
                                                <button type="button" id="btnNodeMod" class="Button button bg_blue">노드편집</button>
                                                <button type="button" id="btnNodeModCancel" class="Button button bg_blue" style="display:none">편집취소</button>
                                                <button type="button" id="btnNodeSave" class="Button button bg_blue">노드저장</button>
                                            </div>
                                        </div>
                                        <div class="Margin-top-5" id="tab-7">
                                            <form id="searchCovForm" name="searchCovForm">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                <div class="condition">
                                                        <span class="Label label" style="width:75px">전송실</span>
                                                        <select class="Multiselect" name="tmofList6" id="tmofList6" data-bind="options:data, selectedOptions: tmofList6" data-bind-option="mtsoId:mtsoNm" data-type="select" style="width:130px;">
                                                        </select>
                                                        <span class="Label label" style="width:75px">국사명</span>
                                                        <input type="text" name="mtsoNm6" id="mtsoNm6" data-bind="value: mtsoNm" class="Textinput textinput w150">
                                                    </div>

                                                    <div class="condition_ty2">
                                                        <span class="Label label" style="width:75px">서비스</span>
                                                        <select class="Multiselect" name="coverageTypList6" id="coverageTypList6" data-bind="options:data, selectedOptions: coverageTypList6" data-bind-option="comCd:comNm" data-type="select" style="width:130px;">
                                                        </select>
                                                        <span class="Label label" style="width:75px">주소</span>
                                                        <input type="text" name="bldAddr6" id="bldAddr6" data-bind="value: bldAddr" class="Textinput textinput w150" >
                                                        <Button id="searchBtn6" class="Button button2" >조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="covList">
                                                <div id="covListGrid"></div>
                                            </div>
                                            </form>
                                            <div class="button_box" style="padding: 5px 0">
                                                <button type="button" id="btnCovCopy" class="Button button bg_blue">설계복사</button>
                                            </div>
                                        </div>
                                        <div class="Margin-top-5" id="tab-8">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                   <div class="condition">
                                                        <span class="Label label" style="width:135px">커버리지 설계명</span>
                                                        <input type="text" name="coverageTerrNm7" id="coverageTerrNm7" data-bind="value: coverageTerrNm7" class="Textinput textinput w330">
                                                        <button id="btnExportExcel" type="button" class="Button button2 color_green"><span class="ico ico_down_green"></span><spring:message code='label.engExcel'/></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>

                                            </div>
                                            <div id="covStatistics" style="overflow-y: scroll;max-height: 728px;">
                                                <table style="width:100%;">
                                                    <colgroup>
                                                        <col style="width:100%;" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr><td>
                                                        <div class="header_box">
                                                            <h1 class="Header-1 header-1"><span class="ico ico_title"></span><b>T망 장비</b></h1>
                                                        </div>
                                                        <table class="Table table Form-type" style="min-width: 95%" id="tT">
                                                        <colgroup>
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                        </colgroup>
                                                        <tbody>
                                                        <tr><th scope="col" ><label class="Lable detail_label">IVC/IVR/IVRR</label></th>
                                                            <td><input id="ivsCnt" name="ivsCnt" data-bind="value: ivsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">IBC/IBR/IBRR</label></th>
                                                            <td><input id="ibsCnt" name="ibsCnt" data-bind="value: ibsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">L2/L3 S/W</label></th>
                                                            <td><input id="l2swCnt" name="l2swCnt" data-bind="value: l2swCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">ROADM/OTN</label></th>
                                                            <td><input id="rotnCnt" name="rotnCnt" data-bind="value: rotnCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">5G-PON/SMUX</label></th>
                                                            <td><input id="fiveCnt" name="fiveCnt" data-bind="value: fiveCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">RING-MUX</label></th>
                                                            <td><input id="rmuxCnt" name="rmuxCnt" data-bind="value: rmuxCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">PTS</label></th>
                                                            <td><input id="ptsCnt" name="ptsCnt" data-bind="value: ptsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">DWDM/CWDM</label></th>
                                                            <td><input id="fmCnt" name="fmCnt" data-bind="value: fmCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">광장비</label></th>
                                                            <td><input id="flCnt" name="flCnt" data-bind="value: flCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">기타</label></th>
                                                            <td colspan="5"><input id="etcCnt" name="etcCnt" data-bind="value: etcCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        </tbody>
                                                        </table>
                                                    </td></tr>
                                                    </tbody>
                                                </table>

                                                <table style="width:100%;">
                                                    <colgroup>
                                                        <col style="width:100%;" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                        <div class="header_box">
                                                            <h1 class="Header-1 header-1"><span class="ico ico_title"></span><b>A망 장비</b></h1>
                                                        </div>
                                                        <table class="Table table Form-type" style="min-width: 95%" id="tA">
                                                        <colgroup>
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                        </colgroup>
                                                        <tbody>
                                                        <tr><th scope="col" ><label class="Lable detail_label">5G DU-H</label></th>
                                                            <td><input id="duhCnt" name="duhCnt" data-bind="value: duhCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">LTE DU</label></th>
                                                            <td><input id="lteduCnt" name="lteduCnt" data-bind="value: lteduCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">기지국</label></th>
                                                            <td><input id="nodebCnt" name="nodebCnt" data-bind="value: nodebCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">5G DU-L</label></th>
                                                            <td><input id="dulCnt" name="dulCnt" data-bind="value: dulCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">LTE RU</label></th>
                                                            <td><input id="lteruCnt" name="lteruCnt" data-bind="value: lteruCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">광중계기</label></th>
                                                            <td><input id="octicCnt" name="octicCnt" data-bind="value: octicCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">AMHS</label></th>
                                                            <td>-<input id="amhsCnt" name="amhsCnt" data-bind="value: amhsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">IMHS</label></th>
                                                            <td>-<input id="imhsCnt" name="imhsCnt" data-bind="value: imhsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">QMHS</label></th>
                                                            <td>-<input id="qmhsCnt" name="qmhsCnt" data-bind="value: qmhsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">SMHS</label></th>
                                                            <td>-<input id="smhsCnt" name="smhsCnt" data-bind="value: smhsCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">LEGACY</label></th>
                                                            <td>-<input id="legacyCnt" name="legacyCnt" data-bind="value: legacyCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">L9TU</label></th>
                                                            <td><input id="l9tuCnt" name="l9tuCnt" data-bind="value: l9tuCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">W-RU</label></th>
                                                            <td><input id="wruCnt" name="wruCnt" data-bind="value: wruCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">MiBOS</label></th>
                                                            <td><input id="mibosCnt" name="mibosCnt" data-bind="value: mibosCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">RF중계기</label></th>
                                                            <td><input id="rfruCnt" name="rfruCnt" data-bind="value: rfruCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        </tbody>
                                                        </table>
                                                        </td></tr>
                                                    </tbody>
                                                </table>

                                                <table style="width:100%;">
                                                    <colgroup>
                                                        <col style="width:100%;" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr><td>
                                                        <div class="header_box">
                                                            <h1 class="Header-1 header-1"><span class="ico ico_title"></span><b>회선/링</b></h1>
                                                        </div>
                                                        <table class="Table table Form-type" style="min-width: 95%" id="tLn">
                                                        <colgroup>
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                        </colgroup>
                                                        <tbody>
                                                        <tr><th scope="col" colspan="6"><label class="Lable detail_label">■ 서비스회선</label></th></tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">기지국</label></th>
                                                            <td><input id="s001Cnt" name="s001Cnt" data-bind="value: s001Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">RU</label></th>
                                                            <td><input id="s003Cnt" name="s003Cnt" data-bind="value: s003Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">가입자망</label></th>
                                                            <td><input id="s004Cnt" name="s004Cnt" data-bind="value: s004Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">B2B</label></th>
                                                            <td><input id="s005Cnt" name="s005Cnt" data-bind="value: s005Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">기타</label></th>
                                                            <td><input id="s006Cnt" name="s006Cnt" data-bind="value: s006Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">미지정</label></th>
                                                            <td><input id="setcCnt" name="setcCnt" data-bind="value: setcCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>

                                                        <tr><th scope="col" colspan="6"><label class="Lable detail_label">■ 링</label></th></tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">기간망</label></th>
                                                            <td><input id="r001Cnt" name="r001Cnt" data-bind="value: r001Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">중심국</label></th>
                                                            <td><input id="r002Cnt" name="r002Cnt" data-bind="value: r002Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">가입자망</label></th>
                                                            <td><input id="r004Cnt" name="r004Cnt" data-bind="value: r004Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">상호접속</label></th>
                                                            <td><input id="r005Cnt" name="r005Cnt" data-bind="value: r005Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">B2B</label></th>
                                                            <td><input id="r015Cnt" name="r015Cnt" data-bind="value: r015Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">국사내부</label></th>
                                                            <td><input id="r016Cnt" name="r016Cnt" data-bind="value: r016Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">기지국</label></th>
                                                            <td><input id="r003Cnt" name="r003Cnt" data-bind="value: r003Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">중계기</label></th>
                                                            <td><input id="r007Cnt" name="r007Cnt" data-bind="value: r007Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">FTTx/HFC</label></th>
                                                            <td><input id="r011Cnt" name="r011Cnt" data-bind="value: r011Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">기타</label></th>
                                                            <td colspan="5"><input id="retcCnt" name="retcCnt" data-bind="value: retcCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>

                                                        <tr><th scope="col" colspan="6"><label class="Lable detail_label">■ 트렁크</label></th></tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">기간망</label></th>
                                                            <td><input id="t001Cnt" name="t001Cnt" data-bind="value: t001Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">WDM</label></th>
                                                            <td colspan="3"><input id="t002Cnt" name="t002Cnt" data-bind="value: t002Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <!-- <th scope="col" ><label class="Lable detail_label">패킷</label></th>
                                                            <td><input id="t003Cnt" name="t003Cnt" data-bind="value: t003Cnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td> -->
                                                        </tr>
                                                        </tbody>
                                                        </table>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <table style="width:100%;">
                                                    <colgroup>
                                                        <col style="width:100%;" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                        <div class="header_box">
                                                            <h1 class="Header-1 header-1"><span class="ico ico_title"></span><b>선로</b></h1>
                                                        </div>
                                                        <table class="Table table Form-type" style="min-width: 95%" id="tLnn">
                                                            <colgroup>
                                                                <col style="width:110px">
                                                                <col />
                                                                <col style="width:110px">
                                                                <col />
                                                                <col style="width:110px">
                                                                <col />
                                                            </colgroup>
                                                            <tbody>
                                                                <tr><th scope="col" ><label class="Lable detail_label">FDF</label></th>
                                                                    <td><input id="fdfCnt" name="fdfCnt" data-bind="value: fdfCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                                    <th scope="col" ><label class="Lable detail_label">랙</label></th>
                                                                    <td><input id="rackCnt" name="rackCnt" data-bind="value: rackCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                                    <th scope="col" ><label class="Lable detail_label">쉘프</label></th>
                                                                    <td><input id="shlfCnt" name="shlfCnt" data-bind="value: shlfCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="col" ><label class="Lable detail_label">케이블</label></th>
                                                                    <td><input id="cblCnt" name="cblCnt" data-bind="value: cblCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                                    <th scope="col" ><label class="Lable detail_label">코어</label></th>
                                                                    <td colspan="3"><input id="coreCnt" name="coreCnt" data-bind="value: coreCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <table style="width:100%;">
                                                    <colgroup>
                                                        <col style="width:100%;" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                        <div class="header_box">
                                                            <h1 class="Header-1 header-1"><span class="ico ico_title"></span><b>부대장비</b></h1>
                                                        </div>
                                                        <table class="Table table Form-type" style="min-width: 95%" id="tS">
                                                        <colgroup>
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                            <col style="width:110px">
                                                            <col />
                                                        </colgroup>
                                                        <tbody>
                                                        <tr><th scope="col" ><label class="Lable detail_label">정류기</label></th>
                                                            <td><input id="rCnt" name="rCnt" data-bind="value: rCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">축전지</label></th>
                                                            <td><input id="bCnt" name="bCnt" data-bind="value: bCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">냉방기</label></th>
                                                            <td><input id="aCnt" name="aCnt" data-bind="value: aCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">소화설비</label></th>
                                                            <td><input id="fCnt" name="fCnt" data-bind="value: fCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">분전반</label></th>
                                                            <td><input id="lCnt" name="lCnt" data-bind="value: lCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">발전기</label></th>
                                                            <td><input id="nCnt" name="nCnt" data-bind="value: nCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr><th scope="col" ><label class="Lable detail_label">IPD</label></th>
                                                            <td><input id="pCnt" name="pCnt" data-bind="value: pCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">계량기</label></th>
                                                            <td><input id="gCnt" name="gCnt" data-bind="value: gCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">배풍기</label></th>
                                                            <td><input id="sCnt" name="sCnt" data-bind="value: sCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" ><label class="Lable detail_label">컨버터</label></th>
                                                            <td><input id="cCnt" name="cCnt" data-bind="value: cCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">인버터</label></th>
                                                            <td><input id="iCnt" name="iCnt" data-bind="value: iCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                            <th scope="col" ><label class="Lable detail_label">기타</label></th>
                                                            <td><input id="eCnt" name="eCnt" data-bind="value: eCnt" style="width:60px;background-color:transparent;border:0 solid black;text-align: center;"  type="text" readonly/></td>
                                                        </tr>
                                                        </tbody>
                                                        </table>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div class="header_box">
                                                    <h1 class="Header-1 header-1" style="margin-left:3px"><span class="ico ico_title"></span><b>국사</b></h1>
                                                </div>
                                                <div class="Margin-top-5" id="covMtsoGrid">#grid : 국사</div>


                                                <div id='floorInf'>
                                                    <div class="header_box Margin-top-5">
                                                    <h1 class="Header-1 header-1" style="margin-left:3px"><span class="ico ico_title"></span><b><input id ="covMtsoNm7" data-bind="value: covMtsoNm7" style="border:0;font-weight:bold;font-size:17px;background-color: transparent;" type="text" readonly></b></h1>
                                                    </div>
                                                    <div class="Margin-top-5" id="covMtsoFloorGrid">#grid : 상면리스트</div>
                                                    <div class="Margin-top-5">■ 상면사용률 : 랙수의 합 / CELL수의 합 * 100 <br>■ 랙 사용률 : (실장장비 Unit 수의 합) / (랙 Unit 수의 합 - 실장 불가 Unit 수의 합) * 100</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>


                        <!-- 유선망 통합설계 -->
                        <div id="wreDsnBox" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>유선설계</h3>
                            </div>
                            <div id="div_wreDsnBox" style="height: 883px;">
                                <span id="tab"></span>
                                <div class="Tabs tabs ltabs" id="leftTab2">
                                    <ul>
                                        <li data-content="#tab-9" style="font-size: 13px">수요검토</li>
                                        <li data-content="#tab-10" style="font-size: 13px">설계결과</li>
                                    </ul>
                                    <div class="Margin-top-5" id="tab-9">
                                        <form id="searchWreDsnForm" name="searchWreDsnForm">
                                            <input type="hidden" id="wreDsnPageNo" name="pageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="wreDsnRowPerPage" name="rowPerPage" data-bind="value: rowPerPage">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition">
                                                        <span class="Label label">AFE 차수</span>
                                                        <select class="Select" id="afeYr1" name="afeYr1" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeYr" style="width:90px"></select>
                                                            <span></span>
                                                        <select class="Select" id="afeDemdDgr1" name="afeDemdDgr1" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeDemdDgr" style="width:90px"></select>
                                                            <span></span>
                                                        <span class="Label label">설계대상</span>
                                                        <div class="Divselect divselect" style="width: 100px;max-width: 100px">
                                                            <select class="Select" id="eqpDivCd1" name="eqpDivCd1" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:eqpDivCd" ></select>
                                                            <span></span>
                                                        </div>
                                                        <Button id="searchBtn9" class="Button button2">조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="wreDsnList">
                                                <div id="wreDsnListGrid"></div>
                                            </div>
                                        </form>
                                    </div>

                                    <div class="Margin-top-5" id="tab-10">
                                        <form id="searchWreDsnRsltForm" name="searchWreDsnRsltForm">
                                        	<input type="hidden" id="userId" name="userId" value="${userInfo.userId}">
                                            <input type="hidden" id="wreDsnRsltPageNo" name="pageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="wreDsnRsltRowPerPage" name="rowPerPage" data-bind="value: rowPerPage">
                                            <input type="hidden" id="wreDsnRsltRouteanPageNo" name="pageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="wreDsnRsltRouteanRowPerPage" name="rowPerPage" data-bind="value: rowPerPage">
                                            <input type="hidden" id="endObjMgmtNo" name="endObjMgmtNo" data-bind="value: endObjMgmtNo">
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition">
                                                        <span class="Label label">AFE 차수</span>
                                                        <select class="Select" id="afeYr2" name="afeYr2" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeYr" style="width:90px"></select>
                                                            <span></span>
                                                        <select class="Select" id="afeDemdDgr2" name="afeDemdDgr2" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeDemdDgr" style="width:90px"></select>
                                                            <span></span>
                                                        <span class="Label label">설계대상</span>
                                                        <div class="Divselect divselect" style="width: 100px;max-width: 100px">
                                                            <select class="Select" id="eqpDivCd2" name="eqpDivCd2" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:eqpDivCd" ></select>
                                                            <span></span>
                                                        </div>
                                                        <Button id="searchBtn10" class="Button button2">조회</Button>
                                                    </div>
                                                    <div class="condition_ty2" style="position: relative; align-items:center;">
                                                        <span class="Label label" style="width:75px;">작업자</span>
                                                        <input type="text" name="rsltUserNm" id="rsltUserNm" data-bind="value: rsltUserNm" class="Textinput textinput w130">
                                                        <span class="Label label" style="padding-left:61px;">내 설계결과 보기</span>
                                           				<input type="checkbox" name="selfChk" id="selfChk" class="Checkbox" value="Y">
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="wreDsnRsltList">
                                                <div id="wreDsnRsltListGrid"></div>
                                            </div>
											<%= "<br>" %>
                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition">
                                                        <span class="Label label">상위국</span>
                                                        <input type="text" name="wreDsnUprMtsoIdNm" id="wreDsnUprMtsoIdNm" data-bind="value: wreDsnUprMtsoIdNm" class="Textinput textinput w130">
                                                        <span class="Label label" style="margin-left: 50px;">하위국</span>
                                                        <input type="text" name="wreDsnLowMtsoIdNm" id="wreDsnLowMtsoIdNm" data-bind="value: wreDsnLowMtsoIdNm" class="Textinput textinput w130">
                                                        <Button id="searchBtn12" class="Button button2">조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="routeanInqList">
                                                <div id="routeanInqListGrid"></div>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                                <div style="visibility: hidden;" id="container"></div>
                            </div>
                        </div>

                        <!-- 국사설계 -->
                        <div id="mtsoInvtBox" class="menu_layer_item">
                            <div class="menu_layer_tit">
                                <h3>국사투자 시뮬레이션</h3>
                            </div>
                            <div id="div_mtsodsn_layer" style="overflow: auto; height: 883px;">
                                <div id="menuContainer2">
                                    <span id="tab2"></span>
                                    <div style="visibility: hidden;" id="container2"></div>
                                    <div class="Tabs tabs" id="leftTab2">
<!--                                         <ul>
                                            <li data-content="#tab-11" style="font-size: 13px">국사투자 설계</li>
                                        </ul> -->
                                        <div class="Margin-top-5" id="tab-11">
                                            <form id="searchMtsoInvtSmltForm" name="searchMtsoInvtSmltForm">
                                            <input type="hidden" id="userId" name="userId" value="${userInfo.userId}">
                                            <input type="hidden" id="mtsoSmltInfPageNo" name="mtsoSmltInfPageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="mtsoSmltInfRowPerPage" name="mtsoSmltInfRowPerPage" data-bind="value: rowPerPage">
                                            <input type="hidden" id="mtsoSmltBasPageNo" name="mtsoSmltBasPageNo" data-bind="value: pageNo">
                                            <input type="hidden" id="mtsoSmltBasRowPerPage" name="mtsoSmltBasRowPerPage" data-bind="value: rowPerPage">

                                            <div class="condition_box">
                                                <div class="basic_condition" style="padding-right:0px;">
                                                    <div class="condition">
                                                        <span class="Label label" style="padding-right: 32px;">AFE 차수</span>
                                                        <select class="Select" id="afeYr11" name="afeYr11" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeYr" style="width:90px"></select>
                                                        <span></span>
                                                        <select class="Select" id="afeDemdDgr11" name="afeDemdDgr11" data-bind-option="cd:cdNm" data-bind="options:data, selectedOptions:afeDemdDgr" style="width:90px"></select>
                                                        <span></span>
                                                        <span class="Label label" style="width:115px; padding-left: 40px;">전송실</span>
                                                        <select class="Multiselect" name="tmofList11" id="tmofList11" data-bind="options:data, selectedOptions: tmofList" data-bind-option="mtsoId: mtsoNm" data-type="select">
                                                        </select>

                                                    </div>
                                                    <div class="condition_ty2">
                                                        <span class="Label label" style="width:95px">시뮬레이션명</span>
                                                        <input type="text" name="mtsoInvtSmltNm11" id="mtsoInvtSmltNm11" data-bind="value: mtsoInvtSmltNm" class="Textinput textinput" style="width:210px">
                                                        <span class="Label label" style="width:75px">작업자</span>
                                                        <input type="text" name="lastChgUserNm11" id="lastChgUserNm11" data-bind="value: lastChgUserNm" class="Textinput textinput w180_2">
                                                        <Button id="searchBtn11" class="Button button2" >조회</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="mtsoInvtList">
                                                <div id="mtsoInvtSmltInfGrid"></div>
                                            </div>
                                            <div class="button_box" style="padding: 5px 0">
                                                <button type="button" id="btnMtsoInvtReg" class="Button button bg_blue">등록</button>
                                                <button type="button" id="btnMtsoInvtMod" class="Button button bg_blue">수정</button>
                                                <!-- button type="button" id="btnMtsoInvtSort" class="Button button bg_blue">노드정렬</button -->
                                            </div>
                                            <div id="mtsoInvtSmltList">
                                                <div id="mtsoInvtSmltBasGrid"></div>
                                            </div>
                                            </form>
                                            <div class="button_box" style="padding: 5px 0">
                                                <button type="button" id="btnMtsoInvtIntgMod" class="Button button bg_blue">통합국수정</button>
                                                <button type="button" id="btnMtsoInvtSmlt" class="Button button bg_lightpurple">시뮬레이션</button>
                                                <button type="button" id="btnMtsoInvtNodeMod" class="Button button bg_blue">노드편집</button>
                                                <button type="button" id="btnMtsoInvtNodeModCancel" class="Button button bg_blue" style="display:none">편집취소</button>
                                                <button type="button" id="btnMtsoInvtNodeSave" class="Button button bg_blue">노드저장</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- //left-contents -->

                </div>
                <!-- //left_panel -->

                <!-- right_panel -->
                <div class="right_panel" style="width: 1857px;">
                    <button id="left-menu_btn" class="Button left-footer__open" style="position:absolute; left:0; top:50%; margin-top:-25px;  z-index: 500;">닫기
                    </button>
                    <!--//right-contents-->
                    <div class="right-contents">
                        <!-- right_header-->
                        <div id="right_header">
                            <div id="dsgmenu02" style="display:flex;align-items:center">
								<ul style="position:absolute">
<!--                                <li id="mapZoomOut" class="new_facility_btn dsgmenu02_list_03"><a href="#none"></a>
                                        <p class="tooltip" style="position:absolute; top:46px;"><span class="ico"></span>영역축소</p>
                                    </li>
                                	<li id="mapZoomIn" class="new_facility_btn dsgmenu02_list_02"><a href="#none"></a>
                                        <p class="tooltip" style="position:absolute; top:46px;"><span class="ico"></span>영역확대</p>
                                    </li>
-->
                                    <li id="wreLnFcltsCurst" class="new_facility_btn" style="float:right; margin-top: 4px; margin-right:5px;" >
                                        <button type="button" id="wreLnFcltsCurstBtn" title="[현황] 유선 선로 시설현황 - CogentA (skbroadband.com)" class="button_grey active_btn" style="line-height: 18px; padding: 4px 10px 4px 10px;">유선선로시설현황(LDAS)</button>
                                    </li>
                                    <!-- <li id="liCircleRangeAply" class="new_facility_btn" style="float:right; margin-top: 4px; margin-right:5px;" >
                                        <button type="button" id="circleRangeAply" class="button_big active_btn" style="line-height: 18px;padding: 4px 10px 4px 10px;">적용</button>
                                    </li> -->
                                    <!-- <li id="liCircleRange" class="new_facility_btn" style="float:right; margin-top: 4px; margin-left:20px; margin-right:5px;">
                                        <span id="spanCircleRangeInput" style="display: flex;">
                                            <label style="vertical-align: middle; vertical-align: middle; font-family: '돋움',Dotum,AppleGothic,sans-serif; font-size: 12px; font-weight:bold; color: #fff; margin-right: 10px;margin-top:8px" for="반경거리">반경거리</label>
                                            <input class="Textinput textinput w50" id="circleRange" name="circleRange" type="Number" value="0" style="width:70px;text-align:right;">
                                        </span>
                                    </li> -->

                                    <li id="liExmaple" class="new_facility_btn" style="float:right; display:none; margin-top: 4px;" >
                                        <button type="button" id="btnExample" class="button_grey active_btn" style="line-height: 18px;padding: 4px 10px 4px 10px;">범례</button>
                                        <ul id="buttonExampleListByNetowkrLayer" class="Dropdown" style="display:none; position: absolute; left: calc(100%-100)px;">
                                        </ul>
                                    </li>
                                    <!-- <li id="liEqpRoldDiveCd" class="new_facility_btn" style="float:right; margin-top: 6px; margin-left:20px; margin-right:5px; display:none;">
                                        <span id="spanEqpRoleDivCdList" style="display: flex;">
                                            <label style="vertical-align: middle; vertical-align: middle; font-family: '돋움',Dotum,AppleGothic,sans-serif; font-size: 12px; font-weight:bold; color: #fff; margin-right: 10px;margin-top:8px" for="장비타입">장비타입</label>
                                            <select class="Multiselect" name="eqpRoleDivCdListByNetowkrLayer" id="eqpRoleDivCdListByNetowkrLayer" data-bind="options:data, selectedOptions: " data-bind-option="comCd:comCdNm" data-type="select"></select>
                                        </span>
                                    </li> -->
                                </ul>
                            </div>
                        </div>
                        <!-- //right_header-->

                        <!-- map -->
                        <div id="engMap" style="z-index:1" tabindex="0">
                        	<ul id="map-contextmenu" class="context-menu"></ul>
                        </div>
						<!-- 팝업 전체 -->
						<div id="popup" class="ol-popup">
							<a href="#" id="popup-closer" class="ol-popup-closer"></a>
							<div id="popup-content"></div>
						</div>
                        <!-- //map -->

                    </div>
                    <!--//right-contents-->

                </div>
                <!--//right_panel-->

            </div>
            <!--//Splitter-->

        </div>
        <!--//container-->

    </div>
    <!--//wrap-->

    <%@include file="/WEB-INF/views/configmgmt/ConfigMsgArray.jsp"%>
    <%@include file="/WEB-INF/views/sub_common/Footer.jsp"%>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/constructprocess/common/TcpMessage.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/constructprocess/common/TcpCommon.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/trafficintg/engineeringmap/EngMap.js?20241022"></script>
    <script type="text/javascript">
        $(function() {
            LayerTreeControl.initialize();
            NetworkLayerControl.initialize();
            ZoomControl.initialize();
            ExtnlCalnControl.initialize();
            MtsoInvtSlmtControl.initialize();
        });
    </script>
    <iframe name="downloadIframe" style="display:none"></iframe>
</body>
</html>