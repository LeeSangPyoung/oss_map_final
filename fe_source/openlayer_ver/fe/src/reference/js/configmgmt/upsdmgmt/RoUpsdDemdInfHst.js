/**
 * UpsdMtsoList.js
 *
 * @author Administrator
 * @date 2017. 7. 12.
 * @version 1.0
 */
var main = $a.page(function() {


	var gridId = 'dataGrid';
	var gridIdDtl = 'dataGridDtl';
	var fileOnDemendName = "";
	var floorParam = "";
	var mtsoMapList = null;
	var grMtsoTypCd = [];
	var grSlfLesCd 	= [];
	var grYear		= [];
	var grDntnYn	= [];
	var grLaraCd	= [];
	var grPraCd 	= [];
	var grG5Acpt	= [];
	var grShtgItmCd = [];
	var grInvtCd	= [];
	var grNinvtCd	= [];
	var grUpsdRsn	= [];
	var grDrawYn	= [];
	var grCellYn	= [];

	var srchMtsoInfo	= [];
	var srchMtsoOpCl	= [];
	var srchLegay		= [];
	var srchUpsd		= [];
	var srchRollOut 	= [];
	var srchAfe			= [];
	var srchEtc			= [];

	var grNbdUpsdRmdyRsn = [];
	var step2Cd_0 = [{value : 'T11001', text : '수도권'}];
	var step2Cd_1 = [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var step2Cd_2 = [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var step2Cd_3 = [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];
	var step1Cd = [{value : 'T11000', text : '수도권'},{value : 'T12000', text : '동부'},{value : 'T13000', text : '서부'},{value : 'T14000', text : '중부'}];
	var step1To2 = {'T11000' : step2Cd_0, 'T12000': step2Cd_1, 'T13000' : step2Cd_2, 'T14000' : step2Cd_3};
	var grNbdUpsdShtgRsnCd = [{value : '01', text : '상면'}, {value : '02', text : '전력'}];

	var grRoDuhAcptVal = [];
	var grUpsdMgmtYn = [{value : 'Y', text : 'O'}, {value : 'N', text : 'X'}];
	var grUpsdCellMgmtYn = [{value : 'Y', text : 'O'}, {value : 'N', text : 'X'}];
	var grUpsdEqpAcrdYn = [{value : 'Y', text : '일치'}, {value : 'N', text : '불일치'}];
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		setSelectCode();
		setEventListener();
		initGrid();
	};

	function getTodayType() {
		var date = new Date();

		return date.getFullYear() +"-"+ ("0"+(date.getMonth()+1)).slice(-2) +"-"+("0"+date.getDate()).slice(-2);
	}

	function setSelectCode() {
		var param = {supCd : 'T10000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdHdofcCd'); // 본사 코드


		var option_data = [{cd: '', cdNm: '전체'}];
		$('#demdAreaCd').setData({ data : option_data, option_selected: '' });
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02363', null, 'GET', 'slfLesCdList');


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BLDMGMT', null, 'GET', 'bldMgmt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DNTNYN', null, 'GET', 'dntnYn');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/SLFCD', null, 'GET', 'slfCd');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'laraCd');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MTSOUSG', null, 'GET', 'mtsoUsg');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/G5ACPT', null, 'GET', 'g5Acpt');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/RMDYRSN', null, 'GET', 'rmdyRsn');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/ROSTEP', null, 'GET', 'rostep');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/SHTG', null, 'GET', 'Shtg');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/INVTCD', null, 'GET', 'InvtCd');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NINVTCD', null, 'GET', 'NinvtCd');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NINVTCD', null, 'GET', 'NinvtCd');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DRAWMGMT', null, 'GET', 'DrawYn');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CELLMGMT', null, 'GET', 'CellYn');


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/UPSDRSN', null, 'GET', 'UpsdRsn');

		var d = new Date();
		//var d = $("#srchDt").val();
		var year = d.getFullYear();
		for(i = year - 30; i < year + 6; i++) {
			var yearObj = {value : i, text : i};
			grYear.push(yearObj);
		}

		$("#srchDt").val(getTodayType());

		var bfYear = d.getFullYear() - 1;
		var nowYear = d.getFullYear();
		var nxtYear = d.getFullYear() + 1;
		var nxtYear2 = d.getFullYear() + 2;
		var ro1, ro2, ro3, ro4, ro5, ro6, ro7, ro8, ro9, ro10 = '';
		//if (nowYear == '2019') {
			ro1 = '1';
			ro2 = '2';
			ro3 = '3';
			ro4 = '4';
			ro5 = '5';
			ro6 = '6';
			ro7 = '7';
			ro8 = '8';
			ro9 = '9';
			ro10 = '10';


			afe1 = '1';
			afe2 = '2';
			afe3 = '3';
			afe4 = '4';
			afe5 = '5';
			afe6 = '6';

//		} else if (nowYear == '2020') {
//			ro1 = '8';
//			ro2 = '9';
//			ro3 = '10';
//			ro4 = '11';
//			ro5 = '12';
//			ro6 = '13';
//			ro7 = '14';
//			ro8 = '15';
//			ro9 = '16';
//			ro10 = '17';
//
//			afe1 = '7';
//			afe2 = '8';
//			afe3 = '9';
//			afe4 = '10';
//			afe5 = '11';
//			afe6 = '12';
//		}

		srchMtsoInfo.push({value : '1', text : '본부/지역'});
		srchMtsoInfo.push({value : '2', text : '국사정보'});
		srchMtsoInfo.push({value : '3', text : '위치정보'});
		srchMtsoInfo.push({value : '4', text : '관리/소유 주체'});
		srchMtsoInfo.push({value : '5', text : '확보 년도'});
		srchMtsoInfo.push({value : '6', text : '규모'});
		srchMtsoInfo.push({value : '7', text : '상면 현황'});

		$("#srchMtsoInfo").multiselect({
			autoOpen : false, noneSelectedText : '국사정보 항목', selectedText : '국사정보 항목(#개)'

        });
		$('#srchMtsoInfo').setData({ data : srchMtsoInfo, option_selected : ['1','2','3','4','5','6','7'] });


		srchMtsoOpCl.push({value : '8', text : '국사 신축 검토'});
		srchMtsoOpCl.push({value : '9', text : '신규/기존 국사명'});
		srchMtsoOpCl.push({value : '10', text : '국사 통폐합'});

		$("#srchMtsoOpCl").multiselect({
			autoOpen : false, noneSelectedText : '신축/통폐합 항목', selectedText : '신축/통폐합 항목(#개)'

        });
		$('#srchMtsoOpCl').setData({ data : srchMtsoOpCl, option_selected : ['8','9','10'] });


		srchLegay.push({value : '13', text : '현재 전력'});
		srchLegay.push({value : '14', text : '2G FadeOut'});
		srchLegay.push({value : '15', text : 'LTE/1X/Wibro'});
		srchLegay.push({value : '16', text : 'Legacy 종국 추가 수요'});
		srchLegay.push({value : '17', text : '5G 종국 DUH'});
		srchLegay.push({value : '18', text : '전송 랙수'});
		srchLegay.push({value : '19', text : '전송 전력량'});

		$("#srchLegay").multiselect({
			autoOpen : false, noneSelectedText : '현재 전력/5G/전송 항목', selectedText : '현재 전력/5G/전송  항목(#개)'

        });
		$('#srchLegay').setData({ data : srchLegay, option_selected : ['13','14','15','16','17','18','19'] });


		srchUpsd.push({value : '20', text : '부대물자'});
		srchUpsd.push({value : '21', text : '상면 종국수요'});
		srchUpsd.push({value : '22', text : '잔여/누적'});

		$("#srchUpsd").multiselect({
			autoOpen : false, noneSelectedText : '부대물자/상면 항목', selectedText : '부대물자/상면  항목(#개)'

        });
		$('#srchUpsd').setData({ data : srchUpsd, option_selected : ['20','21','22'] });


		srchRollOut.push({value : '11', text : 'DUH 식수(AFE 계획)'});
		srchRollOut.push({value : '12', text : 'RO '+ro1+'단계'});
		srchRollOut.push({value : '51', text : 'RO '+ro2+'단계'});
		srchRollOut.push({value : '52', text : 'RO '+ro3+'단계'});
		srchRollOut.push({value : '53', text : 'RO '+ro4+'단계'});
		srchRollOut.push({value : '54', text : 'RO '+ro5+'단계'});
		srchRollOut.push({value : '55', text : 'RO '+ro6+'단계'});
		srchRollOut.push({value : '56', text : 'RO '+ro7+'단계'});
		if (nowYear != '2019') {
			srchRollOut.push({value : '57', text : 'RO '+ro8+'단계'});
			srchRollOut.push({value : '58', text : 'RO '+ro9+'단계'});
			srchRollOut.push({value : '59', text : 'RO '+ro10+'단계'});
		}

		$("#srchRollOut").multiselect({
			autoOpen : false, noneSelectedText : 'RollOut 항목', selectedText : 'RollOut 항목(#개)'
        });

		$('#srchRollOut').setData({ data : srchRollOut, option_selected : ['11','12','51','52','53','54','55','56','57','58','59'] });


		srchAfe.push({value : '23', text : bfYear+'년 투자비'});
		srchAfe.push({value : '24', text : nowYear+'년 투자비'});
		srchAfe.push({value : '25', text : nowYear+'년 '+afe1+'차 AFE'});
		srchAfe.push({value : '26', text : nowYear+'년 '+afe2+'차 AFE'});
		srchAfe.push({value : '27', text : nowYear+'년 '+afe3+'차 AFE'});
		srchAfe.push({value : '28', text : nowYear+'년 '+afe4+'차 AFE'});
		srchAfe.push({value : '29', text : nowYear+'년 '+afe5+'차 AFE'});
		srchAfe.push({value : '30', text : nowYear+'년 '+afe6+'차 AFE'});
		srchAfe.push({value : '31', text : nxtYear+'년 투자비 DUL 10만'});
		srchAfe.push({value : '32', text : nxtYear2+'년 이후 투자비'});
		srchAfe.push({value : '33', text : '전체 투자비 '+bfYear+'년 이후'});
		$("#srchAfe").multiselect({
			autoOpen : false, noneSelectedText : 'AFE 단계별 항목', selectedText : 'AFE 단계별 항목(#개)'
        });

		$('#srchAfe').setData({ data : srchAfe, option_selected : ['23','24','25','26','27','28','29','30','31','32','33'] });

		srchEtc.push({value : '34', text : '도면관리'});
		srchEtc.push({value : '35', text : '기타'});
		$("#srchEtc").multiselect({
			autoOpen : false, noneSelectedText : '기타 항목', selectedText : '기타 항목(#개)'
        });

		$('#srchEtc').setData({ data : srchEtc, option_selected : ['34','35'] });
	}
	//Grid 초기화
	function initGrid() {

		//var d = new Date();
		var d = new Date($("#srchDt").val());
		//console.log(d);
		var bfYear = d.getFullYear() - 1;
		var nowYear = d.getFullYear();
		var nxtYear = d.getFullYear() + 1;
		var nxtYear2 = d.getFullYear() + 2;



		var ro1, ro2, ro3, ro4, ro5, ro6, ro7, ro8, ro9, ro10 = '';
		//if (nowYear == '2019') {
			ro1 = '1';
			ro2 = '2';
			ro3 = '3';
			ro4 = '4';
			ro5 = '5';
			ro6 = '6';
			ro7 = '7';
			ro8 = '8';
			ro9 = '9';
			ro10 = '10';


			afe1 = '1';
			afe2 = '2';
			afe3 = '3';
			afe4 = '4';
			afe5 = '5';
			afe6 = '6';

//		} else if (nowYear == '2020') {
//			ro1 = '8';
//			ro2 = '9';
//			ro3 = '10';
//			ro4 = '11';
//			ro5 = '12';
//			ro6 = '13';
//			ro7 = '14';
//			ro8 = '15';
//			ro9 = '16';
//			ro10 = '17';
//
//			afe1 = '7';
//			afe2 = '8';
//			afe3 = '9';
//			afe4 = '10';
//			afe5 = '11';
//			afe6 = '12';
//		}

		AlopexGrid.setup({
			renderMapping : {
				'grPraCds' : {
					renderer:function(value, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '';
							if (value.length > 0) {
								var praFildCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');
							} else {
								var praFildCd = '';
							}

							for(var i=0; i < grPraCd.length; i++) {
								var exist = '';
								if (praFildCd != undefined && praFildCd != null && praFildCd != ""){
									for(j=0; j < praFildCd.length; j++) {
										if (grPraCd[i].value.toString() == praFildCd[j].toString()) {
											exist = ' Selected="Selected" ';
										}
									}
								}
								strSelectOption += '<option value='+grPraCd[i].value+' '+exist+'> '+grPraCd[i].text+' </option>';
							}
							return '<select class="Multiselect" multiple="multiple">' + strSelectOption + '</select>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var objVal = $(cell).find('select').val();
							var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
							for(var i in dataObj) {
								if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].praFildCd != undefined  && dataObj[i].praFildCd != null) {
									objVal += dataObj[i].praFildCd;
								}
							}
							$('#'+gridId).alopexGrid('dataEdit',{praFildCd:objVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						if(data.repMtsoYn != 'Y') {
							return $(cell).find('select').val();
						} else {
							return data.praFildCd;
						}


					},
					postRender : function(cell, value, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var $multiSelect = $(cell).find('.Multiselect');
							$multiSelect.convert();
							if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
								$multiSelect.open();
							}
						}
					}
				},
				'grUpsdRsn' : {
					renderer:function(value, data, render, mapping, grid) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '';
							if (value.length > 0) {
								var nbdUpsdShtgRsn = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');
							} else {
								var nbdUpsdShtgRsn = '';
							}

							for(var i=0; i < grUpsdRsn.length; i++) {
								var exist = '';
								if (nbdUpsdShtgRsn != undefined && nbdUpsdShtgRsn != null && nbdUpsdShtgRsn != ""){
									for(j=0; j < nbdUpsdShtgRsn.length; j++) {
										if (grUpsdRsn[i].value.toString() == nbdUpsdShtgRsn[j].toString()) {
											exist = ' Selected="Selected" ';
										}
									}
								}
								strSelectOption += '<option value='+grUpsdRsn[i].value+' '+exist+'> '+grUpsdRsn[i].text+' </option>';
							}
							return '<select class="Multiselect" multiple="multiple">' + strSelectOption + '</select>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						return $(cell).find('select').val();
					},
					postRender : function(cell, value, data, render, mapping, grid) {
						if(data.repMtsoYn == 'Y') {
							var $multiSelect = $(cell).find('.Multiselect');
							$multiSelect.convert();
							if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
								$multiSelect.open();
							}
						}
					}
				}
			}
		});
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '10row',
			autoResize: true,
			rowClickSelect : true,
            rowSingleSelect : true,
			rowInlineEdit: false,
			cellSelectable : true,
			numberingColumnFromZero: false,
