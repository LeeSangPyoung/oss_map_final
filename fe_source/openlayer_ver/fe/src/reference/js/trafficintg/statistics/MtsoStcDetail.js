/**
 * MtsoStcDetail.js
 *
 * @author 김현민
 * @date 2016. 7. 6. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);
	
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();
	
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;
	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	
	var selectInit = [];
	
	var xCat = [];
	var yCat = [];
	
	var userGroupRowspanMode = 1;

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };
 
    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
//	    	headerGroup: [{
//    			fromIndex:4, toIndex:9, title:"중심국사(사업자)", id:'u0'
//    		}, {
//    			fromIndex:10, toIndex:16, title:"중심국사(권역)", id:'u1'
////    		}, {
////    			fromIndex:17, toIndex:23, title:"SKB제외 중심국사(권역)", id:'u1'
//    		}, {
//    			fromIndex:24, toIndex:30, title:"기지국사(공대기준)", id:'u1'
//    		}, {
//    			fromIndex:31, toIndex:37, title:"기지국사(통시기준)", id:'u1'
//    		}],
	    	headerGroup: [{
    			fromIndex:4, toIndex:6, title:"중심국사(사업자)", id:'u0'
    		}, {
    			fromIndex:7, toIndex:13, title:"중심국사(권역)", id:'u1'
//    		}, {
//    			fromIndex:17, toIndex:23, title:"SKB제외 중심국사(권역)", id:'u1'
    		}, {
    			fromIndex:14, toIndex:20, title:"기지국사(건물기준)", id:'u1'	// (2017-03-14) 필드명 단순변경 : (공대기준) => (건물기준)
    		}, {
    			fromIndex:21, toIndex:27, title:"기지국사(통시기준)", id:'u1'
    		}],

    		paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},    

        	fitTableWidth:true,
        	autoColumnIndex:true,
        	        	
//        	grouping : {
//        		useGrouping:true
//        		,by:['clctDt','orgNm','teamNm']
//        		,useGroupFooter:['orgNm','teamNm']
//        		,useGroupRowspan:true
//        		,useGroupRearrange:true
//        		,groupRowspanMode : userGroupRowspanMode
//        	},
    		columnMapping: [{
    			key : 'clctDt', align:'center',
				title : '기준일자',
				width: '100px', rowspan:true												
			}, {
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '130px', rowspan:true,
//				groupFooter:['합계'],
//				groupFooterAlign:'center',
//				colspanTo : function(value,data,mapping,range){
//					if(userGroupRowspanMode === 1 && data._state.groupFooter && range && range.groupDepth === 1)
//						return 'teamNm'; 
//				}							    
			}, {
				key : 'teamNm', align:'left',
				title : '팀',
				width: '120px', rowspan:true,
//				groupFooter:['소계'],
//				groupFooterAlign:'center',
//				groupFooterStyleclass:'flight-info-cell'				
			}, {
				key : 'trmsMtsoNm', align:'left',
				title : '전송실',																
				width: '130px'
			}, {
				key : 'bizrStdCotSumrCnt', align:'right',
				title : '계',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}				
			}, {
				key : 'bizrStdSktCnt', align:'right',
				title : 'SKT',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'bizrStdSktSkbCnt', align:'right',
				title : 'SKT/SKB',
				width: '80px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
//				key : 'bizrStdSkt2Cnt', align:'right',
//				title : 'SKT2',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'bizrStdSkbCnt', align:'right',
//				title : 'SKB',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'bizrStdEtcCnt', align:'right',
//				title : '미지정',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
				key : 'laraStdCotSumrCnt', align:'right',
				title : '계',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdSeoulCotCnt', align:'right',
				title : '서울시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdMtpcCotCnt', align:'right',
				title : '광역시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdCity23CotCnt', align:'right',
				title : '23개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdCity85CotCnt', align:'right',
				title : '85개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdNatNetCotCnt', align:'right',
				title : '전국망',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'laraStdEtcCotCnt', align:'right',
				title : '미지정',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
//				key : 'laraStdCotSumrCnt2', align:'right',
//				title : '계',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdSeoulCotCnt2', align:'right',
//				title : '서울시',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdMtpcCotCnt2', align:'right',
//				title : '광역시',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdCity23CotCnt2', align:'right',
//				title : '23개시',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdCity85CotCnt2', align:'right',
//				title : '85개시',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdNatNetCotCnt2', align:'right',
//				title : '전국망',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
//				key : 'laraStdEtcCotCnt2', align:'right',
//				title : '미지정',
//				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
//			}, {
				key : 'repCdStdCotSumrCnt', align:'right',
				title : '계',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdSeoulCotCnt', align:'right',
				title : '서울시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdMtpcCotCnt', align:'right',
				title : '광역시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdCity23CotCnt', align:'right',
				title : '23개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdCity85CotCnt', align:'right',
				title : '85개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdNatNetCotCnt', align:'right',
				title : '전국망',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'repCdStdEtcCotCnt', align:'right',
				title : '미지정',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdCotSumrCnt', align:'right',
				title : '계',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdSeoulCotCnt', align:'right',
				title : '서울시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdMtpcCotCnt', align:'right',
				title : '광역시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdCity23CotCnt', align:'right',
				title : '23개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdCity85CotCnt', align:'right',
				title : '85개시',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdNatNetCotCnt', align:'right',
				title : '전국망',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
				key : 'fcltsCdStdEtcCotCnt', align:'right',
				title : '미지정',
				width: '60px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
    			key : 'orgId', align:'center',
				title : '본부ID',
				width: '90px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
    			key : 'teamId', align:'center',
				title : '팀ID',
				width: '90px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}, {
    			key : 'trmsMtsoId', align:'center',
				title : '전송실ID',
				width: '90px',
//				groupFooter:['sum()'],
//				groupFooterAlign:'right',
//				render : function(value,data,render,mapping,grid){return value;}
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
    	
	    $('#'+gridId).alopexGrid('hideCol', ['orgId', 'teamId', 'trmsMtsoId'], 'conceal');
	    
        $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }
    
   
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}	// (2017-04-06 :  HS Kim) 추가
	                      ];
	
        for(var i=0; i<selectList.length; i++){
	      	selectInit[i] = Tango.select.init({
	      		el: selectList[i].el,
	      		model: Tango.ajax.init({
                    url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                    data: param
                    }),
	      		valueField: selectList[i].key,
	      		labelField: selectList[i].label,
	      		selected: 'all'
	      	})
	      	
	      	selectInit[i].model.get();
	      }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	
    	var clctDt = $('#clctDt').val().split('-');
        param.clctDtYear = clctDtYear = clctDt[0];
        param.clctDtMon = clctDtMon = clctDt[1];
        param.clctDtDay = clctDtDay = clctDt[2];
        param.orgId = selectInit[0].getValue(); 
        param.teamId = selectInit[1].getValue(); 
        param.trmsMtsoId = selectInit[2].getValue();

    	httpRequest('tango-transmission-biz/trafficintg/statistics/mtsoStcDetail', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		windowpopup: true,
    		modal: true,
    		movable:true,
    		width : 877,
    		height : 629
    	});
    }
    
    function setEventListener() {    
    	$('#btn').on('click',function(e){
    		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    		var parameter =  $("#searchForm").getData();
    		var date = $('#clctDt').val().replace(/-/gi,'');
    		parameter.clctDtYear = date.substring(0,4);
    		parameter.clctDtMon = date.substring(4,6);
    		parameter.clctDtDay = date.substring(6,8);
    		parameter.orgId = '' + $.map(data, function(d, idx){return d.orgId});
    		parameter.teamId = '' + $.map(data, function(d, idx){return d.teamId});
    		parameter.trmsMtsoId = '' + $.map(data, function(d, idx){return d.trmsMtsoId});
    		
    		if(parameter.orgId == '' && parameter.teamId == '' && parameter.trmsMtsoId == '')
    		    return
    		
    		httpRequest('tango-transmission-biz/trafficintg/statistics/mtsoStcDetail', parameter, successCallbackPopup, failCallback, 'GET');
    	});
    	var eobjk=100; // Grid 초기 개수
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
        
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		 
    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
    		
    		var clctDt = $('#clctDt').val().split('-');
            param.clctDtYear = clctDtYear = clctDt[0];
            param.clctDtMon = clctDtMon = clctDt[1];
            param.clctDtDay = clctDtDay = clctDt[2];
            param.clctDt = clctDtYear + clctDtMon + clctDtDay; 
            param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
            param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
            param.trmsMtsoId = selectInit[2].getValue();	// (2017-04-06: HS Kim) 추가
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "국사통계상세";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mtsoStcDetail";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateMtsoStcDetail', param, successCallbackExcel, failCallback, 'GET');
         });
        
        ///본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
            changeHdofc();
            changeTeam();
        });
        
        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
            changeTeam();
        })
      
        

    	
	};
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
	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;
    	
    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})
    	
    	selectInit[1].model.get();
	}
	
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();

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
	
	//숫자에 콤마 추가
	function Comma(str) {
    	var strReturn ;
		
    	if(str == null)
			strReturn = '0';
		else{
			str = String(str);
			strReturn = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'); 
		}
    	
    	return strReturn; 
    }
    
    //request 실패시.
    function failCallback(serviceId, response){
    	//조회 실패 하였습니다.
		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	$('#'+gridId).alopexGrid('hideProgress');
    }
    
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		
		for(var i=0; i<response.mtsoStcDetail.length; i++ )
		{
			
			response.mtsoStcDetail[i].bizrStdCotSumrCnt = Comma(response.mtsoStcDetail[i].bizrStdCotSumrCnt);
			response.mtsoStcDetail[i].bizrStdSktCnt = Comma(response.mtsoStcDetail[i].bizrStdSktCnt);
			response.mtsoStcDetail[i].bizrStdSktSkbCnt = Comma(response.mtsoStcDetail[i].bizrStdSktSkbCnt);
			response.mtsoStcDetail[i].bizrStdSkt2Cnt = Comma(response.mtsoStcDetail[i].bizrStdSkt2Cnt);
			response.mtsoStcDetail[i].bizrStdSkbCnt = Comma(response.mtsoStcDetail[i].bizrStdSkbCnt);
			response.mtsoStcDetail[i].bizrStdEtcCnt =  Comma( response.mtsoStcDetail[i].bizrStdEtcCnt);
			response.mtsoStcDetail[i].laraStdCotSumrCnt = Comma(response.mtsoStcDetail[i].laraStdCotSumrCnt);
			response.mtsoStcDetail[i].laraStdSeoulCotCnt = Comma(response.mtsoStcDetail[i].laraStdSeoulCotCnt);
			response.mtsoStcDetail[i].laraStdMtpcCotCnt = Comma(response.mtsoStcDetail[i].laraStdMtpcCotCnt);
			response.mtsoStcDetail[i].laraStdCity23CotCnt = Comma(response.mtsoStcDetail[i].laraStdCity23CotCnt);
			response.mtsoStcDetail[i].laraStdCity85CotCnt  = Comma(response.mtsoStcDetail[i].laraStdCity85CotCnt);
			response.mtsoStcDetail[i].laraStdNatNetCotCnt = Comma(response.mtsoStcDetail[i].laraStdNatNetCotCnt);
			response.mtsoStcDetail[i].laraStdEtcCotCnt = Comma(response.mtsoStcDetail[i].laraStdEtcCotCnt);
			response.mtsoStcDetail[i].laraStdCotSumrCnt2 = Comma(response.mtsoStcDetail[i].laraStdCotSumrCnt2);
			response.mtsoStcDetail[i].laraStdSeoulCotCnt2 = Comma(response.mtsoStcDetail[i].laraStdSeoulCotCnt2);
			response.mtsoStcDetail[i].laraStdMtpcCotCnt2 = Comma(response.mtsoStcDetail[i].laraStdMtpcCotCnt2);
			response.mtsoStcDetail[i].laraStdCity23CotCnt2 = Comma(response.mtsoStcDetail[i].laraStdCity23CotCnt2);
			response.mtsoStcDetail[i].laraStdCity85CotCnt2 = Comma(response.mtsoStcDetail[i].laraStdCity85CotCnt2);
			response.mtsoStcDetail[i].laraStdNatNetCotCnt2 = Comma(response.mtsoStcDetail[i].laraStdNatNetCotCnt2);
			response.mtsoStcDetail[i].laraStdEtcCotCnt2  = Comma(response.mtsoStcDetail[i].laraStdEtcCotCnt2);
			response.mtsoStcDetail[i].repCdStdCotSumrCnt = Comma(response.mtsoStcDetail[i].repCdStdCotSumrCnt);
			response.mtsoStcDetail[i].repCdStdSeoulCotCnt = Comma(response.mtsoStcDetail[i].repCdStdSeoulCotCnt);
			response.mtsoStcDetail[i].repCdStdMtpcCotCnt= Comma(response.mtsoStcDetail[i].repCdStdMtpcCotCnt);
			response.mtsoStcDetail[i].repCdStdCity23CotCnt = Comma(response.mtsoStcDetail[i].repCdStdCity23CotCnt);
			response.mtsoStcDetail[i].repCdStdCity85CotCnt = Comma(response.mtsoStcDetail[i].repCdStdCity85CotCnt);
			response.mtsoStcDetail[i].repCdStdNatNetCotCnt = Comma(response.mtsoStcDetail[i].repCdStdNatNetCotCnt);
			response.mtsoStcDetail[i].repCdStdEtcCotCnt = Comma(response.mtsoStcDetail[i].repCdStdEtcCotCnt);
			response.mtsoStcDetail[i].fcltsCdStdCotSumrCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdCotSumrCnt);
			response.mtsoStcDetail[i].fcltsCdStdSeoulCotCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdSeoulCotCnt);
			response.mtsoStcDetail[i].fcltsCdStdMtpcCotCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdMtpcCotCnt);
			response.mtsoStcDetail[i].fcltsCdStdCity23CotCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdCity23CotCnt);
			response.mtsoStcDetail[i].fcltsCdStdCity85CotCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdCity85CotCnt);
			response.mtsoStcDetail[i].fcltsCdStdNatNetCotCnt = Comma(response.mtsoStcDetail[i].fcltsCdStdNatNetCotCnt);
			response.mtsoStcDetail[i].fcltsCdStdEtcCotCnt    = Comma(response.mtsoStcDetail[i].fcltsCdStdEtcCotCnt);
		}
		
		setSPGrid(gridId,response, response.mtsoStcDetail);
	}
	
	 //본부 request 성공시
    var successCallbackOrg = function(response){
    	$('#hdofcNm').clear();
		$('#teamNm').clear();
		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];
		
		$('#teamNm').setData({
             data:option_data

		});
		

		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
			
		}
		
		$('#hdofcNm').setData({
             data:option_data
             
		});
	}
    
  //팀 request 성공시
    var successCallbackTeam = function(response){
    	$('#teamNm').clear();
		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];
		
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
			
		}
		
		$('#teamNm').setData({
             data:option_data
		});
	}
    
    //전송실 Request 성공시
    var successCallbackTmofs = function(response){
    	$('#mtsoId').clear();
		
		var option_data = [{mtsoId: "",mgmtGrpCd: "",mtsoNm: "전체"}];
		
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
			
		}
		
		$('#mtsoId').setData({
             data:option_data    
		});
	}
    
    
  //전송실 Request 성공시
    var successCallbackTmofs = function(response){
    	$('#mtsoId').clear();
		var option_data =  [{mtsoId: "",mgmtGrpCd: "",mtsoNm: "전체"}];
		
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
			
		}
		
		$('#mtsoId').setData({
             data:option_data,
             mtsoNm:''
		});
	}
    
   
		
			
	var successCallbackPopup = function(response){
		xCat = ['SKT','SKT/SKB','SKT2','SKB','미지정'];
		//for(var i = 0; i < response.mtsoStcDetailDay.length; i++){
		//	xCat.push(response.mtsoStcDetailDay[i].clctDt);
		//}
		
		yCat = [];
		for(var i = 0; i < response.mtsoStcDetailDay.length; i++){
			var yData = [];
			//for(var i = 0; i < response.mtsoStcDetailDay.length; i++){
			//	yData.push(response.mtsoStcDetailDay[i].bizrStdSktCnt);
			//}
	
			yData.push(response.mtsoStcDetailDay[i].bizrStdSktCnt);
			yData.push(response.mtsoStcDetailDay[i].bizrStdSktSkbCnt);
			yData.push(response.mtsoStcDetailDay[i].bizrStdSkt2Cnt);
			yData.push(response.mtsoStcDetailDay[i].bizrStdSkbCnt);
			yData.push(response.mtsoStcDetailDay[i].getBizrStdEtcCnt());
			//yData.push(response.mtsoStcDetailDay[i].getValue('bizrStdEtcCnt'));
			//yData.push(response.mtsoStcDetailDay[i].bizrStdEtcCnt);
			//yData.push(response.mtsoStcDetailDay[0].laraStdCotSumrCnt);
			//yData.push(response.mtsoStcDetailDay[0].laraStdSeoulCotCnt);
			//yData.push(response.mtsoStcDetailDay[0].laraStdMtpcCotCnt);
			
			yCat.push({name : response.mtsoStcDetailDay[i].clctDt, //'사업자 - SKT',
				       data : yData});
		}
		
		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		
		var paraData = {chartType:'column',
				        xCategori:xCat, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	                    yCategori:yCat,
	                    title:'MtsoStcDetail',
	                    subTitle:'MtsoStcDetail',
	                    valueSuffic:'',
	                    yTitle:'MtsoStcDetail',
	                    startDate:$('#clctDt').val(),
	                    orgId:'' + $.map(data, function(d, idx){return d.orgId}),
	            		teamId:'' + $.map(data, function(d, idx){return d.teamId}),
	            		trmsMtsoId:'' + $.map(data, function(d, idx){return d.trmsMtsoId}),
	                    url:'tango-transmission-biz/trafficintg/statistics/mtsoStcDetail'};
		
        popup('chart_page', 'chart_page.do', 'Chart', paraData);
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
		param.headerGrpCnt = 1;
		var headerGrpCd = "";
		var headerGrpNm = "";
		var headerGrpPos = "";
		
		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				headerGrpCd += gridColmnInfo[i].id + ";";
				headerGrpNm += gridColmnInfo[i].title + ";";
				headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
			}
		}
		param.headerGrpCd = headerGrpCd;
		param.headerGrpNm = headerGrpNm;
		param.headerGrpPos = headerGrpPos;
		
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