/**
 * MtsoSystemIntgLkup.js
 *
 * @author 이현우
 * @date 2016. 8. 18. 오전 09:41:00
 * @version 1.0
 */
$a.page(function() {
    var gridId = 'dataGrid';

    var selectInit = [];
    var totalCnt = 0;

    this.init = function(id, param) {
        initGrid();
        hideColumn();
        setSelectCode();
        setEventListener();
    };

    function initGrid() {
    	$('#'+gridId).alopexGrid({
    		autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
    			key : 'gubun', align:'left',
				title : '구분',
				width: '80px',
				treeColumn : true,
				treeColumnHeader : true
			}, {
    			key : 'hdofcNm', align:'left',
				title : '본부',
				width: '180px'
			}, {
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '130px'
			}, {
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			}, {
    			key : 'intgFcltsCd', align:'center',
				title : '대표통합시설코드',
				width: '120px'
			}, {
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '180px'
			}, {
    			key : 'laraDiv', align:'left',
				title : '권역구분',
				width: '100px'
			}, {
    			key : 'mtsoTyp', align:'left',
				title : '국사유형',
				width: '100px'
			},{/* 중심/통합/집중국 구분    */
				key : 'mtsoCntrTypNm', align:'center',
				title : '중심/통합/집중국 구분',
				width: '140px'
			}, {
    			key : 'siteCd', align:'left', // siteCd, siteNm 추가[20171221]
				title : '사이트키',
				width: '100px'
			}, {
    			key : 'siteNm', align:'left',
				title : '사이트명',
				width: '150px'
			}, {
    			key : 'upMtsoNm', align:'left',
				title : '상위국사명',
				width: '180px'
			}, {
    			key : 'bldCd', align:'left',
				title : '건물ID',
				width: '110px'
			}, {
    			key : 'addr', align:'left',
				title : '주소',
				width: '250px'
			}, {
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '150px'
			}, {
    			key : 'cotDu', align:'right',
				title : 'COT수용 DU',
				width: '90px'
			}, {
    			key : 'du', align:'right',
				title : 'DU',
				width: '70px'
			}, {
    			key : 'ru', align:'right',
				title : 'RU',
				width: '70px'
			}, {
    			key : 'tss320', align:'right',
				title : 'TSS-320',
				width: '90px'
			}, {
    			key : 'tss320Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'tss320Eqp1', align:'left',
				title : 'TSS320 장비 #1',
				width: '150px'
			}, {
    			key : 'tss320Eqp2', align:'left',
				title : 'TSS320 장비 #2',
				width: '150px'
			}, {
    			key : 'tss320Eqp3', align:'left',
				title : 'TSS320 장비 #3',
				width: '150px'
			}, {
    			key : 'tss320Eqp4', align:'left',
				title : 'TSS320 장비 #4',
				width: '150px'
			}, {
    			key : 'tss320Eqp5', align:'left',
				title : 'TSS320 장비 #5',
				width: '150px'
			}, {
    			key : 'tss320Eqp6', align:'left',
				title : 'TSS320 장비 #6',
				width: '150px'
			}, {
    			key : 'tss320Eqp7', align:'left',
				title : 'TSS320 장비 #7',
				width: '150px'
			}, {
    			key : 'tss320Eqp8', align:'left',
				title : 'TSS320 장비 #8',
				width: '150px'
			}, {
    			key : 'tss320Eqp9', align:'left',
				title : 'TSS320 장비 #9',
				width: '150px'
			}, {
    			key : 'tss320Eqp10', align:'left',
				title : 'TSS320 장비 #10',
				width: '150px'
			}, {
    			key : 'tss160', align:'right',
				title : 'TSS-160',
				width: '100px'
			}, {
    			key : 'tss160Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'tss160Eqp1', align:'left',
				title : 'TSS160 장비 #1',
				width: '150px'
			}, {
    			key : 'tss160Eqp2', align:'left',
				title : 'TSS160 장비 #2',
				width: '150px'
			}, {
    			key : 'tss160Eqp3', align:'left',
				title : 'TSS160 장비 #3',
				width: '150px'
			}, {
    			key : 'tss160Eqp4', align:'left',
				title : 'TSS160 장비 #4',
				width: '150px'
			}, {
    			key : 'tss160Eqp5', align:'left',
				title : 'TSS160 장비 #5',
				width: '150px'
			}, {
    			key : 'tss160Eqp6', align:'left',
				title : 'TSS160 장비 #6',
				width: '150px'
			}, {
    			key : 'tss160Eqp7', align:'left',
				title : 'TSS160 장비 #7',
				width: '150px'
			}, {
    			key : 'tss160Eqp8', align:'left',
				title : 'TSS160 장비 #8',
				width: '150px'
			}, {
    			key : 'tss160Eqp9', align:'left',
				title : 'TSS160 장비 #9',
				width: '150px'
			}, {
    			key : 'tss160Eqp10', align:'left',
				title : 'TSS160 장비 #10',
				width: '150px'
			}, {
    			key : 'tss5', align:'right',
				title : 'TSS-5',
				width: '100px'
			}, {
    			key : 'tss5Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'tss5Eqp1', align:'left',
				title : 'TSS5 장비 #1',
				width: '150px'
			}, {
    			key : 'tss5Eqp2', align:'left',
				title : 'TSS5 장비 #2',
				width: '150px'
			}, {
    			key : 'tss5Eqp3', align:'left',
				title : 'TSS5 장비 #3',
				width: '150px'
			}, {
    			key : 'tss5Eqp4', align:'left',
				title : 'TSS5 장비 #4',
				width: '150px'
			}, {
    			key : 'tss5Eqp5', align:'left',
				title : 'TSS5 장비 #5',
				width: '150px'
			}, {
    			key : 'tss5Eqp6', align:'left',
				title : 'TSS5 장비 #6',
				width: '150px'
			}, {
    			key : 'tss5Eqp7', align:'left',
				title : 'TSS5 장비 #7',
				width: '150px'
			}, {
    			key : 'tss5Eqp8', align:'left',
				title : 'TSS5 장비 #8',
				width: '150px'
			}, {
    			key : 'tss5Eqp9', align:'left',
				title : 'TSS5 장비 #9',
				width: '150px'
			}, {
    			key : 'tss5Eqp10', align:'left',
				title : 'TSS5 장비 #10',
				width: '150px'
			}, {
    			key : 'osn7500', align:'right',
				title : 'OSN-7500',
				width: '100px'
			}, {
    			key : 'osn7500Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'osn7500Eqp1', align:'left',
				title : 'OSN7500 장비 #1',
				width: '150px'
			}, {
    			key : 'osn7500Eqp2', align:'left',
				title : 'OSN7500 장비 #2',
				width: '150px'
			}, {
    			key : 'osn7500Eqp3', align:'left',
				title : 'OSN7500 장비 #3',
				width: '150px'
			}, {
    			key : 'osn7500Eqp4', align:'left',
				title : 'OSN7500 장비 #4',
				width: '150px'
			}, {
    			key : 'osn7500Eqp5', align:'left',
				title : 'OSN7500 장비 #5',
				width: '150px'
			}, {
    			key : 'osn7500Eqp6', align:'left',
				title : 'OSN7500 장비 #6',
				width: '150px'
			}, {
    			key : 'osn7500Eqp7', align:'left',
				title : 'OSN7500 장비 #7',
				width: '150px'
			}, {
    			key : 'osn7500Eqp8', align:'left',
				title : 'OSN7500 장비 #8',
				width: '150px'
			}, {
    			key : 'osn7500Eqp9', align:'left',
				title : 'OSN7500 장비 #9',
				width: '150px'
			}, {
    			key : 'osn7500Eqp10', align:'left',
				title : 'OSN7500 장비 #10',
				width: '150px'
			}, {
    			key : 'osn3500', align:'right',
				title : 'OSN-3500',
				width: '100px'
			}, {
    			key : 'osn3500Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'osn3500Eqp1', align:'left',
				title : 'OSN3500 장비 #1',
				width: '150px'
			}, {
    			key : 'osn3500Eqp2', align:'left',
				title : 'OSN3500 장비 #2',
				width: '150px'
			}, {
    			key : 'osn3500Eqp3', align:'left',
				title : 'OSN3500 장비 #3',
				width: '150px'
			}, {
    			key : 'osn3500Eqp4', align:'left',
				title : 'OSN3500 장비 #4',
				width: '150px'
			}, {
    			key : 'osn3500Eqp5', align:'left',
				title : 'OSN3500 장비 #5',
				width: '150px'
			}, {
    			key : 'osn3500Eqp6', align:'left',
				title : 'OSN3500 장비 #6',
				width: '150px'
			}, {
    			key : 'osn3500Eqp7', align:'left',
				title : 'OSN3500 장비 #7',
				width: '150px'
			}, {
    			key : 'osn3500Eqp8', align:'left',
				title : 'OSN3500 장비 #8',
				width: '150px'
			}, {
    			key : 'osn3500Eqp9', align:'left',
				title : 'OSN3500 장비 #9',
				width: '150px'
			}, {
    			key : 'osn3500Eqp10', align:'left',
				title : 'OSN3500 장비 #10',
				width: '150px'
			}, {
    			key : 'osn1500', align:'right',
				title : 'OSN-1500',
				width: '100px'
			}, {
    			key : 'osn1500Cnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'osn1500Eqp1', align:'left',
				title : 'OSN1500 장비 #1',
				width: '150px'
			}, {
    			key : 'osn1500Eqp2', align:'left',
				title : 'OSN1500 장비 #2',
				width: '150px'
			}, {
    			key : 'osn1500Eqp3', align:'left',
				title : 'OSN1500 장비 #3',
				width: '150px'
			}, {
    			key : 'osn1500Eqp4', align:'left',
				title : 'OSN1500 장비 #4',
				width: '150px'
			}, {
    			key : 'osn1500Eqp5', align:'left',
				title : 'OSN1500 장비 #5',
				width: '150px'
			}, {
    			key : 'osn1500Eqp6', align:'left',
				title : 'OSN1500 장비 #6',
				width: '150px'
			}, {
    			key : 'osn1500Eqp7', align:'left',
				title : 'OSN1500 장비 #7',
				width: '150px'
			}, {
    			key : 'osn1500Eqp8', align:'left',
				title : 'OSN1500 장비 #8',
				width: '150px'
			}, {
    			key : 'osn1500Eqp9', align:'left',
				title : 'OSN1500 장비 #9',
				width: '150px'
			}, {
    			key : 'osn1500Eqp10', align:'left',
				title : 'OSN1500 장비 #10',
				width: '150px'
			}, {
    			key : 'l2SW', align:'right',
				title : 'L2 S/W',
				width: '100px'
			}, {
    			key : 'ipBackhaul', align:'right',
				title : 'IP백홀',
				width: '100px'
			}, {
    			key : 'roadm', align:'right',
				title : 'ROADM',
				width: '100px'
			}, {
    			key : 'roadmCnt', align:'right',
				title : '수량',
				width: '100px'
			}, {
    			key : 'roadmEqp1', align:'left',
				title : 'ROADM 장비 #1',
				width: '150px'
			}, {
    			key : 'roadmEqp2', align:'left',
				title : 'ROADM 장비 #2',
				width: '150px'
			}, {
    			key : 'roadmEqp3', align:'left',
				title : 'ROADM 장비 #3',
				width: '150px'
			}, {
    			key : 'roadmEqp4', align:'left',
				title : 'ROADM 장비 #4',
				width: '150px'
			}, {
    			key : 'roadmEqp5', align:'left',
				title : 'ROADM 장비 #5',
				width: '150px'
			}, {
    			key : 'roadmEqp6', align:'left',
				title : 'ROADM 장비 #6',
				width: '150px'
			}, {
    			key : 'roadmEqp7', align:'left',
				title : 'ROADM 장비 #7',
				width: '150px'
			}, {
    			key : 'roadmEqp8', align:'left',
				title : 'ROADM 장비 #8',
				width: '150px'
			}, {
    			key : 'roadmEqp9', align:'left',
				title : 'ROADM 장비 #9',
				width: '150px'
			}, {
    			key : 'roadmEqp10', align:'left',
				title : 'ROADM 장비 #10',
				width: '150px'
			}, {
    			key : 'ringMuxCot', align:'right',
				title : 'RingMUX(COT)',
				width: '110px'
			}, {
    			key : 'ringMuxRT', align:'right',
				title : 'RingMUX(RT)',
				width: '110px'
			}, {
    			key : 'mux8Ch', align:'right',
				title : '8CH MUX',
				width: '100px'
			}, {
    			key : 'mux16Ch', align:'right',
				title : '16CH MUX',
				width: '100px'
			}, {
    			key : 'mspp', align:'right',
				title : 'MSPP',
				width: '100px'
			}, {
    			key : 'allEqp', align:'right',
				title : '전체장비',
				width: '100px'
			}, {
    			key : 'sktLine', align:'right',
				title : 'SKT회선',
				width: '100px'
			}, {
    			key : 'skbLine', align:'right',
				title : 'SKB회선',
				width: '100px'
			}, {
    			key : 'ktLine', align:'right',
				title : 'KT임차회선',
				width: '100px'
			}, {
    			key : 'lguLine', align:'right',
				title : 'LGU임차회선',
				width: '100px'
			}, {
    			key : 'etcLine', align:'right',
				title : '기타임차회선',
				width: '110px'
			}, {
    			key : 'allLine', align:'right',
				title : '전체회선',
				width: '100px'
			}, {
    			key : 'cotE1Line', align:'right',
				title : 'COT수용 E1 회선',
				width: '130px'
			}],
			tree : { useTree:true, idKey:'treeNo', parentIdKey : 'treePrntNo',expandedKey : 'treeDivVal'},
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
    	})
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

        var selectList = [ {el: '#orgId', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}             //본부
  	                      ,{el: '#teamId', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}             //팀
  	                      ,{el: '#trmsMtsoId', url: 'trmsmtsos', key: 'mtsoId', label: 'mtsoNm'}   //전송실
  	                      ];

        for(var i=0; i<selectList.length; i++){
        	selectInit[i] = Tango.select.init({
                el: selectList[i].el
               ,model: Tango.ajax.init({
                                        url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                                        data: param
                                        })
               ,valueField: selectList[i].key
               ,labelField: selectList[i].label
               ,selected: 'all'
               })

           selectInit[i].model.get();
        }

        var mtsoCntrTypCdList = {el: '#mtsoCntrTypCdList', key: 'comCd', label: 'comCdNm'};
        mtsoCntrTypCdList = Tango.select.init({
    		el: '#mtsoCntrTypCdList',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	mtsoCntrTypCdList.model.get({data:param});

        var option_data =  [{comCd: "1",comCdNm: "전송실"},
							{comCd: "2",comCdNm: "중심국사"},
							{comCd: "3",comCdNm: "기지국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		$('#mtsoTypCdList').setData({
         data:option_data
		});
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$("#firstRowIndex").val(1);
     	$("#lastRowIndex").val(100);

        var param =  $("#searchForm").serialize();
        $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
        });

        if($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != ""){
        	$.each($("#mtsoCntrTypCdList").val(), function(key, value) {
            	param += '&' + "mtsoCntrTypCdList1" + '=' + value;
    		});

            $.each($("#mtsoCntrTypCdList").val(), function(key, value) {
            	param += '&' + "mtsoCntrTypCdList2" + '=' + value;
    		});
        }

        if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
        	$.each($("#mtsoTypCdList").val(), function(key, value) {
            	param += '&' + "mtsoTypCdList1" + '=' + value;
    		});

            $.each($("#mtsoTypCdList").val(), function(key, value) {
            	param += '&' + "mtsoTypCdList2" + '=' + value;
    		});
        }

        httpRequest('tango-transmission-biz/trafficintg/curstmgmt/mtsoSystemIntgLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function hideColumn(){
    	if($('#addrIntgChk').is(':checked')){  // 주소별 통합조회
    		$('#intgChk').setEnabled(true);
    	}else{
    		$('#intgChk').setChecked(false);
    		$('#intgChk').setEnabled(false);
    	}

    	if($('#optionDetail').is(':checked')){  // 상세장비내역조회
    		$('#'+gridId).alopexGrid('updateOption',{
    			headerGroup:[
    			             {fromIndex:16, toIndex:27, title:"TSS-320"},
    			             {fromIndex:28, toIndex:39, title:"TSS-160"},
    			             {fromIndex:41, toIndex:51, title:"TSS-5"},
    			             {fromIndex:52, toIndex:63, title:"OSN-7500"},
    			             {fromIndex:64, toIndex:76, title:"OSN-3500"},
    			             {fromIndex:77, toIndex:87, title:"OSN-1500"},
    			             {fromIndex:90, toIndex:101, title:"ROADM"}
    			             ]
    		})

    		$('#'+gridId).alopexGrid('showCol',[
    		                                    'tss320Cnt','tss320Eqp1','tss320Eqp2','tss320Eqp3','tss320Eqp4','tss320Eqp5','tss320Eqp6','tss320Eqp7','tss320Eqp8','tss320Eqp9','tss320Eqp10',
    		                                    'tss160Cnt','tss160Eqp1','tss160Eqp2','tss160Eqp3','tss160Eqp4','tss160Eqp5','tss160Eqp6','tss160Eqp7','tss160Eqp8','tss160Eqp9','tss160Eqp10',
    		                                    'tss5Cnt','tss5Eqp1','tss5Eqp2','tss5Eqp3','tss5Eqp4','tss5Eqp5','tss5Eqp6','tss5Eqp7','tss5Eqp8','tss5Eqp9','tss5Eqp10',
    		                                    'osn7500Cnt','osn7500Eqp1','osn7500Eqp2','osn7500Eqp3','osn7500Eqp4','osn7500Eqp5','osn7500Eqp6','osn7500Eqp7','osn7500Eqp8','osn7500Eqp9','osn7500Eqp10',
    		                                    'osn3500Cnt','osn3500Eqp1','osn3500Eqp2','osn3500Eqp3','osn3500Eqp4','osn3500Eqp5','osn3500Eqp6','osn3500Eqp7','osn3500Eqp8','osn3500Eqp9','osn3500Eqp10',
    		                                    'osn1500Cnt','osn1500Eqp1','osn1500Eqp2','osn1500Eqp3','osn1500Eqp4','osn1500Eqp5','osn1500Eqp6','osn1500Eqp7','osn1500Eqp8','osn1500Eqp9','osn1500Eqp10',
    		                                    'roadmCnt','roadmEqp1','roadmEqp2','roadmEqp3','roadmEqp4','roadmEqp5','roadmEqp6','roadmEqp7','roadmEqp8','roadmEqp9','roadmEqp10'
    		                                    ])

    		$('#'+gridId).alopexGrid('hideCol',[
    		                                    'tss320','tss160','tss5','osn7500','osn3500','osn1500','roadm'
    		                                    ], 'conceal')
    	}else{
    		$('#'+gridId).alopexGrid('updateOption',{headerGroup: null})
    		$('#'+gridId).alopexGrid('showCol',[
    		                                    'tss320','tss160','tss5','osn7500','osn3500','osn1500','roadm'
    		                                    ])
    		$('#'+gridId).alopexGrid('hideCol',[
    		                                    'tss320Cnt','tss320Eqp1','tss320Eqp2','tss320Eqp3','tss320Eqp4','tss320Eqp5','tss320Eqp6','tss320Eqp7','tss320Eqp8','tss320Eqp9','tss320Eqp10',
    		                                    'tss160Cnt','tss160Eqp1','tss160Eqp2','tss160Eqp3','tss160Eqp4','tss160Eqp5','tss160Eqp6','tss160Eqp7','tss160Eqp8','tss160Eqp9','tss160Eqp10',
    		                                    'tss5Cnt','tss5Eqp1','tss5Eqp2','tss5Eqp3','tss5Eqp4','tss5Eqp5','tss5Eqp6','tss5Eqp7','tss5Eqp8','tss5Eqp9','tss5Eqp10',
    		                                    'osn7500Cnt','osn7500Eqp1','osn7500Eqp2','osn7500Eqp3','osn7500Eqp4','osn7500Eqp5','osn7500Eqp6','osn7500Eqp7','osn7500Eqp8','osn7500Eqp9','osn7500Eqp10',
    		                                    'osn3500Cnt','osn3500Eqp1','osn3500Eqp2','osn3500Eqp3','osn3500Eqp4','osn3500Eqp5','osn3500Eqp6','osn3500Eqp7','osn3500Eqp8','osn3500Eqp9','osn3500Eqp10',
    		                                    'osn1500Cnt','osn1500Eqp1','osn1500Eqp2','osn1500Eqp3','osn1500Eqp4','osn1500Eqp5','osn1500Eqp6','osn1500Eqp7','osn1500Eqp8','osn1500Eqp9','osn1500Eqp10',
    		                                    'roadmCnt','roadmEqp1','roadmEqp2','roadmEqp3','roadmEqp4','roadmEqp5','roadmEqp6','roadmEqp7','roadmEqp8','roadmEqp9','roadmEqp10'
    		                                    ], 'conceal')
    	}
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수

    	$('#'+gridId).on('scrollBottom', function(e){

        	var nFistRowIndex = parseInt($('#firstRowIndex').val())+100;
 			var nLastRowIndex = parseInt($('#lastRowIndex').val())+100;

 			if(totalCnt > nFistRowIndex){
 				$('#firstRowIndex').val(nFistRowIndex);
 				$('#lastRowIndex').val(nLastRowIndex);

 				$('#'+gridId).alopexGrid('showProgress');

 				var param =  $("#searchForm").serialize();

 				$.each($('form input[type=checkbox]')
 						.filter(function(idx){
 							return $(this).prop('checked') === false
 						}),
 						function(idx, el){
 					var emptyVal = "";
 					param += '&' + $(el).attr('name') + '=' + emptyVal;
 				});

 				if($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != ""){
 					$.each($("#mtsoCntrTypCdList").val(), function(key, value) {
 						param += '&' + "mtsoCntrTypCdList1" + '=' + value;
 					});

 					$.each($("#mtsoCntrTypCdList").val(), function(key, value) {
 						param += '&' + "mtsoCntrTypCdList2" + '=' + value;
 					});
 				}

 				if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
 					$.each($("#mtsoTypCdList").val(), function(key, value) {
 						param += '&' + "mtsoTypCdList1" + '=' + value;
 					});

 					$.each($("#mtsoTypCdList").val(), function(key, value) {
 						param += '&' + "mtsoTypCdList2" + '=' + value;
 					});
 				}

 				httpRequest('tango-transmission-biz/trafficintg/curstmgmt/mtsoSystemIntgLkup', param, successCallbackSearchPageAdd, failCallback, 'GET');
 			}
     	});

        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });

        $('#optionDetail').on('click', function(e){
        	hideColumn();
        })

        $('#addrIntgChk').on('click', function(e){
        	hideColumn();
        })

        //엑셀다운로드
        /*$('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);

//            param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
//            param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
//            param.trmsMtsoId = selectInit[2].getValue(); //$('#trmsMtsoNm').val();
//            param.mtsoTyp = $('#mtsoTypNm').val();
//            param.mtsoNm = $('#mtsoNm').val();
//            param.optionDetail = $('#checkEqpDetail').is(':checked') ? 'Y' : '';
    		param.optionDetail = $('#optionDetail').is(':checked') ? 'Y' : '';
    		param.addrIntgChk = $('#addrIntgChk').is(':checked') ? 'Y' : '';
    		param.intgChk = $('#intgChk').is(':checked') ? 'Y' : '';
//    		param.mtsoCntrTypCdList += "02";
//    		param.mtsoCntrTypCdList += ";";
//    		param.mtsoCntrTypCdList += "03";
//    		param.mtsoCntrTypCdList += ";";
    		alert(JSON.stringify(param.mtsoCntrTypCdList));
    		if ($("#mtsoCntrTypCdList").val() != "" && $("#mtsoCntrTypCdList").val() != null ){
    			for (var i = 0; i < param.mtsoCntrTypCdList.length; i++) {
    				param.mtsoCntrTypCdList += param.mtsoCntrTypCdList[i];
				}
//       			param.mtsoCntrTypCdList = $("#mtsoCntrTypCdList").val() ;
//       			param.mtsoCntrTypCdList1 = $("#mtsoCntrTypCdList").val() ;
//       			param.mtsoCntrTypCdList2 = $("#mtsoCntrTypCdList").val() ;
       		 }else{
       			param.mtsoCntrTypCdList = [];
       			param.mtsoCntrTypCdList1 = [];
       			param.mtsoCntrTypCdList2 = [];
       		 }

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "국사별시스템현황";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mtsoSystemIntgLkup";
alert(JSON.stringify(param));
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/curstmgmt/excelcreateMtsoSystemIntgLkup', param, successCallbackExcel, failCallback, 'GET');
         });*/

        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
