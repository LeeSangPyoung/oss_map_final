/**
 * MtsoDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var popIrms = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGrid';
	var paramData = null;

    this.init = function(id, param) {
    	console.log("init param : ", param);
    	initGrid();
    	setSelectCode();
    	setEventListener();
    	//setRegDataSet(param);
        paramData = param;
        var mtsoId = param.mtsoId;
        if (mtsoId != null && mtsoId != "" && mtsoId != undefined) {
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getIrmsSisulCd', paramData, 'GET', 'irmsSisulCd');
        }
    };

    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				key : 'sisulcode', align:'center',
				title : '통합시설코드',
				width: '110px'
    		},  {
				key : 'rcuIpVal', align:'center',
				title : 'RCU IP',
				width: '100px'
    		},  {
				key : 'stationname', align:'center',
				title : '기지국명',
				width: '120px'
    		},  {
				key : 'stationtypename', align:'center',
				title : '기지국유형',
				width: '120px'
    		},  {
				key : 'stationid', align:'center', hidden : true,
				title : '기지국ID',
				width: '100px'
    		},  {
				key : 'irmsid', align:'center',
				title : '제원ID',
				width: '120px'
			}, {
				key : 'itemnm', align:'left',
				title : '제원명',
				width: '120px'
			}, {
				key : 'rmsFctNoVal', align:'left',
				title : 'RMS 설비번호',
				width: '90px'
    		},  {
				key : 'specnm', align:'left',
				title : '설치제원명',
				width: '110px'
			}, {
				key : 'siteCd', align:'center',
				title : '사이트키',
				width: '140px'
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
    };

    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getIrmsGroup', null, 'GET', 'irmsGroup');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getIrmsKind', null, 'GET', 'irmsKind');
    }

 
    function setGrid(page, rowPerPage){

      	 $('#pageNo').val(page);
      	 $('#rowPerPage').val(rowPerPage);
      	 var param =  $("#searchForm").getData();

      	 $('#'+gridId).alopexGrid('showProgress');
      	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getIrmsSearch', param, 'GET', 'search');
   	}


    function setEventListener() {
    	var perPage = 100;

    	$('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);
    	 });

    	$('#btnClose').on('click', function(e) {
   		 	$a.close();
    	});

    	$('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setGrid(eObj.page, eObj.pageinfo.perPage);
    	});

    	$('#'+gridId).on('perPageChange', function(e){
    		var eObj = AlopexGrid.parseEvent(e);
    		perPage = eObj.perPage;
    		setGrid(1, eObj.perPage);
    	});

    	$('#btnSearch').on('click', function(e) {
    		setGrid(1,perPage);
        });
    	$('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			setGrid(1,perPage);
      		}
      	 });

    	$('#groupcode').on('change', function(e) {
    		var groupcode = $('#groupcode').val();
			var param = {groupcode : groupcode};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getIrmsKind', param, 'GET', 'irmsKind');

         });
    	
    	//2023 통합국사 고도호-옵션 추가
    	// 사이트 조회
    	$('#btnSiteSearch').on('click', function(e) {
    		var param =  $("#searchForm").getData();
    		$a.popup({
    			popid: 'SiteLkup',
    			title: '사이트 조회',
    			url: '/tango-transmission-web/configmgmt/common/SiteLkup.do',
    			data: param,
    			modal: true,
    			movable:true,
    			width : 800,
    			height : window.innerHeight * 0.85,
    			callback : function(data) { // 팝업창을 닫을 때 실행
    				$('#searchForm').find('#siteCd').val(data.siteCd);
    			}
    		});
    	});
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'irmsSisulCd'){
    		if (response.IrmsMtsoInfo.length > 0) {
    			var repIntgFcltsCd = response.IrmsMtsoInfo[0].repIntgFcltsCd;
        		$('#sisulcode').val(repIntgFcltsCd);
    		}
    	} else if(flag == 'irmsGroup'){
    		$('#groupcode').clear();
    		var option_data =  [{groupcode: "", groupdesc: "선택하세요"}];

    		for(var i=0; i<response.irmsGroupList.length; i++){
    			var resObj = response.irmsGroupList[i];
    			option_data.push(resObj);
    		}

    		$('#groupcode').setData({
                 data:option_data
    		});
    	} else if(flag == 'irmsKind'){
    		$('#itemid').clear();
    		var option_data =  [{itemid: "", itemdesc: "선택하세요"}];

    		for(var i=0; i<response.irmsKindList.length; i++){
    			var resObj = response.irmsKindList[i];
    			//console.log(resObj);
    			option_data.push(resObj);
    		}

    		$('#itemid').setData({
                 data:option_data
    		});
    	} else if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.irmsSearchList);
		}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    function setSPGrid(GridID,Option,Data) {
    	var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    this.setGrid = function(page, rowPerPage){

   	 $('#pageNo').val(page);
   	 $('#rowPerPage').val(rowPerPage);
   	 var param =  $("#sbeqpSearchForm").serialize();

	   	 $.each($('form input[type=checkbox]')
       		.filter(function(idx){
       			return $(this).prop('checked') === false
       		}),
       		function(idx, el){
       	var emptyVal = "";
       	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

   	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpMgmt', param, 'GET', 'search');
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

               /*
               	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
               */
               //width: 1000,
               //height: 700

           });
     }
});