//			defaultState : {
//				dataAdd : {editing : true},
//				dataSet : {editing : true}
//			},
			columnFixUpto : 'mtsoNm',
			headerGroup: [
				{fromIndex:4, toIndex:12, title:'국사 정보'},
				{fromIndex:13, toIndex:20, title:'위치정보'},
				{fromIndex:21, toIndex:23, title:'관리/소유 주체'},
				{fromIndex:24, toIndex:25, title:'확보년도'},
				{fromIndex:26, toIndex:30, title:'규모'},
				{fromIndex:31, toIndex:35, title:'상면현황'},
				{fromIndex:36, toIndex:41, title:'국사 신축 검토'},
				{fromIndex:42, toIndex:43, title:'신규/기본 국사명'},
				{fromIndex:44, toIndex:48, title:'국사 통폐합'},
				{fromIndex:49, toIndex:59, title: nowYear+ '년도 DUH 식수(AFE 계획 기준)'},
				{fromIndex:60, toIndex:60, title: nowYear+ '년도 RO 1~10단계 장비 식수(설계기준)'},
				{fromIndex:61, toIndex:61, title: nowYear+ '년도 RO 1~10단계 식수'},
				{fromIndex:62, toIndex:62, title: nowYear+ '년도 RO 1~10단계 식수'},
				{fromIndex:63, toIndex:72, title: nowYear+ '년도 RO 1 단계'},
				{fromIndex:73, toIndex:82, title: nowYear+ '년도 RO 2 단계'},
				{fromIndex:83, toIndex:92, title: nowYear+ '년도 RO 3 단계'},
				{fromIndex:93, toIndex:102, title: nowYear+ '년도 RO 4 단계'},
				{fromIndex:103, toIndex:112, title: nowYear+ '년도 RO 5 단계'},
				{fromIndex:113, toIndex:122, title: nowYear+ '년도 RO 6 단계'},
				{fromIndex:123, toIndex:132, title: nowYear+ '년도 RO 7 단계'},
				{fromIndex:133, toIndex:142, title: nowYear+ '년도 RO 8 단계'},
				{fromIndex:143, toIndex:152, title: nowYear+ '년도 RO 9 단계'},
				{fromIndex:153, toIndex:162, title: nowYear+ '년도 RO 10 단계'},
				{fromIndex:163, toIndex:165, title:'현재 전력'},
				{fromIndex:166, toIndex:167, title:'2G FadeOut'},
				{fromIndex:168, toIndex:171, title:'LTE/1X/Wibro'},
				{fromIndex:172, toIndex:174, title:'Legacy 종국 추가 수요'},
				{fromIndex:175, toIndex:179, title:'5G 종국 DUH수(개)'},
				{fromIndex:180, toIndex:186, title:'전송 랙수(개)'},
				{fromIndex:187, toIndex:191, title:'전송 전력량(Kw)'},
				{fromIndex:192, toIndex:196, title:'부대물자'},
				{fromIndex:197, toIndex:198, title:'상면 종국 수요'},
				{fromIndex:199, toIndex:206, title:'잔여/누적'},
				{fromIndex:207, toIndex:213, title: bfYear+'년 투자비'},
				{fromIndex:214, toIndex:220, title: nowYear+'년 투자비 합계(백만원)'},
				{fromIndex:221, toIndex:226, title: nowYear+'년 1차 AFE'},
				{fromIndex:227, toIndex:232, title: nowYear+'년 2차 AFE'},
				{fromIndex:233, toIndex:238, title: nowYear+'년 3차 AFE'},
				{fromIndex:239, toIndex:244, title: nowYear+'년 4차 AFE'},
				{fromIndex:245, toIndex:250, title: nowYear+'년 5차 AFE'},
				{fromIndex:251, toIndex:256, title: nowYear+'년 6차 AFE'},
				{fromIndex:257, toIndex:266, title: nxtYear+'년 투자비 DUL 10만(85개시 동단위 투자시)'},
				{fromIndex:267, toIndex:273, title: nxtYear2+'년 이후 투자비'},
				{fromIndex:274, toIndex:280, title: '국사 확보를 위한 투자비'},
				{fromIndex:281, toIndex:284, title: '도면관리'},
				{fromIndex:285, toIndex:286, title: '기타'}
				],
			columnMapping: [
	/* 0 */		{ align:'center', title : 'No.', width: '30', resizing: false, numberingColumn: true},
	/* 1 */
				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(step1Cd);
								return render_data;
							} else {
								data.demdHdofcCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else { return false; }},
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							editing_data = editing_data.concat(step1Cd);
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					}},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								var currentData = AlopexGrid.currentData(data);
								if (step1To2[currentData.demdHdofcCd]) {
									render_data = render_data.concat(step1To2[currentData.demdHdofcCd]);
								}
								return render_data;
							} else {
								data.demdAreaCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) {if(data.repMtsoYn == 'Y') { return true; } else { return false; } },
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							var currentData = AlopexGrid.currentData(data);

							if (step1To2[currentData.demdHdofcCd]) {
								editing_data = editing_data.concat(step1To2[currentData.demdHdofcCd]);
							}
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					},
					refreshBy : ['demdHdofcCd'] },
				{ key : 'mtsoNm', align:'left', title : '국사명', width: '150',
						highlight : function(value, data, mappig) {
							if(data.delYn == 'Y') { return "del_row";}
						},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.mtsoNm ;
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<label class="textsearch_1"><input type="text" id="btnMtsoSearch" readonly style="'+strCss+'" value="'+strVal+'" /><span id="btnCnstnBpSearch" class="Button search"></span></label>';
						} else {
							strVal = '';
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value=""/></div>';
						}

					}
				},
				{ key : 'smtsoNm', align:'left', title : '층 국사명', width: '150',
					highlight : function(value, data, mappig) {
						if(data.delYn == 'Y') { return "del_row";}
					},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn != 'Y') {
							return data.mtsoNm ;
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = data.mtsoNm;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
						if(data.repMtsoYn != 'Y') {
							return '<label class="textsearch_1"><input type="text" id="btnMtsoSearch" readonly style="'+strCss+'" value="'+strVal+'" /><span id="btnCnstnBpSearch" class="Button search"></span></label>';
						} else {
							strVal = '';
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value=""/></div>';
						}

					}
				},
				{ key : 'praFildCd', align:'center', title : '층용도', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var praFildCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							var names = [];
							var uniqueNames = [];
							for(i=0; i < praFildCd.length; i++) {
								names.push(praFildCd[i]);
							}
							$.each(names, function(i, el){
								if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
							})
//							if (typeof uniqueNames) {
//								if (data.praFildCd != null) {
//									data.praFildCd = data.praFildCd.toString();
//								}
//							}
//							if (data.praFildCd != null) {
//								var praFildCd = data.praFildCd.toString().replace(/,/gi, '').replace(/undefined/gi, '').replace(/0/gi, '');
//							} else {
//								var praFildCd = "";
//							}
//

							for(i=0; i < uniqueNames.length; i++) {
								for(var j=0; j < grPraCd.length; j++) {
									if (uniqueNames[i].toString() == grPraCd[j].value.toString()) {
										strText += grPraCd[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					},
					editable : {type : 'grPraCds'}
				},
				{ key : 'bldFlorNo', align:'center', title : '층정보', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.totBldFlor ;
						} else {
							return setFlor(data.bldFlorNo);
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							strVal = data.totBldFlor;
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						}
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" /></div>';
					}
				},

				{ key : 'bldCd', align:'center', title : '건물코드', width: '120', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'bldNm', align:'left', title : '건물명', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; } },
				{ key : 'siteKeyVal', align:'center', title : 'SITE KEY', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'mtsoId', align:'center', title : '국사ID', width: '120', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return '-' ;
						} else {
							return value;
						}
					},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
	/* 10 */	{ key : 'repIntgFcltsCd', align:'center', title : '공대코드', width: '90', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							strVal = '';
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						}
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" /></div>';
					}
				},
				{ key : 'mtsoAbbrNm', align:'left', title : '국사약어', width: '160', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; }},
				{ key : 'dtlAddr', align:'left', title : '주소', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; } },
				{ key : 'sidoNm', align:'center', title : '시도', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'sggNm', align:'center', title : '시군구', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'emdNm', align:'center', title : '읍면동', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'laraCd', align:'center', title : '권역', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grLaraCd);
								return render_data;
							} else {
								data.laraCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grLaraCd) {
								var exist = '';

								if (value && value.indexOf(grLaraCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grLaraCd[i].value+' '+exist+'>'+grLaraCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'dntnYn', align:'center', title : '도심/외곽', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDntnYn);
								return render_data;
							} else {
								data.dntnYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grDntnYn) {
								var exist = '';

								if (value && value.indexOf(grDntnYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grDntnYn[i].value+' '+exist+'>'+grDntnYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}

					}
				},
				{ key : 'latVal', align:'center', title : '위도', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							return value;
						} },
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'lngVal', align:'center', title : '경도', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},

					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },

	/* 20 */
				{ key : 'bldMgmtTypCd', align:'center', title : '건물관리 주체', width: '120', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grMtsoTypCd);
								return render_data;
							} else {
								data.bldMgmtTypCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grMtsoTypCd) {
								var exist = '';
								if (value && value.indexOf(grMtsoTypCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grMtsoTypCd[i].value+' '+exist+'>'+grMtsoTypCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'landOwnDivVal', align:'center', title : '토지소유구분', width: '130', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grSlfLesCd);
								return render_data;
							} else {
								data.landOwnDivVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grSlfLesCd) {
								var exist = '';
								if (value && value.indexOf(grSlfLesCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grSlfLesCd[i].value+' '+exist+'>'+grSlfLesCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bldOwnDivVal', align:'center', title : '건물소유구분', width: '130', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grSlfLesCd);
								return render_data;
							} else {
								data.bldOwnDivVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grSlfLesCd) {
								var exist = '';
								if (value && value.indexOf(grSlfLesCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grSlfLesCd[i].value+' '+exist+'>'+grSlfLesCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screLandYr', align:'center', title : '토지', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grYear);
								return render_data;
							} else {
								data.slfLesCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grYear) {
								var exist = '';
								if (value && value.indexOf(grYear[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grYear[i].value+' '+exist+'>'+grYear[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screBldYr', align:'center', title : '건물', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grYear);
								return render_data;
							} else {
								data.slfLesCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grYear) {
								var exist = '';
								if (value && value.indexOf(grYear[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grYear[i].value+' '+exist+'>'+grYear[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'landArPyngVal', align:'center', title : '토지면적(평)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.landArPyngVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.landArPyngVal == undefined || data.landArPyngVal == null || data.landArPyngVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'cbgRate', align:'center', title : '용적율(%)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.cbgRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.cbgRate == undefined || data.cbgRate == null || data.cbgRate == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bldCoverageRate', align:'center', title : '건폐율(%)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bldCoverageRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.bldCoverageRate == undefined || data.bldCoverageRate == null || data.bldCoverageRate == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'bldArPyngVal', align:'center', title : '건(평)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}

							return setComma(tmp);
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (strVal == undefined || strVal == null || strVal == ""){strVal = '0';}
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				},
				{ key : 'totAr', align:'center', title : '연면적(평)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.totAr == undefined || data.totAr == null || data.totAr == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var tmpVal = $(cell).find('input').val();
							var topVal = tmpVal;
							if (isNaN(topVal)) {topVal = 0;}
							var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
							for(var i in dataObj) {
								if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].totAr != undefined  && dataObj[i].totAr != null) {
									var objVal = dataObj[i].totAr
									if (isNaN(objVal)) {objVal = 0;}
									tmpVal = parseInt(tmpVal)+parseInt(objVal);
									if (parseInt(topVal) < parseInt(objVal)) {
										topVal = objVal;
									}
								}
							}
							if(data.repMtsoYn != 'Y') {
								$('#'+gridId).alopexGrid('dataEdit',{totAr:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});

								var ckGubun = $("input:checkbox[id^=srchYn]").is(":checked") ? 'Y' : 'N';
						 	 	if(ckGubun == "N") {
									$('#'+gridId).alopexGrid('dataEdit',{bldArPyngVal:topVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						 	 	}
							}

						}
						return $(cell).find('input').val();
					}
				},
				{ key : 'upsdAcptRackCnt', align:'center', title : '수용가능랙수', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.upsdAcptRackCnt == undefined || data.upsdAcptRackCnt == null || data.upsdAcptRackCnt == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						var tmpVal = parseInt($(cell).find('input').val());
						if (isNaN(tmpVal)) {tmpVal = 0;}
						var topVal = tmpVal;
						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
						for(var i in dataObj) {
							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdAcptRackCnt != undefined  && dataObj[i].upsdAcptRackCnt != null) {
								var objVal = parseInt(dataObj[i].upsdAcptRackCnt);
								if (isNaN(objVal)) {objVal = 0;}
								tmpVal = parseInt(tmpVal)+parseInt(objVal);
								if (parseInt(topVal) < parseInt(objVal)) {
									topVal = objVal;
								}
							}
						}
						if(data.repMtsoYn != 'Y') {
							$('#'+gridId).alopexGrid('dataEdit',{upsdAcptRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						return $(cell).find('input').val();
					}


				},
	/* 30 */	{ key : 'upsdFcltsRackCnt', align:'center', title : '시설랙수', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.upsdFcltsRackCnt == undefined || data.upsdFcltsRackCnt == null || data.upsdFcltsRackCnt == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						var tmpVal = parseInt($(cell).find('input').val());
						if (isNaN(tmpVal)) {tmpVal = 0;}
						var topVal = tmpVal;
						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
						for(var i in dataObj) {
							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdFcltsRackCnt != undefined  && dataObj[i].upsdFcltsRackCnt != null) {
								var objVal = parseInt(dataObj[i].upsdFcltsRackCnt);
								if (isNaN(objVal)) {objVal = 0;}
								tmpVal = parseInt(tmpVal)+parseInt(objVal);
								if (parseInt(topVal) < parseInt(objVal)) {
									topVal = objVal;
								}
							}
						}

						if(data.repMtsoYn != 'Y') {
							$('#'+gridId).alopexGrid('dataEdit',{upsdFcltsRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						return $(cell).find('input').val();
					}

				},
				{ key : 'upsdIdleRackCnt', align:'center', title : '유휴랙수', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var upsdAcptRackCnt =  data.upsdAcptRackCnt;
						var upsdFcltsRackCnt =  data.upsdFcltsRackCnt;
						if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}
						if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
						var tmpCnt =  data.upsdAcptRackCnt - data.upsdFcltsRackCnt;
						if (isNaN(tmpCnt)) tmpCnt = 0;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var upsdAcptRackCnt =  data.upsdAcptRackCnt;
						var upsdFcltsRackCnt =  data.upsdFcltsRackCnt;
						if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}
						if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
						var strVal =  data.upsdAcptRackCnt - data.upsdFcltsRackCnt;
						if (isNaN(strVal)) strVal = 0;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" "/></div>';
					}

				},
				{ key : 'upsdUseRate', align:'center', title : '사용율(%)', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  parseInt((data.upsdFcltsRackCnt / data.upsdAcptRackCnt)*100);
						if (isNaN(tmpCnt)) tmpCnt = 0;
						return tmpCnt;
					},
					editable : function(value, data) {
						var tmpCnt =  parseInt((data.upsdFcltsRackCnt / data.upsdAcptRackCnt)*100);
						if (isNaN(tmpCnt)) tmpCnt = 0;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+tmpCnt+'" "/></div>';
					}
				},
				{ key : 'fcltsRackAispRsltVal', align:'center', title : '랙실사결과', width: '80', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmp = value;

						return tmp;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn != 'Y') {
							//if (data.fcltsRackAispRsltVal == undefined || data.fcltsRackAispRsltVal == null || data.fcltsRackAispRsltVal == ""){strVal = '0';}
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
//						var tmpVal = parseInt($(cell).find('input').val());
//						if (isNaN(tmpVal)) {tmpVal = 0;}
//						var topVal = tmpVal;
//						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
//						for(var i in dataObj) {
//							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].fcltsRackAispRsltVal != undefined  && dataObj[i].fcltsRackAispRsltVal != null) {
//								var objVal = parseInt(dataObj[i].fcltsRackAispRsltVal);
//								if (isNaN(objVal)) {objVal = 0;}
//								tmpVal = parseInt(tmpVal)+parseInt(objVal);
//							}
//						}
//
//						if(data.repMtsoYn != 'Y') {
//							$('#'+gridId).alopexGrid('dataEdit',{fcltsRackAispRsltVal:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
//						}
						return $(cell).find('input').val();
					}
				},
				{ key : 'nbdG5AcptVal', align:'center', title : '5G수용계획', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
						render : {type : 'string',
							rule : function(value, data) {
								if(data.repMtsoYn == 'Y') {
									var render_data = [{ value : ''}];
									render_data = render_data.concat(grG5Acpt);
									return render_data;
								} else {
									data.nbdG5AcptVal = '';
								}
							}
						},
						editable : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var strSelectOption = '';
								for(var i in grG5Acpt) {
									var exist = '';
									if (value && value.indexOf(grG5Acpt[i].value) != -1) {
										exist = ' selected';
									}
									strSelectOption += '<option value='+grG5Acpt[i].value+' '+exist+'>'+grG5Acpt[i].text+'</option>';
								}
								return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
							} else {
								var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
								return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
							}
						}

				},
				{ key : 'nbdG5AcptRsn', align:'left', title : '5G수용사유및향후계획', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.landArPyngVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nbdUpsdShtgRsn', align:'center', title : '상면부족사유', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var nbdUpsdShtgRsn = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							for(i=0; i < nbdUpsdShtgRsn.length; i++) {
								for(var j=0; j < grUpsdRsn.length; j++) {
									if (nbdUpsdShtgRsn[i].toString() == grUpsdRsn[j].value.toString()) {
										strText += grUpsdRsn[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					},
					editable : {type : 'grUpsdRsn'}
				},
				{ key : 'nbdUpsdRmdyRsn', align:'center', title : '상면부족해소방안', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNbdUpsdRmdyRsn);
								return render_data;
							} else {
								data.nbdUpsdRmdyRsn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '';
							for(var i in grNbdUpsdRmdyRsn) {
								var exist = '';
								if (value && value.indexOf(grNbdUpsdRmdyRsn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNbdUpsdRmdyRsn[i].value+' '+exist+'>'+grNbdUpsdRmdyRsn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" style="width:100%;" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'areaNbdInvtScdleVal', align:'center', title : '투자시기(지역)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.areaNbdInvtScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nbdInvtScdleVal', align:'center', title : '투자시기(본사)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.nbdInvtScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'newMtsoNm', align:'left', title : '신규통합국명', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.newMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'exstMtsoNm', align:'left', title : '기존통합국명', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.exstMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'closMtsoNm', align:'left', title : '폐국대상', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.closMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'diffMtsoNm', align:'left', title : '이설국사명', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.diffMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'diffCstVal', align:'right', title : '이설비용', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.diffCstVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							if (data.diffCstVal == undefined || data.diffCstVal == null || data.diffCstVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'lesCstVal', align:'right', title : '임차료', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lesCstVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							if (data.lesCstVal == undefined || data.lesCstVal == null || data.lesCstVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'diffScdleVal', align:'left', title : '이설시기', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.diffScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





	/* 40 */	{ key : 'roAcptScdleVal', align:'center', title : '최초수용시기', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},


					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grRoDuhAcptVal);
								return render_data;
							} else {
								data.roAcptScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grRoDuhAcptVal) {
								var exist = '';
								if (value && value.indexOf(grRoDuhAcptVal[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grRoDuhAcptVal[i].value+' '+exist+'>'+grRoDuhAcptVal[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roDuhStep1Val', align:'center', title : ro1+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},

					render : function(value, data, render, mapping){
						var roStep1Val = setIsNaNCheck(parseInt(data.roStep1Val));
						var roRlyRotnStep1Val = setIsNaNCheck(parseInt(data.roRlyRotnStep1Val));
						var roRlyIvrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrStep1Val));
						var roRlyIvrrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep1Val));
						var roDuRotnStep1Val = setIsNaNCheck(parseInt(data.roDuRotnStep1Val));
						var roDuIvrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrStep1Val));
						var roDuIvrrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrrStep1Val));
						var roRepceRotnStep1Val = setIsNaNCheck(parseInt(data.roRepceRotnStep1Val));
						var roRepceIvrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrStep1Val));
						var roRepceIvrrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep1Val));

						var tmpCnt =  roStep1Val + roRlyRotnStep1Val + roRlyIvrStep1Val + roRlyIvrrStep1Val + roDuRotnStep1Val + roDuIvrStep1Val + roDuIvrrStep1Val + roRepceRotnStep1Val + roRepceIvrStep1Val + roRepceIvrrStep1Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep1Val = '';
						}

					},
					editable : function(value, data) {
						var roStep1Val = setIsNaNCheck(parseInt(data.roStep1Val));
						var roRlyRotnStep1Val = setIsNaNCheck(parseInt(data.roRlyRotnStep1Val));
						var roRlyIvrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrStep1Val));
						var roRlyIvrrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep1Val));
						var roDuRotnStep1Val = setIsNaNCheck(parseInt(data.roDuRotnStep1Val));
						var roDuIvrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrStep1Val));
						var roDuIvrrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrrStep1Val));
						var roRepceRotnStep1Val = setIsNaNCheck(parseInt(data.roRepceRotnStep1Val));
						var roRepceIvrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrStep1Val));
						var roRepceIvrrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep1Val));

						var strVal =  roStep1Val + roRlyRotnStep1Val + roRlyIvrStep1Val + roRlyIvrrStep1Val + roDuRotnStep1Val + roDuIvrStep1Val + roDuIvrrStep1Val + roRepceRotnStep1Val + roRepceIvrStep1Val + roRepceIvrrStep1Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep2Val', align:'center', title : ro2+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep2Val = setIsNaNCheck(parseInt(data.roStep2Val));
						var roRlyRotnStep2Val = setIsNaNCheck(parseInt(data.roRlyRotnStep2Val));
						var roRlyIvrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrStep2Val));
						var roRlyIvrrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep2Val));
						var roDuRotnStep2Val = setIsNaNCheck(parseInt(data.roDuRotnStep2Val));
						var roDuIvrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrStep2Val));
						var roDuIvrrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrrStep2Val));
						var roRepceRotnStep2Val = setIsNaNCheck(parseInt(data.roRepceRotnStep2Val));
						var roRepceIvrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrStep2Val));
						var roRepceIvrrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep2Val));

						var tmpCnt =  roStep2Val + roRlyRotnStep2Val + roRlyIvrStep2Val + roRlyIvrrStep2Val + roDuRotnStep2Val + roDuIvrStep2Val + roDuIvrrStep2Val + roRepceRotnStep2Val + roRepceIvrStep2Val + roRepceIvrrStep2Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep2Val = '';
						}

					},
					editable : function(value, data) {
						var roStep2Val = setIsNaNCheck(parseInt(data.roStep2Val));
						var roRlyRotnStep2Val = setIsNaNCheck(parseInt(data.roRlyRotnStep2Val));
						var roRlyIvrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrStep2Val));
						var roRlyIvrrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep2Val));
						var roDuRotnStep2Val = setIsNaNCheck(parseInt(data.roDuRotnStep2Val));
						var roDuIvrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrStep2Val));
						var roDuIvrrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrrStep2Val));
						var roRepceRotnStep2Val = setIsNaNCheck(parseInt(data.roRepceRotnStep2Val));
						var roRepceIvrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrStep2Val));
						var roRepceIvrrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep2Val));

						var strVal =  roStep2Val + roRlyRotnStep2Val + roRlyIvrStep2Val + roRlyIvrrStep2Val + roDuRotnStep2Val + roDuIvrStep2Val + roDuIvrrStep2Val + roRepceRotnStep2Val + roRepceIvrStep2Val + roRepceIvrrStep2Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep3Val', align:'center', title : ro3+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep3Val = setIsNaNCheck(parseInt(data.roStep3Val));
						var roRlyRotnStep3Val = setIsNaNCheck(parseInt(data.roRlyRotnStep3Val));
						var roRlyIvrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrStep3Val));
						var roRlyIvrrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep3Val));
						var roDuRotnStep3Val = setIsNaNCheck(parseInt(data.roDuRotnStep3Val));
						var roDuIvrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrStep3Val));
						var roDuIvrrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrrStep3Val));
						var roRepceRotnStep3Val = setIsNaNCheck(parseInt(data.roRepceRotnStep3Val));
						var roRepceIvrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrStep3Val));
						var roRepceIvrrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep3Val));

						var tmpCnt =  roStep3Val + roRlyRotnStep3Val + roRlyIvrStep3Val + roRlyIvrrStep3Val + roDuRotnStep3Val + roDuIvrStep3Val + roDuIvrrStep3Val + roRepceRotnStep3Val + roRepceIvrStep3Val + roRepceIvrrStep3Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep3Val = '';
						}

					},
					editable : function(value, data) {
						var roStep3Val = setIsNaNCheck(parseInt(data.roStep3Val));
						var roRlyRotnStep3Val = setIsNaNCheck(parseInt(data.roRlyRotnStep3Val));
						var roRlyIvrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrStep3Val));
						var roRlyIvrrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep3Val));
						var roDuRotnStep3Val = setIsNaNCheck(parseInt(data.roDuRotnStep3Val));
						var roDuIvrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrStep3Val));
						var roDuIvrrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrrStep3Val));
						var roRepceRotnStep3Val = setIsNaNCheck(parseInt(data.roRepceRotnStep3Val));
						var roRepceIvrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrStep3Val));
						var roRepceIvrrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep3Val));

						var strVal =  roStep3Val + roRlyRotnStep3Val + roRlyIvrStep3Val + roRlyIvrrStep3Val + roDuRotnStep3Val + roDuIvrStep3Val + roDuIvrrStep3Val + roRepceRotnStep3Val + roRepceIvrStep3Val + roRepceIvrrStep3Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep4Val', align:'center', title : ro4+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep4Val = setIsNaNCheck(parseInt(data.roStep4Val));
						var roRlyRotnStep4Val = setIsNaNCheck(parseInt(data.roRlyRotnStep4Val));
						var roRlyIvrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrStep4Val));
						var roRlyIvrrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep4Val));
						var roDuRotnStep4Val = setIsNaNCheck(parseInt(data.roDuRotnStep4Val));
						var roDuIvrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrStep4Val));
						var roDuIvrrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrrStep4Val));
						var roRepceRotnStep4Val = setIsNaNCheck(parseInt(data.roRepceRotnStep4Val));
						var roRepceIvrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrStep4Val));
						var roRepceIvrrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep4Val));

						var tmpCnt =  roStep4Val + roRlyRotnStep4Val + roRlyIvrStep4Val + roRlyIvrrStep4Val + roDuRotnStep4Val + roDuIvrStep4Val + roDuIvrrStep4Val + roRepceRotnStep4Val + roRepceIvrStep4Val + roRepceIvrrStep4Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep4Val = '';
						}

					},
					editable : function(value, data) {
						var roStep4Val = setIsNaNCheck(parseInt(data.roStep4Val));
						var roRlyRotnStep4Val = setIsNaNCheck(parseInt(data.roRlyRotnStep4Val));
						var roRlyIvrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrStep4Val));
						var roRlyIvrrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep4Val));
						var roDuRotnStep4Val = setIsNaNCheck(parseInt(data.roDuRotnStep4Val));
						var roDuIvrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrStep4Val));
						var roDuIvrrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrrStep4Val));
						var roRepceRotnStep4Val = setIsNaNCheck(parseInt(data.roRepceRotnStep4Val));
						var roRepceIvrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrStep4Val));
						var roRepceIvrrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep4Val));

						var strVal =  roStep4Val + roRlyRotnStep4Val + roRlyIvrStep4Val + roRlyIvrrStep4Val + roDuRotnStep4Val + roDuIvrStep4Val + roDuIvrrStep4Val + roRepceRotnStep4Val + roRepceIvrStep4Val + roRepceIvrrStep4Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep5Val', align:'center', title : ro5+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep5Val = setIsNaNCheck(parseInt(data.roStep5Val));
						var roRlyRotnStep5Val = setIsNaNCheck(parseInt(data.roRlyRotnStep5Val));
						var roRlyIvrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrStep5Val));
						var roRlyIvrrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep5Val));
						var roDuRotnStep5Val = setIsNaNCheck(parseInt(data.roDuRotnStep5Val));
						var roDuIvrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrStep5Val));
						var roDuIvrrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrrStep5Val));
						var roRepceRotnStep5Val = setIsNaNCheck(parseInt(data.roRepceRotnStep5Val));
						var roRepceIvrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrStep5Val));
						var roRepceIvrrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep5Val));

						var tmpCnt =  roStep5Val + roRlyRotnStep5Val + roRlyIvrStep5Val + roRlyIvrrStep5Val + roDuRotnStep5Val + roDuIvrStep5Val + roDuIvrrStep5Val + roRepceRotnStep5Val + roRepceIvrStep5Val + roRepceIvrrStep5Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep5Val = '';
						}

					},
					editable : function(value, data) {
						var roStep5Val = setIsNaNCheck(parseInt(data.roStep5Val));
						var roRlyRotnStep5Val = setIsNaNCheck(parseInt(data.roRlyRotnStep5Val));
						var roRlyIvrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrStep5Val));
						var roRlyIvrrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep5Val));
						var roDuRotnStep5Val = setIsNaNCheck(parseInt(data.roDuRotnStep5Val));
						var roDuIvrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrStep5Val));
						var roDuIvrrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrrStep5Val));
						var roRepceRotnStep5Val = setIsNaNCheck(parseInt(data.roRepceRotnStep5Val));
						var roRepceIvrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrStep5Val));
						var roRepceIvrrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep5Val));

						var strVal =  roStep5Val + roRlyRotnStep5Val + roRlyIvrStep5Val + roRlyIvrrStep5Val + roDuRotnStep5Val + roDuIvrStep5Val + roDuIvrrStep5Val + roRepceRotnStep5Val + roRepceIvrStep5Val + roRepceIvrrStep5Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep6Val', align:'center', title : ro6+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep6Val = setIsNaNCheck(parseInt(data.roStep6Val));
						var roRlyRotnStep6Val = setIsNaNCheck(parseInt(data.roRlyRotnStep6Val));
						var roRlyIvrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrStep6Val));
						var roRlyIvrrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep6Val));
						var roDuRotnStep6Val = setIsNaNCheck(parseInt(data.roDuRotnStep6Val));
						var roDuIvrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrStep6Val));
						var roDuIvrrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrrStep6Val));
						var roRepceRotnStep6Val = setIsNaNCheck(parseInt(data.roRepceRotnStep6Val));
						var roRepceIvrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrStep6Val));
						var roRepceIvrrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep6Val));

						var tmpCnt =  roStep6Val + roRlyRotnStep6Val + roRlyIvrStep6Val + roRlyIvrrStep6Val + roDuRotnStep6Val + roDuIvrStep6Val + roDuIvrrStep6Val + roRepceRotnStep6Val + roRepceIvrStep6Val + roRepceIvrrStep6Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep6Val = '';
						}

					},
					editable : function(value, data) {
						var roStep6Val = setIsNaNCheck(parseInt(data.roStep6Val));
						var roRlyRotnStep6Val = setIsNaNCheck(parseInt(data.roRlyRotnStep6Val));
						var roRlyIvrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrStep6Val));
						var roRlyIvrrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep6Val));
						var roDuRotnStep6Val = setIsNaNCheck(parseInt(data.roDuRotnStep6Val));
						var roDuIvrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrStep6Val));
						var roDuIvrrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrrStep6Val));
						var roRepceRotnStep6Val = setIsNaNCheck(parseInt(data.roRepceRotnStep6Val));
						var roRepceIvrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrStep6Val));
						var roRepceIvrrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep6Val));

						var strVal =  roStep6Val + roRlyRotnStep6Val + roRlyIvrStep6Val + roRlyIvrrStep6Val + roDuRotnStep6Val + roDuIvrStep6Val + roDuIvrrStep6Val + roRepceRotnStep6Val + roRepceIvrStep6Val + roRepceIvrrStep6Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep7Val', align:'center', title : ro7+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep7Val = setIsNaNCheck(parseInt(data.roStep7Val));
						var roRlyRotnStep7Val = setIsNaNCheck(parseInt(data.roRlyRotnStep7Val));
						var roRlyIvrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrStep7Val));
						var roRlyIvrrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep7Val));
						var roDuRotnStep7Val = setIsNaNCheck(parseInt(data.roDuRotnStep7Val));
						var roDuIvrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrStep7Val));
						var roDuIvrrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrrStep7Val));
						var roRepceRotnStep7Val = setIsNaNCheck(parseInt(data.roRepceRotnStep7Val));
						var roRepceIvrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrStep7Val));
						var roRepceIvrrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep7Val));

						var tmpCnt =  roStep7Val + roRlyRotnStep7Val + roRlyIvrStep7Val + roRlyIvrrStep7Val + roDuRotnStep7Val + roDuIvrStep7Val + roDuIvrrStep7Val + roRepceRotnStep7Val + roRepceIvrStep7Val + roRepceIvrrStep7Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep7Val = '';
						}

					},
					editable : function(value, data) {
						var roStep7Val = setIsNaNCheck(parseInt(data.roStep7Val));
						var roRlyRotnStep7Val = setIsNaNCheck(parseInt(data.roRlyRotnStep7Val));
						var roRlyIvrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrStep7Val));
						var roRlyIvrrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep7Val));
						var roDuRotnStep7Val = setIsNaNCheck(parseInt(data.roDuRotnStep7Val));
						var roDuIvrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrStep7Val));
						var roDuIvrrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrrStep7Val));
						var roRepceRotnStep7Val = setIsNaNCheck(parseInt(data.roRepceRotnStep7Val));
						var roRepceIvrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrStep7Val));
						var roRepceIvrrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep7Val));

						var strVal =  roStep7Val + roRlyRotnStep7Val + roRlyIvrStep7Val + roRlyIvrrStep7Val + roDuRotnStep7Val + roDuIvrStep7Val + roDuIvrrStep7Val + roRepceRotnStep7Val + roRepceIvrStep7Val + roRepceIvrrStep7Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep8Val', align:'center', title : ro8+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep8Val = setIsNaNCheck(parseInt(data.roStep8Val));
						var roRlyRotnStep8Val = setIsNaNCheck(parseInt(data.roRlyRotnStep8Val));
						var roRlyIvrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrStep8Val));
						var roRlyIvrrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep8Val));
						var roDuRotnStep8Val = setIsNaNCheck(parseInt(data.roDuRotnStep8Val));
						var roDuIvrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrStep8Val));
						var roDuIvrrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrrStep8Val));
						var roRepceRotnStep8Val = setIsNaNCheck(parseInt(data.roRepceRotnStep8Val));
						var roRepceIvrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrStep8Val));
						var roRepceIvrrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep8Val));

						var tmpCnt =  roStep8Val + roRlyRotnStep8Val + roRlyIvrStep8Val + roRlyIvrrStep8Val + roDuRotnStep8Val + roDuIvrStep8Val + roDuIvrrStep8Val + roRepceRotnStep8Val + roRepceIvrStep8Val + roRepceIvrrStep8Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep8Val = '';
						}

					},
					editable : function(value, data) {
						var roStep8Val = setIsNaNCheck(parseInt(data.roStep8Val));
						var roRlyRotnStep8Val = setIsNaNCheck(parseInt(data.roRlyRotnStep8Val));
						var roRlyIvrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrStep8Val));
						var roRlyIvrrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep8Val));
						var roDuRotnStep8Val = setIsNaNCheck(parseInt(data.roDuRotnStep8Val));
						var roDuIvrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrStep8Val));
						var roDuIvrrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrrStep8Val));
						var roRepceRotnStep8Val = setIsNaNCheck(parseInt(data.roRepceRotnStep8Val));
						var roRepceIvrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrStep8Val));
						var roRepceIvrrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep8Val));

						var strVal =  roStep8Val + roRlyRotnStep8Val + roRlyIvrStep8Val + roRlyIvrrStep8Val + roDuRotnStep8Val + roDuIvrStep8Val + roDuIvrrStep8Val + roRepceRotnStep8Val + roRepceIvrStep8Val + roRepceIvrrStep8Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep9Val', align:'center', title : ro9+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep9Val = setIsNaNCheck(parseInt(data.roStep9Val));
						var roRlyRotnStep9Val = setIsNaNCheck(parseInt(data.roRlyRotnStep9Val));
						var roRlyIvrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrStep9Val));
						var roRlyIvrrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep9Val));
						var roDuRotnStep9Val = setIsNaNCheck(parseInt(data.roDuRotnStep9Val));
						var roDuIvrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrStep9Val));
						var roDuIvrrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrrStep9Val));
						var roRepceRotnStep9Val = setIsNaNCheck(parseInt(data.roRepceRotnStep9Val));
						var roRepceIvrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrStep9Val));
						var roRepceIvrrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep9Val));

						var tmpCnt =  roStep9Val + roRlyRotnStep9Val + roRlyIvrStep9Val + roRlyIvrrStep9Val + roDuRotnStep9Val + roDuIvrStep9Val + roDuIvrrStep9Val + roRepceRotnStep9Val + roRepceIvrStep9Val + roRepceIvrrStep9Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep9Val = '';
						}

					},
					editable : function(value, data) {
						var roStep9Val = setIsNaNCheck(parseInt(data.roStep9Val));
						var roRlyRotnStep9Val = setIsNaNCheck(parseInt(data.roRlyRotnStep9Val));
						var roRlyIvrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrStep9Val));
						var roRlyIvrrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep9Val));
						var roDuRotnStep9Val = setIsNaNCheck(parseInt(data.roDuRotnStep9Val));
						var roDuIvrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrStep9Val));
						var roDuIvrrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrrStep9Val));
						var roRepceRotnStep9Val = setIsNaNCheck(parseInt(data.roRepceRotnStep9Val));
						var roRepceIvrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrStep9Val));
						var roRepceIvrrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep9Val));

						var strVal =  roStep9Val + roRlyRotnStep9Val + roRlyIvrStep9Val + roRlyIvrrStep9Val + roDuRotnStep9Val + roDuIvrStep9Val + roDuIvrrStep9Val + roRepceRotnStep9Val + roRepceIvrStep9Val + roRepceIvrrStep9Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep10Val', align:'center', title : ro10+'단계', width: '70', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var roStep10Val = setIsNaNCheck(parseInt(data.roStep10Val));
						var roRlyRotnStep10Val = setIsNaNCheck(parseInt(data.roRlyRotnStep10Val));
						var roRlyIvrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrStep10Val));
						var roRlyIvrrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep10Val));
						var roDuRotnStep10Val = setIsNaNCheck(parseInt(data.roDuRotnStep10Val));
						var roDuIvrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrStep10Val));
						var roDuIvrrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrrStep10Val));
						var roRepceRotnStep10Val = setIsNaNCheck(parseInt(data.roRepceRotnStep10Val));
						var roRepceIvrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrStep10Val));
						var roRepceIvrrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep10Val));

						var tmpCnt =  roStep10Val + roRlyRotnStep10Val + roRlyIvrStep10Val + roRlyIvrrStep10Val + roDuRotnStep10Val + roDuIvrStep10Val + roDuIvrrStep10Val + roRepceRotnStep10Val + roRepceIvrStep10Val + roRepceIvrrStep10Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep10Val = '';
						}

					},
					editable : function(value, data) {
						var roStep10Val = setIsNaNCheck(parseInt(data.roStep10Val));
						var roRlyRotnStep10Val = setIsNaNCheck(parseInt(data.roRlyRotnStep10Val));
						var roRlyIvrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrStep10Val));
						var roRlyIvrrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep10Val));
						var roDuRotnStep10Val = setIsNaNCheck(parseInt(data.roDuRotnStep10Val));
						var roDuIvrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrStep10Val));
						var roDuIvrrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrrStep10Val));
						var roRepceRotnStep10Val = setIsNaNCheck(parseInt(data.roRepceRotnStep10Val));
						var roRepceIvrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrStep10Val));
						var roRepceIvrrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep10Val));

						var strVal =  roStep10Val + roRlyRotnStep10Val + roRlyIvrStep10Val + roRlyIvrrStep10Val + roDuRotnStep10Val + roDuIvrStep10Val + roDuIvrrStep10Val + roRepceRotnStep10Val + roRepceIvrStep10Val + roRepceIvrrStep10Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDsnDuhVal', align:'center', title : 'RO '+nowYear+'년도 DUH 소계', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.roDuhStep1Val)) + setIsNaNCheck(parseInt(data.roDuhStep2Val)) + setIsNaNCheck(parseInt(data.roDuhStep3Val)) + setIsNaNCheck(parseInt(data.roDuhStep4Val)) + setIsNaNCheck(parseInt(data.roDuhStep5Val)) + setIsNaNCheck(parseInt(data.roDuhStep6Val)) + setIsNaNCheck(parseInt(data.roDuhStep7Val)) + setIsNaNCheck(parseInt(data.roDuhStep8Val)) + setIsNaNCheck(parseInt(data.roDuhStep9Val)) + setIsNaNCheck(parseInt(data.roDuhStep10Val));
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDsnDuhVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.roDuhStep1Val)) + setIsNaNCheck(parseInt(data.roDuhStep2Val)) + setIsNaNCheck(parseInt(data.roDuhStep3Val)) + setIsNaNCheck(parseInt(data.roDuhStep4Val)) + setIsNaNCheck(parseInt(data.roDuhStep5Val)) + setIsNaNCheck(parseInt(data.roDuhStep6Val)) + setIsNaNCheck(parseInt(data.roDuhStep7Val)) + setIsNaNCheck(parseInt(data.roDuhStep8Val)) + setIsNaNCheck(parseInt(data.roDuhStep9Val)) + setIsNaNCheck(parseInt(data.roDuhStep10Val));
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhAreaVal', align:'center', title : '지역 Acc/유선 확인', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){

						var tmpCnt =  value;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhAreaVal = '';
						}

					},

					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuhAreaVal == undefined || data.roDuhAreaVal == null || data.roDuhAreaVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhHdqtrVal', align:'center', title : 'Acc. Eng 설계 기준', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){

						var tmpCnt =  value;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhHdqtrVal = '';
						}

					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuhHdqtrVal == undefined || data.roDuhHdqtrVal == null || data.roDuhHdqtrVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'roStep1Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep1Val == undefined || data.roStep1Val == null || data.roStep1Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep1Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep1Val == undefined || data.roRlyRotnStep1Val == null || data.roRlyRotnStep1Val == "" || isNaN(data.roRlyRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep1Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep1Val == undefined || data.roRlyIvrStep1Val == null || data.roRlyIvrStep1Val == "" || isNaN(data.roRlyIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep1Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep1Val == undefined || data.roRlyIvrrStep1Val == null || data.roRlyIvrrStep1Val == "" || isNaN(data.roRlyIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep1Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep1Val == undefined || data.roDuRotnStep1Val == null || data.roDuRotnStep1Val == "" || isNaN(data.roDuRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep1Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep1Val == undefined || data.roDuIvrStep1Val == null || data.roDuIvrStep1Val == "" || isNaN(data.roDuIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep1Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep1Val == undefined || data.roDuIvrrStep1Val == null || data.roDuIvrrStep1Val == "" || isNaN(data.roDuIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep1Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep1Val == undefined || data.roRepceRotnStep1Val == null || data.roRepceRotnStep1Val == "" || isNaN(data.roRepceRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep1Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep1Val == undefined || data.roRepceIvrStep1Val == null || data.roRepceIvrStep1Val == "" || isNaN(data.roRepceIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep1Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep1Val == undefined || data.roRepceIvrrStep1Val == null || data.roRepceIvrrStep1Val == "" || isNaN(data.roRepceIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'roStep2Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep2Val == undefined || data.roStep2Val == null || data.roStep2Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep2Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep2Val == undefined || data.roRlyRotnStep2Val == null || data.roRlyRotnStep2Val == "" || isNaN(data.roRlyRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep2Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep2Val == undefined || data.roRlyIvrStep2Val == null || data.roRlyIvrStep2Val == "" || isNaN(data.roRlyIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep2Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep2Val == undefined || data.roRlyIvrrStep2Val == null || data.roRlyIvrrStep2Val == "" || isNaN(data.roRlyIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep2Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep2Val == undefined || data.roDuRotnStep2Val == null || data.roDuRotnStep2Val == "" || isNaN(data.roDuRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep2Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep2Val == undefined || data.roDuIvrStep2Val == null || data.roDuIvrStep2Val == "" || isNaN(data.roDuIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep2Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep2Val == undefined || data.roDuIvrrStep2Val == null || data.roDuIvrrStep2Val == "" || isNaN(data.roDuIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep2Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep2Val == undefined || data.roRepceRotnStep2Val == null || data.roRepceRotnStep2Val == "" || isNaN(data.roRepceRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep2Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep2Val == undefined || data.roRepceIvrStep2Val == null || data.roRepceIvrStep2Val == "" || isNaN(data.roRepceIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep2Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep2Val == undefined || data.roRepceIvrrStep2Val == null || data.roRepceIvrrStep2Val == "" || isNaN(data.roRepceIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},








				{ key : 'roStep3Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep3Val == undefined || data.roStep3Val == null || data.roStep3Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep3Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep3Val == undefined || data.roRlyRotnStep3Val == null || data.roRlyRotnStep3Val == "" || isNaN(data.roRlyRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep3Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep3Val == undefined || data.roRlyIvrStep3Val == null || data.roRlyIvrStep3Val == "" || isNaN(data.roRlyIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep3Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep3Val == undefined || data.roRlyIvrrStep3Val == null || data.roRlyIvrrStep3Val == "" || isNaN(data.roRlyIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep3Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep3Val == undefined || data.roDuRotnStep3Val == null || data.roDuRotnStep3Val == "" || isNaN(data.roDuRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep3Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep3Val == undefined || data.roDuIvrStep3Val == null || data.roDuIvrStep3Val == "" || isNaN(data.roDuIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep3Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep3Val == undefined || data.roDuIvrrStep3Val == null || data.roDuIvrrStep3Val == "" || isNaN(data.roDuIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep3Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep3Val == undefined || data.roRepceRotnStep3Val == null || data.roRepceRotnStep3Val == "" || isNaN(data.roRepceRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep3Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep3Val == undefined || data.roRepceIvrStep3Val == null || data.roRepceIvrStep3Val == "" || isNaN(data.roRepceIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep3Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep3Val == undefined || data.roRepceIvrrStep3Val == null || data.roRepceIvrrStep3Val == "" || isNaN(data.roRepceIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},










				{ key : 'roStep4Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep4Val == undefined || data.roStep4Val == null || data.roStep4Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep4Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep4Val == undefined || data.roRlyRotnStep4Val == null || data.roRlyRotnStep4Val == "" || isNaN(data.roRlyRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep4Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep4Val == undefined || data.roRlyIvrStep4Val == null || data.roRlyIvrStep4Val == "" || isNaN(data.roRlyIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep4Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep4Val == undefined || data.roRlyIvrrStep4Val == null || data.roRlyIvrrStep4Val == "" || isNaN(data.roRlyIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep4Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep4Val == undefined || data.roDuRotnStep4Val == null || data.roDuRotnStep4Val == "" || isNaN(data.roDuRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep4Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep4Val == undefined || data.roDuIvrStep4Val == null || data.roDuIvrStep4Val == "" || isNaN(data.roDuIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep4Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep4Val == undefined || data.roDuIvrrStep4Val == null || data.roDuIvrrStep4Val == "" || isNaN(data.roDuIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep4Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep4Val == undefined || data.roRepceRotnStep4Val == null || data.roRepceRotnStep4Val == "" || isNaN(data.roRepceRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep4Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep4Val == undefined || data.roRepceIvrStep4Val == null || data.roRepceIvrStep4Val == "" || isNaN(data.roRepceIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep4Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep4Val == undefined || data.roRepceIvrrStep4Val == null || data.roRepceIvrrStep4Val == "" || isNaN(data.roRepceIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},









				{ key : 'roStep5Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep5Val == undefined || data.roStep5Val == null || data.roStep5Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep5Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep5Val == undefined || data.roRlyRotnStep5Val == null || data.roRlyRotnStep5Val == "" || isNaN(data.roRlyRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep5Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep5Val == undefined || data.roRlyIvrStep5Val == null || data.roRlyIvrStep5Val == "" || isNaN(data.roRlyIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep5Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep5Val == undefined || data.roRlyIvrrStep5Val == null || data.roRlyIvrrStep5Val == "" || isNaN(data.roRlyIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep5Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep5Val == undefined || data.roDuRotnStep5Val == null || data.roDuRotnStep5Val == "" || isNaN(data.roDuRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep5Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep5Val == undefined || data.roDuIvrStep5Val == null || data.roDuIvrStep5Val == "" || isNaN(data.roDuIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep5Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep5Val == undefined || data.roDuIvrrStep5Val == null || data.roDuIvrrStep5Val == "" || isNaN(data.roDuIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep5Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep5Val == undefined || data.roRepceRotnStep5Val == null || data.roRepceRotnStep5Val == "" || isNaN(data.roRepceRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep5Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep5Val == undefined || data.roRepceIvrStep5Val == null || data.roRepceIvrStep5Val == "" || isNaN(data.roRepceIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep5Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep5Val == undefined || data.roRepceIvrrStep5Val == null || data.roRepceIvrrStep5Val == "" || isNaN(data.roRepceIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},








				{ key : 'roStep6Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep6Val == undefined || data.roStep6Val == null || data.roStep6Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep6Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep6Val == undefined || data.roRlyRotnStep6Val == null || data.roRlyRotnStep6Val == "" || isNaN(data.roRlyRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep6Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep6Val == undefined || data.roRlyIvrStep6Val == null || data.roRlyIvrStep6Val == "" || isNaN(data.roRlyIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep6Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep6Val == undefined || data.roRlyIvrrStep6Val == null || data.roRlyIvrrStep6Val == "" || isNaN(data.roRlyIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep6Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep6Val == undefined || data.roDuRotnStep6Val == null || data.roDuRotnStep6Val == "" || isNaN(data.roDuRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep6Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep6Val == undefined || data.roDuIvrStep6Val == null || data.roDuIvrStep6Val == "" || isNaN(data.roDuIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep6Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep6Val == undefined || data.roDuIvrrStep6Val == null || data.roDuIvrrStep6Val == "" || isNaN(data.roDuIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep6Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep6Val == undefined || data.roRepceRotnStep6Val == null || data.roRepceRotnStep6Val == "" || isNaN(data.roRepceRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep6Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep6Val == undefined || data.roRepceIvrStep6Val == null || data.roRepceIvrStep6Val == "" || isNaN(data.roRepceIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep6Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep6Val == undefined || data.roRepceIvrrStep6Val == null || data.roRepceIvrrStep6Val == "" || isNaN(data.roRepceIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},







				{ key : 'roStep7Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep7Val == undefined || data.roStep7Val == null || data.roStep7Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep7Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep7Val == undefined || data.roRlyRotnStep7Val == null || data.roRlyRotnStep7Val == "" || isNaN(data.roRlyRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep7Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep7Val == undefined || data.roRlyIvrStep7Val == null || data.roRlyIvrStep7Val == "" || isNaN(data.roRlyIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep7Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep7Val == undefined || data.roRlyIvrrStep7Val == null || data.roRlyIvrrStep7Val == "" || isNaN(data.roRlyIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep7Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep7Val == undefined || data.roDuRotnStep7Val == null || data.roDuRotnStep7Val == "" || isNaN(data.roDuRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep7Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep7Val == undefined || data.roDuIvrStep7Val == null || data.roDuIvrStep7Val == "" || isNaN(data.roDuIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep7Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep7Val == undefined || data.roDuIvrrStep7Val == null || data.roDuIvrrStep7Val == "" || isNaN(data.roDuIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep7Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep7Val == undefined || data.roRepceRotnStep7Val == null || data.roRepceRotnStep7Val == "" || isNaN(data.roRepceRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep7Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep7Val == undefined || data.roRepceIvrStep7Val == null || data.roRepceIvrStep7Val == "" || isNaN(data.roRepceIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep7Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep7Val == undefined || data.roRepceIvrrStep7Val == null || data.roRepceIvrrStep7Val == "" || isNaN(data.roRepceIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},











				{ key : 'roStep8Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep8Val == undefined || data.roStep8Val == null || data.roStep8Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep8Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep8Val == undefined || data.roRlyRotnStep8Val == null || data.roRlyRotnStep8Val == "" || isNaN(data.roRlyRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep8Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep8Val == undefined || data.roRlyIvrStep8Val == null || data.roRlyIvrStep8Val == "" || isNaN(data.roRlyIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep8Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep8Val == undefined || data.roRlyIvrrStep8Val == null || data.roRlyIvrrStep8Val == "" || isNaN(data.roRlyIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep8Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep8Val == undefined || data.roDuRotnStep8Val == null || data.roDuRotnStep8Val == "" || isNaN(data.roDuRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep8Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep8Val == undefined || data.roDuIvrStep8Val == null || data.roDuIvrStep8Val == "" || isNaN(data.roDuIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep8Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep8Val == undefined || data.roDuIvrrStep8Val == null || data.roDuIvrrStep8Val == "" || isNaN(data.roDuIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep8Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep8Val == undefined || data.roRepceRotnStep8Val == null || data.roRepceRotnStep8Val == "" || isNaN(data.roRepceRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep8Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep8Val == undefined || data.roRepceIvrStep8Val == null || data.roRepceIvrStep8Val == "" || isNaN(data.roRepceIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep8Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep8Val == undefined || data.roRepceIvrrStep8Val == null || data.roRepceIvrrStep8Val == "" || isNaN(data.roRepceIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},









				{ key : 'roStep9Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep9Val == undefined || data.roStep9Val == null || data.roStep9Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep9Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep9Val == undefined || data.roRlyRotnStep9Val == null || data.roRlyRotnStep9Val == "" || isNaN(data.roRlyRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep9Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep9Val == undefined || data.roRlyIvrStep9Val == null || data.roRlyIvrStep9Val == "" || isNaN(data.roRlyIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep9Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep9Val == undefined || data.roRlyIvrrStep9Val == null || data.roRlyIvrrStep9Val == "" || isNaN(data.roRlyIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep9Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep9Val == undefined || data.roDuRotnStep9Val == null || data.roDuRotnStep9Val == "" || isNaN(data.roDuRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep9Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep9Val == undefined || data.roDuIvrStep9Val == null || data.roDuIvrStep9Val == "" || isNaN(data.roDuIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep9Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep9Val == undefined || data.roDuIvrrStep9Val == null || data.roDuIvrrStep9Val == "" || isNaN(data.roDuIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep9Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep9Val == undefined || data.roRepceRotnStep9Val == null || data.roRepceRotnStep9Val == "" || isNaN(data.roRepceRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep9Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep9Val == undefined || data.roRepceIvrStep9Val == null || data.roRepceIvrStep9Val == "" || isNaN(data.roRepceIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep9Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep9Val == undefined || data.roRepceIvrrStep9Val == null || data.roRepceIvrrStep9Val == "" || isNaN(data.roRepceIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'roStep10Val', align:'center', title : 'DUH(식수)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep10Val == undefined || data.roStep10Val == null || data.roStep10Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep10Val', align:'center', title : '중계노드 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep10Val == undefined || data.roRlyRotnStep10Val == null || data.roRlyRotnStep10Val == "" || isNaN(data.roRlyRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep10Val', align:'center', title : '중계노드 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep10Val == undefined || data.roRlyIvrStep10Val == null || data.roRlyIvrStep10Val == "" || isNaN(data.roRlyIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep10Val', align:'center', title : '중계노드 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep10Val == undefined || data.roRlyIvrrStep10Val == null || data.roRlyIvrrStep10Val == "" || isNaN(data.roRlyIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep10Val', align:'center', title : 'DU ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep10Val == undefined || data.roDuRotnStep10Val == null || data.roDuRotnStep10Val == "" || isNaN(data.roDuRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep10Val', align:'center', title : 'DU IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep10Val == undefined || data.roDuIvrStep10Val == null || data.roDuIvrStep10Val == "" || isNaN(data.roDuIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep10Val', align:'center', title : 'DU IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep10Val == undefined || data.roDuIvrrStep10Val == null || data.roDuIvrrStep10Val == "" || isNaN(data.roDuIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep10Val', align:'center', title : '대개체 ROTN', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep10Val == undefined || data.roRepceRotnStep10Val == null || data.roRepceRotnStep10Val == "" || isNaN(data.roRepceRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep10Val', align:'center', title : '대개체 IVR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep10Val == undefined || data.roRepceIvrStep10Val == null || data.roRepceIvrStep10Val == "" || isNaN(data.roRepceIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep10Val', align:'center', title : '대개체 IVRR', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep10Val == undefined || data.roRepceIvrrStep10Val == null || data.roRepceIvrrStep10Val == "" || isNaN(data.roRepceIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





				{ key : 'ctrtEpwrVal', align:'center', title : '계약전력(Kw)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.ctrtEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'loadEpwrVal', align:'center', title : '부하전력(Kw)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.loadEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'loadEpwrRate', align:'center', title : '부하율(%)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.loadEpwrRate = '';
						}
					},
					editable : function(value, data) {
						var strVal =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g2RemvRackCnt', align:'center', title : '철거랙수', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g2RemvRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g2ScreEpwrVal', align:'center', title : '확보전력(Kw)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g2ScreEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 60 */	{ key : 'lteCellCnt', align:'center', title : 'CELL', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lteCellCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'lteDuCnt', align:'center', title : 'DU', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lteDuCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'etc1xCnt', align:'center', title : '1X', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.etc1xCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'etcWbrCnt', align:'center', title : 'WIBRO', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.etcWbrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
/* 제어되지 않음. */ 	{ key : 'lgcyEpwrVal', align:'center', title : 'Legacy 전력량(Kw)', width: '180', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lgcyEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'addDemdRackCnt', align:'center', title : '랙수', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.addDemdRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'addDemdEpwrVal', align:'center', title : '전력량(Kw)', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.addDemdEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 70 */	{ key : 'sggDulAcptVal', align:'center', title : '시군구 DUL수용 비율', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sggDulAcptVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DulCnt', align:'center', title : 'DUL수', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DulCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhCnt', align:'center', title : 'DUH수', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhRackCnt', align:'center', title : 'DUH랙수', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhEpwrVal', align:'center', title : 'DUL전력량(Kw)', width: '110' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},















				{ key : 'trmsRotnCnt', align:'center', title : 'ROTN', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsRotnCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrCnt', align:'center', title : 'IVR', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrrCnt', align:'center', title : 'IVRR', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trms5gponCnt', align:'center', title : '5GPON', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trms5gponCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 80 */	{ key : 'trmsSmuxCnt', align:'center', title : 'SMUX', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsSmuxCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsFdfCnt', align:'center', title : 'FDF', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsFdfCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsRackSubtCnt', align:'center', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.trmsRackSubtCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'trmsRotnEpwrVal', align:'center', title : 'ROTN', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsRotnEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrEpwrVal', align:'center', title : 'IVR', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrrEpwrVal', align:'center', title : 'IVRR', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrrEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trms5gponEpwrVal', align:'center', title : '5GPON', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trms5gponEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsSubtEpwrVal', align:'center', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.trmsSubtEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'sbeqpRtfRackCnt', align:'center', title : '정류기랙수', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpRtfRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpIpdCnt', align:'center', title : 'IPD', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpIpdCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 90 */	{ key : 'sbeqpArcnCnt', align:'center', title : '냉방기', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpArcnCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpBatryCnt', align:'center', title : '축전지', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpBatryCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpSubtCnt', align:'center', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.sbeqpSubtCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'upsdDemdRackCnt', align:'center', title : '랙수', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.upsdDemdRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'upsdDemdEpwrVal', align:'center', title : '소모전력(Kw)', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.upsdDemdEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'remRackCnt', align:'center', title : '잔여랙수', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.remRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'remEpwrVal', align:'center', title : '잔여전력(Kw)', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.remEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'shtgItmCd', align:'center', title : '부족항목', width: '130' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grShtgItmCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grShtgItmCd) {
								var exist = '';

								if (value && value.indexOf(grShtgItmCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grShtgItmCd[i].value+' '+exist+'>'+grShtgItmCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},

				{ key : 'screPsblEpwrVal', align:'center', title : '최대확보가능전력(Kw)', width: '110' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screPsblEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'accmEpwrVal', align:'center', title : '누적전력(Kw)', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screPsblEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'epwrUseRate', align:'center', title : '전력현재사용율(%)', width: '110' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.epwrUseRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 100 */	{ key : 'epwrRfctInvtCost', align:'right', title : '전력보강투자비', width: '110' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.epwrRfctInvtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'rmk', align:'left', title : '비고', width: '100' , highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.rmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'bfSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.bfLandCost)) + setIsNaNCheck(parseInt(data.bfNbdCost)) + setIsNaNCheck(parseInt(data.bfLinCost)) + setIsNaNCheck(parseInt(data.bfRprCost))  + setIsNaNCheck(parseInt(data.bfBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.bfSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.bfLandCost)) + setIsNaNCheck(parseInt(data.bfNbdCost)) + setIsNaNCheck(parseInt(data.bfLinCost)) + setIsNaNCheck(parseInt(data.bfRprCost))  + setIsNaNCheck(parseInt(data.bfBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//18 Year
				{ key : 'bfLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfRmk', align:'left', title : '비고', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.bfRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'invtTypCd', align:'center', title : '투자유형', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grInvtCd);
								return render_data;
							} else {
								data.invtTypCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grInvtCd) {
								var exist = '';

								if (value && value.indexOf(grInvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grInvtCd[i].value+' '+exist+'>'+grInvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},		// 19Year 1~4
	/* 110 */	{ key : 'afeSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost)) +
						setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost)) +
						setIsNaNCheck(parseInt(data.afeFstNbdCost)) +
						setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFstLinCost)) +
						setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost)) +
						setIsNaNCheck(parseInt(data.afeFstRprCost)) +
						setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost)) +
						setIsNaNCheck(parseInt(data.afeFstBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstLandCost)) +
						setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost)) +
						setIsNaNCheck(parseInt(data.afeFstNbdCost)) +
						setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFstLinCost)) +
						setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost)) +
						setIsNaNCheck(parseInt(data.afeFstRprCost)) +
						setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost)) +
						setIsNaNCheck(parseInt(data.afeFstBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'afeLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost))
						+ setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstLandCost))
						+ setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstNbdCost))
						+ setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstNbdCost))
						+ setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLinCost))
						+ setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstLinCost))
						+ setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstRprCost))
						+ setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstRprCost))
						+ setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstBascEnvCost))
						+ setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstBascEnvCost))
						+ setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},







				{ key : 'afeFstSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost)) + setIsNaNCheck(parseInt(data.afeFstNbdCost)) + setIsNaNCheck(parseInt(data.afeFstLinCost)) + setIsNaNCheck(parseInt(data.afeFstRprCost))  + setIsNaNCheck(parseInt(data.afeFstBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFstSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstLandCost)) + setIsNaNCheck(parseInt(data.afeFstNbdCost)) + setIsNaNCheck(parseInt(data.afeFstLinCost)) + setIsNaNCheck(parseInt(data.afeFstRprCost))  + setIsNaNCheck(parseInt(data.afeFstBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			// 19 1 AFE
				{ key : 'afeFstLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 120 */	{ key : 'afeFstRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeScndSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeScndLandCost)) + setIsNaNCheck(parseInt(data.afeScndNbdCost)) + setIsNaNCheck(parseInt(data.afeScndLinCost)) + setIsNaNCheck(parseInt(data.afeScndRprCost))  + setIsNaNCheck(parseInt(data.afeScndBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeScndSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeScndLandCost)) + setIsNaNCheck(parseInt(data.afeScndNbdCost)) + setIsNaNCheck(parseInt(data.afeScndLinCost)) + setIsNaNCheck(parseInt(data.afeScndRprCost))  + setIsNaNCheck(parseInt(data.afeScndBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 2
				{ key : 'afeScndLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



	/* 130 */	{ key : 'afeThrdSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeThrdLandCost)) + setIsNaNCheck(parseInt(data.afeThrdNbdCost)) + setIsNaNCheck(parseInt(data.afeThrdLinCost)) + setIsNaNCheck(parseInt(data.afeThrdRprCost))  + setIsNaNCheck(parseInt(data.afeThrdBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeThrdSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeThrdLandCost)) + setIsNaNCheck(parseInt(data.afeThrdNbdCost)) + setIsNaNCheck(parseInt(data.afeThrdLinCost)) + setIsNaNCheck(parseInt(data.afeThrdRprCost))  + setIsNaNCheck(parseInt(data.afeThrdBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 3
				{ key : 'afeThrdLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'afeFothSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFothLandCost)) + setIsNaNCheck(parseInt(data.afeFothNbdCost)) + setIsNaNCheck(parseInt(data.afeFothLinCost)) + setIsNaNCheck(parseInt(data.afeFothRprCost))  + setIsNaNCheck(parseInt(data.afeFothBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFothSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFothLandCost)) + setIsNaNCheck(parseInt(data.afeFothNbdCost)) + setIsNaNCheck(parseInt(data.afeFothLinCost)) + setIsNaNCheck(parseInt(data.afeFothRprCost))  + setIsNaNCheck(parseInt(data.afeFothBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeFothLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeFothLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeFithSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFithLandCost)) + setIsNaNCheck(parseInt(data.afeFithNbdCost)) + setIsNaNCheck(parseInt(data.afeFithLinCost)) + setIsNaNCheck(parseInt(data.afeFithRprCost))  + setIsNaNCheck(parseInt(data.afeFithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFithSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFithLandCost)) + setIsNaNCheck(parseInt(data.afeFithNbdCost)) + setIsNaNCheck(parseInt(data.afeFithLinCost)) + setIsNaNCheck(parseInt(data.afeFithRprCost))  + setIsNaNCheck(parseInt(data.afeFithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeFithLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeFithLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},




				{ key : 'afeSithSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeSithLandCost)) + setIsNaNCheck(parseInt(data.afeSithNbdCost)) + setIsNaNCheck(parseInt(data.afeSithLinCost)) + setIsNaNCheck(parseInt(data.afeSithRprCost))  + setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeSithSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeSithLandCost)) + setIsNaNCheck(parseInt(data.afeSithNbdCost)) + setIsNaNCheck(parseInt(data.afeSithLinCost)) + setIsNaNCheck(parseInt(data.afeSithRprCost))  + setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeSithLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeSithLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





//				{ key : 'afeFothRmk', align:'center', title : '비고', width: '100',
//					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
//					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" tabindex="10128"/></div>'; }  },
///* 제어되지 않음. */ 	{ key : 'nxtDulSubtCost', align:'center', title : '투자유형', width: '100',
//					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
//					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" tabindex="10129"/></div>'; }  },		//	20 DUL
				{ key : 'nxtDulSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.nxtDulLandCost)) + setIsNaNCheck(parseInt(data.nxtDulNbdCost)) + setIsNaNCheck(parseInt(data.nxtDulLinCost)) + setIsNaNCheck(parseInt(data.nxtDulRprCost))  + setIsNaNCheck(parseInt(data.nxtDulBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.nxtDulSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.nxtDulLandCost)) + setIsNaNCheck(parseInt(data.nxtDulNbdCost)) + setIsNaNCheck(parseInt(data.nxtDulLinCost)) + setIsNaNCheck(parseInt(data.nxtDulRprCost))  + setIsNaNCheck(parseInt(data.nxtDulBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 150 */	{ key : 'nxtDulBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
















				{ key : 'nxtDulLandCd', align:'center', title : '토지 우선순위(지역)', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'nxtDulNbdCd', align:'center', title : '건축 우선순위', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'nxtDulInvtCd', align:'center', title : '투자 대상(확인필요)', width: '150', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},



				{ key : 'nxtDulRmk', align:'left', title : '비고', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nxtDulRmk = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'nxtSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.nxtLandCost)) + setIsNaNCheck(parseInt(data.nxtNbdCost)) + setIsNaNCheck(parseInt(data.nxtLinCost)) + setIsNaNCheck(parseInt(data.nxtRprCost))  + setIsNaNCheck(parseInt(data.nxtBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.nxtSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.nxtLandCost)) + setIsNaNCheck(parseInt(data.nxtNbdCost)) + setIsNaNCheck(parseInt(data.nxtLinCost)) + setIsNaNCheck(parseInt(data.nxtRprCost))  + setIsNaNCheck(parseInt(data.nxtBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	21
				{ key : 'nxtLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtRmk', align:'left', title : '비고', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nxtRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},




				{ key : 'screNeedSubtCost', align:'right', title : '소계', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.screNeedLandCost)) + setIsNaNCheck(parseInt(data.screNeedNbdCost)) + setIsNaNCheck(parseInt(data.screNeedLinCost)) + setIsNaNCheck(parseInt(data.screNeedRprCost))  + setIsNaNCheck(parseInt(data.screNeedBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.screNeedSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.screNeedLandCost)) + setIsNaNCheck(parseInt(data.screNeedNbdCost)) + setIsNaNCheck(parseInt(data.screNeedLinCost)) + setIsNaNCheck(parseInt(data.screNeedRprCost))  + setIsNaNCheck(parseInt(data.screNeedBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	18
	/* 160 */	{ key : 'screNeedLandCost', align:'right', title : '토지', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedNbdCost', align:'right', title : '건축', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedLinCost', align:'right', title : '인입관로', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedRprCost', align:'right', title : '대수선', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedBascEnvCost', align:'right', title : '기초환경', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedRmk', align:'left', title : '비고', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.screNeedRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'upsdMgmtYn', align:'center', title : '도면관리', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},

					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDrawYn);
								return render_data;
							} else {
								data.upsdMgmtYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grDrawYn) {
								var exist = '';

								if (value && value.indexOf(grDrawYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grDrawYn[i].value+' '+exist+'>'+grDrawYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'upsdCellMgmtYn', align:'center', title : 'CELL', width: '100', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grCellYn);
								return render_data;
							} else {
								data.upsdCellMgmtYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grCellYn) {
								var exist = '';

								if (value && value.indexOf(grCellYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grCellYn[i].value+' '+exist+'>'+grCellYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'upsdEqpAcrdYn', align:'center', title : '장비-도면일치여부', width: '120', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},

					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grUpsdEqpAcrdYn);
								return render_data;
							} else {
								data.upsdEqpAcrdYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grCellYn) {
								var exist = '';

								if (value && value.indexOf(grUpsdEqpAcrdYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grUpsdEqpAcrdYn[i].value+' '+exist+'>'+grUpsdEqpAcrdYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}

				},
				{ key : 'upsdRmk', align:'left', title : '비고', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn != 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
	/* 170 */	{ key : 'gntHldVal', align:'left', title : '발전기보유', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
				{ key : 'exstrHldVal', align:'left', title : '배풍기', width: '200', highlight : function(value, data, mappig) {if(data.delYn == 'Y') { return "del_row";}},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
				{ key : 'upsdDemdId', align:'center', title : '수요ID', width: '100' },
				{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '100' },
				{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '100' }

				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});



//***********************************************************************************************************
		$('#'+gridIdDtl).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '10row',
			autoResize: true,
			rowClickSelect : true,
            rowSingleSelect : true,
			rowInlineEdit: false,
			cellSelectable : true,
			numberingColumnFromZero: false,
//			defaultState : {
//				dataAdd : {editing : true},
//				dataSet : {editing : true}
//			},
			columnFixUpto : 'mtsoNm',
			headerGroup: [
				{fromIndex:4, toIndex:12, title:'국사 정보'},
				{fromIndex:13, toIndex:20, title:'위치정보'},
				{fromIndex:21, toIndex:23, title:'관리/소유 주체'},
				{fromIndex:24, toIndex:25, title:'확보년도'},
				{fromIndex:26, toIndex:30, title:'규모'},
				{fromIndex:31, toIndex:35, title:'상면현황'},
				{fromIndex:36, toIndex:41, title:'국사 신축 검토'},
				{fromIndex:42, toIndex:43, title:'신규/기본 국사명'},
				{fromIndex:44, toIndex:48, title:'국사 통폐합'},



				{fromIndex:49, toIndex:59, title: bfYear+ '년도 DUH 식수(AFE 계획 기준)'},
				{fromIndex:60, toIndex:60, title: nowYear+ '년도 RO 1~10단계 장비 식수(설계기준)'},
				{fromIndex:61, toIndex:61, title: nowYear+ '년도 RO 1~10단계 식수'},
				{fromIndex:62, toIndex:62, title: nowYear+ '년도 RO 1~10단계 식수'},
				{fromIndex:63, toIndex:72, title: nowYear+ '년도 RO 1 단계'},
				{fromIndex:73, toIndex:82, title: nowYear+ '년도 RO 2 단계'},
				{fromIndex:83, toIndex:92, title: nowYear+ '년도 RO 3 단계'},
				{fromIndex:93, toIndex:102, title: nowYear+ '년도 RO 4 단계'},
				{fromIndex:103, toIndex:112, title: nowYear+ '년도 RO 5 단계'},
				{fromIndex:113, toIndex:122, title: nowYear+ '년도 RO 6 단계'},
				{fromIndex:123, toIndex:132, title: nowYear+ '년도 RO 7 단계'},
				{fromIndex:133, toIndex:142, title: nowYear+ '년도 RO 8 단계'},
				{fromIndex:143, toIndex:152, title: nowYear+ '년도 RO 9 단계'},
				{fromIndex:153, toIndex:162, title: nowYear+ '년도 RO 10 단계'},




				{fromIndex:163, toIndex:165, title:'현재 전력'},
				{fromIndex:166, toIndex:167, title:'2G FadeOut'},
				{fromIndex:168, toIndex:171, title:'LTE/1X/Wibro'},
				{fromIndex:172, toIndex:174, title:'Legacy 종국 추가 수요'},
				{fromIndex:175, toIndex:179, title:'5G 종국 DUH수(개)'},
				{fromIndex:180, toIndex:186, title:'전송 랙수(개)'},
				{fromIndex:187, toIndex:191, title:'전송 전력량(Kw)'},
				{fromIndex:192, toIndex:196, title:'부대물자'},
				{fromIndex:197, toIndex:198, title:'상면 종국 수요'},
				{fromIndex:199, toIndex:206, title:'잔여/누적'},
				{fromIndex:207, toIndex:213, title: bfYear+'년 투자비'},
				{fromIndex:214, toIndex:220, title: nowYear+'년 투자비 합계(백만원)'},
				{fromIndex:221, toIndex:226, title: nowYear+'년 1차 AFE'},
				{fromIndex:227, toIndex:232, title: nowYear+'년 2차 AFE'},
				{fromIndex:233, toIndex:238, title: nowYear+'년 3차 AFE'},
				{fromIndex:239, toIndex:244, title: nowYear+'년 4차 AFE'},
				{fromIndex:245, toIndex:250, title: nowYear+'년 5차 AFE'},
				{fromIndex:251, toIndex:256, title: nowYear+'년 6차 AFE'},
				{fromIndex:257, toIndex:266, title: nxtYear+'년 투자비 DUL 10만(85개시 동단위 투자시)'},
				{fromIndex:267, toIndex:273, title: nxtYear2+'년 이후 투자비'},
				{fromIndex:274, toIndex:280, title: '국사 확보를 위한 투자비'},
				{fromIndex:281, toIndex:284, title: '도면관리'},
				{fromIndex:285, toIndex:286, title: '기타'}
				],
			columnMapping: [
	/* 0 */		{ key : 'lastChgDate',  align:'center', title : '날짜', width: '150', resizing: false},
	/* 1 */
				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '100', styleclass : 'font-blue',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(step1Cd);
								return render_data;
							} else {
								data.demdHdofcCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else { return false; }},
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							editing_data = editing_data.concat(step1Cd);
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					}},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '100', styleclass : 'font-blue',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								var currentData = AlopexGrid.currentData(data);
								if (step1To2[currentData.demdHdofcCd]) {
									render_data = render_data.concat(step1To2[currentData.demdHdofcCd]);
								}
								return render_data;
							} else {
								data.demdAreaCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) {if(data.repMtsoYn == 'Y') { return true; } else { return false; } },
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							var currentData = AlopexGrid.currentData(data);

							if (step1To2[currentData.demdHdofcCd]) {
								editing_data = editing_data.concat(step1To2[currentData.demdHdofcCd]);
							}
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					},
					refreshBy : ['demdHdofcCd'] },
				{ key : 'mtsoNm', align:'left', title : '국사명', width: '150', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.mtsoNm ;
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<label class="textsearch_1"><input type="text" id="btnMtsoSearch" readonly style="'+strCss+'" value="'+strVal+'" /><span id="btnCnstnBpSearch" class="Button search"></span></label>';
						} else {
							strVal = '';
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value=""/></div>';
						}

					}
				},
				{ key : 'smtsoNm', align:'left', title : '층 국사명', width: '150', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn != 'Y') {
							return data.mtsoNm ;
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = data.mtsoNm;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
						if(data.repMtsoYn != 'Y') {
							return '<label class="textsearch_1"><input type="text" id="btnMtsoSearch" readonly style="'+strCss+'" value="'+strVal+'" /><span id="btnCnstnBpSearch" class="Button search"></span></label>';
						} else {
							strVal = '';
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value=""/></div>';
						}

					}
				},
				{ key : 'praFildCd', align:'center', title : '층용도', width: '200', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var praFildCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							var names = [];
							var uniqueNames = [];
							for(i=0; i < praFildCd.length; i++) {
								names.push(praFildCd[i]);
							}
							$.each(names, function(i, el){
								if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
							})
//							if (typeof uniqueNames) {
//								if (data.praFildCd != null) {
//									data.praFildCd = data.praFildCd.toString();
//								}
//							}
//							if (data.praFildCd != null) {
//								var praFildCd = data.praFildCd.toString().replace(/,/gi, '').replace(/undefined/gi, '').replace(/0/gi, '');
//							} else {
//								var praFildCd = "";
//							}
//

							for(i=0; i < uniqueNames.length; i++) {
								for(var j=0; j < grPraCd.length; j++) {
									if (uniqueNames[i].toString() == grPraCd[j].value.toString()) {
										strText += grPraCd[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					},
					editable : {type : 'grPraCds'}
				},
				{ key : 'bldFlorNo', align:'center', title : '층정보', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.totBldFlor ;
						} else {
							return setFlor(data.bldFlorNo);
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							strVal = data.totBldFlor;
							if (strVal == undefined) {strVal = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						}
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" /></div>';
					}
				},

				{ key : 'bldCd', align:'center', title : '건물코드', width: '120', styleclass : 'font-red',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'bldNm', align:'left', title : '건물명', width: '150', styleclass : 'font-red',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; } },
				{ key : 'siteKeyVal', align:'center', title : 'SITE KEY', width: '150', styleclass : 'font-red',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'mtsoId', align:'center', title : '국사ID', width: '120', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return '-' ;
						} else {
							return value;
						}
					},
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
	/* 10 */	{ key : 'repIntgFcltsCd', align:'center', title : '공대코드', width: '90', styleclass : 'font-red',
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							strVal = '';
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						}
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" /></div>';
					}
				},
				{ key : 'mtsoAbbrNm', align:'left', title : '국사약어', width: '160', styleclass : 'font-red',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; }},
				{ key : 'dtlAddr', align:'left', title : '주소', width: '200', styleclass : 'font-orange',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;" value="'+value+'" /></div>'; } },
				{ key : 'sidoNm', align:'center', title : '시도', width: '100',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'sggNm', align:'center', title : '시군구', width: '100',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'emdNm', align:'center', title : '읍면동', width: '100',
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; }  },
				{ key : 'laraCd', align:'center', title : '권역', width: '100',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grLaraCd);
								return render_data;
							} else {
								data.laraCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grLaraCd) {
								var exist = '';

								if (value && value.indexOf(grLaraCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grLaraCd[i].value+' '+exist+'>'+grLaraCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'dntnYn', align:'center', title : '도심/외곽', width: '100',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDntnYn);
								return render_data;
							} else {
								data.dntnYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grDntnYn) {
								var exist = '';

								if (value && value.indexOf(grDntnYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grDntnYn[i].value+' '+exist+'>'+grDntnYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}

					}
				},
				{ key : 'latVal', align:'center', title : '위도', width: '100',
					render : {type : 'string',
						rule : function(value, data) {
							return value;
						} },
					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },
				{ key : 'lngVal', align:'center', title : '경도', width: '100',

					editable : function(value, data) { return '<div><input type="text" readonly style="width:100%;background-color:transparent;border:0 solid black;text-align:center;" value="'+value+'" /></div>'; } },

	/* 20 */
				{ key : 'bldMgmtTypCd', align:'center', title : '건물관리 주체', width: '120', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grMtsoTypCd);
								return render_data;
							} else {
								data.bldMgmtTypCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grMtsoTypCd) {
								var exist = '';
								if (value && value.indexOf(grMtsoTypCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grMtsoTypCd[i].value+' '+exist+'>'+grMtsoTypCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'landOwnDivVal', align:'center', title : '토지소유구분', width: '130', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grSlfLesCd);
								return render_data;
							} else {
								data.landOwnDivVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grSlfLesCd) {
								var exist = '';
								if (value && value.indexOf(grSlfLesCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grSlfLesCd[i].value+' '+exist+'>'+grSlfLesCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bldOwnDivVal', align:'center', title : '건물소유구분', width: '130', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grSlfLesCd);
								return render_data;
							} else {
								data.bldOwnDivVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grSlfLesCd) {
								var exist = '';
								if (value && value.indexOf(grSlfLesCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grSlfLesCd[i].value+' '+exist+'>'+grSlfLesCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screLandYr', align:'center', title : '토지', width: '80', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grYear);
								return render_data;
							} else {
								data.slfLesCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grYear) {
								var exist = '';
								if (value && value.indexOf(grYear[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grYear[i].value+' '+exist+'>'+grYear[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screBldYr', align:'center', title : '건물', width: '80', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grYear);
								return render_data;
							} else {
								data.slfLesCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grYear) {
								var exist = '';
								if (value && value.indexOf(grYear[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grYear[i].value+' '+exist+'>'+grYear[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'landArPyngVal', align:'center', title : '토지면적(평)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.landArPyngVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.landArPyngVal == undefined || data.landArPyngVal == null || data.landArPyngVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'cbgRate', align:'center', title : '용적율(%)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.cbgRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.cbgRate == undefined || data.cbgRate == null || data.cbgRate == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bldCoverageRate', align:'center', title : '건폐율(%)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bldCoverageRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.bldCoverageRate == undefined || data.bldCoverageRate == null || data.bldCoverageRate == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'bldArPyngVal', align:'center', title : '건(평)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}

							return setComma(tmp);
						} else {
							return '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (strVal == undefined || strVal == null || strVal == ""){strVal = '0';}
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				},
				{ key : 'totAr', align:'center', title : '연면적(평)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.totAr == undefined || data.totAr == null || data.totAr == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var tmpVal = $(cell).find('input').val();
							var topVal = tmpVal;
							if (isNaN(topVal)) {topVal = 0;}
							var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
							for(var i in dataObj) {
								if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].totAr != undefined  && dataObj[i].totAr != null) {
									var objVal = dataObj[i].totAr
									if (isNaN(objVal)) {objVal = 0;}
									tmpVal = parseInt(tmpVal)+parseInt(objVal);
									if (parseInt(topVal) < parseInt(objVal)) {
										topVal = objVal;
									}
								}
							}
							if(data.repMtsoYn != 'Y') {
								$('#'+gridId).alopexGrid('dataEdit',{totAr:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});

								var ckGubun = $("input:checkbox[id^=srchYn]").is(":checked") ? 'Y' : 'N';
						 	 	if(ckGubun == "N") {
									$('#'+gridId).alopexGrid('dataEdit',{bldArPyngVal:topVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						 	 	}
							}

						}
						return $(cell).find('input').val();
					}
				},
				{ key : 'upsdAcptRackCnt', align:'center', title : '수용가능랙수', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.upsdAcptRackCnt == undefined || data.upsdAcptRackCnt == null || data.upsdAcptRackCnt == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						var tmpVal = parseInt($(cell).find('input').val());
						if (isNaN(tmpVal)) {tmpVal = 0;}
						var topVal = tmpVal;
						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
						for(var i in dataObj) {
							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdAcptRackCnt != undefined  && dataObj[i].upsdAcptRackCnt != null) {
								var objVal = parseInt(dataObj[i].upsdAcptRackCnt);
								if (isNaN(objVal)) {objVal = 0;}
								tmpVal = parseInt(tmpVal)+parseInt(objVal);
								if (parseInt(topVal) < parseInt(objVal)) {
									topVal = objVal;
								}
							}
						}
						if(data.repMtsoYn != 'Y') {
							$('#'+gridId).alopexGrid('dataEdit',{upsdAcptRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						return $(cell).find('input').val();
					}


				},
	/* 30 */	{ key : 'upsdFcltsRackCnt', align:'center', title : '시설랙수', width: '80', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmp = value;
						if(isNaN(tmp)) {tmp = 0;}
						return setComma(tmp);
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn != 'Y') {
							if (data.upsdFcltsRackCnt == undefined || data.upsdFcltsRackCnt == null || data.upsdFcltsRackCnt == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						var tmpVal = parseInt($(cell).find('input').val());
						if (isNaN(tmpVal)) {tmpVal = 0;}
						var topVal = tmpVal;
						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
						for(var i in dataObj) {
							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdFcltsRackCnt != undefined  && dataObj[i].upsdFcltsRackCnt != null) {
								var objVal = parseInt(dataObj[i].upsdFcltsRackCnt);
								if (isNaN(objVal)) {objVal = 0;}
								tmpVal = parseInt(tmpVal)+parseInt(objVal);
								if (parseInt(topVal) < parseInt(objVal)) {
									topVal = objVal;
								}
							}
						}

						if(data.repMtsoYn != 'Y') {
							$('#'+gridId).alopexGrid('dataEdit',{upsdFcltsRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						return $(cell).find('input').val();
					}

				},
				{ key : 'upsdIdleRackCnt', align:'center', title : '유휴랙수', width: '80', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var upsdAcptRackCnt =  data.upsdAcptRackCnt;
						var upsdFcltsRackCnt =  data.upsdFcltsRackCnt;
						if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}
						if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
						var tmpCnt =  data.upsdAcptRackCnt - data.upsdFcltsRackCnt;
						if (isNaN(tmpCnt)) tmpCnt = 0;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var upsdAcptRackCnt =  data.upsdAcptRackCnt;
						var upsdFcltsRackCnt =  data.upsdFcltsRackCnt;
						if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}
						if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
						var strVal =  data.upsdAcptRackCnt - data.upsdFcltsRackCnt;
						if (isNaN(strVal)) strVal = 0;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'" "/></div>';
					}

				},
				{ key : 'upsdUseRate', align:'center', title : '사용율(%)', width: '80', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmpCnt =  parseInt((data.upsdFcltsRackCnt / data.upsdAcptRackCnt)*100);
						if (isNaN(tmpCnt)) tmpCnt = 0;
						return tmpCnt;
					},
					editable : function(value, data) {
						var tmpCnt =  parseInt((data.upsdFcltsRackCnt / data.upsdAcptRackCnt)*100);
						if (isNaN(tmpCnt)) tmpCnt = 0;
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+tmpCnt+'" "/></div>';
					}
				},
				{ key : 'fcltsRackAispRsltVal', align:'center', title : '랙실사결과', width: '80', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmp = value;

						return tmp;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn != 'Y') {
							//if (data.fcltsRackAispRsltVal == undefined || data.fcltsRackAispRsltVal == null || data.fcltsRackAispRsltVal == ""){strVal = '0';}
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
//						var tmpVal = parseInt($(cell).find('input').val());
//						if (isNaN(tmpVal)) {tmpVal = 0;}
//						var topVal = tmpVal;
//						var dataObj = $('#dataGrid').alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
//						for(var i in dataObj) {
//							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].fcltsRackAispRsltVal != undefined  && dataObj[i].fcltsRackAispRsltVal != null) {
//								var objVal = parseInt(dataObj[i].fcltsRackAispRsltVal);
//								if (isNaN(objVal)) {objVal = 0;}
//								tmpVal = parseInt(tmpVal)+parseInt(objVal);
//							}
//						}
//
//						if(data.repMtsoYn != 'Y') {
//							$('#'+gridId).alopexGrid('dataEdit',{fcltsRackAispRsltVal:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
//						}
						return $(cell).find('input').val();
					}
				},
				{ key : 'nbdG5AcptVal', align:'center', title : '5G수용계획', width: '100', styleclass : 'font-orange',
						render : {type : 'string',
							rule : function(value, data) {
								if(data.repMtsoYn == 'Y') {
									var render_data = [{ value : ''}];
									render_data = render_data.concat(grG5Acpt);
									return render_data;
								} else {
									data.nbdG5AcptVal = '';
								}
							}
						},
						editable : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var strSelectOption = '';
								for(var i in grG5Acpt) {
									var exist = '';
									if (value && value.indexOf(grG5Acpt[i].value) != -1) {
										exist = ' selected';
									}
									strSelectOption += '<option value='+grG5Acpt[i].value+' '+exist+'>'+grG5Acpt[i].text+'</option>';
								}
								return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
							} else {
								var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
								return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
							}
						}

				},
				{ key : 'nbdG5AcptRsn', align:'left', title : '5G수용사유및향후계획', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.landArPyngVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nbdUpsdShtgRsn', align:'center', title : '상면부족사유', width: '200', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var nbdUpsdShtgRsn = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							for(i=0; i < nbdUpsdShtgRsn.length; i++) {
								for(var j=0; j < grUpsdRsn.length; j++) {
									if (nbdUpsdShtgRsn[i].toString() == grUpsdRsn[j].value.toString()) {
										strText += grUpsdRsn[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					},
					editable : {type : 'grUpsdRsn'}
				},
				{ key : 'nbdUpsdRmdyRsn', align:'center', title : '상면부족해소방안', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNbdUpsdRmdyRsn);
								return render_data;
							} else {
								data.nbdUpsdRmdyRsn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '';
							for(var i in grNbdUpsdRmdyRsn) {
								var exist = '';
								if (value && value.indexOf(grNbdUpsdRmdyRsn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNbdUpsdRmdyRsn[i].value+' '+exist+'>'+grNbdUpsdRmdyRsn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" style="width:100%;" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'areaNbdInvtScdleVal', align:'center', title : '투자시기(지역)', width: '100', styleclass : 'font-red',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.areaNbdInvtScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nbdInvtScdleVal', align:'center', title : '투자시기(본사)', width: '100', styleclass : 'font-red',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.nbdInvtScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'newMtsoNm', align:'left', title : '신규통합국명', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.newMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'exstMtsoNm', align:'left', title : '기존통합국명', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.exstMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'closMtsoNm', align:'left', title : '폐국대상', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.closMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'diffMtsoNm', align:'left', title : '이설국사명', width: '150', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.diffMtsoNm = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'diffCstVal', align:'right', title : '이설비용', width: '150', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.diffCstVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							if (data.diffCstVal == undefined || data.diffCstVal == null || data.diffCstVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'lesCstVal', align:'right', title : '임차료', width: '150', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lesCstVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							if (data.lesCstVal == undefined || data.lesCstVal == null || data.lesCstVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'diffScdleVal', align:'left', title : '이설시기', width: '200', styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								return value;
							} else {
								data.diffScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





	/* 40 */	{ key : 'roAcptScdleVal', align:'center', title : '최초수용시기', width: '100', styleclass : 'font-red',


					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grRoDuhAcptVal);
								return render_data;
							} else {
								data.roAcptScdleVal = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grRoDuhAcptVal) {
								var exist = '';
								if (value && value.indexOf(grRoDuhAcptVal[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grRoDuhAcptVal[i].value+' '+exist+'>'+grRoDuhAcptVal[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roDuhStep1Val', align:'center', title : ro1+'단계', width: '70', styleclass : 'font-red',

					render : function(value, data, render, mapping){
						var roStep1Val = setIsNaNCheck(parseInt(data.roStep1Val));
						var roRlyRotnStep1Val = setIsNaNCheck(parseInt(data.roRlyRotnStep1Val));
						var roRlyIvrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrStep1Val));
						var roRlyIvrrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep1Val));
						var roDuRotnStep1Val = setIsNaNCheck(parseInt(data.roDuRotnStep1Val));
						var roDuIvrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrStep1Val));
						var roDuIvrrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrrStep1Val));
						var roRepceRotnStep1Val = setIsNaNCheck(parseInt(data.roRepceRotnStep1Val));
						var roRepceIvrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrStep1Val));
						var roRepceIvrrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep1Val));

						var tmpCnt =  roStep1Val + roRlyRotnStep1Val + roRlyIvrStep1Val + roRlyIvrrStep1Val + roDuRotnStep1Val + roDuIvrStep1Val + roDuIvrrStep1Val + roRepceRotnStep1Val + roRepceIvrStep1Val + roRepceIvrrStep1Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep1Val = '';
						}

					},
					editable : function(value, data) {
						var roStep1Val = setIsNaNCheck(parseInt(data.roStep1Val));
						var roRlyRotnStep1Val = setIsNaNCheck(parseInt(data.roRlyRotnStep1Val));
						var roRlyIvrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrStep1Val));
						var roRlyIvrrStep1Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep1Val));
						var roDuRotnStep1Val = setIsNaNCheck(parseInt(data.roDuRotnStep1Val));
						var roDuIvrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrStep1Val));
						var roDuIvrrStep1Val = setIsNaNCheck(parseInt(data.roDuIvrrStep1Val));
						var roRepceRotnStep1Val = setIsNaNCheck(parseInt(data.roRepceRotnStep1Val));
						var roRepceIvrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrStep1Val));
						var roRepceIvrrStep1Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep1Val));

						var strVal =  roStep1Val + roRlyRotnStep1Val + roRlyIvrStep1Val + roRlyIvrrStep1Val + roDuRotnStep1Val + roDuIvrStep1Val + roDuIvrrStep1Val + roRepceRotnStep1Val + roRepceIvrStep1Val + roRepceIvrrStep1Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep2Val', align:'center', title : ro2+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep2Val = setIsNaNCheck(parseInt(data.roStep2Val));
						var roRlyRotnStep2Val = setIsNaNCheck(parseInt(data.roRlyRotnStep2Val));
						var roRlyIvrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrStep2Val));
						var roRlyIvrrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep2Val));
						var roDuRotnStep2Val = setIsNaNCheck(parseInt(data.roDuRotnStep2Val));
						var roDuIvrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrStep2Val));
						var roDuIvrrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrrStep2Val));
						var roRepceRotnStep2Val = setIsNaNCheck(parseInt(data.roRepceRotnStep2Val));
						var roRepceIvrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrStep2Val));
						var roRepceIvrrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep2Val));

						var tmpCnt =  roStep2Val + roRlyRotnStep2Val + roRlyIvrStep2Val + roRlyIvrrStep2Val + roDuRotnStep2Val + roDuIvrStep2Val + roDuIvrrStep2Val + roRepceRotnStep2Val + roRepceIvrStep2Val + roRepceIvrrStep2Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep2Val = '';
						}

					},
					editable : function(value, data) {
						var roStep2Val = setIsNaNCheck(parseInt(data.roStep2Val));
						var roRlyRotnStep2Val = setIsNaNCheck(parseInt(data.roRlyRotnStep2Val));
						var roRlyIvrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrStep2Val));
						var roRlyIvrrStep2Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep2Val));
						var roDuRotnStep2Val = setIsNaNCheck(parseInt(data.roDuRotnStep2Val));
						var roDuIvrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrStep2Val));
						var roDuIvrrStep2Val = setIsNaNCheck(parseInt(data.roDuIvrrStep2Val));
						var roRepceRotnStep2Val = setIsNaNCheck(parseInt(data.roRepceRotnStep2Val));
						var roRepceIvrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrStep2Val));
						var roRepceIvrrStep2Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep2Val));

						var strVal =  roStep2Val + roRlyRotnStep2Val + roRlyIvrStep2Val + roRlyIvrrStep2Val + roDuRotnStep2Val + roDuIvrStep2Val + roDuIvrrStep2Val + roRepceRotnStep2Val + roRepceIvrStep2Val + roRepceIvrrStep2Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep3Val', align:'center', title : ro3+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep3Val = setIsNaNCheck(parseInt(data.roStep3Val));
						var roRlyRotnStep3Val = setIsNaNCheck(parseInt(data.roRlyRotnStep3Val));
						var roRlyIvrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrStep3Val));
						var roRlyIvrrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep3Val));
						var roDuRotnStep3Val = setIsNaNCheck(parseInt(data.roDuRotnStep3Val));
						var roDuIvrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrStep3Val));
						var roDuIvrrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrrStep3Val));
						var roRepceRotnStep3Val = setIsNaNCheck(parseInt(data.roRepceRotnStep3Val));
						var roRepceIvrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrStep3Val));
						var roRepceIvrrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep3Val));

						var tmpCnt =  roStep3Val + roRlyRotnStep3Val + roRlyIvrStep3Val + roRlyIvrrStep3Val + roDuRotnStep3Val + roDuIvrStep3Val + roDuIvrrStep3Val + roRepceRotnStep3Val + roRepceIvrStep3Val + roRepceIvrrStep3Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep3Val = '';
						}

					},
					editable : function(value, data) {
						var roStep3Val = setIsNaNCheck(parseInt(data.roStep3Val));
						var roRlyRotnStep3Val = setIsNaNCheck(parseInt(data.roRlyRotnStep3Val));
						var roRlyIvrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrStep3Val));
						var roRlyIvrrStep3Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep3Val));
						var roDuRotnStep3Val = setIsNaNCheck(parseInt(data.roDuRotnStep3Val));
						var roDuIvrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrStep3Val));
						var roDuIvrrStep3Val = setIsNaNCheck(parseInt(data.roDuIvrrStep3Val));
						var roRepceRotnStep3Val = setIsNaNCheck(parseInt(data.roRepceRotnStep3Val));
						var roRepceIvrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrStep3Val));
						var roRepceIvrrStep3Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep3Val));

						var strVal =  roStep3Val + roRlyRotnStep3Val + roRlyIvrStep3Val + roRlyIvrrStep3Val + roDuRotnStep3Val + roDuIvrStep3Val + roDuIvrrStep3Val + roRepceRotnStep3Val + roRepceIvrStep3Val + roRepceIvrrStep3Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep4Val', align:'center', title : ro4+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep4Val = setIsNaNCheck(parseInt(data.roStep4Val));
						var roRlyRotnStep4Val = setIsNaNCheck(parseInt(data.roRlyRotnStep4Val));
						var roRlyIvrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrStep4Val));
						var roRlyIvrrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep4Val));
						var roDuRotnStep4Val = setIsNaNCheck(parseInt(data.roDuRotnStep4Val));
						var roDuIvrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrStep4Val));
						var roDuIvrrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrrStep4Val));
						var roRepceRotnStep4Val = setIsNaNCheck(parseInt(data.roRepceRotnStep4Val));
						var roRepceIvrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrStep4Val));
						var roRepceIvrrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep4Val));

						var tmpCnt =  roStep4Val + roRlyRotnStep4Val + roRlyIvrStep4Val + roRlyIvrrStep4Val + roDuRotnStep4Val + roDuIvrStep4Val + roDuIvrrStep4Val + roRepceRotnStep4Val + roRepceIvrStep4Val + roRepceIvrrStep4Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep4Val = '';
						}

					},
					editable : function(value, data) {
						var roStep4Val = setIsNaNCheck(parseInt(data.roStep4Val));
						var roRlyRotnStep4Val = setIsNaNCheck(parseInt(data.roRlyRotnStep4Val));
						var roRlyIvrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrStep4Val));
						var roRlyIvrrStep4Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep4Val));
						var roDuRotnStep4Val = setIsNaNCheck(parseInt(data.roDuRotnStep4Val));
						var roDuIvrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrStep4Val));
						var roDuIvrrStep4Val = setIsNaNCheck(parseInt(data.roDuIvrrStep4Val));
						var roRepceRotnStep4Val = setIsNaNCheck(parseInt(data.roRepceRotnStep4Val));
						var roRepceIvrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrStep4Val));
						var roRepceIvrrStep4Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep4Val));

						var strVal =  roStep4Val + roRlyRotnStep4Val + roRlyIvrStep4Val + roRlyIvrrStep4Val + roDuRotnStep4Val + roDuIvrStep4Val + roDuIvrrStep4Val + roRepceRotnStep4Val + roRepceIvrStep4Val + roRepceIvrrStep4Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep5Val', align:'center', title : ro5+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep5Val = setIsNaNCheck(parseInt(data.roStep5Val));
						var roRlyRotnStep5Val = setIsNaNCheck(parseInt(data.roRlyRotnStep5Val));
						var roRlyIvrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrStep5Val));
						var roRlyIvrrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep5Val));
						var roDuRotnStep5Val = setIsNaNCheck(parseInt(data.roDuRotnStep5Val));
						var roDuIvrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrStep5Val));
						var roDuIvrrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrrStep5Val));
						var roRepceRotnStep5Val = setIsNaNCheck(parseInt(data.roRepceRotnStep5Val));
						var roRepceIvrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrStep5Val));
						var roRepceIvrrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep5Val));

						var tmpCnt =  roStep5Val + roRlyRotnStep5Val + roRlyIvrStep5Val + roRlyIvrrStep5Val + roDuRotnStep5Val + roDuIvrStep5Val + roDuIvrrStep5Val + roRepceRotnStep5Val + roRepceIvrStep5Val + roRepceIvrrStep5Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep5Val = '';
						}

					},
					editable : function(value, data) {
						var roStep5Val = setIsNaNCheck(parseInt(data.roStep5Val));
						var roRlyRotnStep5Val = setIsNaNCheck(parseInt(data.roRlyRotnStep5Val));
						var roRlyIvrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrStep5Val));
						var roRlyIvrrStep5Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep5Val));
						var roDuRotnStep5Val = setIsNaNCheck(parseInt(data.roDuRotnStep5Val));
						var roDuIvrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrStep5Val));
						var roDuIvrrStep5Val = setIsNaNCheck(parseInt(data.roDuIvrrStep5Val));
						var roRepceRotnStep5Val = setIsNaNCheck(parseInt(data.roRepceRotnStep5Val));
						var roRepceIvrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrStep5Val));
						var roRepceIvrrStep5Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep5Val));

						var strVal =  roStep5Val + roRlyRotnStep5Val + roRlyIvrStep5Val + roRlyIvrrStep5Val + roDuRotnStep5Val + roDuIvrStep5Val + roDuIvrrStep5Val + roRepceRotnStep5Val + roRepceIvrStep5Val + roRepceIvrrStep5Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep6Val', align:'center', title : ro6+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep6Val = setIsNaNCheck(parseInt(data.roStep6Val));
						var roRlyRotnStep6Val = setIsNaNCheck(parseInt(data.roRlyRotnStep6Val));
						var roRlyIvrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrStep6Val));
						var roRlyIvrrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep6Val));
						var roDuRotnStep6Val = setIsNaNCheck(parseInt(data.roDuRotnStep6Val));
						var roDuIvrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrStep6Val));
						var roDuIvrrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrrStep6Val));
						var roRepceRotnStep6Val = setIsNaNCheck(parseInt(data.roRepceRotnStep6Val));
						var roRepceIvrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrStep6Val));
						var roRepceIvrrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep6Val));

						var tmpCnt =  roStep6Val + roRlyRotnStep6Val + roRlyIvrStep6Val + roRlyIvrrStep6Val + roDuRotnStep6Val + roDuIvrStep6Val + roDuIvrrStep6Val + roRepceRotnStep6Val + roRepceIvrStep6Val + roRepceIvrrStep6Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep6Val = '';
						}

					},
					editable : function(value, data) {
						var roStep6Val = setIsNaNCheck(parseInt(data.roStep6Val));
						var roRlyRotnStep6Val = setIsNaNCheck(parseInt(data.roRlyRotnStep6Val));
						var roRlyIvrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrStep6Val));
						var roRlyIvrrStep6Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep6Val));
						var roDuRotnStep6Val = setIsNaNCheck(parseInt(data.roDuRotnStep6Val));
						var roDuIvrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrStep6Val));
						var roDuIvrrStep6Val = setIsNaNCheck(parseInt(data.roDuIvrrStep6Val));
						var roRepceRotnStep6Val = setIsNaNCheck(parseInt(data.roRepceRotnStep6Val));
						var roRepceIvrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrStep6Val));
						var roRepceIvrrStep6Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep6Val));

						var strVal =  roStep6Val + roRlyRotnStep6Val + roRlyIvrStep6Val + roRlyIvrrStep6Val + roDuRotnStep6Val + roDuIvrStep6Val + roDuIvrrStep6Val + roRepceRotnStep6Val + roRepceIvrStep6Val + roRepceIvrrStep6Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep7Val', align:'center', title : ro7+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep7Val = setIsNaNCheck(parseInt(data.roStep7Val));
						var roRlyRotnStep7Val = setIsNaNCheck(parseInt(data.roRlyRotnStep7Val));
						var roRlyIvrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrStep7Val));
						var roRlyIvrrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep7Val));
						var roDuRotnStep7Val = setIsNaNCheck(parseInt(data.roDuRotnStep7Val));
						var roDuIvrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrStep7Val));
						var roDuIvrrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrrStep7Val));
						var roRepceRotnStep7Val = setIsNaNCheck(parseInt(data.roRepceRotnStep7Val));
						var roRepceIvrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrStep7Val));
						var roRepceIvrrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep7Val));

						var tmpCnt =  roStep7Val + roRlyRotnStep7Val + roRlyIvrStep7Val + roRlyIvrrStep7Val + roDuRotnStep7Val + roDuIvrStep7Val + roDuIvrrStep7Val + roRepceRotnStep7Val + roRepceIvrStep7Val + roRepceIvrrStep7Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep7Val = '';
						}

					},
					editable : function(value, data) {
						var roStep7Val = setIsNaNCheck(parseInt(data.roStep7Val));
						var roRlyRotnStep7Val = setIsNaNCheck(parseInt(data.roRlyRotnStep7Val));
						var roRlyIvrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrStep7Val));
						var roRlyIvrrStep7Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep7Val));
						var roDuRotnStep7Val = setIsNaNCheck(parseInt(data.roDuRotnStep7Val));
						var roDuIvrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrStep7Val));
						var roDuIvrrStep7Val = setIsNaNCheck(parseInt(data.roDuIvrrStep7Val));
						var roRepceRotnStep7Val = setIsNaNCheck(parseInt(data.roRepceRotnStep7Val));
						var roRepceIvrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrStep7Val));
						var roRepceIvrrStep7Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep7Val));

						var strVal =  roStep7Val + roRlyRotnStep7Val + roRlyIvrStep7Val + roRlyIvrrStep7Val + roDuRotnStep7Val + roDuIvrStep7Val + roDuIvrrStep7Val + roRepceRotnStep7Val + roRepceIvrStep7Val + roRepceIvrrStep7Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep8Val', align:'center', title : ro8+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep8Val = setIsNaNCheck(parseInt(data.roStep8Val));
						var roRlyRotnStep8Val = setIsNaNCheck(parseInt(data.roRlyRotnStep8Val));
						var roRlyIvrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrStep8Val));
						var roRlyIvrrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep8Val));
						var roDuRotnStep8Val = setIsNaNCheck(parseInt(data.roDuRotnStep8Val));
						var roDuIvrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrStep8Val));
						var roDuIvrrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrrStep8Val));
						var roRepceRotnStep8Val = setIsNaNCheck(parseInt(data.roRepceRotnStep8Val));
						var roRepceIvrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrStep8Val));
						var roRepceIvrrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep8Val));

						var tmpCnt =  roStep8Val + roRlyRotnStep8Val + roRlyIvrStep8Val + roRlyIvrrStep8Val + roDuRotnStep8Val + roDuIvrStep8Val + roDuIvrrStep8Val + roRepceRotnStep8Val + roRepceIvrStep8Val + roRepceIvrrStep8Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep8Val = '';
						}

					},
					editable : function(value, data) {
						var roStep8Val = setIsNaNCheck(parseInt(data.roStep8Val));
						var roRlyRotnStep8Val = setIsNaNCheck(parseInt(data.roRlyRotnStep8Val));
						var roRlyIvrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrStep8Val));
						var roRlyIvrrStep8Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep8Val));
						var roDuRotnStep8Val = setIsNaNCheck(parseInt(data.roDuRotnStep8Val));
						var roDuIvrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrStep8Val));
						var roDuIvrrStep8Val = setIsNaNCheck(parseInt(data.roDuIvrrStep8Val));
						var roRepceRotnStep8Val = setIsNaNCheck(parseInt(data.roRepceRotnStep8Val));
						var roRepceIvrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrStep8Val));
						var roRepceIvrrStep8Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep8Val));

						var strVal =  roStep8Val + roRlyRotnStep8Val + roRlyIvrStep8Val + roRlyIvrrStep8Val + roDuRotnStep8Val + roDuIvrStep8Val + roDuIvrrStep8Val + roRepceRotnStep8Val + roRepceIvrStep8Val + roRepceIvrrStep8Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep9Val', align:'center', title : ro9+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep9Val = setIsNaNCheck(parseInt(data.roStep9Val));
						var roRlyRotnStep9Val = setIsNaNCheck(parseInt(data.roRlyRotnStep9Val));
						var roRlyIvrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrStep9Val));
						var roRlyIvrrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep9Val));
						var roDuRotnStep9Val = setIsNaNCheck(parseInt(data.roDuRotnStep9Val));
						var roDuIvrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrStep9Val));
						var roDuIvrrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrrStep9Val));
						var roRepceRotnStep9Val = setIsNaNCheck(parseInt(data.roRepceRotnStep9Val));
						var roRepceIvrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrStep9Val));
						var roRepceIvrrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep9Val));

						var tmpCnt =  roStep9Val + roRlyRotnStep9Val + roRlyIvrStep9Val + roRlyIvrrStep9Val + roDuRotnStep9Val + roDuIvrStep9Val + roDuIvrrStep9Val + roRepceRotnStep9Val + roRepceIvrStep9Val + roRepceIvrrStep9Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep9Val = '';
						}

					},
					editable : function(value, data) {
						var roStep9Val = setIsNaNCheck(parseInt(data.roStep9Val));
						var roRlyRotnStep9Val = setIsNaNCheck(parseInt(data.roRlyRotnStep9Val));
						var roRlyIvrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrStep9Val));
						var roRlyIvrrStep9Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep9Val));
						var roDuRotnStep9Val = setIsNaNCheck(parseInt(data.roDuRotnStep9Val));
						var roDuIvrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrStep9Val));
						var roDuIvrrStep9Val = setIsNaNCheck(parseInt(data.roDuIvrrStep9Val));
						var roRepceRotnStep9Val = setIsNaNCheck(parseInt(data.roRepceRotnStep9Val));
						var roRepceIvrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrStep9Val));
						var roRepceIvrrStep9Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep9Val));

						var strVal =  roStep9Val + roRlyRotnStep9Val + roRlyIvrStep9Val + roRlyIvrrStep9Val + roDuRotnStep9Val + roDuIvrStep9Val + roDuIvrrStep9Val + roRepceRotnStep9Val + roRepceIvrStep9Val + roRepceIvrrStep9Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhStep10Val', align:'center', title : ro10+'단계', width: '70', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var roStep10Val = setIsNaNCheck(parseInt(data.roStep10Val));
						var roRlyRotnStep10Val = setIsNaNCheck(parseInt(data.roRlyRotnStep10Val));
						var roRlyIvrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrStep10Val));
						var roRlyIvrrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep10Val));
						var roDuRotnStep10Val = setIsNaNCheck(parseInt(data.roDuRotnStep10Val));
						var roDuIvrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrStep10Val));
						var roDuIvrrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrrStep10Val));
						var roRepceRotnStep10Val = setIsNaNCheck(parseInt(data.roRepceRotnStep10Val));
						var roRepceIvrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrStep10Val));
						var roRepceIvrrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep10Val));

						var tmpCnt =  roStep10Val + roRlyRotnStep10Val + roRlyIvrStep10Val + roRlyIvrrStep10Val + roDuRotnStep10Val + roDuIvrStep10Val + roDuIvrrStep10Val + roRepceRotnStep10Val + roRepceIvrStep10Val + roRepceIvrrStep10Val;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhStep10Val = '';
						}

					},
					editable : function(value, data) {
						var roStep10Val = setIsNaNCheck(parseInt(data.roStep10Val));
						var roRlyRotnStep10Val = setIsNaNCheck(parseInt(data.roRlyRotnStep10Val));
						var roRlyIvrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrStep10Val));
						var roRlyIvrrStep10Val = setIsNaNCheck(parseInt(data.roRlyIvrrStep10Val));
						var roDuRotnStep10Val = setIsNaNCheck(parseInt(data.roDuRotnStep10Val));
						var roDuIvrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrStep10Val));
						var roDuIvrrStep10Val = setIsNaNCheck(parseInt(data.roDuIvrrStep10Val));
						var roRepceRotnStep10Val = setIsNaNCheck(parseInt(data.roRepceRotnStep10Val));
						var roRepceIvrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrStep10Val));
						var roRepceIvrrStep10Val = setIsNaNCheck(parseInt(data.roRepceIvrrStep10Val));

						var strVal =  roStep10Val + roRlyRotnStep10Val + roRlyIvrStep10Val + roRlyIvrrStep10Val + roDuRotnStep10Val + roDuIvrStep10Val + roDuIvrrStep10Val + roRepceRotnStep10Val + roRepceIvrStep10Val + roRepceIvrrStep10Val;

						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDsnDuhVal', align:'center', title : 'RO '+nowYear+'년도 DUH 소계', width: '200', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.roDuhStep1Val)) + setIsNaNCheck(parseInt(data.roDuhStep2Val)) + setIsNaNCheck(parseInt(data.roDuhStep3Val)) + setIsNaNCheck(parseInt(data.roDuhStep4Val)) + setIsNaNCheck(parseInt(data.roDuhStep5Val)) + setIsNaNCheck(parseInt(data.roDuhStep6Val)) + setIsNaNCheck(parseInt(data.roDuhStep7Val)) + setIsNaNCheck(parseInt(data.roDuhStep8Val)) + setIsNaNCheck(parseInt(data.roDuhStep9Val)) + setIsNaNCheck(parseInt(data.roDuhStep10Val));
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDsnDuhVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.roDuhStep1Val)) + setIsNaNCheck(parseInt(data.roDuhStep2Val)) + setIsNaNCheck(parseInt(data.roDuhStep3Val)) + setIsNaNCheck(parseInt(data.roDuhStep4Val)) + setIsNaNCheck(parseInt(data.roDuhStep5Val)) + setIsNaNCheck(parseInt(data.roDuhStep6Val)) + setIsNaNCheck(parseInt(data.roDuhStep7Val)) + setIsNaNCheck(parseInt(data.roDuhStep8Val)) + setIsNaNCheck(parseInt(data.roDuhStep9Val)) + setIsNaNCheck(parseInt(data.roDuhStep10Val));
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhAreaVal', align:'center', title : '지역 Acc/유선 확인', width: '150', styleclass : 'font-red',
					render : function(value, data, render, mapping){

						var tmpCnt =  value;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhAreaVal = '';
						}

					},

					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuhAreaVal == undefined || data.roDuhAreaVal == null || data.roDuhAreaVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuhHdqtrVal', align:'center', title : 'Acc. Eng 설계 기준', width: '150', styleclass : 'font-red',
					render : function(value, data, render, mapping){

						var tmpCnt =  value;

						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuhHdqtrVal = '';
						}

					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuhHdqtrVal == undefined || data.roDuhHdqtrVal == null || data.roDuhHdqtrVal == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'roStep1Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep1Val == undefined || data.roStep1Val == null || data.roStep1Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep1Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep1Val == undefined || data.roRlyRotnStep1Val == null || data.roRlyRotnStep1Val == "" || isNaN(data.roRlyRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep1Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep1Val == undefined || data.roRlyIvrStep1Val == null || data.roRlyIvrStep1Val == "" || isNaN(data.roRlyIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep1Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep1Val == undefined || data.roRlyIvrrStep1Val == null || data.roRlyIvrrStep1Val == "" || isNaN(data.roRlyIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep1Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep1Val == undefined || data.roDuRotnStep1Val == null || data.roDuRotnStep1Val == "" || isNaN(data.roDuRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep1Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep1Val == undefined || data.roDuIvrStep1Val == null || data.roDuIvrStep1Val == "" || isNaN(data.roDuIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep1Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep1Val == undefined || data.roDuIvrrStep1Val == null || data.roDuIvrrStep1Val == "" || isNaN(data.roDuIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep1Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep1Val == undefined || data.roRepceRotnStep1Val == null || data.roRepceRotnStep1Val == "" || isNaN(data.roRepceRotnStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep1Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep1Val == undefined || data.roRepceIvrStep1Val == null || data.roRepceIvrStep1Val == "" || isNaN(data.roRepceIvrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep1Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep1Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep1Val == undefined || data.roRepceIvrrStep1Val == null || data.roRepceIvrrStep1Val == "" || isNaN(data.roRepceIvrrStep1Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'roStep2Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep2Val == undefined || data.roStep2Val == null || data.roStep2Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep2Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep2Val == undefined || data.roRlyRotnStep2Val == null || data.roRlyRotnStep2Val == "" || isNaN(data.roRlyRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep2Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep2Val == undefined || data.roRlyIvrStep2Val == null || data.roRlyIvrStep2Val == "" || isNaN(data.roRlyIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep2Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep2Val == undefined || data.roRlyIvrrStep2Val == null || data.roRlyIvrrStep2Val == "" || isNaN(data.roRlyIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep2Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep2Val == undefined || data.roDuRotnStep2Val == null || data.roDuRotnStep2Val == "" || isNaN(data.roDuRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep2Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep2Val == undefined || data.roDuIvrStep2Val == null || data.roDuIvrStep2Val == "" || isNaN(data.roDuIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep2Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep2Val == undefined || data.roDuIvrrStep2Val == null || data.roDuIvrrStep2Val == "" || isNaN(data.roDuIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep2Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep2Val == undefined || data.roRepceRotnStep2Val == null || data.roRepceRotnStep2Val == "" || isNaN(data.roRepceRotnStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep2Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep2Val == undefined || data.roRepceIvrStep2Val == null || data.roRepceIvrStep2Val == "" || isNaN(data.roRepceIvrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep2Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep2Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep2Val == undefined || data.roRepceIvrrStep2Val == null || data.roRepceIvrrStep2Val == "" || isNaN(data.roRepceIvrrStep2Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},








				{ key : 'roStep3Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep3Val == undefined || data.roStep3Val == null || data.roStep3Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep3Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep3Val == undefined || data.roRlyRotnStep3Val == null || data.roRlyRotnStep3Val == "" || isNaN(data.roRlyRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep3Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep3Val == undefined || data.roRlyIvrStep3Val == null || data.roRlyIvrStep3Val == "" || isNaN(data.roRlyIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep3Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep3Val == undefined || data.roRlyIvrrStep3Val == null || data.roRlyIvrrStep3Val == "" || isNaN(data.roRlyIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep3Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep3Val == undefined || data.roDuRotnStep3Val == null || data.roDuRotnStep3Val == "" || isNaN(data.roDuRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep3Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep3Val == undefined || data.roDuIvrStep3Val == null || data.roDuIvrStep3Val == "" || isNaN(data.roDuIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep3Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep3Val == undefined || data.roDuIvrrStep3Val == null || data.roDuIvrrStep3Val == "" || isNaN(data.roDuIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep3Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep3Val == undefined || data.roRepceRotnStep3Val == null || data.roRepceRotnStep3Val == "" || isNaN(data.roRepceRotnStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep3Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep3Val == undefined || data.roRepceIvrStep3Val == null || data.roRepceIvrStep3Val == "" || isNaN(data.roRepceIvrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep3Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep3Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep3Val == undefined || data.roRepceIvrrStep3Val == null || data.roRepceIvrrStep3Val == "" || isNaN(data.roRepceIvrrStep3Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},










				{ key : 'roStep4Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep4Val == undefined || data.roStep4Val == null || data.roStep4Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep4Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep4Val == undefined || data.roRlyRotnStep4Val == null || data.roRlyRotnStep4Val == "" || isNaN(data.roRlyRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep4Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep4Val == undefined || data.roRlyIvrStep4Val == null || data.roRlyIvrStep4Val == "" || isNaN(data.roRlyIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep4Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep4Val == undefined || data.roRlyIvrrStep4Val == null || data.roRlyIvrrStep4Val == "" || isNaN(data.roRlyIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep4Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep4Val == undefined || data.roDuRotnStep4Val == null || data.roDuRotnStep4Val == "" || isNaN(data.roDuRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep4Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep4Val == undefined || data.roDuIvrStep4Val == null || data.roDuIvrStep4Val == "" || isNaN(data.roDuIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep4Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep4Val == undefined || data.roDuIvrrStep4Val == null || data.roDuIvrrStep4Val == "" || isNaN(data.roDuIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep4Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep4Val == undefined || data.roRepceRotnStep4Val == null || data.roRepceRotnStep4Val == "" || isNaN(data.roRepceRotnStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep4Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep4Val == undefined || data.roRepceIvrStep4Val == null || data.roRepceIvrStep4Val == "" || isNaN(data.roRepceIvrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep4Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep4Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep4Val == undefined || data.roRepceIvrrStep4Val == null || data.roRepceIvrrStep4Val == "" || isNaN(data.roRepceIvrrStep4Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},









				{ key : 'roStep5Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep5Val == undefined || data.roStep5Val == null || data.roStep5Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep5Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep5Val == undefined || data.roRlyRotnStep5Val == null || data.roRlyRotnStep5Val == "" || isNaN(data.roRlyRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep5Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep5Val == undefined || data.roRlyIvrStep5Val == null || data.roRlyIvrStep5Val == "" || isNaN(data.roRlyIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep5Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep5Val == undefined || data.roRlyIvrrStep5Val == null || data.roRlyIvrrStep5Val == "" || isNaN(data.roRlyIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep5Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep5Val == undefined || data.roDuRotnStep5Val == null || data.roDuRotnStep5Val == "" || isNaN(data.roDuRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep5Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep5Val == undefined || data.roDuIvrStep5Val == null || data.roDuIvrStep5Val == "" || isNaN(data.roDuIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep5Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep5Val == undefined || data.roDuIvrrStep5Val == null || data.roDuIvrrStep5Val == "" || isNaN(data.roDuIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep5Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep5Val == undefined || data.roRepceRotnStep5Val == null || data.roRepceRotnStep5Val == "" || isNaN(data.roRepceRotnStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep5Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep5Val == undefined || data.roRepceIvrStep5Val == null || data.roRepceIvrStep5Val == "" || isNaN(data.roRepceIvrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep5Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep5Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep5Val == undefined || data.roRepceIvrrStep5Val == null || data.roRepceIvrrStep5Val == "" || isNaN(data.roRepceIvrrStep5Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},








				{ key : 'roStep6Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep6Val == undefined || data.roStep6Val == null || data.roStep6Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep6Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep6Val == undefined || data.roRlyRotnStep6Val == null || data.roRlyRotnStep6Val == "" || isNaN(data.roRlyRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep6Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep6Val == undefined || data.roRlyIvrStep6Val == null || data.roRlyIvrStep6Val == "" || isNaN(data.roRlyIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep6Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep6Val == undefined || data.roRlyIvrrStep6Val == null || data.roRlyIvrrStep6Val == "" || isNaN(data.roRlyIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep6Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep6Val == undefined || data.roDuRotnStep6Val == null || data.roDuRotnStep6Val == "" || isNaN(data.roDuRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep6Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep6Val == undefined || data.roDuIvrStep6Val == null || data.roDuIvrStep6Val == "" || isNaN(data.roDuIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep6Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep6Val == undefined || data.roDuIvrrStep6Val == null || data.roDuIvrrStep6Val == "" || isNaN(data.roDuIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep6Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep6Val == undefined || data.roRepceRotnStep6Val == null || data.roRepceRotnStep6Val == "" || isNaN(data.roRepceRotnStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep6Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep6Val == undefined || data.roRepceIvrStep6Val == null || data.roRepceIvrStep6Val == "" || isNaN(data.roRepceIvrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep6Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep6Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep6Val == undefined || data.roRepceIvrrStep6Val == null || data.roRepceIvrrStep6Val == "" || isNaN(data.roRepceIvrrStep6Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},







				{ key : 'roStep7Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep7Val == undefined || data.roStep7Val == null || data.roStep7Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep7Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep7Val == undefined || data.roRlyRotnStep7Val == null || data.roRlyRotnStep7Val == "" || isNaN(data.roRlyRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep7Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep7Val == undefined || data.roRlyIvrStep7Val == null || data.roRlyIvrStep7Val == "" || isNaN(data.roRlyIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep7Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRlyIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep7Val == undefined || data.roRlyIvrrStep7Val == null || data.roRlyIvrrStep7Val == "" || isNaN(data.roRlyIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep7Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep7Val == undefined || data.roDuRotnStep7Val == null || data.roDuRotnStep7Val == "" || isNaN(data.roDuRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep7Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep7Val == undefined || data.roDuIvrStep7Val == null || data.roDuIvrStep7Val == "" || isNaN(data.roDuIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep7Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roDuIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep7Val == undefined || data.roDuIvrrStep7Val == null || data.roDuIvrrStep7Val == "" || isNaN(data.roDuIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep7Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceRotnStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep7Val == undefined || data.roRepceRotnStep7Val == null || data.roRepceRotnStep7Val == "" || isNaN(data.roRepceRotnStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep7Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep7Val == undefined || data.roRepceIvrStep7Val == null || data.roRepceIvrStep7Val == "" || isNaN(data.roRepceIvrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep7Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return setComma(tmpCnt);
						} else {
							data.roRepceIvrrStep7Val = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep7Val == undefined || data.roRepceIvrrStep7Val == null || data.roRepceIvrrStep7Val == "" || isNaN(data.roRepceIvrrStep7Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},











				{ key : 'roStep8Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep8Val == undefined || data.roStep8Val == null || data.roStep8Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep8Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep8Val == undefined || data.roRlyRotnStep8Val == null || data.roRlyRotnStep8Val == "" || isNaN(data.roRlyRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep8Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep8Val == undefined || data.roRlyIvrStep8Val == null || data.roRlyIvrStep8Val == "" || isNaN(data.roRlyIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep8Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep8Val == undefined || data.roRlyIvrrStep8Val == null || data.roRlyIvrrStep8Val == "" || isNaN(data.roRlyIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep8Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep8Val == undefined || data.roDuRotnStep8Val == null || data.roDuRotnStep8Val == "" || isNaN(data.roDuRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep8Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep8Val == undefined || data.roDuIvrStep8Val == null || data.roDuIvrStep8Val == "" || isNaN(data.roDuIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep8Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep8Val == undefined || data.roDuIvrrStep8Val == null || data.roDuIvrrStep8Val == "" || isNaN(data.roDuIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep8Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep8Val == undefined || data.roRepceRotnStep8Val == null || data.roRepceRotnStep8Val == "" || isNaN(data.roRepceRotnStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep8Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep8Val == undefined || data.roRepceIvrStep8Val == null || data.roRepceIvrStep8Val == "" || isNaN(data.roRepceIvrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep8Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep8Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep8Val == undefined || data.roRepceIvrrStep8Val == null || data.roRepceIvrrStep8Val == "" || isNaN(data.roRepceIvrrStep8Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},









				{ key : 'roStep9Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep9Val == undefined || data.roStep9Val == null || data.roStep9Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep9Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep9Val == undefined || data.roRlyRotnStep9Val == null || data.roRlyRotnStep9Val == "" || isNaN(data.roRlyRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep9Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep9Val == undefined || data.roRlyIvrStep9Val == null || data.roRlyIvrStep9Val == "" || isNaN(data.roRlyIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep9Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep9Val == undefined || data.roRlyIvrrStep9Val == null || data.roRlyIvrrStep9Val == "" || isNaN(data.roRlyIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep9Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep9Val == undefined || data.roDuRotnStep9Val == null || data.roDuRotnStep9Val == "" || isNaN(data.roDuRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep9Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep9Val == undefined || data.roDuIvrStep9Val == null || data.roDuIvrStep9Val == "" || isNaN(data.roDuIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep9Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep9Val == undefined || data.roDuIvrrStep9Val == null || data.roDuIvrrStep9Val == "" || isNaN(data.roDuIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep9Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep9Val == undefined || data.roRepceRotnStep9Val == null || data.roRepceRotnStep9Val == "" || isNaN(data.roRepceRotnStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep9Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep9Val == undefined || data.roRepceIvrStep9Val == null || data.roRepceIvrStep9Val == "" || isNaN(data.roRepceIvrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep9Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep9Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep9Val == undefined || data.roRepceIvrrStep9Val == null || data.roRepceIvrrStep9Val == "" || isNaN(data.roRepceIvrrStep9Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'roStep10Val', align:'center', title : 'DUH(식수)', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.roStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  value;
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roStep10Val == undefined || data.roStep10Val == null || data.roStep10Val == ""){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyRotnStep10Val', align:'center', title : '중계노드 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyRotnStep10Val == undefined || data.roRlyRotnStep10Val == null || data.roRlyRotnStep10Val == "" || isNaN(data.roRlyRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'roRlyIvrStep10Val', align:'center', title : '중계노드 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrStep10Val == undefined || data.roRlyIvrStep10Val == null || data.roRlyIvrStep10Val == "" || isNaN(data.roRlyIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRlyIvrrStep10Val', align:'center', title : '중계노드 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRlyIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRlyIvrrStep10Val == undefined || data.roRlyIvrrStep10Val == null || data.roRlyIvrrStep10Val == "" || isNaN(data.roRlyIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuRotnStep10Val', align:'center', title : 'DU ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuRotnStep10Val == undefined || data.roDuRotnStep10Val == null || data.roDuRotnStep10Val == "" || isNaN(data.roDuRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrStep10Val', align:'center', title : 'DU IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrStep10Val == undefined || data.roDuIvrStep10Val == null || data.roDuIvrStep10Val == "" || isNaN(data.roDuIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roDuIvrrStep10Val', align:'center', title : 'DU IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roDuIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roDuIvrrStep10Val == undefined || data.roDuIvrrStep10Val == null || data.roDuIvrrStep10Val == "" || isNaN(data.roDuIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceRotnStep10Val', align:'center', title : '대개체 ROTN', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceRotnStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceRotnStep10Val == undefined || data.roRepceRotnStep10Val == null || data.roRepceRotnStep10Val == "" || isNaN(data.roRepceRotnStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrStep10Val', align:'center', title : '대개체 IVR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrStep10Val == undefined || data.roRepceIvrStep10Val == null || data.roRepceIvrStep10Val == "" || isNaN(data.roRepceIvrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'roRepceIvrrStep10Val', align:'center', title : '대개체 IVRR', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return tmp;
						} else {
							data.roRepceIvrrStep10Val = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							if (data.roRepceIvrrStep10Val == undefined || data.roRepceIvrrStep10Val == null || data.roRepceIvrrStep10Val == "" || isNaN(data.roRepceIvrrStep10Val)){strVal = '0';}
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





				{ key : 'ctrtEpwrVal', align:'center', title : '계약전력(Kw)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.ctrtEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'loadEpwrVal', align:'center', title : '부하전력(Kw)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.loadEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'loadEpwrRate', align:'center', title : '부하율(%)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmpCnt =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.loadEpwrRate = '';
						}
					},
					editable : function(value, data) {
						var strVal =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g2RemvRackCnt', align:'center', title : '철거랙수', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g2RemvRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g2ScreEpwrVal', align:'center', title : '확보전력(Kw)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g2ScreEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 60 */	{ key : 'lteCellCnt', align:'center', title : 'CELL', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lteCellCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'lteDuCnt', align:'center', title : 'DU', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lteDuCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'etc1xCnt', align:'center', title : '1X', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.etc1xCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'etcWbrCnt', align:'center', title : 'WIBRO', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.etcWbrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
/* 제어되지 않음. */ 	{ key : 'lgcyEpwrVal', align:'center', title : 'Legacy 전력량(Kw)', width: '180',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.lgcyEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},
				{ key : 'addDemdRackCnt', align:'center', title : '랙수', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.addDemdRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'addDemdEpwrVal', align:'center', title : '전력량(Kw)', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.addDemdEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 70 */	{ key : 'sggDulAcptVal', align:'center', title : '시군구 DUL수용 비율', width: '150', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sggDulAcptVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DulCnt', align:'center', title : 'DUL수', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DulCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhCnt', align:'center', title : 'DUH수', width: '100', styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhRackCnt', align:'center', title : 'DUH랙수', width: '100' , styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'g5DuhEpwrVal', align:'center', title : 'DUL전력량(Kw)', width: '110' , styleclass : 'font-red',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.g5DuhEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},















				{ key : 'trmsRotnCnt', align:'center', title : 'ROTN', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsRotnCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrCnt', align:'center', title : 'IVR', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrrCnt', align:'center', title : 'IVRR', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrrCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trms5gponCnt', align:'center', title : '5GPON', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trms5gponCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 80 */	{ key : 'trmsSmuxCnt', align:'center', title : 'SMUX', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsSmuxCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsFdfCnt', align:'center', title : 'FDF', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsFdfCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsRackSubtCnt', align:'center', title : '소계', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.trmsRackSubtCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'trmsRotnEpwrVal', align:'center', title : 'ROTN', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsRotnEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrEpwrVal', align:'center', title : 'IVR', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsIvrrEpwrVal', align:'center', title : 'IVRR', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trmsIvrrEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trms5gponEpwrVal', align:'center', title : '5GPON', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.trms5gponEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'trmsSubtEpwrVal', align:'center', title : '소계', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.trmsSubtEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'sbeqpRtfRackCnt', align:'center', title : '정류기랙수', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpRtfRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpIpdCnt', align:'center', title : 'IPD', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpIpdCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 90 */	{ key : 'sbeqpArcnCnt', align:'center', title : '냉방기', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpArcnCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpBatryCnt', align:'center', title : '축전지', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.sbeqpBatryCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'sbeqpSubtCnt', align:'center', title : '소계', width: '100', styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.sbeqpSubtCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'upsdDemdRackCnt', align:'center', title : '랙수', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.upsdDemdRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'upsdDemdEpwrVal', align:'center', title : '소모전력(Kw)', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.upsdDemdEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'remRackCnt', align:'center', title : '잔여랙수', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.remRackCnt = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'remEpwrVal', align:'center', title : '잔여전력(Kw)', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.remEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'shtgItmCd', align:'center', title : '부족항목', width: '130' , styleclass : 'font-orange',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grShtgItmCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grShtgItmCd) {
								var exist = '';

								if (value && value.indexOf(grShtgItmCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grShtgItmCd[i].value+' '+exist+'>'+grShtgItmCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},

				{ key : 'screPsblEpwrVal', align:'center', title : '최대확보가능전력(Kw)', width: '110' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screPsblEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'accmEpwrVal', align:'center', title : '누적전력(Kw)', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screPsblEpwrVal = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'epwrUseRate', align:'center', title : '전력현재사용율(%)', width: '110' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.epwrUseRate = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 100 */	{ key : 'epwrRfctInvtCost', align:'right', title : '전력보강투자비', width: '110' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.epwrRfctInvtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'rmk', align:'left', title : '비고', width: '100' , styleclass : 'font-orange',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.rmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'bfSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.bfLandCost)) + setIsNaNCheck(parseInt(data.bfNbdCost)) + setIsNaNCheck(parseInt(data.bfLinCost)) + setIsNaNCheck(parseInt(data.bfRprCost))  + setIsNaNCheck(parseInt(data.bfBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.bfSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.bfLandCost)) + setIsNaNCheck(parseInt(data.bfNbdCost)) + setIsNaNCheck(parseInt(data.bfLinCost)) + setIsNaNCheck(parseInt(data.bfRprCost))  + setIsNaNCheck(parseInt(data.bfBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//18 Year
				{ key : 'bfLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.bfBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'bfRmk', align:'left', title : '비고', width: '200',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.bfRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'invtTypCd', align:'center', title : '투자유형', width: '150',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grInvtCd);
								return render_data;
							} else {
								data.invtTypCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grInvtCd) {
								var exist = '';

								if (value && value.indexOf(grInvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grInvtCd[i].value+' '+exist+'>'+grInvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},		// 19Year 1~4
	/* 110 */	{ key : 'afeSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost)) +
						setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost)) +
						setIsNaNCheck(parseInt(data.afeFstNbdCost)) +
						setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFstLinCost)) +
						setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost)) +
						setIsNaNCheck(parseInt(data.afeFstRprCost)) +
						setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost)) +
						setIsNaNCheck(parseInt(data.afeFstBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstLandCost)) +
						setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost)) +
						setIsNaNCheck(parseInt(data.afeFstNbdCost)) +
						setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFstLinCost)) +
						setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost)) +
						setIsNaNCheck(parseInt(data.afeFstRprCost)) +
						setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost)) +
						setIsNaNCheck(parseInt(data.afeFstBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'afeLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost))
						+ setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstLandCost))
						+ setIsNaNCheck(parseInt(data.afeScndLandCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLandCost)) +
						setIsNaNCheck(parseInt(data.afeFothLandCost))  +
						setIsNaNCheck(parseInt(data.afeFithLandCost)) +
						setIsNaNCheck(parseInt(data.afeSithLandCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstNbdCost))
						+ setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstNbdCost))
						+ setIsNaNCheck(parseInt(data.afeScndNbdCost)) +
						setIsNaNCheck(parseInt(data.afeThrdNbdCost)) +
						setIsNaNCheck(parseInt(data.afeFothNbdCost))  +
						setIsNaNCheck(parseInt(data.afeFithNbdCost)) +
						setIsNaNCheck(parseInt(data.afeSithNbdCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLinCost))
						+ setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstLinCost))
						+ setIsNaNCheck(parseInt(data.afeScndLinCost)) +
						setIsNaNCheck(parseInt(data.afeThrdLinCost)) +
						setIsNaNCheck(parseInt(data.afeFothLinCost))  +
						setIsNaNCheck(parseInt(data.afeFithLinCost)) +
						setIsNaNCheck(parseInt(data.afeSithLinCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstRprCost))
						+ setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstRprCost))
						+ setIsNaNCheck(parseInt(data.afeScndRprCost)) +
						setIsNaNCheck(parseInt(data.afeThrdRprCost)) +
						setIsNaNCheck(parseInt(data.afeFothRprCost))  +
						setIsNaNCheck(parseInt(data.afeFithRprCost)) +
						setIsNaNCheck(parseInt(data.afeSithRprCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstBascEnvCost))
						+ setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = setIsNaNCheck(parseInt(data.afeFstBascEnvCost))
						+ setIsNaNCheck(parseInt(data.afeScndBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeThrdBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeFothBascEnvCost))  +
						setIsNaNCheck(parseInt(data.afeFithBascEnvCost)) +
						setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},







				{ key : 'afeFstSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFstLandCost)) + setIsNaNCheck(parseInt(data.afeFstNbdCost)) + setIsNaNCheck(parseInt(data.afeFstLinCost)) + setIsNaNCheck(parseInt(data.afeFstRprCost))  + setIsNaNCheck(parseInt(data.afeFstBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFstSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFstLandCost)) + setIsNaNCheck(parseInt(data.afeFstNbdCost)) + setIsNaNCheck(parseInt(data.afeFstLinCost)) + setIsNaNCheck(parseInt(data.afeFstRprCost))  + setIsNaNCheck(parseInt(data.afeFstBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			// 19 1 AFE
				{ key : 'afeFstLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 120 */	{ key : 'afeFstRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFstBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFstBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeScndSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeScndLandCost)) + setIsNaNCheck(parseInt(data.afeScndNbdCost)) + setIsNaNCheck(parseInt(data.afeScndLinCost)) + setIsNaNCheck(parseInt(data.afeScndRprCost))  + setIsNaNCheck(parseInt(data.afeScndBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeScndSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeScndLandCost)) + setIsNaNCheck(parseInt(data.afeScndNbdCost)) + setIsNaNCheck(parseInt(data.afeScndLinCost)) + setIsNaNCheck(parseInt(data.afeScndRprCost))  + setIsNaNCheck(parseInt(data.afeScndBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 2
				{ key : 'afeScndLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeScndBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeScndBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



	/* 130 */	{ key : 'afeThrdSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeThrdLandCost)) + setIsNaNCheck(parseInt(data.afeThrdNbdCost)) + setIsNaNCheck(parseInt(data.afeThrdLinCost)) + setIsNaNCheck(parseInt(data.afeThrdRprCost))  + setIsNaNCheck(parseInt(data.afeThrdBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeThrdSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeThrdLandCost)) + setIsNaNCheck(parseInt(data.afeThrdNbdCost)) + setIsNaNCheck(parseInt(data.afeThrdLinCost)) + setIsNaNCheck(parseInt(data.afeThrdRprCost))  + setIsNaNCheck(parseInt(data.afeThrdBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 3
				{ key : 'afeThrdLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeThrdBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeThrdBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},






				{ key : 'afeFothSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFothLandCost)) + setIsNaNCheck(parseInt(data.afeFothNbdCost)) + setIsNaNCheck(parseInt(data.afeFothLinCost)) + setIsNaNCheck(parseInt(data.afeFothRprCost))  + setIsNaNCheck(parseInt(data.afeFothBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFothSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFothLandCost)) + setIsNaNCheck(parseInt(data.afeFothNbdCost)) + setIsNaNCheck(parseInt(data.afeFothLinCost)) + setIsNaNCheck(parseInt(data.afeFothRprCost))  + setIsNaNCheck(parseInt(data.afeFothBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeFothLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeFothLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFothBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFothBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},


				{ key : 'afeFithSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeFithLandCost)) + setIsNaNCheck(parseInt(data.afeFithNbdCost)) + setIsNaNCheck(parseInt(data.afeFithLinCost)) + setIsNaNCheck(parseInt(data.afeFithRprCost))  + setIsNaNCheck(parseInt(data.afeFithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeFithSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeFithLandCost)) + setIsNaNCheck(parseInt(data.afeFithNbdCost)) + setIsNaNCheck(parseInt(data.afeFithLinCost)) + setIsNaNCheck(parseInt(data.afeFithRprCost))  + setIsNaNCheck(parseInt(data.afeFithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeFithLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeFithLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeFithBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeFithBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},




				{ key : 'afeSithSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.afeSithLandCost)) + setIsNaNCheck(parseInt(data.afeSithNbdCost)) + setIsNaNCheck(parseInt(data.afeSithLinCost)) + setIsNaNCheck(parseInt(data.afeSithRprCost))  + setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.afeSithSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.afeSithLandCost)) + setIsNaNCheck(parseInt(data.afeSithNbdCost)) + setIsNaNCheck(parseInt(data.afeSithLinCost)) + setIsNaNCheck(parseInt(data.afeSithRprCost))  + setIsNaNCheck(parseInt(data.afeSithBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	19 4
				{ key : 'afeSithLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 140 */	{ key : 'afeSithLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'afeSithBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.afeSithBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},





//				{ key : 'afeFothRmk', align:'center', title : '비고', width: '100',
//					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
//					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" tabindex="10128"/></div>'; }  },
///* 제어되지 않음. */ 	{ key : 'nxtDulSubtCost', align:'center', title : '투자유형', width: '100',
//					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
//					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" tabindex="10129"/></div>'; }  },		//	20 DUL
				{ key : 'nxtDulSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.nxtDulLandCost)) + setIsNaNCheck(parseInt(data.nxtDulNbdCost)) + setIsNaNCheck(parseInt(data.nxtDulLinCost)) + setIsNaNCheck(parseInt(data.nxtDulRprCost))  + setIsNaNCheck(parseInt(data.nxtDulBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.nxtDulSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.nxtDulLandCost)) + setIsNaNCheck(parseInt(data.nxtDulNbdCost)) + setIsNaNCheck(parseInt(data.nxtDulLinCost)) + setIsNaNCheck(parseInt(data.nxtDulRprCost))  + setIsNaNCheck(parseInt(data.nxtDulBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtDulRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
	/* 150 */	{ key : 'nxtDulBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtDulBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
















				{ key : 'nxtDulLandCd', align:'center', title : '토지 우선순위(지역)', width: '150',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'nxtDulNbdCd', align:'center', title : '건축 우선순위', width: '150',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'nxtDulInvtCd', align:'center', title : '투자 대상(확인필요)', width: '150',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNinvtCd);
								return render_data;
							} else {
								data.shtgItmCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNinvtCd) {
								var exist = '';

								if (value && value.indexOf(grNinvtCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNinvtCd[i].value+' '+exist+'>'+grNinvtCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},



				{ key : 'nxtDulRmk', align:'left', title : '비고', width: '200',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nxtDulRmk = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},



				{ key : 'nxtSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.nxtLandCost)) + setIsNaNCheck(parseInt(data.nxtNbdCost)) + setIsNaNCheck(parseInt(data.nxtLinCost)) + setIsNaNCheck(parseInt(data.nxtRprCost))  + setIsNaNCheck(parseInt(data.nxtBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.nxtSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.nxtLandCost)) + setIsNaNCheck(parseInt(data.nxtNbdCost)) + setIsNaNCheck(parseInt(data.nxtLinCost)) + setIsNaNCheck(parseInt(data.nxtRprCost))  + setIsNaNCheck(parseInt(data.nxtBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	21
				{ key : 'nxtLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.nxtBascEnvCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'nxtRmk', align:'left', title : '비고', width: '200',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nxtRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}

				},




				{ key : 'screNeedSubtCost', align:'right', title : '소계', width: '100',
					render : function(value, data, render, mapping){
						var tmpCnt =  setIsNaNCheck(parseInt(data.screNeedLandCost)) + setIsNaNCheck(parseInt(data.screNeedNbdCost)) + setIsNaNCheck(parseInt(data.screNeedLinCost)) + setIsNaNCheck(parseInt(data.screNeedRprCost))  + setIsNaNCheck(parseInt(data.screNeedBascEnvCost));
						if (isNaN(tmpCnt)) tmpCnt = "0";
						if(data.repMtsoYn == 'Y') {
							return setComma(tmpCnt);
						} else {
							data.screNeedSubtCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal =  setIsNaNCheck(parseInt(data.screNeedLandCost)) + setIsNaNCheck(parseInt(data.screNeedNbdCost)) + setIsNaNCheck(parseInt(data.screNeedLinCost)) + setIsNaNCheck(parseInt(data.screNeedRprCost))  + setIsNaNCheck(parseInt(data.screNeedBascEnvCost));
						if (isNaN(strVal)) strVal = "0";
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},			//	18
	/* 160 */	{ key : 'screNeedLandCost', align:'right', title : '토지', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedLandCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedNbdCost', align:'right', title : '건축', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedNbdCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedLinCost', align:'right', title : '인입관로', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedLinCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedRprCost', align:'right', title : '대수선', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedBascEnvCost', align:'right', title : '기초환경', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							var tmp = value;
							if(isNaN(tmp)) {tmp = 0;}
							return setComma(tmp);
						} else {
							data.screNeedRprCost = '0';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:right;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:right;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},
				{ key : 'screNeedRmk', align:'left', title : '비고', width: '200',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.screNeedRmk = '';
						}
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						} else {
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}
					}
				},

				{ key : 'upsdMgmtYn', align:'center', title : '도면관리', width: '100',

					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDrawYn);
								return render_data;
							} else {
								data.upsdMgmtYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grDrawYn) {
								var exist = '';

								if (value && value.indexOf(grDrawYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grDrawYn[i].value+' '+exist+'>'+grDrawYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'upsdCellMgmtYn', align:'center', title : 'CELL', width: '100',
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grCellYn);
								return render_data;
							} else {
								data.upsdCellMgmtYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grCellYn) {
								var exist = '';

								if (value && value.indexOf(grCellYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grCellYn[i].value+' '+exist+'>'+grCellYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'upsdEqpAcrdYn', align:'center', title : '장비-도면일치여부', width: '120',

					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn != 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grUpsdEqpAcrdYn);
								return render_data;
							} else {
								data.upsdEqpAcrdYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn != 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grCellYn) {
								var exist = '';

								if (value && value.indexOf(grUpsdEqpAcrdYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grUpsdEqpAcrdYn[i].value+' '+exist+'>'+grUpsdEqpAcrdYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}

				},
				{ key : 'upsdRmk', align:'left', title : '비고', width: '200',
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn != 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
	/* 170 */	{ key : 'gntHldVal', align:'left', title : '발전기보유', width: '200',
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
				{ key : 'exstrHldVal', align:'left', title : '배풍기', width: '200',
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else{ return false; } },
					editable : function(value, data) { return '<div><input type="text" style="width:100%;height:22px;" maxlength="100" value="'+value+'" /></div>'; } },
				{ key : 'upsdDemdId', align:'center', title : '수요ID', width: '100' },
				{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '100' },
				{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '100' }

				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});


		gridHide();
	};
	function gridHide() {
		var hideColList = [];
		hideColList = ['upsdDemdId', 'repMtsoYn', 'repMtsoId','intgFcltsCd', 'screBldDivVal', 'demdHdofcCd', 'demdAreaCd', 'bldFlorNo', 'totBldFlor', 'praFildCd', 'bldCd', 'bldNm', 'bldblkNo', 'siteKeyVal', 'repIntgFcltsCd', 'mtsoAbbrNm', 'mtsoId', 'dtlAddr', 'sidoNm', 'sggNm', 'emdNm', 'laraCd', 'dntnYn', 'latVal', 'lngVal', 'bldMgmtTypCd', 'landOwnDivVal', 'bldOwnDivVal', 'screLandYr', 'screBldYr', 'landArPyngVal', 'cbgRate', 'bldCoverageRate', 'bldArPyngVal', 'totAr', 'upsdAcptRackCnt', 'upsdFcltsRackCnt', 'upsdIdleRackCnt', 'upsdUseRate', 'nbdG5AcptVal', 'nbdG5AcptRsn', 'nbdUpsdShtgRsn', 'nbdUpsdRmdyRsn', 'areaNbdInvtScdleVal', 'nbdInvtScdleVal', 'closMtsoNm', 'diffMtsoNm', 'diffCstVal', 'lesCstVal', 'diffScdleVal', 'ctrtEpwrVal', 'loadEpwrVal', 'loadEpwrRate', 'g2RemvRackCnt', 'g2ScreEpwrVal', 'lteCellCnt', 'lteDuCnt', 'etc1xCnt', 'etcWbrCnt', 'lgcyEpwrVal', 'addDemdRackCnt', 'addDemdEpwrVal', 'sggDulAcptVal', 'g5DulCnt', 'g5DuhCnt', 'g5DuhRackCnt', 'g5DuhEpwrVal', 'trmsRotnCnt', 'trmsIvrCnt', 'trmsIvrrCnt', 'trms5gponCnt', 'trmsSmuxCnt', 'trmsFdfCnt', 'trmsRackSubtCnt', 'trmsRotnEpwrVal', 'trmsIvrEpwrVal', 'trmsIvrrEpwrVal', 'trms5gponEpwrVal', 'trmsSubtEpwrVal', 'sbeqpRtfRackCnt', 'sbeqpIpdCnt', 'sbeqpArcnCnt', 'sbeqpBatryCnt', 'sbeqpSubtCnt', 'upsdDemdRackCnt', 'upsdDemdEpwrVal', 'remRackCnt', 'remEpwrVal', 'shtgItmCd', 'screPsblEpwrVal', 'accmEpwrVal', 'epwrUseRate', 'epwrRfctInvtCost', 'rmk', 'roAcptScdleVal', 'roDuhStep1Val', 'roDuhStep2Val', 'roDuhStep3Val', 'roDuhStep4Val', 'roDuhStep5Val', 'roDuhStep6Val', 'roDuhStep7Val', 'roDuhStep8Val', 'roDuhStep9Val', 'roDuhStep10Val', 'roDsnDuhVal', 'roDuhAreaVal', 'roDuhHdqtrVal', 'roStep1Val', 'roRlyRotnStep1Val', 'roRlyIvrStep1Val', 'roRlyIvrrStep1Val', 'roDuRotnStep1Val', 'roDuIvrStep1Val', 'roDuIvrrStep1Val', 'roRepceRotnStep1Val', 'roRepceIvrStep1Val', 'roRepceIvrrStep1Val', 'roStep2Val', 'roRlyRotnStep2Val', 'roRlyIvrStep2Val', 'roRlyIvrrStep2Val', 'roDuRotnStep2Val', 'roDuIvrStep2Val', 'roDuIvrrStep2Val', 'roRepceRotnStep2Val', 'roRepceIvrStep2Val', 'roRepceIvrrStep2Val', 'roStep3Val', 'roRlyRotnStep3Val', 'roRlyIvrStep3Val', 'roRlyIvrrStep3Val', 'roDuRotnStep3Val', 'roDuIvrStep3Val', 'roDuIvrrStep3Val', 'roRepceRotnStep3Val', 'roRepceIvrStep3Val', 'roRepceIvrrStep3Val', 'roStep4Val', 'roRlyRotnStep4Val', 'roRlyIvrStep4Val', 'roRlyIvrrStep4Val', 'roDuRotnStep4Val', 'roDuIvrStep4Val', 'roDuIvrrStep4Val', 'roRepceRotnStep4Val', 'roRepceIvrStep4Val', 'roRepceIvrrStep4Val', 'roStep5Val', 'roRlyRotnStep5Val', 'roRlyIvrStep5Val', 'roRlyIvrrStep5Val', 'roDuRotnStep5Val', 'roDuIvrStep5Val', 'roDuIvrrStep5Val', 'roRepceRotnStep5Val', 'roRepceIvrStep5Val', 'roRepceIvrrStep5Val', 'roStep6Val', 'roRlyRotnStep6Val', 'roRlyIvrStep6Val', 'roRlyIvrrStep6Val', 'roDuRotnStep6Val', 'roDuIvrStep6Val', 'roDuIvrrStep6Val', 'roRepceRotnStep6Val', 'roRepceIvrStep6Val', 'roRepceIvrrStep6Val', 'roStep7Val', 'roRlyRotnStep7Val', 'roRlyIvrStep7Val', 'roRlyIvrrStep7Val', 'roDuRotnStep7Val', 'roDuIvrStep7Val', 'roDuIvrrStep7Val', 'roRepceRotnStep7Val', 'roRepceIvrStep7Val', 'roRepceIvrrStep7Val', 'bfSubtCost', 'bfLandCost', 'bfNbdCost', 'bfLinCost', 'bfRprCost', 'bfBascEnvCost', 'bfRmk', 'invtTypCd', 'afeSubtCost', 'afeLandCost', 'afeNbdCost', 'afeLinCost', 'afeRprCost', 'afeBascEnvCost', 'afeFstSubtCost', 'afeFstLandCost', 'afeFstNbdCost', 'afeFstLinCost', 'afeFstRprCost', 'afeFstBascEnvCost', 'afeScndSubtCost', 'afeScndLandCost', 'afeScndNbdCost', 'afeScndLinCost', 'afeScndRprCost', 'afeScndBascEnvCost', 'afeThrdSubtCost', 'afeThrdLandCost', 'afeThrdNbdCost', 'afeThrdLinCost', 'afeThrdRprCost', 'afeThrdBascEnvCost', 'afeFothSubtCost', 'afeFothLandCost', 'afeFothNbdCost', 'afeFothLinCost', 'afeFothRprCost', 'afeFothBascEnvCost', 'afeFithSubtCost', 'afeFithLandCost', 'afeFithNbdCost', 'afeFithLinCost', 'afeFithRprCost', 'afeFithBascEnvCost', 'afeSithSubtCost', 'afeSithLandCost', 'afeSithNbdCost', 'afeSithLinCost', 'afeSithRprCost', 'afeSithBascEnvCost', 'nxtDulSubtCost', 'nxtDulLandCost', 'nxtDulNbdCost', 'nxtDulLinCost', 'nxtDulRprCost', 'nxtDulBascEnvCost', 'nxtDulLandCd', 'nxtDulNbdCd', 'nxtDulInvtCd', 'nxtDulRmk', 'nxtSubtCost', 'nxtLandCost', 'nxtNbdCost', 'nxtLinCost', 'nxtRprCost', 'nxtBascEnvCost', 'nxtRmk', 'screNeedSubtCost', 'screNeedLandCost', 'screNeedNbdCost', 'screNeedLinCost', 'screNeedRprCost', 'screNeedBascEnvCost', 'screNeedRmk', 'upsdMgmtYn', 'upsdCellMgmtYn', 'upsdEqpAcrdYn', 'upsdRmk', 'gntHldVal', 'exstrHldVal', 'fcltsRackAispRsltVal'];

		hideColList.push('newMtsoNm');
		hideColList.push('exstMtsoNm');


		var d = new Date();
		var nowYear = d.getFullYear();
		//if (nowYear == '2019') {
//			hideColList.push('roDuhStep8Val');
//			hideColList.push('roDuhStep9Val');
//			hideColList.push('roDuhStep10Val');

			hideColList.push('roStep8Val');
			hideColList.push('roRlyRotnStep8Val');
			hideColList.push('roRlyIvrStep8Val');
			hideColList.push('roRlyIvrrStep8Val');
			hideColList.push('roDuRotnStep8Val');
			hideColList.push('roDuIvrStep8Val');
			hideColList.push('roDuIvrrStep8Val');
			hideColList.push('roRepceRotnStep8Val');
			hideColList.push('roRepceIvrStep8Val');
			hideColList.push('roRepceIvrrStep8Val');

			hideColList.push('roStep9Val');
			hideColList.push('roRlyRotnStep9Val');
			hideColList.push('roRlyIvrStep9Val');
			hideColList.push('roRlyIvrrStep9Val');
			hideColList.push('roDuRotnStep9Val');
			hideColList.push('roDuIvrStep9Val');
			hideColList.push('roDuIvrrStep9Val');
			hideColList.push('roRepceRotnStep9Val');
			hideColList.push('roRepceIvrStep9Val');
			hideColList.push('roRepceIvrrStep9Val');

			hideColList.push('roStep10Val');
			hideColList.push('roRlyRotnStep10Val');
			hideColList.push('roRlyIvrStep10Val');
			hideColList.push('roRlyIvrrStep10Val');
			hideColList.push('roDuRotnStep10Val');
			hideColList.push('roDuIvrStep10Val');
			hideColList.push('roDuIvrrStep10Val');
			hideColList.push('roRepceRotnStep10Val');
			hideColList.push('roRepceIvrStep10Val');
			hideColList.push('roRepceIvrrStep10Val');
		//}



		var srchMtsoInfo = $('#srchMtsoInfo').val();
		if (srchMtsoInfo != undefined && srchMtsoInfo != null && srchMtsoInfo != "") {
			for(var i=0; i < srchMtsoInfo.length; i++) {
				var tmpValue = srchMtsoInfo[i];
				switch (tmpValue) {
				case "1" :
					hideColList.splice(hideColList.indexOf('demdHdofcCd'),1);
					hideColList.splice(hideColList.indexOf('demdAreaCd'),1);
					break;
				case "2" :
					hideColList.splice(hideColList.indexOf('bldFlorNo'),1);
					hideColList.splice(hideColList.indexOf('totBldFlor'),1);
					hideColList.splice(hideColList.indexOf('praFildCd'),1);
					hideColList.splice(hideColList.indexOf('bldCd'),1);
					hideColList.splice(hideColList.indexOf('bldNm'),1);
					hideColList.splice(hideColList.indexOf('bldblkNo'),1);
					hideColList.splice(hideColList.indexOf('siteKeyVal'),1);
					hideColList.splice(hideColList.indexOf('repIntgFcltsCd'),1);
					hideColList.splice(hideColList.indexOf('mtsoAbbrNm'),1);
					hideColList.splice(hideColList.indexOf('mtsoId'),1);
					break;
				case "3" :
					hideColList.splice(hideColList.indexOf('dtlAddr'),1);
					hideColList.splice(hideColList.indexOf('sidoNm'),1);
					hideColList.splice(hideColList.indexOf('sggNm'),1);
					hideColList.splice(hideColList.indexOf('emdNm'),1);
					hideColList.splice(hideColList.indexOf('laraCd'),1);
					hideColList.splice(hideColList.indexOf('dntnYn'),1);
					hideColList.splice(hideColList.indexOf('latVal'),1);
					hideColList.splice(hideColList.indexOf('lngVal'),1);
					break;
				case "4" :
					hideColList.splice(hideColList.indexOf('bldMgmtTypCd'),1);
					hideColList.splice(hideColList.indexOf('landOwnDivVal'),1);
					hideColList.splice(hideColList.indexOf('bldOwnDivVal'),1);
					break;
				case "5" :
					hideColList.splice(hideColList.indexOf('screLandYr'),1);
					hideColList.splice(hideColList.indexOf('screBldYr'),1);
					break;
				case "6" :
					hideColList.splice(hideColList.indexOf('landArPyngVal'),1);
					hideColList.splice(hideColList.indexOf('cbgRate'),1);
					hideColList.splice(hideColList.indexOf('bldCoverageRate'),1);
					hideColList.splice(hideColList.indexOf('bldArPyngVal'),1);
					hideColList.splice(hideColList.indexOf('totAr'),1);
					break;
				case "7" :
					hideColList.splice(hideColList.indexOf('upsdAcptRackCnt'),1);
					hideColList.splice(hideColList.indexOf('upsdFcltsRackCnt'),1);
					hideColList.splice(hideColList.indexOf('upsdIdleRackCnt'),1);
					hideColList.splice(hideColList.indexOf('upsdUseRate'),1);

					hideColList.splice(hideColList.indexOf('fcltsRackAispRsltVal'),1);

					break;
				}
			}
		}



		var srchMtsoOpCl = $('#srchMtsoOpCl').val();
		if (srchMtsoOpCl != undefined && srchMtsoOpCl != null && srchMtsoOpCl != "") {
			for(var i=0; i < srchMtsoOpCl.length; i++) {
				var tmpValue = srchMtsoOpCl[i];
				switch (tmpValue) {
				case "8" :
					hideColList.splice(hideColList.indexOf('nbdG5AcptVal'),1);
					hideColList.splice(hideColList.indexOf('nbdG5AcptRsn'),1);
					hideColList.splice(hideColList.indexOf('nbdUpsdShtgRsn'),1);
					hideColList.splice(hideColList.indexOf('nbdUpsdRmdyRsn'),1);
					hideColList.splice(hideColList.indexOf('areaNbdInvtScdleVal'),1);
					hideColList.splice(hideColList.indexOf('nbdInvtScdleVal'),1);
					break;
				case "9" :
					hideColList.splice(hideColList.indexOf('newMtsoNm'),1);
					hideColList.splice(hideColList.indexOf('exstMtsoNm'),1);
					break;
				case "10" :
					hideColList.splice(hideColList.indexOf('closMtsoNm'),1);
					hideColList.splice(hideColList.indexOf('diffMtsoNm'),1);
					hideColList.splice(hideColList.indexOf('diffCstVal'),1);
					hideColList.splice(hideColList.indexOf('lesCstVal'),1);
					hideColList.splice(hideColList.indexOf('diffScdleVal'),1);
					break;
				}
			}
		}

		var srchLegay = $('#srchLegay').val();
		if (srchLegay != undefined && srchLegay != null && srchLegay != "") {
			for(var i=0; i < srchLegay.length; i++) {
				var tmpValue = srchLegay[i];
				switch (tmpValue) {
				case "13" :
					hideColList.splice(hideColList.indexOf('ctrtEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('loadEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('loadEpwrRate'),1);
					break;
				case "14" :
					hideColList.splice(hideColList.indexOf('g2RemvRackCnt'),1);
					hideColList.splice(hideColList.indexOf('g2ScreEpwrVal'),1);
					break;
				case "15" :
					hideColList.splice(hideColList.indexOf('lteCellCnt'),1);
					hideColList.splice(hideColList.indexOf('lteDuCnt'),1);
					hideColList.splice(hideColList.indexOf('etc1xCnt'),1);
					hideColList.splice(hideColList.indexOf('etcWbrCnt'),1);
					break;
				case "16" :
					hideColList.splice(hideColList.indexOf('lgcyEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('addDemdRackCnt'),1);
					hideColList.splice(hideColList.indexOf('addDemdEpwrVal'),1);
					break;
				case "17" :
					hideColList.splice(hideColList.indexOf('sggDulAcptVal'),1);
					hideColList.splice(hideColList.indexOf('g5DulCnt'),1);
					hideColList.splice(hideColList.indexOf('g5DuhCnt'),1);
					hideColList.splice(hideColList.indexOf('g5DuhRackCnt'),1);
					hideColList.splice(hideColList.indexOf('g5DuhEpwrVal'),1);
					break;
				case "18" :
					hideColList.splice(hideColList.indexOf('trmsRotnCnt'),1);
					hideColList.splice(hideColList.indexOf('trmsIvrCnt'),1);
					hideColList.splice(hideColList.indexOf('trmsIvrrCnt'),1);
					hideColList.splice(hideColList.indexOf('trms5gponCnt'),1);
					hideColList.splice(hideColList.indexOf('trmsSmuxCnt'),1);
					hideColList.splice(hideColList.indexOf('trmsFdfCnt'),1);
					hideColList.splice(hideColList.indexOf('trmsRackSubtCnt'),1);
					break;
				case "19" :
					hideColList.splice(hideColList.indexOf('trmsRotnEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('trmsIvrEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('trmsIvrrEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('trms5gponEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('trmsSubtEpwrVal'),1);
					break;
				}
			}
		}

		var srchUpsd = $('#srchUpsd').val();
		if (srchUpsd != undefined && srchUpsd != null && srchUpsd != "") {
			for(var i=0; i < srchUpsd.length; i++) {
				var tmpValue = srchUpsd[i];
				switch (tmpValue) {
				case "20" :
					hideColList.splice(hideColList.indexOf('sbeqpRtfRackCnt'),1);
					hideColList.splice(hideColList.indexOf('sbeqpIpdCnt'),1);
					hideColList.splice(hideColList.indexOf('sbeqpArcnCnt'),1);
					hideColList.splice(hideColList.indexOf('sbeqpBatryCnt'),1);
					hideColList.splice(hideColList.indexOf('sbeqpSubtCnt'),1);
					break;
				case "21" :
					hideColList.splice(hideColList.indexOf('upsdDemdRackCnt'),1);
					hideColList.splice(hideColList.indexOf('upsdDemdEpwrVal'),1);
					break;
				case "22" :
					hideColList.splice(hideColList.indexOf('remRackCnt'),1);
					hideColList.splice(hideColList.indexOf('remEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('shtgItmCd'),1);
					hideColList.splice(hideColList.indexOf('screPsblEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('accmEpwrVal'),1);
					hideColList.splice(hideColList.indexOf('epwrUseRate'),1);
					hideColList.splice(hideColList.indexOf('epwrRfctInvtCost'),1);
					hideColList.splice(hideColList.indexOf('rmk'),1);
					break;
				}
			}
		}

		var srchRollOut = $('#srchRollOut').val();
		if (srchRollOut != undefined && srchRollOut != null && srchRollOut != "") {
			for(var i=0; i < srchRollOut.length; i++) {
				var tmpValue = srchRollOut[i];
				switch (tmpValue) {
				case "11" :
					hideColList.splice(hideColList.indexOf('roAcptScdleVal'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roDuhStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roDsnDuhVal'),1);
					hideColList.splice(hideColList.indexOf('roDuhAreaVal'),1);
					hideColList.splice(hideColList.indexOf('roDuhHdqtrVal'),1);
					break;
				case "12" :
					hideColList.splice(hideColList.indexOf('roStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep1Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep1Val'),1);
					break;
				case "51" :
					hideColList.splice(hideColList.indexOf('roStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep2Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep2Val'),1);
					break;
				case "52" :
					hideColList.splice(hideColList.indexOf('roStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep3Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep3Val'),1);
					break;
				case "53" :
					hideColList.splice(hideColList.indexOf('roStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep4Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep4Val'),1);
					break;
				case "54" :
					hideColList.splice(hideColList.indexOf('roStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep5Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep5Val'),1);
					break;
				case "55" :
					hideColList.splice(hideColList.indexOf('roStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep6Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep6Val'),1);
					break;
				case "56" :
					hideColList.splice(hideColList.indexOf('roStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep7Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep7Val'),1);
					break;
				case "57" :
					hideColList.splice(hideColList.indexOf('roStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep8Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep8Val'),1);
					break;
				case "58" :
					hideColList.splice(hideColList.indexOf('roStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep9Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep9Val'),1);
					break;
				case "59" :
					hideColList.splice(hideColList.indexOf('roStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyRotnStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRlyIvrrStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roDuRotnStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roDuIvrrStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceRotnStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrStep10Val'),1);
					hideColList.splice(hideColList.indexOf('roRepceIvrrStep10Val'),1);
					break;

				}
			}
		}
		var srchAfe = $('#srchAfe').val();
		if (srchAfe != undefined && srchAfe != null && srchAfe != "") {
			for(var i=0; i < srchAfe.length; i++) {
				var tmpValue = srchAfe[i];
				switch (tmpValue) {
				case "23" :

					hideColList.splice(hideColList.indexOf('bfSubtCost'),1);
					hideColList.splice(hideColList.indexOf('bfLandCost'),1);
					hideColList.splice(hideColList.indexOf('bfNbdCost'),1);
					hideColList.splice(hideColList.indexOf('bfLinCost'),1);
					hideColList.splice(hideColList.indexOf('bfRprCost'),1);
					hideColList.splice(hideColList.indexOf('bfBascEnvCost'),1);
					hideColList.splice(hideColList.indexOf('bfRmk'),1);
					break;
				case "24" :

					hideColList.splice(hideColList.indexOf('invtTypCd'),1);
					hideColList.splice(hideColList.indexOf('afeSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeBascEnvCost'),1);
					break;
				case "25" :

					hideColList.splice(hideColList.indexOf('afeFstSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeFstLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeFstNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeFstLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeFstRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeFstBascEnvCost'),1);
					break;
				case "26" :

					hideColList.splice(hideColList.indexOf('afeScndSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeScndLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeScndNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeScndLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeScndRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeScndBascEnvCost'),1);
					break;
				case "27" :

					hideColList.splice(hideColList.indexOf('afeThrdSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeThrdLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeThrdNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeThrdLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeThrdRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeThrdBascEnvCost'),1);
					break;
				case "28" :

					hideColList.splice(hideColList.indexOf('afeFothSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeFothLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeFothNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeFothLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeFothRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeFothBascEnvCost'),1);
					break;
				case "29" :

					hideColList.splice(hideColList.indexOf('afeFithSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeFithLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeFithNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeFithLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeFithRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeFithBascEnvCost'),1);
					break;
				case "30" :

					hideColList.splice(hideColList.indexOf('afeSithSubtCost'),1);
					hideColList.splice(hideColList.indexOf('afeSithLandCost'),1);
					hideColList.splice(hideColList.indexOf('afeSithNbdCost'),1);
					hideColList.splice(hideColList.indexOf('afeSithLinCost'),1);
					hideColList.splice(hideColList.indexOf('afeSithRprCost'),1);
					hideColList.splice(hideColList.indexOf('afeSithBascEnvCost'),1);
					break;
				case "31" :

					hideColList.splice(hideColList.indexOf('nxtDulSubtCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulLandCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulNbdCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulLinCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulRprCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulBascEnvCost'),1);
					hideColList.splice(hideColList.indexOf('nxtDulLandCd'),1);
					hideColList.splice(hideColList.indexOf('nxtDulNbdCd'),1);
					hideColList.splice(hideColList.indexOf('nxtDulInvtCd'),1);
					hideColList.splice(hideColList.indexOf('nxtDulRmk'),1);
					break;
				case "32" :

					hideColList.splice(hideColList.indexOf('nxtSubtCost'),1);
					hideColList.splice(hideColList.indexOf('nxtLandCost'),1);
					hideColList.splice(hideColList.indexOf('nxtNbdCost'),1);
					hideColList.splice(hideColList.indexOf('nxtLinCost'),1);
					hideColList.splice(hideColList.indexOf('nxtRprCost'),1);
					hideColList.splice(hideColList.indexOf('nxtBascEnvCost'),1);
					hideColList.splice(hideColList.indexOf('nxtRmk'),1);
					break;
				case "33" :


					hideColList.splice(hideColList.indexOf('screNeedSubtCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedLandCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedNbdCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedLinCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedRprCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedBascEnvCost'),1);
					hideColList.splice(hideColList.indexOf('screNeedRmk'),1);
					break;
				}
			}
		}


		var srchEtc = $('#srchEtc').val();
		if (srchEtc != undefined && srchEtc != null && srchEtc != "") {
			for(var i=0; i < srchEtc.length; i++) {
				var tmpValue = srchEtc[i];
				switch (tmpValue) {
				case "34" :
					hideColList.splice(hideColList.indexOf('upsdMgmtYn'),1);
					hideColList.splice(hideColList.indexOf('upsdCellMgmtYn'),1);
					hideColList.splice(hideColList.indexOf('upsdEqpAcrdYn'),1);
					hideColList.splice(hideColList.indexOf('upsdRmk'),1);
					break;
				case "35" :
					hideColList.splice(hideColList.indexOf('gntHldVal'),1);
					hideColList.splice(hideColList.indexOf('exstrHldVal'),1);
					break;
				}
			}
		}


		$('#'+gridId).alopexGrid('hideCol', hideColList);
		$('#'+gridIdDtl).alopexGrid('hideCol', hideColList);


	}
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.

	function setComma(str) {
		str = String(str);

		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}


	function setFlor(num) {
		var strNum = num;
		if (strNum < 0 ) {
			return 'B'+ strNum;
		} else if (strNum > 0 ) {
			return strNum + 'F';
		} else {
			return '-';
		}
	}

	function setIsNaNCheck(strVal) {
		if (isNaN(strVal)) { strVal = 0; }
		return strVal;
	}

	function setEventListener() {


		var perPage = 100;
		var perPage2 = 100;
		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);

			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);

			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		// 데이터 수정
		$('#'+gridId).on('pageSet', function(e){
			var objData = $('#'+gridId).alopexGrid('dataEdit', {name : 'Grid'+(++editCount)}, {_state: {selected: true}});
			//console.log(objData);
		});

		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			$('#tmpUpsdDemdId').val(dataObj.upsdDemdId);
			main.setGrid2(1,perPage2);
		});

		// 페이지 번호 클릭시
		$('#'+gridIdDtl).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);

			main.setGrid2(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridIdDtl).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);

			perPage2 = eObj.perPage;
			main.setGrid2(1, eObj.perPage);
		});

		// 데이터 수정
		$('#'+gridIdDtl).on('pageSet', function(e){
			var objData = $('#'+gridIdDtl).alopexGrid('dataEdit', {name : 'Grid'+(++editCount)}, {_state: {selected: true}});
			//console.log(objData);
		});

		//조회
		$('#btnSearch').on('click', function(e) {
			initGrid();
			main.setGrid(1,perPage);
		});
		//엔터키로 조회
		$('#mtsoHisForm').on('keydown', function(e){
			if (e.which == 13  ){
				initGrid();
				main.setGrid(1,perPage);
			}
		});

		$('#demdHdofcCd').on('change', function(e) {
			var supCd = $("#demdHdofcCd").val();
			var param = {supCd : supCd}
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', param, 'GET', 'demdAreaCd'); // 본사 코드
		});

//		$('#btnExportExcel').on('click', function(e) {
//			var param =  $("#mtsoHisForm").getData();
//
//	   		 param.pageNo = 1;
//	   		 param.rowPerPage = 10;
//	   		 param.firstRowIndex = 1;
//	   		 param.lastRowIndex = 1000000000;
//	   		 param.fileName = "투자국사현황";
//	   		 param.fileExtension = "xlsx";
//	   		 param.excelPageDown = "N";
//	   		 param.excelUpload = "N";
//	   		 param.method = "getRoUpsdDemdList";
//	   		 //console.log(param);
//	   		 $('#'+gridId).alopexGrid('showProgress');
//		     httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/roExcelcreate', param, 'GET', 'excelDownload');
//		});

		$('#btnCncl').on('click', function(e) {
			$a.close();
		});


		$('#srchCheckAll').on('click', function(e) {
			var ckGubun = $("input:checkbox[id=srchCheckAll]").is(":checked") ? 'Y' : 'N';
			if (ckGubun == "Y") {
				$('#srchMtsoInfo').setData({ option_selected : ['1','2','3','4','5','6','7'] });
				$('#srchMtsoOpCl').setData({ option_selected : ['8','9','10'] });
				$('#srchLegay').setData({ option_selected : ['13','14','15','16','17','18','19'] });
				$('#srchUpsd').setData({ option_selected : ['20','21','22'] });
				$('#srchRollOut').setData({ option_selected : ['11','12','51','52','53','54','55','56'] });
				$('#srchAfe').setData({ option_selected : ['23','24','25','26','27','28','29','30','31','32','33'] });
				$('#srchEtc').setData({ option_selected : ['34','35'] });
			} else {
				$('#srchMtsoInfo').setData({ option_selected : [] });
				$('#srchMtsoOpCl').setData({ option_selected : [] });
				$('#srchLegay').setData({ option_selected : [] });
				$('#srchUpsd').setData({ option_selected : [] });
				$('#srchRollOut').setData({ option_selected : [] });
				$('#srchAfe').setData({ option_selected : [] });
				$('#srchEtc').setData({ option_selected : [] });
			}

		});


		$('#btnExportExcel').on('click', function(e) {

	        var param =  $("#mtsoHisForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#userId').val();
	   		$("#srchDt").val().replace("-","").replace("-","");

	   		var tmpSrchCol = [];
	   		$("input[name=srchCol]:checked").each(function() {
	   			var test = $(this).val();
	   			tmpSrchCol.push(test);
	   		})
//
	   		var ckGubun = $("input:checkbox[id^=srchYn]").is(":checked") ? 'N' : 'Y';
	   		param.srchYn = ckGubun;

	   		param.lastChgDate = $("#srchDt").val().replace("-","").replace("-","");
	   		//param.srchCol = tmpSrchCol;
//
//	   		/* 엑셀정보     	 */

//	   		param.mtsoMapList = mtsoMapListExcel;

	   		var now = new Date();
	   		var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   		var excelFileNm = 'RO_DEMD_InformationHistory_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getRoUpsdDemdHstList";
	   		param.excelFlag = "RoUemd";
//	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	   		fileOnDemendName = excelFileNm+".xlsx";
	   		//console.log(param);
	   		$('#'+gridId).alopexGrid('showProgress');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');

	});

	}




	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = [];
		var excelHeaderNm = [];
		var excelHeaderAlign = [];
		var excelHeaderWidth = [];
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {

//				excelHeaderCd.push(gridHeader[i].key);
//				excelHeaderNm.push(gridHeader[i].title);
//				excelHeaderAlign.push(gridHeader[i].align);
//				excelHeaderWidth.push(gridHeader[i].width);

				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

	function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                    //$('#mgmtGrpNm').val('');
                }
            });
	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
		if(flag == 'mtsoEdited'){
			var mtsoNm				= response.mtsoInfoList[0].mtsoNm;
			var bldFlorNo			= response.mtsoInfoList[0].bldFlorNo;
			var bldCd				= response.mtsoInfoList[0].bldCd;
			var bldNm				= response.mtsoInfoList[0].bldNm;
			var siteKeyVal			= response.mtsoInfoList[0].siteCd;
			var repIntgFcltsCd		= response.mtsoInfoList[0].repIntgFcltsCd;
			var mtsoAbbrNm			= response.mtsoInfoList[0].mtsoAbbrNm;
//			var sidoNm				= response.mtsoInfoList[0].mtsoNm;
//			var sggNm				= response.mtsoInfoList[0].mtsoNm;
//			var emdNm				= response.mtsoInfoList[0].mtsoNm;
			var latVal				= response.mtsoInfoList[0].mtsoLatVal;
			var lngVal				= response.mtsoInfoList[0].mtsoLngVal;
			var bldblkNm			= response.mtsoInfoList[0].bldblkNm;

			if (repIntgFcltsCd == undefined) { repIntgFcltsCd = ''; }
			if (bldFlorNo == undefined) { bldFlorNo = '-'; }
			if (siteKeyVal == undefined)  { siteKeyVal = ''; }
			var tmpDtlAddr = "";
			if (bldblkNm != 'N') {
				tmpDtlAddr = response.mtsoInfoList[0].bldAddr + ' ' + bldNm + ' ' +  bldblkNm + '동 ' + bldFlorNo + '층';
			} else {
				tmpDtlAddr = response.mtsoInfoList[0].bldAddr + ' ' + bldNm + ' ' +  bldFlorNo + '층';
			}
			var dtlAddr				= tmpDtlAddr;

			var data = {mtsoNm : mtsoNm, bldFlorNo : bldFlorNo, bldCd : bldCd, bldNm : bldNm, siteKeyVal : siteKeyVal, repIntgFcltsCd : repIntgFcltsCd, mtsoAbbrNm : mtsoAbbrNm, latVal : latVal, lngVal : lngVal, dtlAddr: dtlAddr};
			$('#'+gridId).alopexGrid('dataEdit',data, {_state: {editing: true}});
		}

		if(flag == 'demdHdofcCd'){
			$('#demdHdofcCd').clear();
			//step1Cd = [];
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdHdofcCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'demdAreaCd'){
			$('#demdAreaCd').clear();
			var option_data = [{cd: '', cdNm: '전체'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#demdAreaCd').setData({ data : option_data, option_selected: '' });
		}

		if(flag == 'slfCd'){
			grSlfLesCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grSlfLesCd.push(resObj);
			}
		}
    	if(flag == 'bldMgmt'){
    		grMtsoTypCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grMtsoTypCd.push(resObj);
			}

			$('#mtsoCntrTypCdList').clear();
			var option_data = [];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#mtsoCntrTypCdList').setData({ data : option_data, option_selected: '' });

		}
    	if(flag == 'dntnYn'){
    		$('#dntnYn').clear();
    		var option_data = [{comCd:'',comCdNm:'전체'}];
    		grDntnYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grDntnYn.push(resObj);
				var resObj2 = response[i];
				option_data.push(resObj2);
			}
			$('#dntnYn').setData({ data : option_data, option_selected: '' });

		}
    	if(flag == 'mtsoUsg'){
    		grPraCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grPraCd.push(resObj);
			}
		}

    	if(flag == 'g5Acpt'){
    		grG5Acpt = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grG5Acpt.push(resObj);
			}
		}
    	if(flag == 'rmdyRsn'){

    		grNbdUpsdRmdyRsn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNbdUpsdRmdyRsn.push(resObj);
			}

		}

    	if(flag == 'laraCd'){
    		$('#laraCd').clear();
    		var option_data = [{comCd:'',comCdNm:'전체'}];
    		grLaraCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grLaraCd.push(resObj);
				var resObj2 = response[i];
				option_data.push(resObj2);
			}
			$('#laraCd').setData({ data : option_data, option_selected: '' });
		}

    	if(flag == 'rostep'){
    		grRoDuhAcptVal = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grRoDuhAcptVal.push(resObj);
			}
		}
    	if(flag == 'Shtg'){
    		grShtgItmCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grShtgItmCd.push(resObj);
			}
		}
    	if(flag == 'InvtCd'){
    		grInvtCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grInvtCd.push(resObj);
			}
		}
    	if(flag == 'NinvtCd'){
    		grNinvtCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNinvtCd.push(resObj);
			}
		}

    	if(flag == 'DrawYn'){
    		grDrawYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grDrawYn.push(resObj);
			}
		}
    	if(flag == 'CellYn'){
    		grCellYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grCellYn.push(resObj);
			}
		}
    	if(flag == 'UpsdRsn'){
    		grUpsdRsn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grUpsdRsn.push(resObj);
				//console.log(resObj);
			}
		}

		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.RoUpsdDemdInfList);
		}
		if(flag == 'search2'){
			$('#'+gridIdDtl).alopexGrid('hideProgress');
			setSPGrid2(gridIdDtl, response, response.RoUpsdDemdInfList);
		}



		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();

        }
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}

	this.setGrid = function(page, rowPerPage){

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);



		var demdHdofcCd = 	$("#demdHdofcCd").val();
		var demdAreaCd =	$("#demdAreaCd").val();
		var dntnYn =		$("#dntnYn").val();
		var laraCd =		$("#laraCd").val();
		var repIntgFcltsCd =$("#repIntgFcltsCd").val();
		var mtsoId =		$("#mtsoId").val();
		var mtsoNm =		$("#mtsoNm").val();
		var srchDt = 		$("#srchDt").val().replace("-","").replace("-","");
		var ckGubun = $("input:checkbox[id^=srchYn]").is(":checked") ? true : false;
		if (ckGubun) {
			var srchYn = "N";
		} else {
			var srchYn = "Y";
		}

		var ckGubun = $("input:checkbox[id^=srchDelYn]").is(":checked") ? true : false;
		if (ckGubun) {
			var srchDelYn = "Y";
		} else {
			var srchDelYn = "N";
		}

		var param =  {demdHdofcCd : demdHdofcCd, demdAreaCd : demdAreaCd,  dntnYn : dntnYn,  laraCd : laraCd, repIntgFcltsCd : repIntgFcltsCd, mtsoId : mtsoId, mtsoNm : mtsoNm, srchYn : srchYn, pageNo : page, rowPerPage : rowPerPage, lastChgDate : srchDt, srchDelYn : srchDelYn };
		//console.log(param);
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoUpsdDemdHstList', param, 'GET', 'search');
	}

	this.setGrid2 = function(page, rowPerPage){
		var upsdDemdId = $("#tmpUpsdDemdId").val();
		var srchDt = $("#srchDt").val().replace("-","").replace("-","");
		var param =  {pageNo : page, rowPerPage : rowPerPage, upsdDemdId : upsdDemdId, lastChgDate : srchDt };
		//console.log(param)
		//$('#'+gridIdDtl).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRoUpsdDemdHstDtlList', param, 'GET', 'search2');
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

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
	function setSPGrid2(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
});