//    		var param =  $("#searchForm").serialize();
    		var param =  $("#searchForm").serializeArray();

    		for (var int = 0; int < param.length; int++) {
				if(param[int].name == "firstRowIndex"){
					param[int].value = 1;
				}
				if(param[int].name == "lastRowIndex"){
					param[int].value = 1000000000;
				}
			}

    		param = jQuery.param(param);

    		param = decodeURIComponent(param); // 한글검색어 깨짐 문제 수정[20171221]

    		param = gridExcelColumn(param, gridId);

    		$.each($('form input[type=checkbox]')
					.filter(function(idx){
						return $(this).prop('checked') === false
					}),
					function(idx, el){
				var emptyVal = "";
				param += '&' + $(el).attr('name') + '=' + emptyVal;
			});

    		if($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != ""){
				$.each($("#mtsoCntrTypCdList").val(), function(key, value) {
					param += '&' + "mtsoCntrTypCdList1" + '=' + value;
				});

				$.each($("#mtsoCntrTypCdList").val(), function(key, value) {
					param += '&' + "mtsoCntrTypCdList2" + '=' + value;
				});
			}

    		if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
				$.each($("#mtsoTypCdList").val(), function(key, value) {
					param += '&' + "mtsoTypCdList1" + '=' + value;
				});

				$.each($("#mtsoTypCdList").val(), function(key, value) {
					param += '&' + "mtsoTypCdList2" + '=' + value;
				});
			}

