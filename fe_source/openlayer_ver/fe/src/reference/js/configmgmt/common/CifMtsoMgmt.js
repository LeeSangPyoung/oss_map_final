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
        setEventListener();
        
        $('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoMgmt', param, 'GET', 'cifMtsoMgmt');
    };
    
    function initGrid() {
    	$('#'+gridId).alopexGrid({
    		pager: false,
    		autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		footer : {
    			position : "bottom",
    			footerMapping : [
    			                 {columnIndex:0,title:"합계",align:"center"}
    			                 ,{columnIndex:2,render:"sum(intgSktSlf)",align:"center"}
    			                 ,{columnIndex:3,render:"sum(intgSkbSlf)",align:"center"}
    			                 ,{columnIndex:4,render:"sum(intgSktLes)",align:"center"}
    			                 ,{columnIndex:5,render:"sum(intgSkbLes)",align:"center"}
    			                 ,{columnIndex:6,render:"sum(intgGnrlLes)",align:"center"}
    			                 ,{columnIndex:7,render:"sum(intgSumrlLes)",align:"center"}
    			                 ,{columnIndex:8,render:"sum(intgEtclLes)",align:"center"}
    			                 ,{columnIndex:9,render:"sum(focsSktSlf)",align:"center"}
    			                 ,{columnIndex:10,render:"sum(focsSkbSlf)",align:"center"}
    			                 ,{columnIndex:11,render:"sum(focsSktLes)",align:"center"}
    			                 ,{columnIndex:12,render:"sum(focsSkbLes)",align:"center"}
    			                 ,{columnIndex:13,render:"sum(focsGnrlLes)",align:"center"}
    			                 ,{columnIndex:14,render:"sum(focsSumrlLes)",align:"center"}
    			                 ,{columnIndex:15,render:"sum(focsEtclLes)",align:"center"}
    			                 ,{columnIndex:16,render:"sum(cofcSktSlf)",align:"center"}
    			                 ,{columnIndex:17,render:"sum(cofcSkbSlf)",align:"center"}
    			                 ,{columnIndex:18,render:"sum(cofcSktLes)",align:"center"}
    			                 ,{columnIndex:19,render:"sum(cofcSkbLes)",align:"center"}
    			                 ,{columnIndex:20,render:"sum(cofcGnrlLes)",align:"center"}
    			                 ,{columnIndex:21,render:"sum(cofcSumrlLes)",align:"center"}
    			                 ,{columnIndex:22,render:"sum(cofcEtclLes)",align:"center"}
    			                 ,{columnIndex:23,render:"sum(sumrSumrlLes)",align:"center"}
    			                 ,{columnIndex:24,render:"sum(sumrEtclLes)",align:"center"}
    			                 ]
    		},
    		headerGroup: [
                          {fromIndex:2, toIndex:22, title:"국사구분"}
			             ,{fromIndex:2, toIndex:8, title:"통합국"}
			             ,{fromIndex:9, toIndex:15, title:"DU집중기지국"}
			             ,{fromIndex:16, toIndex:22, title:"전송중심국"}
                         ],
    		columnMapping: [{
    			key : 'uprOrgNm', align:'center',
				title : '본부',
				width: '180px'
			}, {
    			key : 'teamNm', align:'center',
				title : '운용팀',
				width: '130px'
			}, {
    			key : 'intgSktSlf', align:'center',
				title : 'SKT자가',
				width: '100px'
			}, {
    			key : 'intgSkbSlf', align:'center',
				title : 'SKB자가',
				width: '100px'
			}, {
    			key : 'intgSktLes', align:'center',
				title : 'SKT임차',
				width: '100px'
			}, {
    			key : 'intgSkbLes', align:'center',
				title : 'SKB임차',
				width: '100px'
			}, {
				key : 'intgGnrlLes', align:'center',
				title : '일반임차',
				width: '100px'	
			}, {
    			key : 'intgSumrlLes', align:'center',
				title : '합계',
				width: '100px'
			}, {
    			key : 'intgEtclLes', align:'center',
				title : '미선택',
				width: '100px'
			}, {
    			key : 'focsSktSlf', align:'center',
				title : 'SKT자가',
				width: '100px'
			}, {
    			key : 'focsSkbSlf', align:'center',
				title : 'SKB자가',
				width: '100px'
			}, {
    			key : 'focsSktLes', align:'center',
				title : 'SKT임차',
				width: '100px'
			}, {
    			key : 'focsSkbLes', align:'center',
				title : 'SKB임차',
				width: '100px'
			}, {
				key : 'focsGnrlLes', align:'center',
				title : '일반임차',
				width: '100px'	
			}, {
    			key : 'focsSumrlLes', align:'center',
				title : '합계',
				width: '100px'
			}, {
    			key : 'focsEtclLes', align:'center',
				title : '미선택',
				width: '100px'
			}, {
    			key : 'cofcSktSlf', align:'center',
				title : 'SKT자가',
				width: '100px'
			}, {
    			key : 'cofcSkbSlf', align:'center',
				title : 'SKB자가',
				width: '100px'
			}, {
    			key : 'cofcSktLes', align:'center',
				title : 'SKT임차',
				width: '100px'
			}, {
    			key : 'cofcSkbLes', align:'center',
				title : 'SKB임차',
				width: '100px'
			}, {
				key : 'cofcGnrlLes', align:'center',
				title : '일반임차',
				width: '100px'	
			}, {
    			key : 'cofcSumrlLes', align:'center',
				title : '합계',
				width: '100px'
			}, {
    			key : 'cofcEtclLes', align:'center',
				title : '미선택',
				width: '100px'
			}, {
    			key : 'sumrSumrlLes', align:'center',
				title : '총합',
				width: '120px'
			}, {
    			key : 'sumrEtclLes', align:'center',
				title : '미선택 총합',
				width: '120px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
    	})
    	
    	$('#'+gridId).alopexGrid("hideCol", ['cifTakeAprvStatNm', 'intgEtclLes', 'focsEtclLes', 'cofcEtclLes', 'sumrEtclLes'], 'conceal');
    }
    
    function hideColumn(){
    	
    	if($('#optionDetail').is(':checked')){
    		$('#'+gridId).alopexGrid('showCol',[
												'intgSktSlf','intgSkbSlf','intgSktLes','intgSkbLes','intgGnrlLes',
												'focsSktSlf','focsSkbSlf','focsSktLes','focsSkbLes','focsGnrlLes',
												'cofcSktSlf','cofcSkbSlf','cofcSktLes','cofcSkbLes','cofcGnrlLes'
    		                                    ]);
    	}else{
    		$('#'+gridId).alopexGrid('hideCol',[
    		                                    'intgSktSlf','intgSkbSlf','intgSktLes','intgSkbLes','intgGnrlLes',
    		                                    'focsSktSlf','focsSkbSlf','focsSktLes','focsSkbLes','focsGnrlLes',
    		                                    'cofcSktSlf','cofcSkbSlf','cofcSktLes','cofcSkbLes','cofcGnrlLes'
    		                                    ], 'conceal');
    	}
    }
    
    function setEventListener() {
        
        $('#optionDetail').on('click', function(e){
        	hideColumn();
        })
        
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
        
	};
   
	function successCallback(response, status, jqxhr, flag){
		if(flag == "cifMtsoMgmt"){

			$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.cifMtsoMgmtList);
		}
	}
	
	function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
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
	
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
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