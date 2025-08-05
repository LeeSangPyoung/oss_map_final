/**
 * VerificationRegistrationLineTestReportSkb.js
 *
 * @author P096430
 * @date 2016. 08. 02. 오후 02:04:00
 * @version 1.0
 */

    	/* ********************************************************************* */
    	/*   < 미완료 작업 >                                                     */
    	/*                                                                       */
    	/*   1. 파일 다운로드 작업!!!!!!!!!!!!                                   */
    	/*                                                                       */
    	/* ********************************************************************* */

var m = {
	   file :{
				upload     : null,
				download   : null,
				fileresult : null,
				nm         : "",
				guid       : "",
				url        : "",
				sno        : "",
				delsno     : "",
				flag	   : ""
			},
		message : {},
		label : {}
}



var userId = parent.m.userInfo.userId;

var params = {};
var params2 = {};
var engstNo = "";
var cstrCd = "";
var lnVrfClCd = "D"; //선로검증분류코드 시험성적서


var skAfcoDivCd = parent.m.userInfo.skAfcoDivCd;
var bpId = parent.m.userInfo.bpId;

var otderNo = 0;
var wkrtNo = "";
var cstrVrfRsltCd = ""; // 선로공사검증결과
var vrfOponCtt = ""; // 검증의견내용

var exemptionStatus = 'N'; // 검증등록 제외 여부
var jsonData = "";

var data = [];

// 페이지 파라미터
var pageNo = 1;
var rowPerPage = 30;
var totalPageCnt = 0;
var nextPageNo = 0;

// 페이지 파라미터2
var pageNo2 = 1;
var rowPerPage2 = 30;
var totalPageCnt2 = 0;
var nextPageNo2 = 0;

var photoData = null;

/* 
 * 2022-08-17 이전 저장된 OTDR 데이터 : false
 * 2022-08-17 이후 저장된 OTDR 데이터 : true 
 */
var isAfterOtdr = "";

var p = [
	         {
	        	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineTestReportOtdrListSkb',
	        	flag:'OtdrList' // 0
	         },
	         {
	        	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineTestReportOtdrDetailListSkb',
	        	flag:'otdrDetail' // 1
	         },
	         {
	  			url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineTestReportOtdrOpinionInfoSkb',
	  			flag:'opinionResult' // 2
	         },
	         {
	  			url:'tango-transmission-biz/transmission/constructprocess/verification/insertVerificationRegistrationLineTestReportOpinionSkb?method=put',
	  			flag:'saveOpinion' // 3
	         },
	         {  // BP사 의견 및 검증제외 조회
            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpCommentSkb',
            	flag:'BpCommentChk' // 4
	         },
			 {   // 파일 다운로드
				url : 'tango-common-business-biz/dext/files',
				data : "",
				flag : 'fileDownload' /* 5 */
			 },
             {  // 사진 DATA 조회
				url:'tango-transmission-biz/transmission/constructprocess/verification/getFileDataListSkb',
				data:"",
				flag:'getPhotoDataList' // 6
	         },
	         {
				url:'tango-transmission-biz/transmisson/constructprocess/completion/cmplDocLcbm',
				flag:'cmplDocLcbm' // 7
		     }
	     ];




var tangoAjaxModel = Tango.ajax.init({});


