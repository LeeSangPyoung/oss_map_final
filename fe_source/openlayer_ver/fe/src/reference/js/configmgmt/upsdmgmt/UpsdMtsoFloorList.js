/**
 * UpsdMtsoFloorList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var floor = $a.page(function() {

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'floorData';
	var paramData = null;
	this.init = function(id, param) {
		paramData = param;
		initGrid();
		setEventListener();
		floor.setGrid(param);
	};

	function initGrid() {
		$('#'+gridId).alopexGrid({
			width : 'parent',
			height : 600,
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : false,
			paging : {
				pagerTotal: false,
			},
			rowSelectOption : {
				clickSelect : true,
				singleSelect : true,
				disableSelectByKey : true
			},
			defaultColumnMapping : {
				resizing : true,
			},
			columnMapping : [
				{
					align : 'center',
					width : 30,
					numberingColumn : true
				}, {
					key : 'floorId', align : 'center',
					title : 'ID층',
					width : '100',
					inlineStyle : {
						cursor:'pointer'
					}
				}, {
					key : 'sisulCd', align : 'center',
					title : '국사코드',
					width : '130',
					inlineStyle : {
						cursor:'pointer'
					}
				}, {
					key : 'floorNameNm', align : 'center',
					title : '층구분',
					width : '100'
				}, {
					key : 'floorLabel', align : 'center',
					title : '라벨명',
					width : '130'
				}, {
					key : 'affairNm', align : 'center',
					title : '용도구분',
					width : '100'
				}, {
					key : 'assetNm', align : 'center',
					title : '자산구분',
					width : '100'
				}, {
					align : 'center',
					title : '도면',
					width : '80',
					render : function(value, data, render, mapping){
						return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnDraw" type="button"></button></div>';
					}
				}, {
					align : 'center',
					title : '공간정보',
					width : '80'
				}, {
					key: 'attfileId',
					align : 'center',
					title : '첨부파일',
					width : '80',
					render : function(value, data, render, mapping){
						if(value != null){
							return '<button class="Valign-md" id="fileDownBtn" type="button" style="cursor: pointer"><span class="icoonly ico_attachment"></span></button>';
						}
					},
					tooltip : function(value, data, render, mapping){
						return data.attfileOrgNm;
					}
				}, {
					key: 'attfileOrgNm',
					align : 'center',
					title : '원본이름',
					width : '80'
				}, {
					key: 'attfileNewNm',
					align : 'center',
					title : '저장된이름',
					width : '80'
				}, {
					key: 'attfilePath',
					align : 'center',
					title : '파일경로',
					width : '80'
				}, {
					title : '위치정보', align : 'center',
					width : '80',
					render : function(value, data, render, mapping){
						return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="locBtn" type="button"></button></div>';
					}
				}, {
					align : 'center',
					title : '부대물자설계',
					width : '95',
					render : function(value, data, render, mapping){
						return '<div style="width: 100%;"><button type="button" id="itmBtn" style="cursor: pointer"><span class="Icon List-alt"></span></button></div>';
					}
				}, {
					align : 'center',
					title : '요청내역',
					width : '80',
					render : function(value, data, render, mapping){
						return '<div style="width: 100%;"><button type="button" id="reqBtn" style="cursor: pointer"><span class="Icon User"></span></button></div>';
					}
				}, {
					key : 'celluse', align : 'center',
					title : '상면사용률',
					width : '80'
				}, {
					key : 'rackratio', align : 'center',
					title : '랙내실장률',
					width : '80'
				}, {
					key : 'chgDtNm', align : 'center',
					title : '수정일',
					width : '80'
				}
				],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
		});
		gridHide();
	}

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['attfileOrgNm', 'attfileNewNm', 'attfilePath'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	function setEventListener() {
		$('#btnClose').on('click', function(e) {
			$a.close();
		});

		$('#'+gridId).on('click', '#locBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var data = {x: dataObj.lng, y: dataObj.lat};

			$a.popup({
				width: '1600',
				height: '700',
				data: data,
				url: '/tango-transmission-gis-web/tgis/CmMap.do',
				iframe: false,
				windowpopup: true,
				title: '국사지도',
				modal: false,
				other: 'top=100,left:100,scrollbars=yes, location=no',
				callback: function(data) {
				}
			});
		});

		//국소저장
		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var key = dataObj._key;
			if(key == 'floorId' || key == 'sisulCd'){
		    	$a.popup({
		    		popid: 'UpsdMtsoFloorReg',
		    		title: '국소저장',
		    		url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoFloorReg.do',
		    		data: dataObj,
		    		iframe: false,
				    modal: true,
				    movable:true,
		    		width : 750,
		    		height : window.innerHeight * 0.45
		    	});
			}

		});
		//부대물자설계
		$('#'+gridId).on('click', '#itmBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			$a.popup({
				data: dataObj,
				url: '/tango-transmission-web/configmgmt/upsdmgmt/IncidItemDsn.do',
				iframe: false,
				windowpopup: true,
				title: '사업관리',
				modal: false,
				other: 'top=0,left:100,scrollbars=yes, location=no,',
				width : screen.availWidth,
    			height : screen.availWidth,
				callback: function(data) {
				}
			});
		});

    	//요청내역 클릭시 팝업
    	$('#'+gridId).on('click', '#reqBtn', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;
    		 var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId
    				 	,cellId: "", cellNm: ""
    		 			}
    		 $a.popup({

    			 data: data,
    			 url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdUseAprvMgmt.do',
    			 iframe: false,
    			 windowpopup: true,
    			 title: '상면사용승인 관리',
    			 modal: false,
    			 width: '1400',
    			 height: '950',
    			 /*callback: function(data) {
    				 console.log(data);
    			 }
    			 */
    		 });
    	 });

    	// 도면 클릭시
    	$('#'+gridId).on('click', '#btnDraw', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};

    		$a.popup({
    			title: '드로잉 툴',
    			url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
    			data: data,
    			iframe: false,
    			windowpopup: true,
    			movable:false,
    			width : screen.availWidth,
    			height : screen.availHeight,
    			callback: function(data) {
    				floor.setGrid(paramData);
    			}
    		});
    	});
    	// 국사별 도면(CAD) 업로드
		$('#btnUpload').on('click', function(e){
			var selectData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
			if(selectData == undefined) {
				alertBox('W', "업로드할 국사 층을 선택해주세요");
				return false;
			}
			var data = {sisulCd: selectData.sisulCd, floorId: selectData.floorId};

			$a.popup({
              	title: '국사별 도면(CAD) 업로드',
              	url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoFloorUpload.do',
              	data: data,
              	iframe: false,
              	windowpopup: true,
				movable:false,
				width : 500,
				height : window.innerHeight * 0.3,
				callback: function(data) {
					floor.setGrid(paramData);
   			 	}
			});
		});

		// 도면 파일 다운로드
		$('#'+gridId).on('click', '#fileDownBtn', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/downloadfile");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			// X-Remote-Id와 X-Auth-Token을 parameter로 넘기기 위한 함수(open api를 통하므로 반드시 작성)
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+ dataObj.attfileNewNm +'" />');
			$form.append('<input type="hidden" name="fileOriginalName" value="'+ dataObj.attfileOrgNm +'" />');
			$form.append('<input type="hidden" name="filePath" value="'+ dataObj.attfilePath +'" />');
			$form.appendTo('body');
			$form.submit().remove();
		});

	}

    this.setGrid = function(param){
 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoFloorList', param, 'GET', 'search');
    }

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search') {
			$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.floorList);
		}
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
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