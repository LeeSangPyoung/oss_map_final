/**
 * MtsoOpCurstStc.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setEventListener();

        $('body').progress();

        httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');

        // 그리드 데이터
        httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoOpCurstList', '', 'GET', 'search');

        // SKT chart
//        var param = {"itmCd" : "REG"};
//        httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSKTChartList', param, 'GET', 'sktChart');
//
//        var mtsoCntrTypCdList = "01";
//        var param2 = {"mtsoCntrTypCd": mtsoCntrTypCdList};
//        httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSKBChartList', param2, 'GET', 'skbChart');


    };

    //Grid 초기화
    function initGrid() {

        $('#'+gridId).alopexGrid({
        	height : '16row',
        	columnFixUpto:1,
        	autoColumnIndex : true,
    		autoResize : true,
    		pager : false,
    		paging : {
    			pagerTotal: false,
        	},
    		defaultColumnMapping : {
    			sorting : false
    		},
    		headerGroup : [
    		    {fromIndex:2, toIndex:4, title: '임차/자가/층매입구분', rowspan : 2},
    		    {fromIndex:5, toIndex:24, title: '중통집구분별'},
    			{fromIndex:5, toIndex:9, title: '1.전송중심국'},
    			{fromIndex:10, toIndex:14, title: '2.통합국'},
    			{fromIndex:15, toIndex:19, title: '3.DU집중국'},
    			{fromIndex:20, toIndex:24, title: '4.해당없음'}

    		],
    		grouping : {
    			by : ['workGubun'],
    			useGrouping : true,
    			useGroupRowspan : true,
    			useGroupHeader: [],
    			useGroupFooter:['workGubun'],
    			groupRowspanMode : 1
    		},
//    		footer : {
//    			position : "bottom",
//    			footerMapping : [
//    			                 {columnIndex:0, colspan:true, colspan: 2, render:["총계"]},
//    			                 {columnIndex:2, colspan:true, colspan: 36
//    			                	 , render:function(value, data, render, mapping){
//	    			         				var msg = "";
//	    			        				var drawCntTot = 0;
//	    			        				var florCntTot = 0;
//	    			        				var rackCountTot = 0;
//	    			        				var cellCountTot = 0;
//	    			        				var eqpSizeTot = 0;
//	    			        				var rackSizeTot = 0;
//	    			        				var recInUnitTot = 0;
//	    			        				var recUnitTot = 0;
//	    			        				var panelInUnitTot = 0;
//	    			        				var panelUnitTot = 0;
//
//	    			        				for(var i=0, l=value.length; i<l; i++){
//	    			        					drawCntTot += parseInt(value[i]["drawCntTot"], 10);
//	    			        					florCntTot += parseInt(value[i]["florCntTot"], 10);
//	    			        					rackCountTot += parseInt(value[i]["rackCountTot"], 10);
//	    			        					cellCountTot += parseInt(value[i]["cellCountTot"], 10);
//	    			        					eqpSizeTot += parseInt(value[i]["eqpSizeTot"], 10);
//	    			        					rackSizeTot += parseInt(value[i]["rackSizeTot"], 10);
//	    			        					recInUnitTot += parseInt(value[i]["recInUnitTot"], 10);
//	    			        					recUnitTot += parseInt(value[i]["recUnitTot"], 10);
//	    			        					panelInUnitTot += parseInt(value[i]["panelInUnitTot"], 10);
//	    			        					panelUnitTot += parseInt(value[i]["panelUnitTot"], 10);
//	    			        				}
//
//	    			        				var reg = ((drawCntTot/florCntTot*100).toFixed(1)) + "";
//	    			        				var use = ((rackCountTot/cellCountTot*100).toFixed(1)) + "";
//	    			        				var rack = ((eqpSizeTot/rackSizeTot*100).toFixed(1)) + "";
//	    			        				var rtf = ((recInUnitTot/recUnitTot*100).toFixed(1)) + "";
//	    			        				var cbpl = ((panelInUnitTot/panelUnitTot*100).toFixed(1)) + "";
//
//	    			        				msg = "등록 : "+ drawCntTot + " / " + florCntTot + " (" + reg.replace(".0", "") + "%),   "
//	    			        				msg += " 사용 : "+ rackCountTot + " / " + cellCountTot + " (" + use.replace(".0", "") + "%),   "
//	    			        				msg += " 랙내실장 : "+ eqpSizeTot + " / " + rackSizeTot + " (" + rack.replace(".0", "") + "%),   "
//	    			        				msg += " 정류기 : "+ recInUnitTot + " / " + recUnitTot + " (" + rtf.replace(".0", "") + "%),   "
//	    			        				msg += " 분전반 : "+ panelInUnitTot + " / " + panelUnitTot + " (" + cbpl.replace(".0", "") + "%)"
//	    			        				return msg;
//    			        			}
//    			                 }
//    			                 ]
//    		},
    		columnMapping: [
    			{
        			align :'center',
        			key : 'workGubun',
        			title : '관리그룹',
        			width: '70px',
        			rowspan : true
        		}, {
        			align :'center',
        			key : 'affairNm',
        			title : '전송실별',
        			width : '180px',
        			groupFooter:['계'],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'les',
        			title : '임차',
        			width : '50px',
        			groupFooter:['sum()'],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'slf',
        			title : '자가',
        			width : '50px',
        			groupFooter:['sum()'],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'prch',
        			title : '층매입',
        			width : '60px',
        			groupFooter:['sum()'],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'upsdRegRate1',
        			title : '등록',
        			width : '70px',

	        		render : function(value, data, render, mapping){
	        			return data.drawCntTot1 +'/'+ data.florCntTot1 ;
					},


        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["drawCntTot1"], 10);
        					var b = parseInt(range.member[i]["florCntTot1"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1+'/'+sum2;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'useRate1',
        			title : '상면사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["rackCountTot1"], 10);
        					var b = parseInt(range.member[i]["cellCountTot1"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rackInRate1',
        			title : '랙사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["eqpSizeTot1"], 10);
        					var b = parseInt(range.member[i]["rackSizeTot1"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rectifier1',
        			title : '정류기(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["recInUnitTot1"], 10);
        					var b = parseInt(range.member[i]["recUnitTot1"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'panel1',
        			title : '분전반(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["panelInUnitTot1"], 10);
        					var b = parseInt(range.member[i]["panelUnitTot1"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'upsdRegRate2',
        			title : '등록',
        			width : '70px',
        			render : function(value, data, render, mapping){
	        			return data.drawCntTot2 +'/'+ data.florCntTot2 ;
					},
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["drawCntTot2"], 10);
        					var b = parseInt(range.member[i]["florCntTot2"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1+'/'+sum2;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'useRate2',
        			title : '상면사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["rackCountTot2"], 10);
        					var b = parseInt(range.member[i]["cellCountTot2"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rackInRate2',
        			title : '랙사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["eqpSizeTot2"], 10);
        					var b = parseInt(range.member[i]["rackSizeTot2"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rectifier2',
        			title : '정류기(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["recInUnitTot2"], 10);
        					var b = parseInt(range.member[i]["recUnitTot2"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'panel2',
        			title : '분전반(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["panelInUnitTot2"], 10);
        					var b = parseInt(range.member[i]["panelUnitTot2"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'upsdRegRate3',
        			title : '등록',
        			width : '70px',
        			render : function(value, data, render, mapping){
	        			return data.drawCntTot3 +'/'+ data.florCntTot3 ;
					},
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["drawCntTot3"], 10);
        					var b = parseInt(range.member[i]["florCntTot3"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1+'/'+sum2;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'useRate3',
        			title : '상면사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["rackCountTot3"], 10);
        					var b = parseInt(range.member[i]["cellCountTot3"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rackInRate3',
        			title : '랙사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["eqpSizeTot3"], 10);
        					var b = parseInt(range.member[i]["rackSizeTot3"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rectifier3',
        			title : '정류기(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["recInUnitTot3"], 10);
        					var b = parseInt(range.member[i]["recUnitTot3"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'panel3',
        			title : '분전반(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["panelInUnitTot3"], 10);
        					var b = parseInt(range.member[i]["panelUnitTot3"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'upsdRegRate4',
        			title : '등록',
        			width : '70px',
        			render : function(value, data, render, mapping){
	        			return data.drawCntTot4 +'/'+ data.florCntTot4 ;
					},
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["drawCntTot4"], 10);
        					var b = parseInt(range.member[i]["florCntTot4"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1+'/'+sum2;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'useRate4',
        			title : '상면사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["rackCountTot4"], 10);
        					var b = parseInt(range.member[i]["cellCountTot4"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rackInRate4',
        			title : '랙사용(%)',
        			width : '100px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["eqpSizeTot4"], 10);
        					var b = parseInt(range.member[i]["rackSizeTot4"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'rectifier4',
        			title : '정류기(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["recInUnitTot4"], 10);
        					var b = parseInt(range.member[i]["recUnitTot4"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}, {
        			align :'center',
        			key : 'panel4',
        			title : '분전반(%)',
        			width: '90px',
        			groupFooter:[function(range, mapping){
        				var rate = 0;
        				var sum1 = 0;
        				var sum2 = 0;
        				for(var i=0, l=range.member.length; i<l; i++){
        					var a = parseInt(range.member[i]["panelInUnitTot4"], 10);
        					var b = parseInt(range.member[i]["panelUnitTot4"], 10);
        					sum1 += a;
        					sum2 += b;
        				}

        				rate = sum1/sum2*100;
        				rate = rate.toFixed(1);
        				if(isNaN(rate)){
        					rate = 0;
        				}
        				rate = (rate+"").replace(".0", "");
        				return AlopexGrid.renderUtil.addCommas(rate);
        			}],
        			groupFooterAlign: 'center'
        		}

//        		, {
//        			align :'center',
//        			key : 'upsdRegRate5',
//        			title : '등록(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["drawCntTot5"], 10);
//        					var b = parseInt(range.member[i]["florCntTot5"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'useRate5',
//        			title : '사용(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["rackCountTot5"], 10);
//        					var b = parseInt(range.member[i]["cellCountTot5"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rackInRate5',
//        			title : '랙내실장(%)',
//        			width : '100px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["eqpSizeTot5"], 10);
//        					var b = parseInt(range.member[i]["rackSizeTot5"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rectifier5',
//        			title : '정류기(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["recInUnitTot5"], 10);
//        					var b = parseInt(range.member[i]["recUnitTot5"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'panel5',
//        			title : '분전반(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["panelInUnitTot5"], 10);
//        					var b = parseInt(range.member[i]["panelUnitTot5"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}












//
//        		, {
//        			align :'center',
//        			key : 'upsdRegRate6',
//        			title : '등록(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["drawCntTot6"], 10);
//        					var b = parseInt(range.member[i]["florCntTot6"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'useRate6',
//        			title : '사용(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["rackCountTot6"], 10);
//        					var b = parseInt(range.member[i]["cellCountTot6"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rackInRate6',
//        			title : '랙내실장(%)',
//        			width : '100px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["eqpSizeTot6"], 10);
//        					var b = parseInt(range.member[i]["rackSizeTot6"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rectifier6',
//        			title : '정류기(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["recInUnitTot6"], 10);
//        					var b = parseInt(range.member[i]["recUnitTot6"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'panel6',
//        			title : '분전반(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["panelInUnitTot6"], 10);
//        					var b = parseInt(range.member[i]["panelUnitTot6"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}
//
//
//
//
//        		, {
//        			align :'center',
//        			key : 'upsdRegRate7',
//        			title : '등록(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["drawCntTot7"], 10);
//        					var b = parseInt(range.member[i]["florCntTot7"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'useRate7',
//        			title : '사용(%)',
//        			width : '70px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["rackCountTot7"], 10);
//        					var b = parseInt(range.member[i]["cellCountTot7"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rackInRate7',
//        			title : '랙내실장(%)',
//        			width : '100px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["eqpSizeTot7"], 10);
//        					var b = parseInt(range.member[i]["rackSizeTot7"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'rectifier7',
//        			title : '정류기(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["recInUnitTot7"], 10);
//        					var b = parseInt(range.member[i]["recUnitTot7"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}, {
//        			align :'center',
//        			key : 'panel7',
//        			title : '분전반(%)',
//        			width: '90px',
//        			groupFooter:[function(range, mapping){
//        				var rate = 0;
//        				var sum1 = 0;
//        				var sum2 = 0;
//        				for(var i=0, l=range.member.length; i<l; i++){
//        					var a = parseInt(range.member[i]["panelInUnitTot7"], 10);
//        					var b = parseInt(range.member[i]["panelUnitTot7"], 10);
//        					sum1 += a;
//        					sum2 += b;
//        				}
//
//        				rate = sum1/sum2*100;
//        				rate = rate.toFixed(1);
//        				if(isNaN(rate)){
//        					rate = 0;
//        				}
//        				rate = (rate+"").replace(".0", "");
//        				return AlopexGrid.renderUtil.addCommas(rate);
//        			}],
//        			groupFooterAlign: 'center'
//        		}
			],
			message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setEventListener() {
    	$('#itmCd').on('change', function(e) {
	   		var itmCD =  $("#itmCd").getData();

	   		var param = {"itmCd" : itmCD.itmCd};

	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSKTChartList', param, 'GET', 'sktChart');
        });

    	$('#mtsoCntrTypCdList').on('change', function(e) {
    		var mtsoCntrTypCdList = $("#mtsoCntrTypCdList").val();
            var param2 = {"mtsoCntrTypCd": mtsoCntrTypCdList};
            httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSKBChartList', param2, 'GET', 'skbChart');
        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
//	   	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
//	   	 	var dataObj = AlopexGrid.parseEvent(e).data;
//
//	   	 	if(dataObj.workGubun != undefined){
//	   	 		/* 국사 상세정보 */
//	   	 		$a.popup({
//	   	 			popid: 'SmtsoStcPop',
//	   	 			title: '국소별 통계',
//	   	 			url: '/tango-transmission-web/configmgmt/upsdmgmt/SmtsoStcPop.do',
//	   	 			data: dataObj,
//	   	 			windowpopup : true,
//		   	 		modal: true,
//	                movable:true,
//	   	 			width : 1250,
//	   	 			height : 750
//	   	 		});
//	   	 	}
//
//	   	 });

        $('#btnDataMgmt').on('click', function(e) {
        	$a.popup({
   	 			popid: 'SmtsoStcPop',
   	 			title: '국소별 통계',
   	 			url: '/tango-transmission-web/configmgmt/upsdmgmt/SmtsoStcPop.do',
   	 			//data: dataObj,
   	 			windowpopup : true,
	   	 		modal: true,
                movable:true,
   	 			width : 1250,
   	 			height : 750
   	 		});
    	});

    };



    var createPieChart = function(chartData) {

		chart = new Highcharts.Chart('chartPie', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
//				chart: {backgroundColor: '#242428'},
//			colors: ['#f7a35c', '#3363bb', '#90ed7d', '#f15c80'],		// color 4
			credits: {enabled: false},
			title: {text: "전송실별"},
			navigation: {
				buttonOptions: {enabled: false}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
//			subtitle: {text: null},
			tooltip: {
				pointFormat: '<span style="color: {point.color}">\u25CF</span>  {series.name}: <b>{point.percentage:.2f}%</b>'
			},
			series: [{
				type: 'pie',
				name: '비율',
				colorByPoint: true,
				data:chartData

			}],
		});
//		$('.highcharts-button').attr('style', 'cursor: pointer;');
	}

    var createBarChart = function(chartData, chartNm) {

		chart = new Highcharts.Chart('chartColumn', {
			chart: {
				type: 'column'
			},
//				chart: {backgroundColor: '#242428'},
//			colors: ['#f7a35c', '#3363bb', '#90ed7d', '#f15c80'],		// color 4
			credits: {enabled: false},
			title: {text: "중통집구분별"},
			navigation: {
				buttonOptions: {enabled: false}
			},
//			subtitle: {text: null},
			tooltip: {
				pointFormat: '<span style="color: {point.color}">\u25CF</span> 비율: <b>{point.y:.2f}%</b>'
			},
			series: [{
				type: 'column',
				colorByPoint: true,
				data:chartData,
				showInLegend: false
			}],
			xAxis: {
				crosshair: true,
				labels: {
					style: {
						fontFamily: '"Moebius eng", "Moebius kor", sans-serif',
						fontSize: '12px',
						fontWeight: 'bold'
					}
				},
				tickLength: 0,
				categories: chartNm
			}
		});
//		$('.highcharts-button').attr('style', 'cursor: pointer;');
	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search') {
			$('#'+gridId).alopexGrid( 'dataSet' , response.mtsoOpCurstList );
			$('body').progress().remove();
		}
		if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();

    		var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
    	}
//		if(flag == 'sktChart') {
//			if(response.SKTChartList != null && response.SKTChartList.length>0){
//    			var arr = [];
//    			var arrArr = [];
//    			for(i=0; i<response.SKTChartList.length; i++){
//    				arrArr = [response.SKTChartList[i].name, parseFloat(response.SKTChartList[i].percentage)];
//    				arr.push(arrArr);
//    			}
//    			createPieChart(arr);
//    		}
//		}
//
//		if(flag == 'skbChart') {
//			if(response.SKBChartList != null && response.SKBChartList.length>0){
//    			var arr1 = [];
//    			var arr2 = [];
//    			var arrArr1 = [];
//    			var arrArr2 = [];
//    			for(i=0; i<response.SKBChartList.length; i++){
//    				arrArr1 = [parseFloat(response.SKBChartList[i].percentage)];
//    				arrArr2 = [response.SKBChartList[i].name];
//    				arr1.push(arrArr1);
//    				arr2.push(arrArr2);
//    			}
//    			createBarChart(arr1, arr2);
//    		}
//		}

		if(flag == 'excelDownload'){
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        }
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
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