$a.page(function(){



    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param){

    	// 파라미터 셋팅
    	if(param.cstrCd != null && param.cstrCd != ""){
    		cstrCd = param.cstrCd;
    	}else{
        	cstrCd = parent.$('#cstrCd').val();
    	}
    	if(param.engstNo != null && param.engstNo != ""){
    		engstNo = param.engstNo;
    	}else{
    		engstNo = '0';
    	}

    	params.cstrCd = cstrCd;
    	params.engstNo = engstNo

    	// 그리드 생성
    	initGrid();
    	//initGridDtlBefore();
    	initGridDtlAfter();
    	
    	setGrid1();
    	setGrid3();
   		setEventListener();
   		searchOpinion();

   		$('#masterTable').find('input').setEnabled(false);

    };

    //Grid 초기화
    function initGrid(){
    	// 그리드 생성
    	$('#otdrListGrid').alopexGrid({
    		pager: false,
    		height: 135,
    		rowClickSelect: false,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
		    rowOption:{
		    	defaultHeight:30
		    },
    		columnMapping:[
    		             { key : 'svlnNo'                  , title : '회선번호'			},
    		             { key : 'bpNm'                    , title : '시공업체'			},
    		             { key : 'cnstnSpsbMtsoDivNm'      , title : '상하위구분'			},
    		             { key : 'uprMtsoNm'               , title : '상하위국'			},
    		             { key : 'lowMtsoNm'               , title : '상하위대국'			},
    		             { key : 'otdrDivNm'               , title : 'OTDR구분'			},
    		             { key : 'sctnNm'                  , title : '구간명'				},
    		             { key : 'msmtDistm'               , title : '측정거리'			},
    		             { key : 'msmtDt'                  , title : '측정일자'			},
    		             { key : 'msopNm'                  , title : '측정자'				},
    		             { key : 'frstRegDate'             , title : '최초등록일자'			, hidden : true	}
            ],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+parent.m.message.noData+"</div>"
			},
    		paging: {
    			pagerTotal: true,
    			pagerSelect: false,
    			hidePageList: true
    		}
    	});


        $('#cmplDocLcbmGrid').alopexGrid({
        	autoColumnIndex: true,
    		rowClickSelect: true,
    		rowSingleSelect: true,
    		fitTableWidth: true,
    		height: 210,
    		paging : {
    			hidePageList: true,  // pager 중앙 삭제
    			pagerSelect: false,  // 한 화면에 조회되는 Row SelectBox 삭제
    			pagerTotal: false
    		},
    		columnMapping: [{
				key : 'cmplDocmtSubmFileSrno', title : '파일순번', width : '80px'  //파일순번
			},{
				key : 'fileNm', title : '파일명', width : '320px', align : 'left'  //파일명
			}]
        });    	
    	
    }// initGrid()
    
    function initGridDtlBefore() {
    	
    	$('#otdrDetailGrid').alopexGrid({
    		pager: false,
    		height: 170,
    		cellSelectable: true,
    		rowClickSelect: false,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		// 헤더그룹정의
    		headerGroup:[
    		             {fromIndex:0   ,toIndex:0      ,title:'상위국'					,id:''                         		},
    		             {fromIndex:0   ,toIndex:0      ,title:'Core.No'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:1   ,toIndex:1      ,title:'하위국'					,id:''                         		},
    		             {fromIndex:1   ,toIndex:1      ,title:'Core.No'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:2   ,toIndex:13     ,title:'1.310mm 측정 광섬유손실'		,id:''                         		},
    		             {fromIndex:2   ,toIndex:6      ,title:'상→하(dB/Km)'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:7   ,toIndex:7      ,title:'총손실'					,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:8   ,toIndex:12     ,title:'하→상(dB/Km)'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:13  ,toIndex:13     ,title:'총손실'					,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:14  ,toIndex:25     ,title:'1.550mm 측정 광섬유손실'		,id:''                         		},
    		             {fromIndex:14  ,toIndex:18     ,title:'상→하(dB/Km)'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:19  ,toIndex:19     ,title:'총손실'					,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:20  ,toIndex:24     ,title:'하→상(dB/Km)'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:25  ,toIndex:25     ,title:'총손실'					,id:''    ,hideSubTitle:true   		}
    		             ],
		    rowOption:{
		    	defaultHeight:30
		    },
    		columnMapping:[
    		             { key : 'umtsoLnNo'               , title : ''                                    		},
    		             { key : 'lmtsoLnNo'               , title : ''                                    		},
    		     /* ---------------------------------------------------------------------------------------------- */
    		             { key : 'updnLossRateOneThreeOne'         , title : '상하손실률131'                       	},
    		             { key : 'updnGrphCttOneThreeOne'          , title : '상하내용131'         ,hidden:true  	},
    		             { key : 'updnGrphImgOneThreeOne'          , title : '상하이미지131'                       	},
    		             { key : 'updnGrsrDownOneThreeOne'         , title : '상하다운131'                        	},
    		             { key : 'updnGrsrSorOneThreeOne'          , title : '상하소스131'         ,hidden:true  	},
    		             { key : 'updnSumLossRateOneThreeOne'      , title : '상하총손실131'                       	},
    		     /* ---------------------------------------------------------------------------------------------- */
    		             { key : 'dnupLossRateOneThreeOne'         , title : '하상손실률131'                     	},
    		             { key : 'dnupGrphCttOneThreeOne'          , title : '하상내용131'         ,hidden:true 	},
    		             { key : 'dnupGrphImgOneThreeOne'          , title : '하상이미지131'                  		},
    		             { key : 'dnupGrsrDownOneThreeOne'         , title : '하상다운131'                       	},
    		             { key : 'dnupGrsrSorOneThreeOne'          , title : '하상소스131'         ,hidden:true  	},
    		             { key : 'dnupSumLossRateOneThreeOne'      , title : '하상총손실131'                    	},
    		     /* ---------------------------------------------------------------------------------------------- */
    		             { key : 'updnLossRateOneFiveFive'         , title : '상하손실률155'                    	},
    		             { key : 'updnGrphCttOneFiveFive'          , title : '상하내용155'         ,hidden:true   	},
    		             { key : 'updnGrphImgOneFiveFive'          , title : '상하이미지155'                     	},
    		             { key : 'updnGrsrDownOneFiveFive'         , title : '상하다운155'                       	},
    		             { key : 'updnGrsrSorOneFiveFive'          , title : '상하소스155'         ,hidden:true  	},
    		             { key : 'updnSumLossRateOneFiveFive'      , title : '상하총손실155'                    	},
    		     /* ---------------------------------------------------------------------------------------------- */
    		             { key : 'dnupLossRateOneFiveFive'         , title : '하상손실률155'                    	},
    		             { key : 'dnupGrphCttOneFiveFive'          , title : '하상내용155'         ,hidden:true   	},
    		             { key : 'dnupGrphImgOneFiveFive'          , title : '하상이미지155'                     	},
    		             { key : 'dnupGrsrDownOneFiveFive'         , title : '하상다운155'                         },
    		             { key : 'dnupGrsrSorOneFiveFive'          , title : '하상소스155'         ,hidden:true    },
    		             { key : 'dnupSumLossRateOneFiveFive'      , title : '하상총손실155'                    	},
    		     /* ---------------------------------------------------------------------------------------------- */
    		             { key : 'updnFileSrnoOneThreeOne'         , title : '상하1P31업로드일련번호'               ,hidden:true },
    		             { key : 'dnupFileSrnoOneThreeOne'         , title : '하상1P31업로드일련번호'               ,hidden:true },
    		             { key : 'updnFileSrnoOneFiveFive'         , title : '상하1P55업로드일련번호'               ,hidden:true },
    		             { key : 'dnupFileSrnoOneFiveFive'         , title : '하상1P55업로드일련번호'               ,hidden:true },
    		             { key : 'updnSorFileSrnoOneThreeOne'      , title : '상하SOR1P31업로드일련번호'            ,hidden:true },
    		             { key : 'dnupSorFileSrnoOneThreeOne'      , title : '하상SOR1P31업로드일련번호'            ,hidden:true },
    		             { key : 'updnSorFileSrnoOneFiveFive'      , title : '상하SOR1P55업로드일련번호'            ,hidden:true },
    		             { key : 'dnupSorFileSrnoOneFiveFive'      , title : '하상SOR1P55업로드일련번호'            ,hidden:true }

            ],
			message: {
				nodata: "<div class='no_data' style='font-weight:normal;'><i class='fa fa-exclamation-triangle'></i>"+parent.m.message.noData+"</div>"
			},
    		paging: {
    			pagerTotal: true,
    			pagerSelect: false,
    			hidePageList: true
    		}
    	});
	
    }
    
    function initGridDtlAfter() {
    	
    	$('#otdrDetailGrid').alopexGrid({
    		pager: false,
    		height: 170,
    		cellSelectable: true,
    		rowClickSelect: false,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		// 헤더그룹정의
    		headerGroup:[
    		             {fromIndex:0   ,toIndex:0      ,title:'상위국'					,id:''                         		},
    		             {fromIndex:0   ,toIndex:0      ,title:'Core.No'				,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:1   ,toIndex:1      ,title:'하위국'					,id:''                         		},
    		             {fromIndex:1   ,toIndex:1      ,title:'Core.No'				,id:''    ,hideSubTitle:true   		},
    		             
    		             {fromIndex:2   ,toIndex:4     	,title:'1.550mm 측정 광섬유 손실값'	,id:''    ,hideSubTitle:true        },
 
    		             {fromIndex:5  	,toIndex:8     	,title:'상위국'					,id:''                         		},
    		             {fromIndex:5  	,toIndex:6     	,title:'랙 사진'					,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:7  	,toIndex:8     	,title:'포트 사진'					,id:''    ,hideSubTitle:true   		},
    		             
    		             {fromIndex:9  	,toIndex:12     ,title:'하위국'					,id:''                         		},
    		             {fromIndex:9  	,toIndex:10     ,title:'랙 사진'					,id:''    ,hideSubTitle:true   		},
    		             {fromIndex:11  ,toIndex:12     ,title:'포트 사진'					,id:''    ,hideSubTitle:true   		}
    		             ],
    		             rowOption:{
    		            	 defaultHeight:30
    		             },
    		             columnMapping:[
    		                            { key : 'umtsoLnNo'               		, title : ''                            , width : '60px'},
    		                            { key : 'lmtsoLnNo'               		, title : ''                            , width : '60px'},
    		                            /* ---------------------------------------------------------------------------------------------- */
    		                            { key : 'msmt1p55FileNm'         		, title : '측정1P55파일명'                       			},
    		                            { key : 'msmt1p55FileUladSrno'          , title : '측정1P55파일업로드일련번호'         ,hidden:true  	},
    		                            { key : 'msmt1p55LossRate'          	, title : '측정1P55손실율'                       			},
    		                            /* ---------------------------------------------------------------------------------------------- */
    		                            { key : 'umtsoInstlRackFileNm'         	, title : '상위국사설치랙파일명'                     			},
    		                            { key : 'umtsoInstlRackFileSrno'      	, title : '상위국사설치랙파일일련번호'         	,hidden:true 	},
    		                            { key : 'umtsoInstlPortFileNm'         	, title : '상위국사설치포트파일명'                       		},
    		                            { key : 'umtsoInstlPortFileSrno'     	, title : '상위국사설치포트파일일련번호'       	,hidden:true  	},
    		                            /* ---------------------------------------------------------------------------------------------- */
    		                            { key : 'lmtsoInstlRackFileNm'         	, title : '하위국사설치랙파일명'                     			},
    		                            { key : 'lmtsoInstlRackFileSrno'      	, title : '하위국사설치랙파일일련번호'         	,hidden:true 	},
    		                            { key : 'lmtsoInstlPortFileNm'         	, title : '하위국사설치포트파일명'                       		},
    		                            { key : 'lmtsoInstlPortFileSrno'     	, title : '하위국사설치포트파일일련번호'       	,hidden:true  	},
    		                            
    		                            ],
    		                            message: {
    		                            	nodata: "<div class='no_data' style='font-weight:normal;'><i class='fa fa-exclamation-triangle'></i>"+parent.m.message.noData+"</div>"
    		                            },
    		                            paging: {
    		                            	pagerTotal: true,
    		                            	pagerSelect: false,
    		                            	hidePageList: true
    		                            }
    	});
    	
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }

    function validateChk(){
    	return true;
    }

    // 이벤트 !!!!!!!!!!!!!
    function setEventListener() {
    	// 메인그리드 스크롤 이벤트
    	$('#otdrListGrid').on('scrollBottom', function(e) {
    		if(nextPageNo > totalPageCnt){
    			return false;
    		}else{
    			pageNo = nextPageNo;

    			$('#otdrListGrid').alopexGrid('showProgress');

    			setGrid1();
    		}
    	});

    	var cc = 0; // 마우스 클릭 체크
    	// 메인그리드 데이터 선택시
    	$('#otdrListGrid').on('click','.bodycell',function(e){

			/* ***********************************************************
	    		var evObj = AlopexGrid.parseEvent(e);
	    		var row = evObj.datalist[0]._index.row;
	    		var id = evObj.datalist[0].otdrNo;
	    		var selected = evObj.datalist[0]._state.selected;
	    		console.log('데이터선택'+(selected?'':'해제')+'됨(row '+row+')---> id: '+ id);
			 ************************************************************ */
			var eObj = AlopexGrid.parseEvent(e).data;
			var i = eObj._index.row; // 선택 데이터 index
			var rowData = $('#otdrListGrid').alopexGrid("dataGetByIndex",{data:i});
			var selected = eObj._state.selected;
			$('#otdrListGrid').alopexGrid('rowSelect',{_index:eObj._index},true)
	
			if (rowData.frstRegDate > "2022081719") {
	    		isAfterOtdr = true;
	    		initGridDtlAfter();
	    	} else {
	    		isAfterOtdr = false;
	    		initGridDtlBefore();
	    	}
			
			if(selected == false){
		    		otdrNo = rowData.otdrNo;
		    		wkrtNo = rowData.wkrtNo
		    		pageNo2 = 1;
		    		setGrid2(); // 상세그리드 셋팅;
	    		}

    	});

    	// 상세그리드 스크롤 이벤트
    	$('#otdrDetailGrid').on('scrollBottom', function(e){
    		if(nextPageNo2 > totalPageCnt2){
    			return false;
    		}else{
    			pageNo2 = nextPageNo2;
    			$('#otdrDetailGrid').alopexGrid('showProgress');
    			setGrid2();
    		}
    	});

    	// 상세그리드 데이터 선택시
    	$('#otdrDetailGrid').on('click','.bodycell',function(e){

    		var eObj = AlopexGrid.parseEvent(e).data;
    		var i = eObj._index.row; // 선택 데이터 index
			var rowData = $('#otdrDetailGrid').alopexGrid("dataGetByIndex",{data:i});
    		$('#otdrDetailGrid').alopexGrid('rowSelect',{_index:eObj._index},true)

    		/* 시간안에 클릭 한번일 경우 수행 */
    		cc++;
    		setTimeout(function(){
    			if(cc == 1){
    				var k = eObj._key; // 선택 데이터 key 값
    	    		if( k == "updnGrphImgOneThreeOne" ||
    	    			k == "dnupGrphImgOneThreeOne" ||
    	    			k == "updnGrphImgOneFiveFive" ||
    	    			k == "dnupGrphImgOneFiveFive" ||
    	    				
    	    			k == "msmt1p55FileNm"		  ||
      	    			k == "umtsoInstlRackFileNm"	  ||
      	    			k == "umtsoInstlPortFileNm"	  ||
      	    			k == "lmtsoInstlRackFileNm"	  ||
      	    			k == "lmtsoInstlPortFileNm"	
    	    		  )
    	    		{
    	    			var sUrl = ""; // 이미지경로

	    	    		     if( k == "updnGrphImgOneThreeOne" ){ sUrl=rowData.updnFileSrnoOneThreeOne }
	    	            else if( k == "dnupGrphImgOneThreeOne" ){ sUrl=rowData.dnupFileSrnoOneThreeOne }
	    	            else if( k == "updnGrphImgOneFiveFive" ){ sUrl=rowData.updnFileSrnoOneFiveFive }
	    	            else if( k == "dnupGrphImgOneFiveFive" ){ sUrl=rowData.dnupFileSrnoOneFiveFive }
	    	            else if( k == "/imge/imgeV.gif"){ parent.parent.callMsgBox('','I', 'Graph 이미지가 없습니다.'); }
	    	    		    
	    	            else if( k == "msmt1p55FileNm" ){ sUrl=rowData.msmt1p55FileUladSrno }  
	    	            else if( k == "umtsoInstlRackFileNm" ){ sUrl=rowData.umtsoInstlRackFileSrno }  
	    	            else if( k == "umtsoInstlPortFileNm" ){ sUrl=rowData.umtsoInstlPortFileSrno }  
	    	            else if( k == "lmtsoInstlRackFileNm" ){ sUrl=rowData.lmtsoInstlRackFileSrno }  
	    	            else if( k == "lmtsoInstlPortFileNm" ){ sUrl=rowData.lmtsoInstlPortFileSrno }


	    	    		     if(sUrl == null || sUrl == ""){
	    	    		    	sUrl = "40000663";
	    	    		     }
	    	    		     m.file.sno = sUrl;

	    	    		     callTangoAjax(6); // 파일 다운로드


    	    		}else if( k == "updnGrsrDownOneThreeOne" ||
        	    			  k == "dnupGrsrDownOneThreeOne" ||
        	    			  k == "updnGrsrDownOneFiveFive" ||
        	    			  k == "dnupGrsrDownOneFiveFive")
    	    		{	// sor파일 다운로드
    	    			var fUrl = "";   // 파일경로
    	    			var fDown = "";  // 파일다data
    	    			var fSno = "";  // 파일 일련번호
    	    		    var path = "";
    	    		    var fileName = "";

   	    		             if( k == "updnGrsrDownOneThreeOne" ){ fUrl=rowData.updnGrsrSorOneThreeOne ,fDown=rowData.updnGrsrDownOneThreeOne ,fSno=rowData.updnSorFileSrnoOneThreeOne }
	    	            else if( k == "dnupGrsrDownOneThreeOne" ){ fUrl=rowData.dnupGrsrSorOneThreeOne ,fDown=rowData.dnupGrsrDownOneThreeOne ,fSno=rowData.dnupSorFileSrnoOneThreeOne }
	    	            else if( k == "updnGrsrDownOneFiveFive" ){ fUrl=rowData.updnGrsrSorOneFiveFive ,fDown=rowData.updnGrsrDownOneFiveFive ,fSno=rowData.updnSorFileSrnoOneFiveFive }
	    	            else if( k == "dnupGrsrDownOneFiveFive" ){ fUrl=rowData.dnupGrsrSorOneFiveFive ,fDown=rowData.dnupGrsrDownOneFiveFive ,fSno=rowData.dnupSorFileSrnoOneFiveFive }

   	    		        // sor파일 유무 체크
    	    		    if(fDown == null || fDown == "" ){ return; }

    	    	    	/* ********************************************************************* */
    	    	    	/*                                                                       */
    	    	    	/*   추후 파일다운로드 작업!!!!!!!!!!!!                                  */
    	    	    	/*                                                                       */
    	    	    	/* ********************************************************************* */
    	    		    m.file.sno = fSno;

    					console.log("sno : "+ m.file.sno);

    					if(m.file.sno != null && m.file.sno != "" && m.file.sno != undefined ){
    						console.log("다운받을 파일 있음");

    						callTangoAjax(5); // 파일 다운로드

    					}else{
    							parent.parent.callMsgBox("","W",parent.m.message.noExistFileForDownload ); /* 다운로드 할 파일이 존재하지 않습니다. */

    					}

    	    		} // if
    			}
    			cc = 0;
    		},300);
    	}); //$('#otdrDetailGrid').on('click','.bodycell',function(e){});

    	// 저장버튼 클릭시
    	$('#VerificationRegistrationLineTestReportSaveBtn').on('click',function(e){

     		if($('.Radio').getValue() == null){
     			parent.parent.callMsgBox('','I', parent.m.message.choiceVerificationResult); // 검증결과를 선택해주세요
     		}else{
     			if($('.Radio').getValue() == "N" && $('#OpR').val() == ""){
     				parent.callMsgBox('','I', parent.m.message.vrfOppnCttValidation); // 불량시 의견은 필수 입니다.
     			}else{
     				callTangoAjax(4);
     			}
     		}
    	});

    	$('#otdrDetailGrid').on('dblclick','.bodycell',function(e){
        		
    		if (isAfterOtdr) {
    			OtdrMsmtMgmtSavePopup(
					$('#otdrDetailGrid').alopexGrid("dataGetByIndex",{data:AlopexGrid.parseEvent(e).data._index.row}).otdrNo,
					$('#otdrDetailGrid').alopexGrid("dataGetByIndex",{data:AlopexGrid.parseEvent(e).data._index.row}).otdrSrno
    			);
    		} else {
    			otdrTestMgmtSavePopup(
					$('#otdrDetailGrid').alopexGrid("dataGetByIndex",{data:AlopexGrid.parseEvent(e).data._index.row}).otdrNo,
					$('#otdrDetailGrid').alopexGrid("dataGetByIndex",{data:AlopexGrid.parseEvent(e).data._index.row}).otdrSrno
    			);
    		}
    		
    	}); // $('#VerificationRegistrationLineTestReportSaveBtn').on('click',function(e){});
    	
     	//그리드 셀 더블클릭 이벤트 바인딩 (파일다운로드)
      	$('#cmplDocLcbmGrid').on('dblclick','.bodycell', function(e){

      		var rowData = AlopexGrid.trimData($('#cmplDocLcbmGrid').alopexGrid("dataGet" , {_state : {focused:true}}));
      		var fileKey = rowData[0].fileUladSrno; // responseCustomValue 값이 저장되어 있음

      		// 업로드 파일 단건 조회
      		Tango.ajax({
    			url : 'tango-common-business-biz/dext/files/'+ fileKey,
    			data : null,
    			method : 'GET'
    		}).done(function(response){successCallbackPopup(response, 'cmplDocLcbmFileSearch');})
    		  .fail(function(response){failCallbackPopup(response, 'cmplDocLcbmFileSearch');});
		});    	

	} // setEventListener() - 이벤트
    
    //request 성공시
    function successCallbackPopup(response, flag){
    	
    	if(flag == 'cmplDocLcbmFileSearch'){
    		$('#editorResult').text('업로드 파일조회결과 : ' + $.TcpUtils.toString(response));

    		DEXT5UPLOAD.ResetUpload("dext5download"); // dext5download 초기화 (삭제 후 추가로 하려했으나 삭제시 alert 호출로 인해 초기화로 변경)
    		DEXT5UPLOAD.AddUploadedFile(response.fileUladSrno,response.uladFileNm,response.uladFilePathNm, response.uladFileSz,response.fileUladSrno,"dext5download");
    		DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
    	}
    }

    //request 실패시.
    function failCallbackPopup(response, flag){
    }    

    // 성공시
    function successFn(response, status, jqxhr, flag){
    	switch (flag) {
    	case 'cmplDocLcbm' :
    		$('#cmplDocLcbmGrid').alopexGrid('dataSet', response.gisFileList);
    		$('#cmplDocLcbmGrid').alopexGrid('hideProgress');
    		
    		break;
    	case 'OtdrList':   // OTDR 내역
    		if(response.VerificationRegistrationLineTestReportOtdrList != null && response.VerificationRegistrationLineTestReportOtdrList != ""){
	    		if(response.pager != null && response.pager != ""){
	    			//===================
	    			totalPageCnt = Math.ceil(response.pager.totalCnt / response.pager.rowPerPage);
	    			nextPageNo = response.pager.pageNo + 1;
	    		}

	    		if(pageNo == 1){
	    			$('#otdrListGrid').alopexGrid('dataSet', response.VerificationRegistrationLineTestReportOtdrList);
	    		}else{
	    			$('#otdrListGrid').alopexGrid('dataAdd', response.VerificationRegistrationLineTestReportOtdrList);
	    		}
    		}
    		$('#otdrListGrid').alopexGrid('hideProgress');
    		break;

    	case 'otdrDetail':   // OTDR 상세

    		if(response.VerificationRegistrationLineTestReportOtdrMasterInfo != null && response.VerificationRegistrationLineTestReportOtdrMasterInfo != null){
    			$('#masterTable').setData(response.VerificationRegistrationLineTestReportOtdrMasterInfo);
    		}else{
    			$('#masterTable').find('.Textinput').val("");
    		}

    		if(response.pager != null && response.pager != ""){
    			totalPageCnt2 = Math.ceil(response.pager.totalCnt / response.pager.rowPerPage);
    			nextPageNo2 = response.pager.pageNo + 1;

	    		if(response.pager.pageNo == 1){
		    		$('#otdrDetailGrid').alopexGrid('dataSet', response.VerificationRegistrationLineTestReportOtdrDetailList);
	    		}else if(response.pager.pageNo > 1){
	    			$('#otdrDetailGrid').alopexGrid('dataAdd', response.VerificationRegistrationLineTestReportOtdrDetailList);
	    		}
    		}else{
    			$('#otdrDetailGrid').alopexGrid('dataEmpty');
    		}
    		$('#otdrDetailGrid').alopexGrid('hideProgress');
    		break;

    	case 'opinionResult': // 검증의견 조회결과
    		if(response.VerificationRegistrationLineTestReportOpinionInfo != null && response.VerificationRegistrationLineTestReportOpinionInfo != ""){
				// 양호(Y), 불량(N) 셋팅
    			$('#opRTable').setData(response.VerificationRegistrationLineTestReportOpinionInfo);

				if( // parent.m.globalVar.bpYn == "Y" ||  // BP사 여부 체크 안함
				   parent.m.globalVar.vcYn == "N" ||  // Not Verification Center
				   response.VerificationRegistrationLineTestReportOpinionInfo.vrfObjYn == "N" ||  // Verification Target
				   (response.VerificationRegistrationLineTestReportOpinionInfo.vrfFnshDt != null &&
				    response.VerificationRegistrationLineTestReportOpinionInfo.vrfFnshDt != ""     ) // Verification Complete
							){
							$('.Radio'     ).setEnabled(false);
							$('#OpR' ).setEnabled(false);
							$('#VerificationRegistrationLineTestReportSaveBtn').setEnabled(false);
						}else{
							$('#VerificationRegistrationLineTestReportSaveBtn').setEnabled(true);
						}
    		}else{
    			if( // parent.m.globalVar.bpYn == "Y" || // BP사 여부 체크 안함
    			   parent.m.globalVar.vcYn == "N" ||  // Not Verification Center
    			   parent.m.globalVar.vrfObjYn == "N"||
    			   (parent.m.globalVar.vrfFnshDt != null &&
    			    parent.m.globalVar.vrfFnshDt != "")
    			   ){
    				$('.Radio'     ).setEnabled(false);
					$('#OpR' ).setEnabled(false);
					$('#VerificationRegistrationLineTestReportSaveBtn').setEnabled(false);
				 }else{
					$('#VerificationRegistrationLineTestReportSaveBtn').setEnabled(true);
				 }
    		}


    		break;

    	case 'saveOpinion': // 검정의견 저장
//    		parent.parent.callMsgBox('','I', parent.m.message.savesuccess);
			div_msg_4.style.display = "";
			setTimeout("div_msg_4.style.display = 'none'", 1100);
    		break;
    	case 'BpCommentChk':

    		if(response.BpCommentInfo != null && response.BpCommentInfo != ""){
				if(parent.m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationTargetInfomation, messageCallback); // "검증대상정보가 변경 되었습니다."
				}else if(parent.m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation, messageCallback); // "검증완료정보가 변경 되었습니다."
				}else{
//					parent.parent.callMsgBox('save_btn','C', parent.m.message.save, messageCallback); // 저장을 하시겠습니까?
					messageCallback("save_btn", "Y");
				}
    		}else{
    			parent.parent.callMsgBox('BpCommentChk','W', parent.m.message.changedVerificationCompletionInfomation, messageCallback); // "검증완료정보가 변경 되었습니다."
    		}
    		break;
		case 'fileDownload':

			DEXT5UPLOAD.ResetUpload("dext5download"); // 기존 다운로드 파일 초기화

			// 다운로드 파일 셋팅
			DEXT5UPLOAD.AddUploadedFile(
					  response.fileUladSrno
					 ,response.uladFileNm
					 ,response.uladFilePathNm
					 , response.uladFileSz
					 ,response.fileUladSrno
					 ,"dext5download"
					 );

			DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
			break;
		case 'getPhotoDataList':


	    	$a.popup({
	    		popid: 'LargePic' // 중복클릭방지 id 필요
	            ,title : parent.m.label.expansionPicture // 확대사진
	            ,url : '/tango-transmission-web/constructprocess/verification/VerificationRegistrationLineLargePic.do'
		            ,windowpopup: true
	            ,width : 800
	            ,height : 600
	            ,modal : false
	            ,data : {'picUrl':response.photoDataList[0]}
	            ,callback : function(x){
	            			}
	        }); // parent.$a.popup({

			break;
    	}
    } // successFn()

    // 실패시
    function failFn(response, status, jqxhr, flag){
    	console.log(response);
   		parent.parent.callMsgBox('','I', response.message);
    } // failFn()

    // 파일 다운로드 실패
    function failFileDownFn(){
    	parent.parent.callMsgBox('','I',parent.m.message.noExistFileForDownload );
    }

    //그리드 데이터 조회
    function setGrid1(){
    	// 페이지 파라미터 셋팅
    	params.pageNo = pageNo;
    	params.rowPerPage = rowPerPage;

    	// 데이터 조회
    	callTangoAjax(0);
    } // setGrid1()

    function setGrid2(){
    	// 페이지 파라미터 셋팅
    	params2.pageNo = pageNo2;
    	params2.rowPerPage = rowPerPage2;
    	params2.otdrNo = otdrNo;
    	params2.wkrtNo = wkrtNo;
    	$('#otdrDetailGrid').alopexGrid('showProgress');
    	// 데이터 조회
    	callTangoAjax(1);

    } // setGrid2()
    
    function setGrid3(){
    	
    	// 페이지 파라미터 셋팅
    	params2.pageNo = pageNo2;
    	params2.rowPerPage = rowPerPage2;
    	params2.cmplDocmtFileDivCd = 'D'; //광파워미터
    	params2.cstrCd = cstrCd;
    	$('#cmplDocLcbmGrid').alopexGrid('showProgress');
    	// 데이터 조회
    	callTangoAjax(7);
    	
    } // setGrid3()

    // 검증의견, 검증완료일자 조회
    function searchOpinion(){
 		params.cstrCd = cstrCd;
 		params.lnVrfClCd = lnVrfClCd;

 		callTangoAjax(2);

    } // searchOpinion()

    function saveOpinion(){
 		params.cstrCd = cstrCd;
 		params.lnVrfClCd = lnVrfClCd;
 		params.cstrVrfRsltCd = $('.Radio').getValue();
 		params.vrfOponCtt = $('#OpR').val()
 		params.lastChgUserId = userId;

 		callTangoAjax(3);

    } // saveOpinion()

    function otdrTestMgmtSavePopup(otdrNo,otdrSrno){
    	parent.parent.$a.popup({
    		popid: 'OtdrTestMsmtSave' // 중복클릭방지 id 필요
            ,title : '시험측정표'
            ,url : '/tango-transmission-web/constructprocess/completion/OtdrTestMsmtSave.do'
           	,windowpopup: true
            ,width : 1200
            ,height : 800
            ,modal : false
            ,data : {'otdrNo':otdrNo,'otdrSrno':otdrSrno,'popHead':'Y'}
            ,callback : function(x){
            				if(x=="ok"){
            					location.reload(true);
            				}
            			}
        });

    } // otdrTestMgmtSavePopup()
    
    // 2022-08-17 이후 OTDR 측정 팝업
    function OtdrMsmtMgmtSavePopup(otdrNo, otdrSrno) {
    	parent.parent.$a.popup({
    		popid: 'OtdrMsmtMgmtSave'
    			,title : '시험측정표'
    			,url : '/tango-transmission-web/constructprocess/completion/OtdrMsmtMgmtSave.do'
    			,windowpopup: true
    			,width : 1200
    			,height : 800
    			,modal : false
    			,data : {'otdrNo':otdrNo,'otdrSrno':otdrSrno,'popHead':'Y'}
    			,callback : function(x){
    				if(x=="ok"){
    					location.reload(true);
    				}
    			}
    	});
    }

    // AJAX GET, POST, PUT
    function callTangoAjax(i){

    	var url = p[i].url;
    	if(i==4){
    		p[i].url = url+'/'+cstrCd
    	}else if(i==5||i==6){
    		p[i].url = url+'/'+ m.file.sno;
    	}else{
    		p[i].url = url;
    	}

    	params.skAfcoDivCd = skAfcoDivCd;
    	params.bpId = bpId;

    	if(i == 1){
    		p[i].data = params2;
    	}else if(i==5 || i==6){
    	}else if(i==7){
    		p[i].data = params2;
    	}else{
    		p[i].data = params;
    	}
    	     
    	if(i == 0){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } //
    	else if(i == 1){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } //
    	else if(i == 2){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } //
    	else if(i == 3){ tangoAjaxModel.post(p[i]).done(successFn).fail(failFn); } //
    	else if(i == 4){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } //
    	else if(i == 5){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFileDownFn);  } // 파일다운로드 조회
    	else if(i == 6){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } // 파일Data 조회
    	else if(i == 7){ tangoAjaxModel.get(p[i]).done(successFn).fail(failFn);  } // 광파워미터

    	p[i].url = url;

    } // callTangoAjax()

    function messageCallback(msgId, msgRst){
		switch (msgId) {
		case 'save_btn':
			if(msgRst == 'Y'){
	    		saveOpinion();
			}
			break;
		case "BpCommentChk":
			if(msgRst == "Y"){
				parent.location.reload(true);
			}
			break;
		}
	};    // messageCallback

});