//    		param += "&firstRowIndex=1";
//    		param += "&lastRowIndex=lastRowIndex";


//    		param.push({name:firstRowIndex, value:1});
//    		param.push({name:lastRowIndex, value:1000000000});

    		param += "&fileName=국사별시스템현황";
    		param += "&fileExtension=xlsx";
    		param += "&excelPageDown=N";
    		param += "&excelUpload=N";
    		param += "&method=mtsoSystemIntgLkup";

//    		param = param.replace(/%/g,'%25');
    		param = encodeURI(param);

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/curstmgmt/excelcreateMtsoSystemIntgLkup', param, successCallbackExcel, failCallback, 'GET');
         });

        //본부를 선택했을 경우
        $('#orgId').on('change', function(e){
            changeHdofc();
            changeTeam();
        });

        //팀을 선택했을 경우
        $('#teamId').on('change', function(e){
            changeTeam();
        })

        //국사 입력 시
        $('#mtsoNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        		return false;
        	}
        })
        // 국사명입력시 [주소별통합조회, 통합내역조회]체크박스 입력 불가능-> 가능으로 변경 [20171221]
        /*
        $('#mtsoNm').keyup(function(e){
        	if(($("#mtsoNm").val() != null && $("#mtsoNm").val() != "") || ($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
        		$('#addrIntgChk').setChecked(false);
        		$('#addrIntgChk').setEnabled(false);
        		$('#intgChk').setChecked(false);
        		$('#intgChk').setEnabled(false);
        	}else{
        		$('#addrIntgChk').setEnabled(true);
        	}
        })

        $('#mtsoNm').blur(function(e){
        	if(($("#mtsoNm").val() != null && $("#mtsoNm").val() != "") || ($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
        		$('#addrIntgChk').setChecked(false);
        		$('#addrIntgChk').setEnabled(false);
        		$('#intgChk').setChecked(false);
        		$('#intgChk').setEnabled(false);
        	}else{
        		$('#addrIntgChk').setEnabled(true);
        	}
        })
        */
        //_국사명입력시 [주소별통합조회, 통합내역조회]체크박스 입력 불가능-> 가능으로 변경 [20171221]

        $('#mtsoTypCdList').multiselect({
    		 beforeclose: function(e){
    			 //국사명입력시 [주소별통합조회, 통합내역조회]체크박스 입력 불가능-> 가능으로 변경 [20171221]
    			 //if(($("#mtsoNm").val() != null && $("#mtsoNm").val() != "") || ($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
    			 if(($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
    	        		$('#addrIntgChk').setChecked(false);
    	        		$('#addrIntgChk').setEnabled(false);
    	        		$('#intgChk').setChecked(false);
    	        		$('#intgChk').setEnabled(false);
    	        	}else{
    	        		$('#addrIntgChk').setEnabled(true);
    	        	}
    		 }
    	 });

        $('#mtsoCntrTypCdList').multiselect({
    		 beforeclose: function(e){
    			 //국사명입력시 [주소별통합조회, 통합내역조회]체크박스 입력 불가능-> 가능으로 변경 [20171221]
    			 //if(($("#mtsoNm").val() != null && $("#mtsoNm").val() != "") || ($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
    			 if(($("#mtsoCntrTypCdList").val() != null && $("#mtsoCntrTypCdList").val() != "") || ($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != "")){
    	        		$('#addrIntgChk').setChecked(false);
    	        		$('#addrIntgChk').setEnabled(false);
    	        		$('#intgChk').setChecked(false);
    	        		$('#intgChk').setEnabled(false);
    	        	}else{
    	        		$('#addrIntgChk').setEnabled(true);
    	        	}
    		 }
    	 });
	};

	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;

    	selectInit[1] = Tango.select.init({
    		el: '#teamId',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})

    	selectInit[1].model.get();
	}

	//team change
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();

    	selectInit[2] = Tango.select.init({
    		el: '#trmsMtsoId',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtso',
    			data: param
    		}),
    		valueField: 'mtsoId',
    		labelField: 'mtsoNm',
    		selected: 'all'
    	})

    	selectInit[2].model.get({data:param});
	}

    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		$('#'+gridId).alopexGrid('dataSet', response.mtsoSystemIntgLkup);
		$('#'+gridId).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					return '총 건수 : ' + response.totalCnt;
				}}}
		);
		totalCnt = response.totalCnt;
	}

	var successCallbackSearchPageAdd = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		if(response.mtsoSystemIntgLkup.length <= 0){
			return false;
		}else{
    		$('#'+gridId).alopexGrid("dataAdd", response.mtsoSystemIntgLkup);
    		$('#'+gridId).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return '총 건수 : ' + response.totalCnt;
					}}}
			);
		}
	}

	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate');
		console.log(response);

		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}

	var failCallback = function(response){
		//조회 실패 하였습니다.
		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
	}

    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
//    		      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//    		      dataType: "text",
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }

    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //Excel
    function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
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

		/*param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;*/

		param += "&excelHeaderCd=" + excelHeaderCd;
		param += "&excelHeaderNm=" + excelHeaderNm;
		param += "&excelHeaderAlign=" + excelHeaderAlign;
		param += "&excelHeaderWidth=" + excelHeaderWidth;

		return param;
	}
});