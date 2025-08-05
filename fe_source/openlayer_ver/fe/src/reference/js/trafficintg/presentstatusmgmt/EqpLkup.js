/**
 * PtsTraffic.js
 *
 * @author P098821
 * @date 2016. 12. 21.
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var selectInit = [];

	// (2017-03-10 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
    	$('#'+gridId).alopexGrid('dataEmpty');

    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'hdofcNm', align:'left',
				title : '본부',
				width: '150px'
			},{
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '130px'
			},{
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px'
			},{
    			key : 'repIntgFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '130px'
			}/*,{	(2017-06-23 : HS Kim) 필드 삭제
    			key : 'intgFcltsCd', align:'center',
				title : '통합시설코드',
				width: '110px'
			}*/,{
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '180px'
			},{
    			key : 'mtsoTyp', align:'center',
				title : '국사유형',
				width: '130px'
			},{
    			key : 'adstNm', align:'left',
				title : '권역구분',
				width: '90px'
			},{
    			key : 'bpNm', align:'left',
				title : '제조사',
				width: '110px'
			},{
    			key : 'eqpMdlNm', align:'left',
				title : '장비모델',
				width: '130px'
			},{
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '180px'
			},{
    			key : 'ip', align:'left',
				title : 'IP',
				width: '110px'
			},{
    			key : 'du', align:'right',
				title : 'DU수',
				width: '50px'
			},{
    			key : 'emsYn', align:'center',
				title : '연동여부',
				width: '80px'
			},{ // (2017-05-29 : HS Kim) 추가 : 건물코드, 건물명
				key : 'bldCd', align:'left',
				title : '건물코드',
				width: '130px'
			},{
    			key : 'addr', align:'left',
				title : '주소',
				width: '200px'
			},{
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '130px'
			},{
    			key : 'devPortCnt', align:'right',
				title : '장비등록포트수',
				width: '110px'
			},{
    			key : 'devPortUseCnt', align:'right',
				title : '장비사용포트수',
				width: '110px'
			},{
    			key : 'cardNm', align:'left',
				title : '카드명',
				width: '120px'
			},{
    			key : 'cardRmk', align:'left',
				title : '카드 설명',
				width: '180px'
			},{
    			key : 'cardMdlNm', align:'left',
				title : '카드모델',
				width: '150px'
			},{
    			key : 'portCnt', align:'right',
				title : '등록포트수',
				width: '100px'
			},{
    			key : 'portUseCnt', align:'right',
				title : '사용포트수',
				width: '100px'
			},{
    			key : 'cardUseTyp', align:'left',
				title : '용도',
				width: '100px'
			},{
    			key : 'portNm', align:'left',
				title : '포트명',
				width: '180px'
			},{
    			key : 'portAlsNm', align:'left',
				title : '포트 별명',
				width: '130px'
			},{
    			key : 'portDesc', align:'left',
				title : '포트 설명',
				width: '130px'
			},{
    			key : 'ifIp', align:'left',
				title : 'I/F IP',
				width: '110px'
			},{
    			key : 'duIp', align:'left',
				title : 'DU IP',
				width: '110px'
			},{
    			key : 'vlan', align:'left',
				title : 'VLAN',
				width: '100px'
			},{
    			key : 'capa', align:'left',
				title : '포트용량',
				width: '100px'
			},{
    			key : 'portUseYn', align:'center',
				title : '사용여부',
				width: '100px'
			},{
    			key : 'lte', align:'center',
				title : 'LTE',
				width: '80px'
			},{
    			key : 'wifi', align:'center',
				title : 'WIFI',
				width: '80px'
			},{
    			key : 'wcdma', align:'center',
				title : 'WCDMA',
				width: '80px'
			},{
    			key : 'b2b', align:'center',
				title : 'B2B',
				width: '80px'
			},{
    			key : 'ems', align:'center',
				title : 'EMS',
				width: '80px'
			},{
    			key : 'lineBmtso', align:'center',
				title : '기지국연결',
				width: '100px'
			},{
    			key : 'lineTrdCnnt', align:'center',
				title : '상호접속연결',
				width: '100px'
			},{
    			key : 'lineRont', align:'center',
				title : '교환기간(기간망)연결',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    $('#'+gridId).alopexGrid("hideCol", ['cardNm','cardRmk','cardMdlNm','portCnt','portUseCnt','cardUseTyp']);
    	$('#'+gridId).alopexGrid("hideCol",['portNm','portDesc','capa','portUseYn','portAlsNm', 'ifIp', 'duIp', 'vlan', 'lineBmtso', 'lineTrdCnnt', 'lineRont']);
    	$('#'+gridId).alopexGrid("hideCol",['lte','wifi','wcdma','b2b','ems']);
    	$('#'+gridId).alopexGrid("hideCol",['devPortCnt','devPortUseCnt']);	// (2017-06-23 : HS Kim) 숨기기 : PTS, ROADM, RingMux
    	$("#chkLinkLine").attr("disabled", true);	// (2017-06-23 : HS Kim) 미사용 : PTS, RingMux, L2 S/W, IP백홀
    	$("#chkCard").attr("disabled", true);
    	$("#chkSvc").attr("disabled", true);


//    	$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
		if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.roleDiv = "5GBH";
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
                          ,{el: '#vendNm', url: 'vendnms', key: 'comCd', label: 'comCdNm'}
                          ,{el: '#mdlNm', url: 'modellist', key: 'comCd', label: 'comCdNm'}
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
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param = $("#searchForm").getData();
        param.hdofcId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();
    	param.bpId = selectInit[3].getValue();
        param.eqpMdlId = selectInit[4].getValue();

        param.eqpNm = $('#eqpNm').val();
        param.mtsoNm = $('#mtsoNm').val();
        param.addr = $('#addr').val();
        param.eqpIp = $('#eqpIp').val();

        if ($('#emsY').is(':checked')){
        	param.emsYn = 'Y';
        } else if ($('#emsN').is(':checked')){
        	param.emsYn = 'N';
        } else {
        	param.emsYn = 'all';
        }

        param.chkEqpTyp = $('#eqpTyp option:selected').text();

        if ($('#chkCard').is(':checked')) {
        	param.chkCard = 'Y'
        }else {
        	param.chkCard = 'N'
        }
        if ($('#chkPort').is(':checked')) {
        	param.chkPort = 'Y'
        }else {
        	param.chkPort = 'N'
        }
        if ($('#chkSvc').is(':checked')) {
        	param.chkSvc = 'Y'
        }else {
        	param.chkSvc = 'N'
        }
        if ($('#chkLinkLine').is(':checked')) {
        	param.chkLinkLine = 'Y'
        }else {
        	param.chkLinkLine = 'N'
        }

    	httpRequest('tango-transmission-biz/trafficintg/presentstatusmgmt/getEqpLkup', param, successCallbackSearch, failCallback, 'GET');
    }

    function showIpCols() {
    	$('#'+gridId).alopexGrid("showCol",['portAlsNm', 'ifIp', 'duIp', 'vlan']);
    }

    function hideIpCols() {
    	$('#'+gridId).alopexGrid("hideCol",['portAlsNm', 'ifIp', 'duIp', 'vlan'], 'conceal');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	/* //(2017-03-10 : HS Kim) 장비 종류에 따른 검색옵션 확인
        	if ( $('#chkCard').is(":checked") || $('#chkPort').is(":checked") || $('#chkSvc').is(":checked")  ){
        		if( $('#eqpTyp option:selected').text()=='Ring MUX' || $('#eqpTyp option:selected').text()=='ROADM' || $('#eqpTyp option:selected').text()=='PTS' ){
        			if( !($('#chkCard').is(":checked")) && !($('#chkSvc').is(":checked")) ){
                		//카드내역 또는 서비스내역을 선택하세요
                		callMsgBox('','W', makeArgConfigMsg('selectRequirement'," [검색옵션:카드내역] ", "[검색옵션:서비스내역]"), function(msgId, msgRst){});
                		return;
                	};
        		}
        	}*/

        	setGrid(1, eobjk);
        });

        //장비명
        $('#eqpNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //국사명
        $('#mtsoNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //주소
        $('#addr').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //IP
        $('#ip').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });

        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            setGrid(1, eobjk);
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);

    		param.pageNo = 1;
    		param.rowPerPage = 100;

    		param.hdofcId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();
        	param.bpId = selectInit[3].getValue();
            param.eqpMdlId = selectInit[4].getValue();

            param.eqpNm = $('#eqpNm').val();
            param.mtsoNm = $('#mtsoNm').val();
            param.addr = $('#addr').val();
            param.eqpIp = $('#eqpIp').val();

            if ($('#emsY').is(':checked')){
            	param.emsYn = 'Y'
            } else if ($('#emsN').is(':checked')){
            	param.emsYn = 'N'
            } else {
            	param.emsYn = 'all';
            }

            param.chkEqpTyp = $('#eqpTyp option:selected').text();

            if ($('#chkCard').is(':checked')) {
            	param.chkCard = 'Y'
            }else {
            	param.chkCard = 'N'
            }
            if ($('#chkPort').is(':checked')) {
            	param.chkPort = 'Y'
            }else {
            	param.chkPort = 'N'
            }
            if ($('#chkSvc').is(':checked')) {
            	param.chkSvc = 'Y'
            }else {
            	param.chkSvc = 'N'
            }
            if ($('#chkLinkLine').is(':checked')) {	// (2017-09-23 :  HS Kim) 연결회선수 추가
            	param.chkLinkLine = 'Y'
            }else {
            	param.chkLinkLine = 'N'
            }

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getEqpLkupList";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "EqpLkup" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "EqpLkup";     // 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-10 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "Planning 장비 조회";
 	    	//httpRequest('tango-transmission-biz/trafficintg/presentstatusmgmt/excelcreateEqpLkup', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });

        $('#chkCard').on('click', function(e) {
        	clickChkCard();
        });
        $('#chkPort').on('click', function(e) {
        	clickchkPort();
        });
        $('#chkSvc').on('click', function(e) {
        	clickChkSvc();
        });
        $('#chkLinkLine').on('click', function(e) {
        	clickChkLinkLine();
        });

    	//본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
            changeHdofc();
            changeTeam();
        });

        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
            changeTeam();
        })

        //장비역할을 선택했을 경우
        $('#eqpTyp').on('change', function(e){
            changeEqpTyp();
        })

        //제조사를 선택했을 경우
        $('#vendNm').on('change', function(e){
            changeVend();
        })
	};

	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;

    	var param = {};
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID,
    			data: param
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

    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[2] = Tango.select.init({
    		el: '#trmsMtsoNm',
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

	// (2017-06-29 : HS Kim) 검색옵션 클릭이벤트 function처리
	function clickChkCard() {
		if ($('#chkCard').is(':checked')) {
	   		$('#'+gridId).alopexGrid("showCol",['cardNm','cardRmk','cardMdlNm','portCnt','portUseCnt','cardUseTyp']);
	    } else {
	    	$('#'+gridId).alopexGrid("hideCol",['cardNm','cardRmk','cardMdlNm','portCnt','portUseCnt','cardUseTyp'], 'conceal');
	    }
    }
    function clickchkPort() {
    	if ($('#chkPort').is(':checked')) {
	   		$('#'+gridId).alopexGrid("showCol",['portNm','portDesc','capa','portUseYn']);
	   		if ($("#eqpTyp option:selected").text() == "L2 S/W" || $("#eqpTyp option:selected").text() == "IP 백홀" || $("#eqpTyp option:selected").text() == "5G 백홀") {
	   			showIpCols();
    		} else {
    			hideIpCols();
    		}
	    } else {
	    	$('#'+gridId).alopexGrid("hideCol",['portNm','portDesc','capa','portUseYn']);
	    	hideIpCols();
	    }
    }
    function clickChkSvc() {
    	if ($('#chkSvc').is(':checked')) {
	   		$('#'+gridId).alopexGrid("showCol",['lte','wifi','wcdma','b2b','ems']);
	    } else {
	    	$('#'+gridId).alopexGrid("hideCol",['lte','wifi','wcdma','b2b','ems']);
	    }
    }
    function clickChkLinkLine() {
    	if ($('#chkLinkLine').is(':checked')) {
	   		$('#'+gridId).alopexGrid("showCol",['lineBmtso', 'lineTrdCnnt', 'lineRont']);
	    } else {
	    	$('#'+gridId).alopexGrid("hideCol",['lineBmtso', 'lineTrdCnnt', 'lineRont']);
	    }
    }

	function changeEqpTyp(){	// (2017-06-23 : HS Kim) 장비별 검색옵션, 연동여부 사용설정
		var param = {};
    	param.roleDiv = "all";
    	$('#'+gridId).alopexGrid("hideCol",['du','devPortCnt','devPortUseCnt']);
		if ($('#eqpTyp option:selected').text()=='PTS') {
			param.roleDiv = 'PTS';
			$('#'+gridId).alopexGrid("showCol",['du']);
			$("#chkLinkLine").attr("checked", false);	clickChkLinkLine();
			$("#chkCard").attr("disabled",false); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", false); $("#chkLinkLine").attr("disabled", true);
			$("input[name=emsYn]").attr("disabled",false);
		} else if ($('#eqpTyp option:selected').text()=='ROADM') {
			param.roleDiv = 'ROADM';
			$("#chkSvc").attr("checked", false);	clickChkSvc();
			$("#chkCard").attr("disabled",false); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", false);
			$("input[name=emsYn]").attr("disabled",false);
		} else if ($('#eqpTyp option:selected').text()=='Ring MUX') {
			param.roleDiv = 'RINGMUX';
			$('#'+gridId).alopexGrid("hideCol",['cardUseTyp']);
			$("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",false); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("input[name=emsYn]").attr("disabled",false);
		} else if ($('#eqpTyp option:selected').text()=='L2 S/W') {
			param.roleDiv = 'L2';
			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		} else if ($('#eqpTyp option:selected').text()=='IP 백홀') {
			param.roleDiv = 'L3';
			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		} else if ($('#eqpTyp option:selected').text()=='5G 백홀') {
			param.roleDiv = '5GBH';
			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}else if ($('#eqpTyp option:selected').text()=='OTN') {
			param.roleDiv = 'OTN';
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}else if ($('#eqpTyp option:selected').text()=='5G-PON') {
			param.roleDiv = '5GPON';
//			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}else if ($('#eqpTyp option:selected').text()=='5G-SMUX') {
			param.roleDiv = '5GSMUX';
//			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}else if ($('#eqpTyp option:selected').text()=='5G-CMUX') {
			param.roleDiv = '5GCMUX';
//			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}else if ($('#eqpTyp option:selected').text()=='5G-LMUX') {
			param.roleDiv = '5GLMUX';
//			$('#'+gridId).alopexGrid("showCol",['du','devPortCnt','devPortUseCnt']);
			$("#chkCard").attr("checked",false); $("#chkSvc").attr("checked", false); $("#chkLinkLine").attr("checked", false);	clickChkCard();	clickChkSvc();	clickChkLinkLine();
			$("#chkCard").attr("disabled",true); $("#chkPort").attr("disabled", false); $("#chkSvc").attr("disabled", true); $("#chkLinkLine").attr("disabled", true);
			$("#emsAll").prop("checked",true);	$("input[name=emsYn]").attr("disabled",true);
		}

		if ($('#chkPort').is(":checked")) {
    		if ($("#eqpTyp option:selected").text() == "L2 S/W" || $("#eqpTyp option:selected").text() == "IP 백홀" || $("#eqpTyp option:selected").text() == "5G 백홀") {
    			showIpCols();
    		} else {
    			hideIpCols();
    		}
    	}

    	selectInit[3] = Tango.select.init({
    		el: '#vendNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/vendnms',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[3].model.get();
	}

	function changeVend(){
		var param = {};
		param.roleDiv = "all";
		if ($('#eqpTyp option:selected').text()=='PTS') {
			param.roleDiv = 'PTS';
		} else if ($('#eqpTyp option:selected').text()=='ROADM') {
			param.roleDiv = 'ROADM';
		} else if ($('#eqpTyp option:selected').text()=='Ring MUX') {
				param.roleDiv = 'RINGMUX';
		} else if ($('#eqpTyp option:selected').text()=='L2 S/W') {
			param.roleDiv = 'L2';
		} else if ($('#eqpTyp option:selected').text()=='IP 백홀') {
			param.roleDiv = 'L3';
		}else if ($('#eqpTyp option:selected').text()=='5G 백홀') {
			param.roleDiv = '5GBH';
		}else if ($('#eqpTyp option:selected').text()=='OTN') {
			param.roleDiv = 'OTN';
		}else if ($('#eqpTyp option:selected').text()=='5G-PON') {
			param.roleDiv = '5GPON';
		}else if ($('#eqpTyp option:selected').text()=='5G-SMUX') {
			param.roleDiv = '5GSMUX';
		}else if ($('#eqpTyp option:selected').text()=='5G-CMUX') {
			param.roleDiv = '5GCMUX';
		}else if ($('#eqpTyp option:selected').text()=='5G-LMUX') {
			param.roleDiv = '5GLMUX';
		}

		param.vendCd = selectInit[3].getValue();

    	selectInit[4] = Tango.select.init({
    		el: '#mdlNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/modellist',
    			data: param
    		}),
    		valueField: 'comCd',
    		labelField: 'comCdNm',
    		selected: 'all'
    	})

    	selectInit[4].model.get();
	}

	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }

    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.lists);
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
	// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
	var successCallbackOnDemandExcel = function(response){

		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand');
		console.log(response);

		var jobInstanceId = response.resultData.jobInstanceId;
		//alert("(HS Kim) jobInstanceId : " + jobInstanceId);
		// 엑셀다운로드팝업
        $a.popup({
               popid: 'TrafficExcelDownloadPop' + jobInstanceId,
               title: '엑셀다운로드',
               iframe: true,
               modal : false,
               windowpopup : true,
               url: '/tango-transmission-web/trafficintg/TrafficExcelDownloadPop.do',
               data: {
                   jobInstanceId : jobInstanceId,
                   fileName : fileOnDemandName,
                   fileExtension : fileOnDemandExtension
               },
               width : 500,
               height : 300
               ,callback: function(resultCode) {
                   if (resultCode == "OK") {
                       //$('#btnSearch').click();
                   }
               }
           });

	}

    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
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

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}
});