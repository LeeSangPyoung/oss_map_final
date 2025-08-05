function SimulApp(pSvlnInfo,pConf){
	var conf = {
		//layerNmList : ["T_전송실","B_SKT중계기" ,"상호접속국사" ,"B_SKT기지국" ,"B_SO" ,"B_BcN중심국" ,"SKT기지국" ,"B_광가입자국" ,"분배국사" ,"T_국소" ,"B_국사" ,"TN_국사" ,"SKT중계기" ,"T_중심국_국사" ,"B_BCN가입자국"],
		layerNmList : ["T_전송실","T_중심국_국사","B_국사","B_SO","B_가상접속점","B_접속점_자가","B_접속점_타사","B_접속점_GE","B_FTTH_MA","B_휘더망","건물영역"],
		layerNm : "CUSTOM_MTSO_LAYER",
		mapId : "serviceLineSimulMap",
		tmofGridId : "tmofGridId",
		mtsoGridId : "mtsoGridId",
		svlnSchGridId : "svlnSchGridId",
		jrdtGridId : "jrdtGridId",
		trunkSchGridId : "trunkSchGridId",
		ringSchGridId : "ringSchGridId",
		ringUsedCnnBoxSchGridId : "ringUsedCnnBoxSchGridId",
		wdmTrunkSchGridId : "wdmTrunkSchGridId",
		eqpInfSchGridId : "eqpInfSchGridId",
		teamsPathGridId : "teamsPathGridId",
		tangoPathGridId : "tangoPathGridId",
		mapGridId : "mapGridId",
		layoutAreaId : "simulArea",
		layoutId : "simulLayout",
		layoutIncYn : true,		 
		mapInc : function(){
	    	var engineJsUrl = GLOBAL_GIS_ENGINE_IP + "/mapgeo/build/mapgeo.js";
	    	var engineCssUrl = GLOBAL_GIS_ENGINE_IP + "/mapgeo/build/mapgeo.min.css";
	    	var mapGeoJS = '<script type="text/javascript" src=' + engineJsUrl + '>';
	    	var mapGeoCSS = '<link rel="stylesheet" href=' + engineCssUrl + '>';
	    	$('head').append(mapGeoJS);
	    	$('head').append(mapGeoCSS);
		},
		mapHeaderYn : true
	};                                                                                                                           
	var conf = $.extend(conf,pConf);
	_app =  {
		  conf:conf
		, prop : {
			 isInit : false //화면 초기화 여부
			,caller : {  //caller 구별을 위한 전역 변수
			    tmof : "tmof"	 //전송실
			   ,mtso : "mtso"    //국사
			   ,svln : "svln"    //서비스회선
			   ,vtMtso : "vtMtso" //가상국사
			   ,jrdt : "jrdt"    //상하위 국사
			   ,trunk : "trunk"  //트렁크
			   ,ring : "ring"	 //링
			   ,wdmTrunk : "wdmTrunk" //wdm트렁크	   
			   ,eqpInf : "eqpInf" //장비
			   ,path : "path"     //선택그리드 (현재 사용x)
			   ,virtualPath : "virtualPath"  //가상 구간
			   ,virtualEqpInf : "virtualEqpInf" //가상장비
			   ,skbLastRing : "skbLastRing"   //skb 가입자망
			   ,skbVirtualRing : "skbVirtualRing" //skb가상 가입자망	   
			   ,mtsobyaddr : "pointbyaddr"   //주소로 특정국사검색
			   ,pathInfo : "pathInfo"     //선택그리드 (현재 사용x)
			   ,skbCnnBoxRing : "cnnBoxRing"  // skb 접속함체에 딸린 가입자망 링 검색
			   ,networkInfo : "networkInfo"  // 국사내 수용네트워크정보
			   ,uprMtsoOfVtulMtso : "uprMtsoOfVtulMtso"  // 소속가상국사 추가기능
			},tabIdx:{ //탭 순서
				diagram : 0,
				jrdt : 1,
				svln : 2,
				trunk : 3,
				ring : 4,
				wdmTrunk : 5,
				eqpInf : 6
			}, customLayerNm : {  //사용자 레이어 전역 변수
			    virtualMtso : "virtualMtsoLayer"  //임시 선택 국사 
			   ,virtualMtso2 : "virtualMtsoLayer2" //주소 검색 결과 용 국사
			   ,virtualPath : "virtualPathLayer"   //임시 선택 구간
			   ,jrdt : "jrdtLayer"    //관할 국사 (상위국,하위국) - 국사탭에서 사용 
			   ,path : "pathLayer"    //TeamsPath정보 레이어 - 국사탭 이외의 탭에서 사용
			}, lineStyleNm : {   //구간의 연결선 스타일
				  jrdt : "lineJrdtStyle"	
				, path : "linePathStyle"
				, pathVirtual : "linePathVirtualStyle"
				, trunk : "lineTrunkStyle"
				, ring : "lineRingStyle"
				, wdmTrunk : "lineWdmTrunkStyle"
				, virtualNetwork : "lineVirtualNetwork"
				, pathTemp : "linePathTempStyle"
				, eqpInf : "lineEqpInfStyle"
			}, pointStyleNm:{   //국사 스타일
				tmof : "T_전송실",
				mtso : "T_중심국_국사",
				tmofSkb : "B_국사",
				mtsoSkb : "B_SO",
			    boxSkb : "B_가상접속점",
			    bld : "건물영역"	
			}, filterFlag : []//키 입력시 그리드 필터 딜레이 추가
			,filterDelay : { tmof : 100, mtso : 1000,svln:500, trunk : 500, wdmTrunk : 500 , ring : 500, cnnBoxRing : 500}			
			,dfl : { dt:[{},{}]}
			,connBox:{ // "B_가상접속점","B_접속점_자가","B_접속점_타사","B_접속점_GE","B_FTTH_MA"
				 bFtthMa : {id : "B_FTTH_MA", name : "B_FTTH_MA"} 
			   , bCnptGe : {id : "B_CNPT_GE", name : "B_접속점_GE"} 
			   , bCnptSlf : {id : "B_CNPT_SLF", name : "B_접속점_자가"} 
			   , bCnptOhcpn : {id : "B_CNPT_OHCPN", name : "B_접속점_타사"} 
			   , bVtulCnpt : {id : "B_VTUL_CNPT", name : "B_가상접속점"} 
			   , bFdlk : {id : "B_FDLK", name : "B_휘더망"}
			}
		  }
	    , layer:{
	    	jrdt : { point:{}, line :{}},
	    	trunk : { point:{}, line :{}},
	    	eqpInf : { point:{}, line :{}}
	    }, data: {
	    	svlnInfo : pSvlnInfo, //화면 오픈 시 넘어온 서비스 회선 정보
	    	svcLnList : [],
	    	schMtso : {}, //검색한 국사 정보
	    	schRing : {}, //검색한 링 정보
	    	schSvln : {}, //검색한 서비스회선 정보
	    	selectPath : {}, //자동으로 선택된 구간
	    	realSelectPath : null, //실제로 선택한 구간 
	    	selectMtso : null,  //실제로 선택한 국사
	    	mgmtGrpCd : "", //회선의 관리그룹
	    	mapMtso : {},  //지도가 그려질때 국사 정보 데이터   
	    	mtsoAddr: {},  //국사의 주소 정보를 화면 내 공유(key:국사번호)
	    	cnnBox: {cnpt:true,fdlk:true}
	    }
		, map : null //지도
		, init : function(){ //화면 초기화
			if(_app.conf.mapHeaderYn == true){
				_app.conf.mapInc();
			};
			if(_app.conf.layoutIncYn == true){
				$("#"+_app.conf.layoutAreaId).css({"display":"inline"});
			};
			var interval = setInterval(function(){ 
		
				_app.initMap(function(){
					clearInterval(interval);
					//$('#btnEdit').show();

					_app.prop.isInit = true;
					_app.initGrid();
				    _app.initData();
				    _app.addEventListner();
			         $("div[id$=GridId]").each(function(){
			        	 $("#"+this.id).alopexGrid("updateOption",{width:null});
			         });
			         //_app.onOffCnnBox(true);
			         // 접속함체/ 휘더망 숨기기
			         _app.data.cnnBox.cnpt = false;  // 접속함체
			         _app.onOffCnnBox(_app.data.cnnBox.cnpt, "cnpt");
			         _app.data.cnnBox.fdlk = false;  // 휘더망
			         _app.onOffCnnBox(_app.data.cnnBox.fdlk, "fdlk");
			         
				});				
			} ,500);  
		}, initData : function(){  //기본 데이터 조회 (검색조건 등)
			//_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');//관리그룹
			createMgmtGrpSelectBox ("mgmtGrpCd", "A");
			
			//tabEqp
			var parm = {neRoleCd: "",partnerNeId:""};
			_app.httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getNeRoleInfList', parm, 'GET', 'neRoleInfList');// 장비타입(장비역할구분코드)
	        _app.httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'mdlList');//장비모델
	    	_app.httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'bpList');//제조사
			_app.httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/selectEqpBldCd', parm, 'GET', 'eqpBldCd');//장비 건물 코드
		}, initMap : function(pFunc){ //맵 초기화
			if(window.MapGeo == null || window.L != null){
				return false;
			}; 
		    var options = {
		       	app: 'tango',
		       	contextmenu: true,
		        // 초기 줌레벨과 위치
		        location: {zoom: 3, center: [36.5087805938127, 128.062289345605]}
		    };
		    /** 맵 생성 */
		    // 1. 'map' : 맵 생성을 위한 target div element의 id
		    // 2. 'BASEMAP' : 설비 없이 베이스 지도만 생성
		    // 3. 'BASEMAP' 대신 'TANGO-T'를 입력한 경우 설비 및 미리 정의된 옵션으로 맵 생성
		    MapGeo.create(_app.conf.mapId, 'TANGO-T', options).then(function (map) {
		    	_app.map = map;
		        var styles = [];
		        var styleList = _app.conf.layerNmList;
		        for(var i = 0 ; i < styleList.length;i++){
		        	var iconUrl = L.MG.ENV.APP_IMAGEPATH+"/res/symbols/"+styleList[i]+".png";
		        	var style = {
		                    id : _app.conf.layerNm+"_"+styleList[i],
		                    type : L.MG.StyleCfg.STYLE_TYPE.POINT,      //포인트 타입
		                    options : {
		                        markerType   : 'icon',
		                        iconUrl: iconUrl,  
		                        iconSize: [16, 16],  
		                        iconAnchor: [8, 8]  
		                    }
		                };
		        	styles.push(style);
		        	if($("span#layerIconUrl_"+i).size()>0){
		        		$("span#layerIconUrl_"+i).append($("<img/>").attr("src",iconUrl).css({"vertical-align":"bottom"}));
		        	};
		        };
		        style = [{ id : _app.prop.lineStyleNm.jrdt,
				           type : L.MG.StyleCfg.STYLE_TYPE.LINE,
				           options : { opacity: 1.0, color: '#FF8C00', weight: 5, dashArray: '10,0' }
		        		 },
		        		 { id : _app.prop.lineStyleNm.path,
			               type : L.MG.StyleCfg.STYLE_TYPE.LINE,
			               options : { opacity: 1.0, color: '#CC8C00', weight: 5, dashArray: '10,0' }
		        		 },
//		        		 { id : _app.prop.lineStyleNm.pathTemp,
//			        	   type : L.MG.StyleCfg.STYLE_TYPE.LINE,
//			        	   options : { opacity: 1.0, color: '#C666FF', weight: 5, dashArray: '10,20' }
//		        		 },
		        		 { id : _app.prop.lineStyleNm.pathTemp,
			        	   type : L.MG.StyleCfg.STYLE_TYPE.LINE,
			        	   options : { opacity: 1.0, color: '#FFFF00', weight: 4, dashArray: '10,0' }
		        		 },
		        		 { id : _app.prop.lineStyleNm.pathVirtual,
				           type : L.MG.StyleCfg.STYLE_TYPE.LINE,
				           options : { opacity: 1.0, color: '#CC0000', weight: 5, dashArray: '10,10' }
				         },
		        		 { id : _app.prop.lineStyleNm.eqpInf,
		        		   type : L.MG.StyleCfg.STYLE_TYPE.LINE,
		        		   options : { opacity: 1.0, color: '#CCCCFF', weight: 5, dashArray: '10,0' }
		        		 }, 
		        		 { id : _app.prop.lineStyleNm.trunk,
		        			 type : L.MG.StyleCfg.STYLE_TYPE.LINE,
		        			 options : { opacity: 1.0, color: '#A89824', weight: 5, dashArray: '10,0' }
		        		 },
		        		 { id : _app.prop.lineStyleNm.ring,
		        			 type : L.MG.StyleCfg.STYLE_TYPE.LINE,
		        			 options : { opacity: 1.0, color: '#FF7171', weight: 5, dashArray: '10,0' }
		        		 },
		        		 { id : _app.prop.lineStyleNm.wdmTrunk,
			               type : L.MG.StyleCfg.STYLE_TYPE.LINE,
			               options : { opacity: 1.0, color: '#3A8B3A', weight: 5, dashArray: '10,0' }
		        		 },
		        		 { id : _app.prop.lineStyleNm.virtualNetwork,
		        			 type : L.MG.StyleCfg.STYLE_TYPE.LINE,
		        			 options : { opacity: 1.0, color: '#AAAAAA', weight: 5, dashArray: '10,0' }
		        		 }
		        		];
		    	// 시스템에 사용할 스타일 설정
		    	L.MG.StyleCfg.setCustomStyles(styles.concat(style));
				
		        // 기본 우클릭 메뉴 구성
		    	_app.map.setDefaultContextMenu(_app.getDefaultMenuItems(_app.map));
		        //선택됬을때 이벤트
		    	_app.map.on('mg-selected-features', _app.onSelectedFeatures);
		        
				var layers = _app.map.getVectorLayers();
		    	_.each(layers, function(layer, index) { //탱고맵 기본 레이어 삭제
		    			layer.setVisible(false); 
		    			//console.log(layer.getLayerAliasName());
		    			//console.log(layer.getId());
		    	});
		    	pFunc();
		    });
		}, initGrid : function(){  // 그리드 초기화
			 $('#'+_app.conf.tmofGridId).alopexGrid({   //전송실 그리드
				columnMapping : [ 
				    {key : 'mtsoMgmtNo', align:'center', width:'280px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeManagementNumber'], hidden: true} //국사관리번호
   			      , {key : 'mtsoLatVal', align:'center', width:'280px', title : cflineMsgArray['latitude'], hidden: true} //위도
				  , {key : 'mtsoLngVal', align:'center', width:'280px', title : cflineMsgArray['longitude'], hidden: true} //경도
				  , {key : 'mgmtGrpCd', align:'center', width:'280px', title : cflineMsgArray['managementGroupCode'], hidden: true} //관리그룹ID
				  , {key : 'mgmtGrpNm', align:'center', width:'70px', title : cflineMsgArray['managementGroup']} //관리그룹 
				  , {key : 'mtsoId', align:'center', width:'100px', title : cflineMsgArray['transmissionOffice'], hidden: true} //전송실ID
				  , {key : 'topMtsoId', align:'center', width:'100px', title : cflineMsgArray['transmissionOffice'], hidden: true} //전송실ID
				  , {key : 'topMtsoNm', align:'left', width:'230px', title : (_app.data.svlnInfo.mgmtGrpCd == "0001" ? cflineMsgArray['transmissionOffice'] : cflineMsgArray['informationCenter']) } //전송실명
				  ,	{key : 'tmofBtnShow', width:'40px',render: {type: 'btnTmofShow'},title:cflineMsgArray['display'], hidden: true} /*표시*/
				  ,	{key : 'tmofBtnHide', width:'40px',render: {type: 'btnTmofHide'},title:cflineMsgArray['delete'], hidden: true} /*"삭제"*/
				  , {key : 'mtsoTypCd', align:'left', width:'50px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeFormName'], hidden: true}  /*"국사형태명"*/
				  , {key : 'modelNm', align:'left', width:'50px', title : cflineMsgArray['equipmentName'], hidden: true} /*"장비명"*/
				],
	        	autoColumnIndex: true,
	        	cellSelectable : true,
	        	rowClickSelect : true,
	        	rowInlineEdit : false,
	        	rowSingleSelect : true,
	            width: null,
	        	height : 400,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
				},scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
	            ,hideProgress : true
	            ,renderMapping : {
	     			"btnTmofShow" : {
	     				renderer : function(value, data, render, mapping) {
	     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnTmofShow" type="button"></button></div>';
	     	            }
	     			},
	     			"btnTmofHide" : {
	     				renderer : function(value, data, render, mapping) {
	     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_del_icon Valign-md" id="btnTmofHide" type="button"></button></div>';
	     	            }
	     			}
	     		} ,enableContextMenu:true
	    		,contextMenu : [{title: cflineMsgArray['addUprMtso']/*"상위국추가"*/, processor: function(data, $cell, grid) { data["jrdtMtsoTypCd"]="01"; _app.updateGrid(_app.prop.caller.jrdt,"dataAdd",data); }}
	    			   		   ,{title: cflineMsgArray['addLowMtso']/*"하위국추가"*/, processor: function(data, $cell, grid) { data["jrdtMtsoTypCd"]="02"; _app.updateGrid(_app.prop.caller.jrdt,"dataAdd",data); }}
	            	           //,{title: "경로추가", processor: function(data, $cell, grid) {   data["jrdtMtsoTypCd"]="03"; _app.updateGrid("dataAdd",data,_app.prop.caller.jrdt); }}
	            	          ],
			 });
			 $('#'+_app.conf.mtsoGridId).alopexGrid({   //국사 그리드
					columnMapping : [
						  {key : 'mtsoMgmtNo', align:'center', width:'280px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeManagementNumber'], hidden: true} //국사관리번호
						, {key : 'mtsoLatVal', align:'center', width:'280px', title : cflineMsgArray['latitude'], hidden: true} //위도
						, {key : 'mtsoLngVal', align:'center', width:'280px', title : cflineMsgArray['longitude'], hidden: true} //경도
	 				    , {key : 'mgmtGrpCd', align:'center', width:'280px', title : cflineMsgArray['managementGroup'], hidden: true} //관리그룹ID
	 				    , {key : 'mgmtGrpNm', align:'center', width:'70px', title : cflineMsgArray['managementGroup']} //관리그룹명 
						, {key : 'mtsoId', align:'center', width:'280px', title : cflineMsgArray['mtsoCode'], hidden: true} //국사코드
						, {key : 'mtsoNm', align:'left', width:'230px', title : cflineMsgArray['mtsoName']} //국사명
						, {key : 'mtsoBtnShow', width:'40px',render: {type: 'btnMtsoShow'},title:cflineMsgArray['display'], hidden: true} /*"표시"*/
						, {key : 'mtsoBtnHide', width:'40px',render: {type: 'btnMtsoHide'},title:cflineMsgArray['delete'], hidden: true} /*"삭제"*/
						, {key : 'mtsoTypCd', align:'left', width:'50px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeFormName'], hidden: true}  /*"국사형태명"*/
						, {key : 'modelNm', align:'left', width:'50px', title : cflineMsgArray['equipmentName'], hidden: true} /*"장비명"*/
					]
				    , autoColumnIndex: true
				    , cellSelectable : true
				    , rowClickSelect : true
				    , rowInlineEdit : false
				    , rowSingleSelect : true			 
			 		, width: "parent"
			 		, height : 400
					, message: {
						nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
						filterNodata : 'No data'
					} ,renderMapping : {
		     			"btnMtsoShow" : {
		     				renderer : function(value, data, render, mapping) {
		     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnMtsoShow" type="button"></button></div>';
		     	            }
		     			},
		     			"btnMtsoHide" : {
		     				renderer : function(value, data, render, mapping) {
		     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_del_icon Valign-md" id="btnMtsoHide" type="button"></button></div>';
		     	            }
		     			}
		     		},hideProgress : true
				    ,enableContextMenu:true
					,contextMenu : [{title: cflineMsgArray['addUprMtso']/*"상위국추가"*/, processor: function(data, $cell, grid) { data["jrdtMtsoTypCd"]="01"; _app.updateGrid(_app.prop.caller.jrdt,"dataAdd",data); }}
						   		   ,{title: cflineMsgArray['addLowMtso']/*"하위국추가"*/, processor: function(data, $cell, grid) { data["jrdtMtsoTypCd"]="02"; _app.updateGrid(_app.prop.caller.jrdt,"dataAdd",data); }}
						   		   //,{title: "경로추가", processor: function(data, $cell, grid) {   data["jrdtMtsoTypCd"]="03"; _app.updateGrid("dataAdd",data); }}
			       	          ]
		     		,rowOption:{
		     			inlineStyle: function(data,rowOption){			
		     					if(data['vtulMtsoYn']== "Y") return {color:'blue'}
		     			}
		     		}
				 });
			 	
			    $('#'+_app.conf.jrdtGridId).alopexGrid({   //관할국사 그리드
		         	columnMapping : [ 
	   					  {key : 'mtsoMgmtNo', align:'center', width:'280px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeManagementNumber'], hidden: true} //국사관리번호
	  					, {key : 'mtsoLatVal', align:'center', width:'280px', title : cflineMsgArray['latitude'], hidden: true} //위도
	  					, {key : 'mtsoLngVal', align:'center', width:'280px', title : cflineMsgArray['longitude'], hidden: true} //경도
	   				    , {key : 'mgmtGrpCd', align:'center', width:'280px', title : cflineMsgArray['managementGroup'], hidden: true} //관리그룹ID
	   				    , {key : 'btnDel', width:'40px',render: {type: 'btnDel'},title:cflineMsgArray['delete']/*"삭제"*/}
	  		    		//, {key : 'move', width:'30x', dragdropColumn : true}
	  		    		, {key : 'seq', width:'50px',align:'center',title:'순번', hidden: true}
	  		    		, {key : 'lineJrdtMtsoLnoSrno', align:'center', width:'90px', title : "관할국사순번",hidden : true} //관할국사순번 
	  		    		, {key : 'jrdtMtsoTypCd', align:'center', width:'90px', title : cflineMsgArray['jurisdictionMobileTelephoneSwitchingOfficeType']/*"관할국사유형"*/
	  		    			, render : {  type: 'string' , rule: function (value,data){
  				                	 return [{value:"01",text:cflineMsgArray['superStation']/*"상위국"*/},{value:"02",text:cflineMsgArray['subStation']/*"하위국"*/},{value:"03",text:cflineMsgArray['pathMtso']/*"Path경로"*/}];
			    			}}} //관할국사유형 
	   				    , {key : 'mgmtGrpNm', align:'center', width:'70px', title : cflineMsgArray['managementGroup']} //관리그룹명 
	   				    , {key : 'topMtsoId', align:'center', width:'250px', title : cflineMsgArray['transmissionOffice'], hidden: true} //전송실ID
	   				    , {key : 'topMtsoNm', align:'left', width:'190px', title : (_app.data.svlnInfo.mgmtGrpCd == "0001" ? cflineMsgArray['transmissionOffice'] : cflineMsgArray['informationCenter'])} //전송실명
	  					, {key : 'mtsoId', align:'center', width:'280px', title : cflineMsgArray['mtsoCode'], hidden: true} //국사코드
	  					, {key : 'mtsoNm', align:'left', width:'230px', title : cflineMsgArray['mtsoName']} //국사명
	  					, {key : 'mtsoTypCd', align:'left', width:'50px', title : cflineMsgArray['mobileTelephoneSwitchingOfficeFormName'], hidden: true}  /*"국사형태명"*/
	  					, {key : 'modelNm', align:'left', width:'50px', title :cflineMsgArray['equipmentName'], hidden: true} /*"장비명"*/
	  				], width: null
	  				, height : 229
	  				, rowSingleSelect : true
	  				, message: {
						nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
						filterNodata : 'No data'
					},scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
					,hideProgress : true
					,renderMapping : {
		     			"btnDel" : {
		     				renderer : function(value, data, render, mapping) {
		     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_del_icon Valign-md" id="btnDel" type="button"></button></div>';
		     	            }
		     			}
					}
		         });
			     var trunkOption = { //트렁크,wdm트렁크 그리드
			    		 			columnMapping : [ 
										    {key : 'ntwkLineNo', align:'center', width:'120px', title : cflineMsgArray['networkLineNumber']
										    ,tooltip : function(value, data, mapping) { return cflineMsgArray['networkLineNumber'] + " 더블클릭시 상세정보를 확인할 수 있습니다.";}
										    } //네트워크회선번호
						   			      , {key : 'ntwkLineNm', align:'left', width:'300px', title : cflineMsgArray['lnNm'] } //회선명
						   			      , {key : 'ntwkCapa', align:'left', width:'80px', title : cflineMsgArray['capacity']} /*"용량"*/
						   			      , {key : 'ntwkIdleRate', align:'center', width:'80px', title : cflineMsgArray['effectiveRatio'], hidden:false} //유휴율
						   			      ,	{key : 'ntwkLineBtnShow', width:'40px',render: {type: 'btnNtwkLineShow'},title:cflineMsgArray['display'], hidden: true} /*"표시"*/
						   			      ,	{key : 'ntwkLineBtnHide', width:'40px',render: {type: 'btnNtwkLineHide'},title:cflineMsgArray['delete'], hidden: true} /*"삭제"*/
						   			      , {key : 'uprMtsoId', align:'center', width:'100px', title : cflineMsgArray['upperMtsoId'], hidden:true} //상위국사ID
						                  , {key : 'uprMtsoNm', align:'left', width:'150px', title : cflineMsgArray['upperMtsoName']
						                	  , render : function(value, data) { 	
						      					if (value != data.uprTopMtsoNm) { return value + "("+data.uprTopMtsoNm+")";}					
						      					return value;
						      				}
						                  } //상위국사명
						                  , {key : 'uprMtsoLatVal', align:'center', width:'100px', title : "상위국사위도", hidden:true} //상위국사위도
						                  , {key : 'uprMtsoLngVal', align:'center', width:'100px', title : "상위국사경도", hidden:true} //상위국사경도
						                  , {key : 'lowMtsoId', align:'center', width:'100px', title : "하위국사ID", hidden:true} //하위국사ID
						                  , {key : 'lowMtsoNm', align:'left', width:'150px', title : cflineMsgArray['lowerMtsoName']
						                	  , render : function(value, data) { 	
							      					if (value != data.lowTopMtsoNm) { return value + "("+data.lowTopMtsoNm+")";}					
							      					return value;
							      				}
						                  } //하위국사명
						                  , {key : 'lowMtsoLatVal', align:'center', width:'100px', title : "하위국사위도", hidden:true} //하위국사위도
						                  , {key : 'lowMtsoLngVal', align:'center', width:'100px', title : "하위국사경도", hidden:true} //하위국사경도
						                  , {key : 'pathUprMtsoId', align:'center', width:'100px', title : "PATH상위국사ID", hidden:true} //PATH상위국사ID
						                  , {key : 'pathUprMtsoNm', align:'center', width:'230px', title : cflineMsgArray['pathUprMtsoNm'], hidden:true} //PATH상위국사명
						                  , {key : 'pathUprMtsoLatVal', align:'center', width:'100px', title : "PATH상위국사위도", hidden:true} //PATH상위국사위도
						                  , {key : 'pathUprMtsoLngVal', align:'center', width:'100px', title : "PATH상위국사경도", hidden:true} //PATH상위국사경도
						                  , {key : 'pathLowMtsoId', align:'center', width:'100px', title : "PATH하위국사ID", hidden:true} //PATH하위국사ID
						                  , {key : 'pathLowMtsoNm', align:'center', width:'230px', title : cflineMsgArray['pathLowMtsoNm'], hidden:true} //PATH하위국사명
						                  , {key : 'pathLowMtsoLatVal', align:'center', width:'100px', title : "PATH하위국사위도", hidden:true} //PATH하위국사위도
						                  , {key : 'pathLowMtsoLngVal', align:'center', width:'100px', title : "PATH하위국사경도", hidden:true} //PATH하위국사경도
										  , {key : 'mgmtGrpCd', align:'center', width:'100px', title : cflineMsgArray['managementGroupCode'], hidden: true} //관리그룹ID
										  , {key : 'mgmtGrpNm', align:'center', width:'100px', title : cflineMsgArray['managementGroup'], hidden:true} //관리그룹
										  , {key : 'uprNodeId', align:'center', width:'100px', title : "구간상위노드ID", hidden:true}
										  , {key : 'lowNodeId', align:'center', width:'100px', title : "구간하위노드ID", hidden:true}
										  , {key : 'ntwkCapaVal', align:'left', width:'70px', title : "네트워크용량",hidden:true}
										  , {key : 'ordNum', align:'left', width:'70px', title : "국사정렬순서",hidden:true}
										],
							        	autoColumnIndex: true,
							        	cellSelectable : true,
							        	rowClickSelect : true,
							        	rowInlineEdit : false,
							        	rowSingleSelect : true,
							            //width: 890,
							        	width: null,
							        	height : 434,
										message: {
											nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
											filterNodata : 'No data'
										},scroll: true
							            ,hideProgress : true
							            ,renderMapping : {
							     			"btnNtwkLineShow" : {
							     				renderer : function(value, data, render, mapping) {
							     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnNtwkLineShow" type="button"></button></div>';
							     	            }
							     			},
							     			"btnNtwkLineHide" : {
							     				renderer : function(value, data, render, mapping) {
							     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_del_icon Valign-md" id="btnNtwkLineHide" type="button"></button></div>';
							     	            }
							     			}
							     		},enableContextMenu:true
							    		,contextMenu : [{title: cflineMsgArray['addTrunk']/*"트렁크추가"*/, processor: function(data, $cell, grid) {_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(data,{insCaller:_app.prop.caller.trunk}));}}]
							     		,rowOption:{
							     			inlineStyle: function(data,rowOption){			
							     					if(data['ordNum'] == "1-1") return {color:'blue'}
							     					else if(data['overCapaValYn'] == 'N') return {color:'red'} // background:'orange',
							     			}
							     		}
									 }; 
				 $('#'+_app.conf.trunkSchGridId).alopexGrid(trunkOption);//트렁크 그리드
				 $('#'+_app.conf.wdmTrunkSchGridId).alopexGrid(//wdm트렁크 그리드    
						 $.extend({},trunkOption,{
							 	height:459,
							 	contextMenu : [{title: cflineMsgArray['addWdmTrunk']/*"WDM트렁크 추가"*/
							 				  , processor: function(data, $cell, grid) {_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(data,{insCaller:_app.prop.caller.wdmTrunk}));}
							 				   }]}));
				 $('#'+_app.conf.svlnSchGridId).alopexGrid({//서비스회선 그리드 
						 	autoColumnIndex: true,
				        	cellSelectable : true,
				        	rowClickSelect : true,
				        	rowInlineEdit : false,
				        	rowSingleSelect : true,
				            //width: 890,
				        	width: null,
				        	height : 434,
							message: {
								nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
								filterNodata : 'No data'
							},scroll: true
				            ,hideProgress : true
				            , columnMapping : [ 
											    {key : 'ntwkLineNo', align:'center', width:'100px', title : cflineMsgArray['serviceLineNumber']
											    ,tooltip : function(value, data, mapping) { return cflineMsgArray['serviceLineNumber'] + " 더블클릭시 상세정보를 확인할 수 있습니다.";}
											    } //서비스회선번호
											  , {key : 'srvcMgmtNo', align:'left', width:'100px', title : cflineMsgArray['serviceManagementNumber'] } //서비스회선관리번호
							   			      , {key : 'ntwkLineNm', align:'left', width:'230px', title : cflineMsgArray['lnNm'] } //회선명
							   			      , {key : 'ntwkCapa', align:'left', width:'70px', title : cflineMsgArray['capacity']} /*"용량"*/
							   			      ,	{key : 'ntwkLineBtnShow', width:'40px',render: {type: 'btnNtwkLineShow'},title:cflineMsgArray['display'], hidden: true} /*"표시"*/
							   			      ,	{key : 'ntwkLineBtnHide', width:'40px',render: {type: 'btnNtwkLineHide'},title:cflineMsgArray['delete'], hidden: true} /*"삭제"*/
							   			      , {key : 'uprMtsoId', align:'center', width:'100px', title : cflineMsgArray['upperMtsoId'], hidden:true} //상위국사ID
							                  , {key : 'uprMtsoNm', align:'left', width:'150px', title : cflineMsgArray['upperMtsoName']
							                	  , render : function(value, data) { 	
							      					if (value != data.uprTopMtsoNm) { return value + "("+data.uprTopMtsoNm+")";}					
							      					return value;
							      				}
							                  } //상위국사명
							                  , {key : 'uprMtsoLatVal', align:'center', width:'100px', title : "상위국사위도", hidden:true} //상위국사위도
							                  , {key : 'uprMtsoLngVal', align:'center', width:'100px', title : "상위국사경도", hidden:true} //상위국사경도
							                  , {key : 'lowMtsoId', align:'center', width:'100px', title : "하위국사ID", hidden:true} //하위국사ID
							                  , {key : 'lowMtsoNm', align:'left', width:'150px', title : cflineMsgArray['lowerMtsoName']
							                	  , render : function(value, data) { 	
								      					if (value != data.lowTopMtsoNm) { return value + "("+data.lowTopMtsoNm+")";}					
								      					return value;
								      				}
							                  } //하위국사명
							                  , {key : 'lowMtsoLatVal', align:'center', width:'100px', title : "하위국사위도", hidden:true} //하위국사위도
							                  , {key : 'lowMtsoLngVal', align:'center', width:'100px', title : "하위국사경도", hidden:true} //하위국사경도
							                  , {key : 'pathUprMtsoId', align:'center', width:'100px', title : "PATH상위국사ID", hidden:true} //PATH상위국사ID
							                  , {key : 'pathUprMtsoNm', align:'center', width:'230px', title : cflineMsgArray['pathUprMtsoNm'], hidden:true} //PATH상위국사명
							                  , {key : 'pathUprMtsoLatVal', align:'center', width:'100px', title : "PATH상위국사위도", hidden:true} //PATH상위국사위도
							                  , {key : 'pathUprMtsoLngVal', align:'center', width:'100px', title : "PATH상위국사경도", hidden:true} //PATH상위국사경도
							                  , {key : 'pathLowMtsoId', align:'center', width:'100px', title : "PATH하위국사ID", hidden:true} //PATH하위국사ID
							                  , {key : 'pathLowMtsoNm', align:'center', width:'230px', title : cflineMsgArray['pathLowMtsoNm'], hidden:true} //PATH하위국사명
							                  , {key : 'pathLowMtsoLatVal', align:'center', width:'100px', title : "PATH하위국사위도", hidden:true} //PATH하위국사위도
							                  , {key : 'pathLowMtsoLngVal', align:'center', width:'100px', title : "PATH하위국사경도", hidden:true} //PATH하위국사경도
											  , {key : 'mgmtGrpCd', align:'center', width:'100px', title : cflineMsgArray['managementGroupCode'], hidden: true} //관리그룹ID
											  , {key : 'mgmtGrpNm', align:'center', width:'100px', title : cflineMsgArray['managementGroup'], hidden:true} //관리그룹
											  , {key : 'uprNodeId', align:'center', width:'100px', title : "구간상위노드ID", hidden:true}
											  , {key : 'lowNodeId', align:'center', width:'100px', title : "구간하위노드ID", hidden:true}
											  , {key : 'ntwkCapaVal', align:'left', width:'70px', title : "네트워크용량",hidden:true}
											  , {key : 'ordNum', align:'left', width:'70px', title : "국사정렬순서",hidden:true}
											]
				            ,renderMapping : {
				     			"btnNtwkLineShow" : {
				     				renderer : function(value, data, render, mapping) {
				     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnNtwkLineShow" type="button"></button></div>';
				     	            }
				     			},
				     			"btnNtwkLineHide" : {
				     				renderer : function(value, data, render, mapping) {
				     				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_del_icon Valign-md" id="btnNtwkLineHide" type="button"></button></div>';
				     	            }
				     			}
				     		},enableContextMenu:true
				     		, contextMenu : [{title:"서비스회선 등록"
								            , processor: function(data, $cell, grid) {_app.cu.setSelectLinePath(data);}
				     						}]
				     		,rowOption:{
				     			inlineStyle: function(data,rowOption){			
				     					if(data['ordNum'] == "1-1") return {color:'blue'}
				     					else if(data['overCapaValYn'] == 'N') return {color:'red'} // background:'orange',
				     			}
				     		}
				 });
				 $('#'+_app.conf.wdmTrunkSchGridId).alopexGrid('hideCol', 'ntwkIdleRate');
				 //$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid('hideCol', 'ntwkIdleRate');
				 $('#'+_app.conf.ringSchGridId).alopexGrid({ //링 검색 그리드
					    autoColumnIndex: true,
			    		pager : true,
			    		width: null,
			    		height : 450,
						columnMapping : [ 
						    {key : 'ntwkLineNo', align:'center', width:'120px', title : cflineMsgArray['networkLineNumber']
						    ,tooltip : function(value, data, mapping) { return cflineMsgArray['networkLineNumber'] + " 더블클릭시 상세정보를 확인할 수 있습니다.";}
						    } //네트워크회선번호
		   			      , {key : 'ntwkLineNm', align:'left', width:'330px', title :  cflineMsgArray['ringName']} //링명
		   			      , {key : 'ntwkCapa', align:'left', width:'80px', title : cflineMsgArray['capacity']} // 용량
		   			      , {key : 'ntwkIdleRate', align:'center', width:'80px', title :  cflineMsgArray['effectiveRatio'] , hidden:true} //네트워크유휴율
		   			      , {key : 'uprMtsoId', align:'center', width:'100px', title : "상위국사ID", hidden:true} //상위국사ID
		                  , {key : 'uprMtsoNm', align:'left', width:'150px', title : cflineMsgArray['upperMtsoName'], hidden:false
		                	  , render : function(value, data) { 	
			      					if (value != data.uprTopMtsoNm) { return value + "("+data.uprTopMtsoNm+")";}					
			      					return value;  
		                	  }
		                  } //상위국사명
		                  , {key : 'uprMtsoLatVal', align:'center', width:'100px', title : "상위국사위도", hidden:true} //상위국사위도
		                  , {key : 'uprMtsoLngVal', align:'center', width:'100px', title : "상위국사경도", hidden:true} //상위국사경도
		                  , {key : 'lowMtsoId', align:'center', width:'100px', title : "하위국사ID", hidden:true} //하위국사ID
		                  , {key : 'lowMtsoNm', align:'left', width:'150px', title :cflineMsgArray['lowerMtsoName'], hidden:false
		                	  , render : function(value, data) { 	
			      					if (value != data.lowTopMtsoNm) { return value + "("+data.lowTopMtsoNm+")";}					
			      					return value;
		                	  }
		                    } //하위국사명
		                  , {key : 'lowMtsoLatVal', align:'center', width:'100px', title : "하위국사위도", hidden:true} //하위국사위도
		                  , {key : 'lowMtsoLngVal', align:'center', width:'100px', title : "하위국사경도", hidden:true} //하위국사경도
		                  , {key : 'pathUprMtsoId', align:'center', width:'100px', title : "PATH상위국사ID", hidden:true} //PATH상위국사ID
		                  , {key : 'pathUprMtsoNm', align:'left', width:'230px', title : cflineMsgArray['pathUprMtsoNm']} //PATH상위국사명
		                  , {key : 'pathUprMtsoLatVal', align:'center', width:'100px', title : "PATH상위국사위도", hidden:true} //PATH상위국사위도
		                  , {key : 'pathUprMtsoLngVal', align:'center', width:'100px', title : "PATH상위국사경도", hidden:true} //PATH상위국사경도
		                  , {key : 'pathLowMtsoId', align:'center', width:'100px', title : "PATH하위국사ID", hidden:true} //PATH하위국사ID
		                  , {key : 'pathLowMtsoNm', align:'left', width:'230px', title : cflineMsgArray['pathLowMtsoNm']} //PATH하위국사명
		                  , {key : 'pathLowMtsoLatVal', align:'center', width:'100px', title : "PATH하위국사위도", hidden:true} //PATH하위국사위도
		                  , {key : 'pathLowMtsoLngVal', align:'center', width:'100px', title : "PATH하위국사경도", hidden:true} //PATH하위국사경도
						  , {key : 'mgmtGrpCd', align:'center', width:'100px', title : cflineMsgArray['managementGroupCode'], hidden: true} //관리그룹ID
						  , {key : 'mgmtGrpNm', align:'center', width:'100px', title : cflineMsgArray['managementGroup'], hidden:true} //관리그룹 
						  , {key : 'ntwkLnoGrpSrno', align:'center', width:'100px', title : "선번그룹번호", hidden:true} //선번그룹번호 
						  , {key : 'ntwkCapaVal', align:'left', width:'70px', title : "네트워크용량",hidden:true}
						  , {key : 'ordNum', align:'left', width:'70px', title : "국사정렬순서",hidden:true}
						],
						message: {
							nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
							,filterNodata : 'No data'
						}			          
						,enableContextMenu:true
			    		,contextMenu : [{title: cflineMsgArray['addRing']/*"링추가"*/, processor: function(data, $cell, grid) { 
			    			_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(data,{insCaller:(_app.prop.caller.ring)}));}
      			    		//_app.data.selectPath.isUserRing=="Y"?_app.prop.caller.trunk: _app.prop.caller.ring 가입자망일 경우 트렁크형식 주석
			    		}]
						,rowOption:{
			     			inlineStyle: function(data,rowOption){					
			     					if(data['ordNum'] == "1-1" || data['ordNum'] == "2-1") return {color:'blue'}
			     					else if(data['overCapaValYn'] == 'N') return {color:'red'} // background:'orange',
			     			}
			     		}
					 });    
				 $('#'+_app.conf.eqpInfSchGridId).alopexGrid({ //장비 검색 그리드
		        	autoColumnIndex: true,
		    		pager : true,
		    		width: null,
		    		height : 509,
		    		columnMapping: [
		    		      {key : 'mgmtGrpCd', align:'center', width:'50px', title : cflineMsgArray['managementGroup'], hidden: true} //관리그룹ID
			    		, { key : 'orgNmL3', align:'center', title : cflineMsgArray['transmissionOffice']/*전송실*/, width: '105px'}
			    		, { key : 'orgNm', align:'center', title : cflineMsgArray['mobileTelephoneSwitchingOffice'] /*국사*/, width: '160px' }
			    		, { key : 'modelNm', align:'center', title : cflineMsgArray['equipmentModelName'] /*장비모델명*/, width: '110px' }
			    		, { key : 'eqpTid', align:'center', title : cflineMsgArray['equipmentTargetId'] /*장비 TID*/, width: '180px' }
			    		, { key : 'useCnt', align:'right', title : cflineMsgArray['portUse'] /*포트사용*/, width: '100px' }
			    		, { key : 'notUseCnt', align:'right', title : cflineMsgArray['portNotUse'] /*포트미사용*/, width: '100px' }
			    		, { key : 'neNm', align:'center', title : cflineMsgArray['equipmentName'] /*장비명*/, width: '180px' }
			    		, { key : 'neId', align:'center', title : cflineMsgArray['equipmentIdentification'] /*장비ID*/, width: '112px' }
			    		, { key : 'neRoleNm', align:'center', title : cflineMsgArray['korEquipmentType'] /*장비타입:장비역할명*/, width: '65px' }
			    		, { key : 'neRoleCd', align:'center', title : cflineMsgArray['equipmentRoleDivisionCode'] /*장비역할코드*/, width: '65px', hidden: true }
						, { key : 'jrdtTeamOrgNm', align:'center', title : cflineMsgArray['managementTeamName'] /*관리팀명*/, width: '65px' , hidden: true }
						, { key : 'opTeamOrgId', align:'center', title : cflineMsgArray['operationTeamOrganizationIdentification'] /*운용팀조직ID*/, width: '65px' , hidden: true }
						, { key : 'opTeamOrgNm', align:'center', title : cflineMsgArray['operationTeam']+cflineMsgArray['organizationName'] /*운용팀조직명*/, width: '65px' , hidden: true }
						, { key : 'orgIdL3', align:'center', title : cflineMsgArray['transmissionOfficeIdentification'] /*전송실ID*/, width: '65px' , hidden: true }
						, { key : 'orgId', align:'center', title : cflineMsgArray['installMobileTelephoneSwitchingOfficeIdentification'] /*설치국사ID*/, width: '65px' , hidden: true }
						, { key : 'modelLclCd', align:'center', title : cflineMsgArray['equipmentModelLargeClassificationCode'] /*장비모델대분류코드*/, width: '65px' , hidden: true }
						, { key : 'modelLclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['largeClassificationName'] /*장비모델대분류명*/, width: '65px' , hidden: true }
						, { key : 'modelMclCd', align:'center', title : cflineMsgArray['equipmentModelMiddleClassificationCode'] /*장비모델중분류코드*/, width: '65px' , hidden: true }
						, { key : 'modelMclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['middleClassificationName'] /*장비모델중분류명*/, width: '65px' , hidden: true }
						, { key : 'modelSclCd', align:'center', title : cflineMsgArray['equipmentModelSmallClassificationCode'] /*장비모델소분류코드*/, width: '65px' , hidden: true}
						, { key : 'modelSclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['smallClassificationName'] /*장비모델소분류명*/, width: '65px' , hidden: true }
						, { key : 'modelId', align:'center', title : cflineMsgArray['equipmentModelIdentification'] /*장비모델ID*/, width: '65px' , hidden: true }
						, { key : 'vendorId', align:'center', title : cflineMsgArray['vendorIdentification'] /*제조사ID*/, width: '65px' , hidden: true }
						, { key : 'vendorNm', align:'center', title : cflineMsgArray['vendorName'] /*제조사명*/, width: '65px' , hidden: true }
						, { key : 'neStatusCd', align:'center', title : cflineMsgArray['equipmentStatusCode'] /*장비상태코드*/, width: '65px' , hidden: true }
						, { key : 'neStatusNm', align:'center', title : cflineMsgArray['equipmentStatus']+cflineMsgArray['name'] /*장비상태명*/, width: '65px' , hidden: true }
						, { key : 'neDummy', align:'center', title : cflineMsgArray['dummy']+cflineMsgArray['equipment']+cflineMsgArray['yesOrNo'] /*더미장비여부*/, width: '65px', hidden: true}
						, { key : 'bldCd', align:'center', title : '건물아이디', width: '65px' , hidden: true }
						, { key : 'uprMtsoLatVal', align:'center', width:'100px', title : "전송실위도", hidden:true}
		                , { key : 'uprMtsoLngVal', align:'center', width:'100px', title : "전송실경도", hidden:true}
		                , { key : 'lowMtsoLatVal', align:'center', width:'100px', title : "국사위도", hidden:true}
		                , { key : 'lowMtsoLngVal', align:'center', width:'100px', title : "국사경도", hidden:true}		
		                , { key : 'schMtsoId',align:'center',width:'50px', title : "검색국사",hidden:true}
					],
					message: {
						nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
					},enableContextMenu:true
					,contextMenu : [{title: cflineMsgArray['addEquipment']/*"장비추가"*/, processor: function(data, $cell, grid) {_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(data,{insCaller:_app.prop.caller.eqpInf}));}}]
		        });
				 $('#'+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid({ //접속함체 사용하는 가입자망 링 검색 그리드
					    autoColumnIndex: true,
			    		pager : true,
			    		width: null,
			    		height : 500,
						columnMapping : [ 
						    {key : 'ntwkLineNo', align:'center', width:'120px', title : cflineMsgArray['networkLineNumber']} //네트워크회선번호
		   			      , {key : 'ntwkLineNm', align:'left', width:'230px', title : cflineMsgArray['ringName']} //링명
		   			      , {key : 'ntwkCapa', align:'left', width:'90px', title : cflineMsgArray['capacity']}  // 용량
		   			      , {key : 'gisFedRingNm', align:'left', width:'100px', title : cflineMsgArray['feederRingNm']/*"휘더망링명"*/}
		   			      , {key : 'gisFedRingMgmtNo', align:'left', width:'70px', title : cflineMsgArray['feederRingId']/*"휘더망링 번호"*/, hidden:true}
		   			      , {key : 'ntwkIdleRate', align:'center', width:'70px', title : "네트워크\n유휴율" , hidden:true} //네트워크유휴율
		   			      , {key : 'uprMtsoId', align:'center', width:'100px', title : "상위국사ID", hidden:true} //상위국사ID
		                  , {key : 'uprMtsoNm', align:'center', width:'230px', title : cflineMsgArray['upperMtsoName'], hidden:false} //상위국사명
		                  , {key : 'uprMtsoLatVal', align:'center', width:'100px', title : "상위국사위도", hidden:true} //상위국사위도
		                  , {key : 'uprMtsoLngVal', align:'center', width:'100px', title : "상위국사경도", hidden:true} //상위국사경도
		                  , {key : 'lowMtsoId', align:'center', width:'100px', title : "하위국사ID", hidden:true} //하위국사ID
		                  , {key : 'lowMtsoNm', align:'center', width:'230px', title : cflineMsgArray['lowerMtsoName'], hidden:false} //하위국사명
		                  , {key : 'lowMtsoLatVal', align:'center', width:'100px', title : "하위국사위도", hidden:true} //하위국사위도
		                  , {key : 'lowMtsoLngVal', align:'center', width:'100px', title : "하위국사경도", hidden:true} //하위국사경도
		                  , {key : 'pathUprMtsoId', align:'center', width:'100px', title : "PATH상위국사ID", hidden:true} //PATH상위국사ID
		                  , {key : 'pathUprMtsoNm', align:'center', width:'230px', title : cflineMsgArray['pathUprMtsoNm']} //PATH상위국사명
		                  , {key : 'pathUprMtsoLatVal', align:'center', width:'100px', title : "PATH상위국사위도", hidden:true} //PATH상위국사위도
		                  , {key : 'pathUprMtsoLngVal', align:'center', width:'100px', title : "PATH상위국사경도", hidden:true} //PATH상위국사경도
		                  , {key : 'pathLowMtsoId', align:'center', width:'100px', title : "PATH하위국사ID", hidden:true} //PATH하위국사ID
		                  , {key : 'pathLowMtsoNm', align:'center', width:'230px', title :  cflineMsgArray['pathLowMtsoNm']} //PATH하위국사명
		                  , {key : 'pathLowMtsoLatVal', align:'center', width:'100px', title : "PATH하위국사위도", hidden:true} //PATH하위국사위도
		                  , {key : 'pathLowMtsoLngVal', align:'center', width:'100px', title : "PATH하위국사경도", hidden:true} //PATH하위국사경도
						  , {key : 'mgmtGrpCd', align:'center', width:'100px', title : cflineMsgArray['managementGroupCode'], hidden: true} //관리그룹ID
						  , {key : 'mgmtGrpNm', align:'center', width:'100px', title : cflineMsgArray['managementGroup'], hidden:true} //관리그룹 
						  , {key : 'ntwkLnoGrpSrno', align:'center', width:'100px', title : "선번그룹번호", hidden:true} //선번그룹번호 
						  , {key : 'ntwkCapaVal', align:'left', width:'70px', title : "네트워크용량",hidden:true}
						  , {key : 'ordNum', align:'left', width:'70px', title : "국사정렬순서",hidden:true}
						],
						message: {
							nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
							,filterNodata : 'No data'
						}			          
						,enableContextMenu:true
			    		,contextMenu : [{title: cflineMsgArray['addUserNetworkRing']/*"가입자망 추가"*/, processor: function(data, $cell, grid) { 
			    			_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(data,{insCaller:(_app.prop.caller.skbCnnBoxRing)}));}
			    		}]
						,rowOption:{
			     			inlineStyle: function(data,rowOption){							     		
			     					if(data['overCapaValYn'] == 'N') return {color:'red'} // background:'orange',
			     			}
			     		}
					 });   
				 $('#'+_app.conf.teamsPathGridId).alopexGrid({   //teamsPathGrid 그리드
						columnMapping : [ 
		                 	{ key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
									if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) { return data._index.id; } 
									else if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) { return data['WDM_TRUNK_ID']; } 
									else if(data['TRUNK_ID'] == null && data['RING_ID'] != null) { return data['RING_ID']; } 
									else if(data['TRUNK_ID'] != null) { return data['TRUNK_ID']; } }
							}
							, { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '140px' , inlineStyle: trunkStyleCss , rowspan : {by : 'TRUNK_MERGE'} }
							, { key : 'RING_MERGE', hidden : true, value : function(value, data) {
										if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) { return data._index.id;} 
										else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {return data['WDM_TRUNK_ID'];} 
										else if(data['RING_ID'] != null) {return data['RING_ID']; } }
							  }
							, { key : 'RING_NM', title : cflineMsgArray['ringName'], align : 'left', width : '120px' , inlineStyle: ringStyleCss , rowspan : {by : 'RING_MERGE'} }
							, { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) { return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; } }
							, { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px' , inlineStyle: wdmStyleCss , rowspan : {by : 'WDM_TRUNK_MERGE'} }
							, { key : 'NE_NM', 						title : '장비명', align : 'left', width : '170px', tooltip : tooltipText }
							, { key : 'A_PORT_DESCR', 				title : 'A포트', align : 'left', width : '140px', tooltip : tooltipText }
							, { key : 'A_CHANNEL_DESCR', 			title : 'A채널', align : 'left', width : '90px' , hidden:true}
							, { key : 'B_PORT_DESCR', 				title : 'B포트', align : 'left', width : '140px', tooltip : tooltipText }
							, { key : 'B_CHANNEL_DESCR', 			title : 'B채널', align : 'left', width : '90px' , hidden:true}
						],
			        	autoColumnIndex: true,
			    		autoResize: true,
			        	height : 400,
						message: {
							nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
							filterNodata : 'No data'
						},scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			            ,hideProgress : true
					 });				 
				 $('#'+_app.conf.tangoPathGridId).alopexGrid({   //tangoPathGrid 그리드
					 columnMapping : [ 
		                  { key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
		                	  if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) { return data._index.id; } 
		                	  else if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) { return data['WDM_TRUNK_ID']; } 
		                	  else if(data['TRUNK_ID'] == null && data['RING_ID'] != null) { return data['RING_ID']; } 
		                	  else if(data['TRUNK_ID'] != null) { return data['TRUNK_ID']; } }
		                  }
		                  , { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '140px' , inlineStyle: trunkStyleCss , rowspan : {by : 'TRUNK_MERGE'} }
		                  , { key : 'RING_MERGE', hidden : true, value : function(value, data) {
		                	  if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) { return data._index.id;} 
		                	  else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {return data['WDM_TRUNK_ID'];} 
		                	  else if(data['RING_ID'] != null) {return data['RING_ID']; } }
		                  }
		                  , { key : 'RING_NM', title : cflineMsgArray['ringName'], align : 'left', width : '120px' , inlineStyle: ringStyleCss , rowspan : {by : 'RING_MERGE'} }
		                  , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) { return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; } }
		                  , { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px' , inlineStyle: wdmStyleCss , rowspan : {by : 'WDM_TRUNK_MERGE'} }
			          	  ,	{ key : 'LEFT_ORG_NM', 						title : cflineMsgArray['westMtso'], align : 'center', width : '98px'} /* A 국사 */
		        		  , { key : 'LEFT_NODE_ROLE_NM', 				title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
		        		  , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '130px', tooltip : tooltipText } /* A장 비 */
		        		  , { key : 'LEFT_PORT_DESCR', 				title : cflineMsgArray['westPort'], align : 'left', width : '80px', tooltip : tooltipText } /* A 포트  */
		        		  , { key : 'LEFT_CHANNEL_DESCR', 			title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
		        		  , { key : 'LEFT_IS_CHANNEL_T1',		title : cflineMsgArray['t1'], align : 'center', width : '45px', render : getCheckBoxColumn}
		      			  , { key : 'RIGHT_ORG_NM', 					title : cflineMsgArray['eastMtso'], align : 'center', width : '98px'} /* A 국사 */
		    			  , { key : 'RIGHT_NODE_ROLE_NM', 			title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
		    			  , { key : 'RIGHT_NE_NM', 					title : cflineMsgArray['eastEqp'], align : 'left', width : '130px', tooltip : tooltipText } /* A장 비 */
		    			  , { key : 'RIGHT_PORT_DESCR', 				title : cflineMsgArray['eastPort'], align : 'left', width : '80px', tooltip : tooltipText } /* A 포트  */
		    			  , { key : 'RIGHT_CHANNEL_DESCR', 			title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
		    			  , { key : 'RIGHT_IS_CHANNEL_T1',	title : cflineMsgArray['t1'], align : 'center', width : '45px' , render: getCheckBoxColumn}
		    			  ],
		                  autoColumnIndex: true,
		                  autoResize: true,
		                  height : 400,
		                  message: {
		                	  nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
		                	  filterNodata : 'No data'
		                  },scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		                  ,hideProgress : true
				 });				 
	         _app.searchList(_app.prop.caller.tmof);
		}, addEventListner : function(){ // 이벤트 초기화
			$("#btnExportExcelTangoPath").on("click",function(e){
				if(!_app.tpu.isInit){
					alertBox("A","엑셀 다운로드 할 데이터가 없습니다.");
				};
				var teamsPathData = _app.tpu.teamsPath.toData(); 
				var tangoPathData = _app.tpu.teamsPath.toTangoPath().toData();
				
				$('#'+_app.conf.teamsPathGridId).alopexGrid('dataSet', teamsPathData.NODES);
				$('#'+_app.conf.tangoPathGridId).alopexGrid('dataSet', tangoPathData.LINKS);
				var date = getCurrDate();
				
				var excelNmInfo = '서비스회선시뮬레이션_' + date;
				
				var worker = new ExcelWorker({
	        		excelFileName: excelNmInfo
	        		, palette : [{
	        			className: 'B_YELLOW',
	        			backgroundColor: '255,255,0'
	        		},{
	        			className: 'F_RED',
	        			color: '#FF0000'
	        		}],
	        		sheetList: [
	        		            { sheetName: "노드선번" ,$grid: $('#'+_app.conf.teamsPathGridId) }
	        		           ,{ sheetName: "구간선번" ,$grid: $('#'+_app.conf.tangoPathGridId) }
	        		           ]
	        	});
	        	worker.export({
	        		merge: true,
	        		exportHidden: false,
	        		filtered  : false,
	        		selected: false,
	        		useGridColumnWidth : true,
	        		border  : true
	        		,exportGroupSummary:true
	        		, exportFooter:true
	        	});
				
			});
			
			// 인쇄
			$('#btnPrint').on('click', function(e) {
				popupWindow = window.open("", "_blank","width=1600,height=850");
				$a.block(self);
				popupWindow.onunload = function(){
					$a.unblock();
				}
				$(popupWindow.document.head).html($("<style/>").attr({type:"text/css"}).html("@page {size:landscape;}"));
				// 지도
				var capture = new L.MG.Capture(_app.map);
				// Diagram
				var $visualDiv = visualLinePath.makeImage(
						{
							scale: 1
							, maxSize: new go.Size(Infinity, Infinity)
							, type: 'image/png'
						}
				);
				
				if($("#simulMapArea").css("display")=="none"){
					$(popupWindow.document.body).html(
							// 타이틀
							$("<div/>").html($("#svlInfoPop").text()).get(0).outerHTML +   
							// 내용
							$("<div style='float:left;width:100%;margin-left:50px'/>").html($($visualDiv)).get(0).outerHTML
							//$($visualDiv).css({width:"90%","vertical-align":"top","margin-left":"50px"})
					);
					setTimeout(function(){
						popupWindow.print();
						popupWindow.close();
					},500);
				} else {
				    capture.print().then(function () {
						var bl = capture._canvas.toDataURL();	
						$(popupWindow.document.body).html(
							// 타이틀
							$("<div/>").html($("#svlInfoPop").text()).get(0).outerHTML +   
							// 내용
							$("<div/>").css({float:"left",width:"50%"}).html($($visualDiv)).get(0).outerHTML //.css({width:"98%"})
						  + $("<div/>").css({float:"right",width:"50%"}).html(
									$("<img/>").attr("src",bl).css({width:"98%"}).get(0).outerHTML
							   ).get(0).outerHTML
					    );
						setTimeout(function(){
							var img1 = $(popupWindow.document.body).find("img:first");
							if(img1.width()>750)img1.width("98%");
							popupWindow.print();
							popupWindow.close();
						},500);
					});
				};
			});
			//공통화면 event
	    	$('#btnEdit').on('click', function(e) {
	     		 _app.setEditMode(true);
	         }); 
	    	$('#btnSave').on('click', function(e) {
	    		//_app.doSaveJrdtMtso();
	    		_app.doSave();
	        }); 
	    	$('#btnAddrSch').on('click', function(e) { //주소검색창 호출 함수
	    		searchAddress();
	    	});
	    	$("#btnMap").on("click",function(e){
	    		var mapArea = $("#simulMapArea");
	    		var jrdtTabs = $("#jrdtTabs");
	    		if(mapArea.css("display")=="none"){
	    			jrdtTabs.css({"width":"930px"});
	    			mapArea.show({direction:"left"});
	    			this.innerHTML = cflineMsgArray['hideMap']/*"지도 숨기기"*/;
	    		}else{
	    			jrdtTabs.css({"width":"1620px"});
	    			mapArea.hide({direction:"right"});
	    			this.innerHTML = cflineMsgArray['showMap']/*"지도 표시"*/;
	    		}
	    		_app.cu.resetGrid($('#jrdtTabs').getCurrentTabIndex());
	    	});
			//tabJrdt event start
	    	//전송실그리드 표시,삭제,하위국사 조회 이벤트
			 $('#'+_app.conf.tmofGridId)   
			     .on('click', '.bodycell', function(e){ _app.showMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data,true); })
			 //.on('click', '#btnTmofShow', function(e){ _app.showMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data,true); })
			 //.on('click', '#btnTmofHide', function(e){ _app.hideMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data); })
		     .on('click', '[data-alopexgrid-key=topMtsoNm]', function(e) {
		    	 _app.searchList(_app.prop.caller.mtso);}
		     );
			 
			//국사그리드 표시,삭제 이벤트
			 $('#'+_app.conf.mtsoGridId)   
			     .on('click', '.bodycell', function(e){ _app.showMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data,true); })
			 //.on('click', '#btnMtsoShow', function(e){ _app.showMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data,true); })
			 //.on('click', '#btnMtsoHide', function(e){ _app.hideMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data); })
			 .on('scrollBottom', function(e){ _app.searchList(_app.prop.caller.mtso, $.extend(_app.data.schMtso,{division:"scroll"})); });
			
			 //관할국사그리드 삭제 이벤트
			 $('#'+_app.conf.jrdtGridId)  
			 .on('click', '.bodycell', function(e){ _app.showMtso(_app.prop.customLayerNm.virtualMtso,AlopexGrid.parseEvent(e).data,true); })
			 .on('click', '#btnDel', function(e){ _app.updateGrid(_app.prop.caller.jrdt,"dataDelete",AlopexGrid.parseEvent(e).data); })
			 .on('rowDragDropEnd', function(e){
				 var dataList = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
				 $.each(dataList, function(idx, obj){
						$('#'+_app.conf.jrdtGridId).alopexGrid('cellEdit', idx+1, {_index: {row:obj._index.row}}, 'seq');   // 화면표시순서   
		  				$('#'+_app.conf.jrdtGridId).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'seq');
				 });
				 _app.updateGridSort(_app.prop.caller.jrdt); 
			 })
			 
			 //관리그룹 변경시 필터 이벤트
			 $("#tabJrdt #mgmtGrpCd").on("change",function(){    
				 _app.filterGridData(_app.prop.caller.tmof);
				 //_app.filterGridData(_app.prop.caller.mtso);
				 $('#'+_app.conf.mtsoGridId).alopexGrid("dataEmpty");
				 //_app.data.schMtso = null;
			 });
			 
			//국사명 키 입력시 이벤트
			 $("#tabJrdt #mtsoNm").on("keyup",function(e){    
				 //_app.filterGridData(_app.prop.caller.mtso); 필터 삭제
				 if(e.keyCode == "13"){
					 $("#btnSchMtso").trigger("click");		 
				 };
			 });
			 
			 // 국사조회
			 $("#btnSchMtso").on("click",function(){
				 _app.searchList(_app.prop.caller.mtso,$.extend(_app.data.schMtso,{division:""}));
			 });
			 
			 // 국사주소
			 $("#btnInitAddr").on("click",function(){ //주소 삭제 버튼 클릭 이벤트
				 $('#popAllAddr').val("");
				 _app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);
				 
				 // 주소검색결과의 검색조건 초기화
				 //_app.data.schMtso = {};
				 _app.data.schMtso = null;
				 $('#mtsoNm').val("");
				 
				 
				 // 국사선택 팝업에서 주소 삭제버튼 클릭시만 전송실 재검색
				 if ($("#jrdtTabs").getCurrentTabIndex() == _app.prop.tabIdx.jrdt) {
					 _app.searchList(_app.prop.caller.tmof); 
					 _app.map.setZoom(3);
					 $('#'+_app.conf.mtsoGridId).alopexGrid("dataEmpty");
				 }
				 
				 _app.tpu.isExistsTempVtualMtso = false;
			 });
			//tabJrdt event end		
			 
			 //tabSvln event start
			 // 서비스회선탭 
	    	 $('#'+_app.conf.svlnSchGridId)   //서비스회선 검색 그리드 이벤트
			 .on('dblclick', '[data-alopexgrid-key=ntwkLineNo]', function(e) { 
    			 var dataObj = AlopexGrid.parseEvent(e).data;
    			 var gridId = _app.conf.svlnSchGridId;
				 // 시각화 임시 주석
				var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoDiagramPop.do';
				var width = 1400;
				var height = 940;
				
				var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
				if (lineLnoGrpSrno == undefined){
					lineLnoGrpSrno =null;
				}
				var openParam = {
						  "gridId":gridId
						, "ntwkLineNo":dataObj.ntwkLineNo
						,"svlnLclCd":dataObj.svlnLclCd
						,"svlnSclCd":dataObj.svlnSclCd
						,"sFlag":"N"
						, "ntwkLnoGrpSrno": lineLnoGrpSrno
						, "mgmtGrpCd":dataObj.mgmtGrpCd
						, "callFromTyp" : "SIM"	
				};
				
				$a.popup({
					  popid: "ServiceLineDiagramPop"
					, title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/
				    , url: url
					, data: openParam
					, iframe: true, modal : false, movable:true, windowpopup : true
					, width : width, height : height
					, callback:function(data){
						if(data != null){
							//alert(data);
						}
					}
				});				
			  })
			  
			  // 20171228 그리드 클릭시 선번정보에 있는 링크정보를 지도에 임시적으로 표시
	    	  //.on('click', '.bodycell', function(e) { _app.showMtso(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data); })
			  .on('click', '.bodycell', function(e) { _app.tempLinkOnMap(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data, _app.prop.caller.svln); })
	    	  
			  .on('scrollBottom', function(e){ _app.searchList(_app.prop.caller.svln, $.extend(_app.data.schSvln,{division:"scroll"})); });
			 $("#btnSearchSvln").on("click",function(){
				 _app.searchList(_app.prop.caller.svln,$.extend(_app.data.schSvln,{division:""}));
			 });	    	 
			 //tabSvln event end
			 
			//tabTrunk event start
			 // 트렁크 탭
			 $('#'+_app.conf.trunkSchGridId)   //트렁크 검색 그리드 이벤트
			 .on('dblclick', '[data-alopexgrid-key=ntwkLineNo]', function(e) { 
			     var data = AlopexGrid.parseEvent(e).data;
				 _app.tpu.updateNode("showDetailData",
						 {nodeData:{Trunk:{NETWORK_ID:data.ntwkLineNo,PATH_SAME_NO:data.ntwkLnoGrpSrno,TOPOLOGY_LARGE_CD:data.topoLclCd,TOPOLOGY_SMALL_CD:data.topoSclCd,TOPOLOGY_CFG_MEANS_CD:data.topoCfgMeansCd}}});
			  })
 		     
			 // 20171228 그리드 클릭시 선번정보에 있는 링크정보를 지도에 임시적으로 표시
			 //.on('click', '.bodycell', function(e) { _app.showMtso(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data); });
			 .on('click', '.bodycell', function(e) { _app.tempLinkOnMap(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data, _app.prop.caller.trunk); })
			 
			 // 네트워크번호, 회선명, 유효율, 용량 조회쿼리를 통해 재조회
			 /*$("#tabTrunk").find("#ntwkLineNo,#ntwkLineNm,#ntwkCapa,#ntwkIdleRate").on("keyup",function(){ //네트워크회선번호,네트워크회선명,용량,유효율 입력시 필터 이벤트
				 _app.filterGridData(_app.prop.caller.trunk);
			 });*/
			 
			 // 우선순위변경시 이벤트 발생하지 않고 조회후 처리하도록 수정
			 /*$("#tabTrunk").find("#ordType,#ordValue").on("change",function(){
				 _app.updateGridSort(_app.prop.caller.trunk);
			 });*/
			 $('#tabTrunk #btnSearchPop').on('click', function(e){// 조회

				 // 네트워크 임시 표시선 삭제
				 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
				 
				 _app.searchList(_app.prop.caller.trunk,_app.data.selectPath);
			 });
			//tabTrunk event end

			 //tabRing event start
			 // 링
			 
			 // 각 조회조건 조회쿼리를 통해 처리되도록 수정
	    	 /*$("#tabRing").find("#ntwkLineNo,#ntwkLineNm,#ntwkCapa,#ntwkIdleRate").on("keyup",function(){ //네트워크회선번호,네트워크회선명 입력시 필터 이벤트
	    		 if ($('#'+_app.conf.ringUsedCnnBoxSchGridId).css("display") != "none") {
	    			 _app.filterGridData(_app.prop.caller.skbCnnBoxRing);
	    		 } else {
	    			 _app.filterGridData(_app.prop.caller.ring);
	    		 } 
			 });
			 $("#tabRing").find("#ordType,#ordValue").on("change",function(){
				 if ($('#'+_app.conf.ringUsedCnnBoxSchGridId).css("display") != "none") {
					 _app.updateGridSort(_app.prop.caller.skbCnnBoxRing);
				 } else {
					 _app.updateGridSort(_app.prop.caller.ring);
				 }
			 });*/	 
			 
			 
	    	 $('#'+_app.conf.ringSchGridId)   //링 검색 그리드 이벤트
			 .on('dblclick', '[data-alopexgrid-key=ntwkLineNo]', function(e) { 
			     var data = AlopexGrid.parseEvent(e).data;
				 _app.tpu.updateNode("showDetailData",
						 {nodeData:{Ring:{NETWORK_ID:data.ntwkLineNo,PATH_SAME_NO:data.ntwkLnoGrpSrno,TOPOLOGY_LARGE_CD:data.topoLclCd,TOPOLOGY_SMALL_CD:data.topoSclCd,TOPOLOGY_CFG_MEANS_CD:data.topoCfgMeansCd}}});
			  })	    	 
	    	  
			  // 20171228 그리드 클릭시 선번정보에 있는 링크정보를 지도에 임시적으로 표시
			  //.on('click', '.bodycell', function(e) { _app.showMtso(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data); })
			  .on('click', '.bodycell', function(e) { _app.tempLinkOnMap(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data, _app.prop.caller.ring); })
			  
	    	  .on('scrollBottom', function(e){ _app.searchList(_app.prop.caller.ring, $.extend(_app.data.schRing,{division:"scroll"})); });
			 $("#btnSearchRing").on("click",function(){
				 _app.searchList(_app.prop.caller.ring,$.extend(_app.data.schRing,{division:""}));
			 });	    	 
			 //tabRing event end
	    	 
	    	 //tabWdmTrunk event start
			 // WDM 트렁크 탭
			 $('#'+_app.conf.wdmTrunkSchGridId)   //트렁크 검색 그리드 이벤트
			 .on('dblclick', '[data-alopexgrid-key=ntwkLineNo]', function(e) { 
			     var data = AlopexGrid.parseEvent(e).data;
				 _app.tpu.updateNode("showDetailData",
						 {nodeData:{WdmTrunk:{NETWORK_ID:data.ntwkLineNo,PATH_SAME_NO:data.ntwkLnoGrpSrno,TOPOLOGY_LARGE_CD:data.topoLclCd,TOPOLOGY_SMALL_CD:data.topoSclCd,TOPOLOGY_CFG_MEANS_CD:data.topoCfgMeansCd}}});
			  })			 
 		     
			  // 20171228 그리드 클릭시 선번정보에 있는 링크정보를 지도에 임시적으로 표시
			  //.on('click', '.bodycell', function(e) { _app.showMtso(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data); });
			  .on('click', '.bodycell', function(e) { _app.tempLinkOnMap(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data, _app.prop.caller.wdmTrunk); })
			 
			 // 조회조건변경시 이벤트 처리하지 않음...조회쿼리에서 처리하도록 수정
			 /*$("#tabWdmTrunk").find("#ntwkLineNo,#ntwkLineNm,#ntwkCapa,#ntwkIdleRate").on("keyup",function(){ //네트워크회선번호,네트워크회선명,용량,유효율 입력시 필터 이벤트
				 _app.filterGridData(_app.prop.caller.wdmTrunk);
			 });
			 $("#tabWdmTrunk").find("#ordType,#ordValue").on("change",function(){
				 _app.updateGridSort(_app.prop.caller.wdmTrunk);
			 });*/
			 $('#tabWdmTrunk #btnSearchPop').on('click', function(e){// 조회
				 _app.searchList(_app.prop.caller.wdmTrunk,_app.data.selectPath);
			 });
			//tabWdmTrunk event end
			 //tabEqp event start
			 $('#tabEqp #btnSearchPop').on('click', function(e){// 조회
				 _app.searchList(_app.prop.caller.eqpInf, {division:"search"});
			 });
	    	 $('#'+_app.conf.eqpInfSchGridId).on('scrollBottom', function(e){// 스크롤
	    		 _app.searchList(_app.prop.caller.eqpInf, {division:"scroll"});
	    	 });
			 //tabEqp event end
	    	 //공통 이벤트 설정 start
			if(_app.data.svlnInfo.mgmtGrpCd != "0002"){ //skb가 아닐겨우 wdm트렁크 탭삭제
				
				$('#jrdtTabs').removeTab(_app.prop.tabIdx.wdmTrunk);
				_app.prop.tabIdx.eqpInf--;
				
				$('.wdmTrunkTd').hide();
			};
			 //상위국 하위국 검색 버튼 클릭시 이벤트
			$('button[id$=MtsoSch]').on("click", function(e) {
				_app.cu.openMtsoDataPop(e);
			});	

			$("#jrdtTabs").on("beforetabchange", function(e,index) {
				if(_app.tpu.isInit != true && index != _app.prop.tabIdx.jrdt) {
					$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.jrdt);
					alertBox('W', cflineMsgArray['pleaseChooseUperLowMtso']/*"상하위국을 설정해 주세요."*/);
					$(this).cancelThisTabChange();
					return ;
				 }
			});
			
			 $("#jrdtTabs").on("tabchange", function(e, index) { //탭변경시 이벤트
				 // 주소검색 결과 표시된 국사정보 삭제
				 _app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);
				 _app.tpu.isExistsTempVtualMtso = false;   // 주소검색시 건물 검색 결과 초기화
				 $("#btnInitAddr").click();
				 
				 // 네트워크 임시 표시선 삭제
				 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
				 
				 if(_app.data.realSelectPath != null && (index == _app.prop.tabIdx.trunk || index == _app.prop.tabIdx.wdmTrunk)){
					 if(_app.data.realSelectPath.uprMtsoId == _app.data.realSelectPath.lowMtsoId){  //트렁크,wdm트렁크일때 선택 패스가 같은 국소일 경우 초기화
						 _app.data.realSelectPath = null;
					 };
				 };
				 if(index == _app.prop.tabIdx.diagram || index == _app.prop.tabIdx.jrdt || index == _app.prop.tabIdx.svln){
					_app.mu.setDefaultView();
				 };
				 
				 if (index == _app.prop.tabIdx.diagram) {
					 $("#btnExportExcelTangoPath").show();
					 $("#btnPrint").show();
				 } else {
					 $("#btnExportExcelTangoPath").hide();
					 $("#btnPrint").hide();
				 }
				// 링검색 그리드 보이기
				$('#'+_app.conf.ringSchGridId).show();
				// 접속함체 링 그리드 숨기기
				$('#'+_app.conf.ringUsedCnnBoxSchGridId).hide();						
				
				if(index == _app.prop.tabIdx.jrdt || index == _app.prop.tabIdx.diagram){
					 $(this).css({height:"750px"});					
				 }else{					 				 
					 $(this).css({height:"730px"});
					 _app.tpu.refreshTabGrid();
				 };
				 				
				 // 트렁크 선택시
				 if (index == _app.prop.tabIdx.trunk ) {
					 $('#'+_app.conf.trunkSchGridId).alopexGrid('showCol', 'ntwkIdleRate');
				 }
				 // wdm트렁크 선택시
				 else if ( index == _app.prop.tabIdx.wdmTrunk) {
					 //$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid('hideCol', 'ntwkIdleRate');
				 }
				// cflineShowProgress();
				 _app.setTabLayer(index);
				 _app.cu.resetGrid(index);
			 });
			 
			 $('#'+_app.conf.ringUsedCnnBoxSchGridId)   //접속함체 링 검색 그리드 이벤트
	    	  .on('click', '.bodycell', function(e) { _app.showMtso(_app.prop.customLayerNm.virtualPath,AlopexGrid.parseEvent(e).data); });
	    	  
	    	 //_app.setTabLayer(_app.prop.tabIdx.jrdt);
		},getCustomLayer : function(caller,isNew){   //커스텀 레이어 생성, isNew true 이거나 생성된 레이어가 없을 경우 새로 생성
			if(isNew) _app.removeCustomLayer(caller); 
			var layer = _app.map.getCustomLayerByName(caller);
			if(layer == null){
				layer = _app.map.addCustomLayerByName(caller,{selectable: true});
				
				// 아래에 속하는 레이이에 대해서만 선택이벤트가 발생함
				switch(caller){
					case _app.prop.customLayerNm.jrdt:
					case _app.prop.customLayerNm.path:
					case _app.prop.customLayerNm.virtualMtso:	
					case _app.prop.customLayerNm.virtualMtso2:	
					case _app.prop.customLayerNm.virtualPath:	
						layer.options.onEachFeature = function(geo, ftr) {
							if(ftr.defaultOptions.type == "POINT"){
								ftr.on('mouseover', function(e){ ftr.openPopup(); })
							       .on('mouseout', function(e){ ftr.closePopup(); })
							       .on('click', function(e){
							    	   //e.originalEvent.preventDefault();
							    	   var cl = _app.getCustomLayer(this.feature.properties.customLayerNm);
							    	   var layer = cl.getLayer(this._leaflet_id);
							    	   _app.map.setSelectFeatures([layer]);
							    	   _app.onSelectedFeatures();
							    	})
							}
						};
					break;
				};
			};
			return layer;
		},removeCustomLayer : function(caller){
			var layer = _app.map.getCustomLayerByName(caller);
			if(layer != null)_app.map.removeCustomLayerByName(caller);
			_app.map.clearSelectLayer();
		},setTabLayer : function(index){
			_app.map.clearSelectLayer();
			if(index == _app.prop.tabIdx.jrdt){
				_app.updateMapLine(_app.prop.caller.jrdt);
				_app.removeCustomLayer(_app.prop.customLayerNm.path);
			}else{
				_app.updateMapLine(_app.prop.caller.path);
				_app.removeCustomLayer(_app.prop.customLayerNm.jrdt);
			}
		},moveMapCenter : function(pos1,pos2,pLat){ //두 위치의 중앙으로 이동 
			var sumLatVal = Number(pos1.lat) + Number(pos2.lat);
			var sumLngVal = Number(pos1.lng) + Number(pos2.lng);
			var km = getDistanceFromLatLonInKm(pos1.lat,pos1.lng,pos2.lat,pos2.lng);
			var rat = 0;
			if(km < 10){
				rat = 7;
			}else if(km < 100){
				rat = 5;
			}else{
				rat = 3;
			};
			if(pLat != null){
				rat = pLat;
			};
			_app.map.setView([sumLatVal/2 ,sumLngVal/2], rat);
		},getDefaultMenuItems :  function(){ // 기본 우클릭 이벤트
			var rsList = [
		              { text: cflineMsgArray['expansion']/*'확대'*/, icon: L.MG.ENV.IMAGEPATH +'/zoom-in.png', callback: function(e) {(_app.map.getZoom() >= 10) ? _app.map.zoomIn() : _app.map.setView(_app.getLatLng(e), 10);}}
		            , { text: cflineMsgArray['reductionMap']/*'축소'*/, icon: L.MG.ENV.IMAGEPATH +'/zoom-out.png', callback: function(e) {(_app.map.getZoom() <= 6) ? _app.map.zoomOut() : _app.map.setView(_app.getLatLng(e), 6);}}
	            ];
			return rsList;
		},getLatLng : function(e){  //선택된 포인트가 있을 경우 선택 포인트 중심, 아닐 경우 마우스 위치 중심으로 이동 
			var selectedFeatures = _app.map.getSelectedFeatures();
   		 	if(selectedFeatures.length == 1 &&  selectedFeatures[0].feature.geometry.type == "Point") {
   		 		var cd = selectedFeatures[0].feature.geometry.coordinates;
           		return [cd[1],cd[0]]; 
            }else{
             	return e.latlng;
            };
		}
		// context메뉴
		,onSelectedFeatures : function(){ //feature가 선택됬을때 이벤트
	    	var selectedFeatures = _app.map.getSelectedFeatures();
	    	var contextItems = [];
	    	if(selectedFeatures.length == 0){
		    	if (_app.isSkbB2bOrUserLine()){
		    		contextItems.push({ text: (_app.data.cnnBox.cnpt? cflineMsgArray['hideCnntBox'] : cflineMsgArray['showCnntBox'] /*"접속함체 숨기기":"접속함체 보이기"*/),
						callback:function(e){ var b = !_app.data.cnnBox.cnpt; _app.data.cnnBox.cnpt=b; _app.onOffCnnBox(b,"cnpt"); 
						_app.map.setDefaultContextMenu(_app.getDefaultMenuItems(_app.map));_app.onSelectedFeatures();
						}});
		    		contextItems.push({ text: (_app.data.cnnBox.fdlk?cflineMsgArray['hideFtNtwk'] : cflineMsgArray['showFtNtwk'] /*"휘더망 숨기기":"휘더망 보이기"*/), 
						callback:function(e){var b = !_app.data.cnnBox.fdlk;_app.data.cnnBox.fdlk=b;_app.onOffCnnBox(b,"fdlk");
						_app.map.setDefaultContextMenu(_app.getDefaultMenuItems(_app.map));_app.onSelectedFeatures();
						}});
		    	};
	    	}else{
		        if(selectedFeatures.length == 1) {
		        	var feature = selectedFeatures[0].feature;
		        	if(feature.properties.isVirtual){
		        		_app.data.realSelectPath = feature.properties;
		        		_app.data.selectPath = feature.properties;
		        		contextItems.push({ text: cflineMsgArray['searchTrunk']/*'트렁크 검색'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.trunk}))}}); 
		        		contextItems.push({ text: cflineMsgArray['searchRing']/*'링 검색'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.ring}))}}); 
		        		if (_app.data.svlnInfo.mgmtGrpCd == "0002") {
		        			contextItems.push({ text: cflineMsgArray['searchWdmTrunk']/*'WDM트렁크 검색'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.wdmTrunk}))}}); 
		        		}
		        		contextItems.push({ text: cflineMsgArray['addVirtualNetwork']/*'가상 네트워크 추가'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.virtualPath}))}});
		        	}else{
		        		if(visualLinePath.isEnabled && $("#jrdtTabs").getCurrentTabIndex() != _app.prop.tabIdx.jrdt && feature.geometry.type != "Point" && _app.chkCnnBoxYn(feature.layerName) == false){
		        			if (feature.properties.isDelete != true) {
		        				contextItems.push({ text: cflineMsgArray['networkDetailInfo']/*'네트워크 상세정보'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.pathInfo}))}});
		        				contextItems.push({ text: cflineMsgArray['deleteNetwork']/*'네트워크 삭제'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.path}))}});
		        			}
		        		}
		        		
		        	};

		        	if(feature.geometry.type == "Point"){
		        		_app.data.selectMtso = feature.properties;
		        		// 접속함체를 클릭한 경우
		        		if (_app.chkCnnBoxYn(feature.layerName) == true && _app.data.svlnInfo.mgmtGrpCd == "0002") {
		        			//contextItems.push({text:"가입자망 검색", callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.skbCnnBoxRing}))}});	
		        		}else if(feature.properties.isSchVtMtso){ //가상 국사
		        			contextItems.push({text:cflineMsgArray['addVitualMtso']/*"가상국사 추가"*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.mtso}))}});
		        		}else {
			        		switch($("#jrdtTabs").getCurrentTabIndex()){
			        			case _app.prop.tabIdx.jrdt:
			        				contextItems.push({ text: cflineMsgArray['addUprMtso']/*'상위국추가'*/, callback: function(e) {feature.properties.jrdtMtsoTypCd="01";_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.jrdt}))}});
			        				contextItems.push({ text: cflineMsgArray['addLowMtso']/*'하위국추가'*/, callback: function(e) {feature.properties.jrdtMtsoTypCd="02";_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.jrdt}))}});
			        				
			        				/*가상국사추가
			        				(isExistsTempVtualMtso : 주소검색을 통한 건물이 있는경우
			        				, vtulMtsoYn : 선택한 국사가 가상국사가 아닌경우
			        				, 전송실이나/정보센터가 아닌경우
			        				, mgmtGrpCd : 시뮬레이션중인 회선의 관리그룹과 선택한 국사의 관리그룹이 같은경우)*/
			        				if (_app.tpu.isExistsTempVtualMtso == true 
			        						&& feature.properties.vtulMtsoYn != "Y"
			        						&& feature.properties.topMtsoId != feature.properties.mtsoId
			        						/* && _app.data.svlnInfo.mgmtGrpCd == feature.properties.mgmtGrpCd*/			        						
			        					) {
			        					contextItems.push({ text: cflineMsgArray['addVitualMtsoAtBelow']/*"가상국사 연결"*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.uprMtsoOfVtulMtso}))}});				        				
			        				}
			        				break;
			        			default :
			    	        		if(!feature.properties.isVtMtso   // 가상 국사가 아니고 
			    	        				&& feature.layerName !=_app.prop.customLayerNm.virtualPath // 임시표시선아닌경우
			    	        			){
				    	        			contextItems.push({ text: cflineMsgArray['searchEquipment']/*'장비 검색'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.eqpInf}))}});
				    	        			contextItems.push({ text: cflineMsgArray['addVirtualEquipment']/*'가상 장비추가'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.virtualEqpInf}))}});
			    	        		};
			        				break;
			        		}
			        		if(!feature.properties.isVtMtso){
	    	        		// 가입자망,B2B회선
			        			if((feature.properties.isLowMtso==true||feature.properties.isUprMtso==true) // 상하위 국사인경우
			        					&&  _app.isSkbB2bOrUserLine() == true  // skbB2B서비스회선인 경우
			        					&& feature.layerName !=_app.prop.customLayerNm.virtualPath // 임시표시선 아닌경우
			        				){
			        				contextItems.push({ text: cflineMsgArray['searchUserNetworkRing']/*'링(가입자망) 검색'*/, callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.skbLastRing}))}});
			        				//contextItems.push({ text: '가상 가입자망 추가', callback: function(e) {_app.onContextEvt($.extend({},e,{feature:feature,caller:_app.prop.caller.skbVirtualRing}))}});	
			        			};
				        		contextItems.push({text:cflineMsgArray['searchUsedNetworkInfo']/*"수용네트워크정보"*/
				        			, callback:function(e){ 
				        				_app.onContextEvt($.extend({},e,{data:{
				        														 uprMtsoId:feature.properties.mtsoId
				        														,lowMtsoId:feature.properties.mtsoId
				        														,lineCapaCdVal : _app.data.svlnInfo.lineCapaCdVal
				        														,mtsoNm : feature.properties.mtsoNm
				        													  } ,caller:_app.prop.caller.networkInfo}))}});
			        		};
		        			contextItems.push({text: cflineMsgArray['searchMtsoInfo']/*"국사정보조회"*/, callback:function(e){ _app.onContextEvt($.extend({},e,{feature:feature,data:{fromMtsoDemd:"Y",mtsoId:feature.properties.mtsoId},caller:_app.prop.caller.mtso}))}});
		        		}
		        	};
		        	if(feature.properties.isDelete){
		        		contextItems.push({ text: cflineMsgArray['delete']/*'삭제'*/, callback: function(e) {
		        			_app.removeCustomLayer(feature.getLayerId());
		        		}});
		        	};
		        };	    		
	    	};
	        _app.map.setSelectedItemContextMenu(contextItems, true);
		}, onContextEvt : function(e){// map context event
			switch(e.caller){
				case _app.prop.caller.mtso :
				case _app.prop.caller.uprMtsoOfVtulMtso : 
					if(e.feature.properties.vtulMtsoYn == "Y" //  //가상국사 일 경우
						|| e.caller == _app.prop.caller.uprMtsoOfVtulMtso  // 소속 가상국사 추가건일 경우
					 	){
						var mtsoData = e.feature;
						// 소속 하위국사로 가상국사추가시
						if (e.caller == _app.prop.caller.uprMtsoOfVtulMtso) {							
							var layer = _app.getCustomLayer(_app.prop.customLayerNm.virtualMtso2);  // 가상국사레이어 취득
							for(var i = 0 ; i < layer.getLayers().length; i++){
								var la = layer.getLayers()[i];
								if(L.MG.Util.objectId(la) == _app.tpu.beforeAddVtulMtsoId){
									mtsoData = la.feature;
									mtsoData.properties.topMtsoId = e.feature.properties.topMtsoId;
									mtsoData.properties.topMtsoNm = e.feature.properties.topMtsoNm;
									   // 소속 가상국사로 추가하기 위해
									mtsoData.properties.uprMtsoId = e.feature.properties.mtsoId;
									mtsoData.properties.uprMtsoNm = e.feature.properties.mtsoNm;									
								}
							}
						}
						// 데이터 셋팅
						var data = $.extend({},mtsoData.properties,{svlnNo:_app.data.svlnInfo.svlnNo,mgmtGrpCd:_app.data.svlnInfo.mgmtGrpCd});
						
						$.extend(data, {"uprMtsoOfVtulMtso" : (e.caller == _app.prop.caller.uprMtsoOfVtulMtso ? "Y" : "N")});
						
						// 추가/수정전 가상국사 id 보존
						var bfVtulMtsoId = mtsoData.properties._$id;
						
						$a.popup({ popid: "vtMtsoAdd",
							title: "가상국사 추가/수정",
							url: $('#ctx').val()+"/configmgmt/cfline/ServiceLineSimulAddVtMtsoPop.do",
							data: data,
							iframe: true,
							modal: false,
							windowpopup : true,
							width : 750,
							height : 400,
							callback:function(res){
								if(res != null){
									_app.data.mtsoAddr[res.mtsoId] = res;
									var layer = _app.getCustomLayer(mtsoData.getLayerId());
									for(var i = 0 ; i < layer.getLayers().length; i++){
										var la = layer.getLayers()[i];
										if(L.MG.Util.objectId(la) == mtsoData.properties._$id){
											// 각 국사에 표현되어야할 기본정보 셋팅 꼭 필요
											// showMtso메소드에서 properties에 셋팅하는 항목은 동일하게 처리해 주어야 함
											res.customLayerNm = mtsoData.getLayerId();
											res.mtsoInfoYn = "Y";   // 국사별 장비정보 존재여부
											res.isDelete = mtsoData.properties.isDelete;    //가상 여부(선택해서 임시로 보여지는 국사)
											res.isVtMtso = mtsoData.properties.isVtMtso; //가상 국사 여부
											res.isSchVtMtso = false;   // 미등록 가상국사여부											
											
											la.feature.properties = res;
											la.feature._$id = res.mtsoId;
											_app.map.setSelectFeatures([la]);
											_app.onSelectedFeatures();
											
											// 팝업메뉴 설정
											var ttCont = '<div id="<%mtid%>"><b>'+ cflineMsgArray['mtsoName'] + ':</b><%label%><br><b>' + cflineMsgArray['address'] +':</b><%mtsoAddr%><br><b>' + cflineMsgArray['model'] + ':</b><%modelNm%></div>'; /*국사명  주소 장비모델*/
											ttCont = ttCont.replace('<%mtid%>', res.mtsoId);
											ttCont = ttCont.replace('<%mtsoAddr%>', nullToEmpty(res.mtsoAddr));
											ttCont = ttCont.replace('<%modelNm%>', "");
											ttCont = ttCont.replace('<%label%>', res.mtsoNm);
											
											la.bindPopup(ttCont,{offset:L.point([0,-(16/2+2)])});		
											
											// 상하위국사로 지정된 가상국사 수정한 경우
											var jl = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
											for(var j = 0 ; j < jl.length;j++){
												var dt = jl[j];
												if(dt.mtsoId == res.mtsoId){
													dt.mtsoNm = res.mtsoNm;
													jl[j]=dt;
												};
											};
											
											$('#'+_app.conf.jrdtGridId).alopexGrid("dataSet",jl);
											
											// 가상국사 추가인 경우 추가 후 가상국사로 추가가능한 건물이 없다는 플러그 셋팅
											if (bfVtulMtsoId == _app.tpu.beforeAddVtulMtsoId) {
												_app.tpu.isExistsTempVtualMtso = false;
												_app.data.schMtso.selectedMtsoId = res.mtsoId;
											}
											break;
											//la.feature._$id = res.mtsoId;
										};
									}
									
									// 다른 팝업에 영향을 주지않기 위해
									$.alopex.popup.result = null;
								};
							}
						});						
					}else{
						$a.popup({ popid: "mtsoInqury",
							   title: cflineMsgArray['searchMtsoInfo']/*"국사 정보조회"*/,
					 	       url: $('#ctx').val()+"/configmgmt/common/MtsoDtlLkup.do",
							   data: e.data,
							   iframe: false,
							   modal: true,
							   movable:true,
							   width : 865,
							   height : window.innerHeight * 0.9
						 });
					}
					break;
				case _app.prop.caller.jrdt :
					_app.updateGrid(e.caller,"dataAdd",e.feature.properties);
					break;
				case _app.prop.caller.trunk  : 
					$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.trunk);
					break;
				case _app.prop.caller.wdmTrunk  : 
					$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.wdmTrunk);
					break;
				case _app.prop.caller.eqpInf : 
					_app.data["mtsoList"] = [e.feature.properties._$id]
			    	var mtsoParam = {"topMtsoIdList" : _app.data["mtsoList"]};
					_app.httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getjrdtmtsolist', mtsoParam, 'POST', 'mtsoListForEqp');
					$('#'+_app.conf.eqpInfSchGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.eqpInfSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.eqpInf);					
					break;
				case _app.prop.caller.ring  : 
					$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.ring);
					break;
				case _app.prop.caller.virtualPath :  //가상네트워크 추가
					_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(e.feature.properties,{insCaller:e.caller}));
					break;
				case _app.prop.caller.virtualEqpInf : //가상 장비 추가
					if (_app.data.selectPath == null || _app.data.selectPath.isVirtualLowerMtsoNode == undefined ) {
						var p = e.feature.properties;
						_app.data.selectPath = {isVirtualLowerMtsoNode : p.isVirtualLowerMtsoNode};
					}
					_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(e.feature.properties,{insCaller:e.caller}));
					break;
				case _app.prop.caller.skbVirtualRing : //가상 가입자망 추가
					if (e.feature.properties.isUprMtso==true && nullToEmpty(_app.tpu.uprNetworkNo) != "") {
						alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"상위국에는 이미 가입자망이 지정되었습니다."*/);
						return;
					} else if (e.feature.properties.isLowMtso==true && nullToEmpty(_app.tpu.lowNetworkNo) != "") {
						alertBox('I', cflineMsgArray['existsUserNetworkAtLowMtso']/*"하위국에는 이미 가입자망이 지정되었습니다."*/);
						return;
					}
					_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(e.feature.properties,{insCaller:e.caller}));
					break;
				case _app.prop.caller.skbLastRing :
					
					if (e.feature.properties.isUprMtso==true && nullToEmpty(_app.tpu.uprNetworkNo) != "") {
						alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"상위국에는 이미 가입자망이 지정되었습니다."*/);
						return;
					} else if (e.feature.properties.isLowMtso==true && nullToEmpty(_app.tpu.lowNetworkNo) != "") {
						alertBox('I', cflineMsgArray['existsUserNetworkAtLowMtso']/*"하위국에는 이미 가입자망이 지정되었습니다."*/);
						return;
					}
					
					var p = e.feature.properties;
					_app.data.realSelectPath = {
						uprMgmtGrpCd : p.mgmtGrpCd,	
						uprMtsoId : p.mtsoId,
						uprMtsoNm : p.mtsoNm,
						uprMtsoLngVal : p.mtsoLngVal,
						uprMtsoLatVal : p.mtsoLatVal,
						lowMgmtGrpCd : p.mgmtGrpCd,
						lowMtsoId : p.mtsoId,
						lowMtsoNm : p.mtsoNm,
						lowMtsoLngVal : p.mtsoLngVal,
						lowMtsoLatVal : p.mtsoLatVal,
						uprNodeId : null,
						lowNodeId : null,
						isVirtual : false,
					    isVirtualLowerMtsoNode : p.isVirtualLowerMtsoNode,
					    isUserRing : "Y",
					    modelNm : p.modelNm	
					};
					$("#jrdtTabs").setTabIndex(_app.prop.tabIdx.ring);
					//_app.updateGrid(_app.prop.caller.path,"dataAdd",$.extend(e.feature.properties,{insCaller:e.caller}));
					break;
				case _app.prop.caller.path:
					var data = {nodeData:{uprNodeId:e.feature.properties.uprNodeId}};
					_app.tpu.updateNode("dataDelete",data);
					break;
				case _app.prop.caller.pathInfo:
					var data = {nodeData:{uprNodeId:e.feature.properties.uprNodeId}};
					_app.tpu.updateNode("showDetailData",data);
					
					break;
				case _app.prop.caller.skbCnnBoxRing:
					// 가입자망 검색
					_app.selectRingUsedCnnBox(e.feature);
					break;
				case _app.prop.caller.networkInfo:
					e.data.mgmtGrpCd = _app.data.svlnInfo.mgmtGrpCd;
					$a.popup({ popid: "networkInfoAtMtso",
						   title: e.data.mtsoNm +" "+ cflineMsgArray['searchUsedNetworkInfo']/*" 수용 네트워크 정보"*/,
				 	       url: $('#ctx').val()+"/configmgmt/cfline/NetworkInfoAtMtsoPop.do",
						   data: e.data,
						   iframe: true,
						   modal: false,
						   movable:true,
						   windowpopup : true,
						  /* iframe: false,
						   modal: true,
						   movable:false,*/
						   width : 1400,
						   height : 800
					 });
					
					break;
			}	
				//_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchtrunklist', e.feature.properties, 'GET', e.caller);
		}, searchList : function(caller,param){
			switch(caller){
				case _app.prop.caller.tmof:
					$('#'+_app.conf.tmofGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.tmofGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchTmofList', param, 'GET', caller);
					break;
				case _app.prop.caller.mtso:
					var selData = $('#'+_app.conf.tmofGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]||{};
					
					var tmofData = { topMtsoId : selData.mtsoId };
					// 전송실 그리드를 클릭하여 조회하는 경우 주소검색시 사용되는 좌표값이 셋팅되는 경우를 방지 하기 위해서
					/*tmofData.mtsoLatVal = null;
					tmofData.mtsoLngVal = null;*/
					
					if (param != null && param != undefined) {
						tmofData = param;
					};
			    	var nFirstRowIndex = 1;
			    	var nLastRowIndex = 100;
			    	if(tmofData.division == "scroll"){
			    		nFirstRowIndex = parseInt($("#tabJrdt #firstRowIndex").val()) + 100;
			    		$("#tabJrdt #firstRowIndex").val(nFirstRowIndex);
			    		nLastRowIndex = parseInt($("#tabJrdt #lastRowIndex").val()) + 100;
			    		$("#tabJrdt #lastRowIndex").val(nLastRowIndex);
			    	}else {
			    		$('#'+_app.conf.mtsoGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.mtsoGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
			    		tmofData.division = "";
			    		$("#tabJrdt #firstRowIndex").val(nFirstRowIndex);
			    		$("#tabJrdt #lastRowIndex").val(nLastRowIndex);
			    	};
			    	
			    	$.extend(tmofData,{svlnNo:_app.data.svlnInfo.svlnNo});
			    	var searchFormData = $.extend({},tmofData,$("#tabJrdt #searchFormPop").getData());
			    	_app.data.schMtso = searchFormData;
					//var dataParam = $.param(searchFormData, true);
					
			    	_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchMtsoList', searchFormData, 'GET', _app.prop.caller.mtso+tmofData.division);				 
					break;
				case _app.prop.caller.trunk:
					// 네트워크 임시 표시선 삭제
					 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
					
					$('#'+_app.conf.trunkSchGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.trunkSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					if(param == null)return;
					// 검색조건에 용량 추가
					param.lineCapaCdVal = _app.data.svlnInfo.lineCapaCdVal;
					var dtParam = $.extend({},param,$("#tabTrunk").getData());

					dtParam.ntwkIdleRate = $("#tabTrunk #ntwkIdleRate").val();
					dtParam.ntwkCapa = $("#tabTrunk #ntwkCapa").val();
					dtParam.ntwkLineNo = $("#tabTrunk #ntwkLineNo").val();
					dtParam.ntwkLineNm = $("#tabTrunk #ntwkLineNm").val();
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchtrunklist', dtParam, 'GET', caller);
					break;
				case _app.prop.caller.wdmTrunk:
					// 네트워크 임시 표시선 삭제
					 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
					 
					$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					if(param == null)return;
					var dtParam = $.extend({},param,$("#tabWdmTrunk").getData());

					dtParam.ntwkCapa = $("#tabWdmTrunk #ntwkCapa").val();
					dtParam.ntwkLineNo = $("#tabWdmTrunk #ntwkLineNo").val();
					dtParam.ntwkLineNm = $("#tabWdmTrunk #ntwkLineNm").val();
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchWdmTrunkList', dtParam, 'GET', caller);
					break;
				case _app.prop.caller.ring:
					 
					if(param == null){						
						$('#'+_app.conf.ringSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.ringSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
						return;
					}
					var nFirstRowIndex = 1;
			    	var nLastRowIndex = 100;
			    	if(param.division == "scroll"){
			    		
			    		// 계속 검색여부
			    		var ringListCnt = AlopexGrid.trimData ($('#'+_app.conf.ringSchGridId).alopexGrid('dataGet')); 
			    		if (ringListCnt < parseInt($("#tabRing #firstRowIndex").val()) + 100) {
			    			// 계속 검색하지 않음
			    			return;
			    		}
			    		nFirstRowIndex = parseInt($("#tabRing #firstRowIndex").val()) + 100;
			    		$("#tabRing #firstRowIndex").val(nFirstRowIndex);
			    		nLastRowIndex = parseInt($("#tabRing #lastRowIndex").val()) + 100;
			    		$("#tabRing #lastRowIndex").val(nLastRowIndex);
			    	}else {
						// 네트워크 임시 표시선 삭제
						 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
						 
						$('#'+_app.conf.ringSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.ringSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
			    		param.division = "";
			    		$("#tabRing #firstRowIndex").val(nFirstRowIndex);
			    		$("#tabRing #lastRowIndex").val(nLastRowIndex);
			    		$("#tabRing #isUserRing").val(param.isUserRing);
			    	};
			    	param.uprMtsoId = $("#tabRing #uprMtsoId").val();
			    	param.lowMtsoId = $("#tabRing #lowMtsoId").val();
			    	param.ordType = $("#tabRing #ordType").val();
			    	param.ordValue = $("#tabRing #ordValue").val();
			    	param.firstRowIndex = nFirstRowIndex;
			    	param.lastRowIndex = nLastRowIndex;

					// 검색조건에 용량 추가
			    	param.lineCapaCdVal = _app.data.svlnInfo.lineCapaCdVal;
					param.ntwkCapa = $("#tabRing #ntwkCapa").val();
			    	param.ntwkLineNo = $("#tabRing #ntwkLineNo").val();
			    	param.ntwkLineNm = $("#tabRing #ntwkLineNm").val();
		    		
		    		// 가입자망 링 검색여부
		    		param.isUserRing = $("#tabRing #isUserRing").val();
			    	_app.data.schRing = param;	
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchringlist', param, 'GET', caller+param.division);
					break;					
				case _app.prop.caller.svln:
					
					if(param == null){
						$('#'+_app.conf.svlnSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.svlnSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
						return;
					}
					var nFirstRowIndex = 1;
					var nLastRowIndex = 100;
					param.noPage = 'N';
					if(param.division == "scroll"){
						
						// 계속 검색여부
						var svlnListCnt = AlopexGrid.trimData ($('#'+_app.conf.svlnSchGridId).alopexGrid('dataGet')); 
						if (svlnListCnt < parseInt($("#tabSvln #firstRowIndex").val()) + 100) {
							// 계속 검색하지 않음
							return;
						}
						nFirstRowIndex = parseInt($("#tabSvln #firstRowIndex").val()) + 100;
						$("#tabSvln #firstRowIndex").val(nFirstRowIndex);
						nLastRowIndex = parseInt($("#tabSvln #lastRowIndex").val()) + 100;
						$("#tabSvln #lastRowIndex").val(nLastRowIndex);
					}else {
						// 네트워크 임시 표시선 삭제
						 _app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
						
						$('#'+_app.conf.svlnSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.svlnSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
						param.division = "";
						$("#tabSvln #firstRowIndex").val(nFirstRowIndex);
						$("#tabSvln #lastRowIndex").val(nLastRowIndex);
					};
					param.uprMtsoId = $("#tabSvln #uprMtsoId").val();
					param.lowMtsoId = $("#tabSvln #lowMtsoId").val();
					param.ordType = $("#tabSvln #ordType").val();
					param.ordValue = $("#tabSvln #ordValue").val();
					param.firstRowIndex = nFirstRowIndex;
					param.lastRowIndex = nLastRowIndex;
					
					// 검색조건에 용량 추가
					param.lineCapaCdVal = _app.data.svlnInfo.lineCapaCdVal;
					param.ntwkCapa = $("#tabSvln #ntwkCapa").val();
					param.ntwkLineNo = $("#tabSvln #ntwkLineNo").val();
					param.ntwkLineNm = $("#tabSvln #ntwkLineNm").val();
					
					_app.data.schSvln = param;	
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchservicelinelist', param, 'GET', caller+param.division);
					break;					
				case _app.prop.caller.eqpInf:	
			    	var nFirstRowIndex = 1;
			    	var nLastRowIndex = 100;
			    	if(param.division == "scroll"){
			    		nFirstRowIndex = parseInt($("#tabEqp #firstRowIndex").val()) + 100;
			    		$("#tabEqp #firstRowIndex").val(nFirstRowIndex);
			    		nLastRowIndex = parseInt($("#tabEqp #lastRowIndex").val()) + 100;
			    		$("#tabEqp #lastRowIndex").val(nLastRowIndex);
			    	}else {

						$('#'+_app.conf.eqpInfSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.eqpInfSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
			    		$("#tabEqp #firstRowIndex").val(nFirstRowIndex);
			    		$("#tabEqp #lastRowIndex").val(nLastRowIndex);
			    	};
			    	var searchFormData = $("#tabEqp #searchFormPop").getData();
			    	// 장비역할 코드 미선택시 parameter로 넘겨받은 장비역할 코드 set
					searchFormData.neRoleCd = nullToEmpty($("#tabEqp #neRoleCdPop").val());;
					var dataParam = $.param(searchFormData, true);
					if(searchFormData.topMtsoIdList==""){
						alertBox('A', cflineMsgArray['noExistsJrdtMtso']/*"선택된 관할국사가 없습니다."*/);return;
					};
			    	_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchEqpInfList', dataParam, 'GET', _app.prop.caller.eqpInf+param.division, true);
			    	break;
				case _app.prop.caller.mtsobyaddr:
					var latLng = null;
					_app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);
					
					$('#'+_app.conf.tmofGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.tmofGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					$('#'+_app.conf.mtsoGridId).alopexGrid("dataEmpty");
					$('#'+_app.conf.mtsoGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
					
					param = $.extend({},param,{svlnNo:_app.data.svlnInfo.svlnNo});
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchaddrmtsoinfo', param, 'GET', _app.prop.caller.mtsobyaddr)
						.done(function(response){
							var data = null;
							_app.tpu.isExistsTempVtualMtso = false;
							
							if(response != null && response.mtsoByAddr!=null){ //검색 주소의 위도 경도가 결과 값에 있을 경우								
								
								data = response.mtsoByAddr;
								latLng = [data.mtsoLatVal,data.mtsoLngVal];
								param.mtsoLatVal = data.mtsoLatVal;
								param.mtsoLngVal = data.mtsoLngVal;
								param.latLng = latLng;
								param.selectedMtsoId = data.mtsoId;
								
								/* 
								  1. 특정좌표의 값이 1개이면서 국사정보가 없는건물일 경우 (data.mtsoYn = 'N'
								    1-1. 해당 좌표 표시(표시항목 : 빌딩명/주소, 속성값 : 빌딩코드, 좌표값, 주소값, 국사여부 : N, 가상국사여부 : N) 
								    1-2. 해당 좌표 기준으로 1000M이내의 전송실/국사 검색(표시)
								  2. 특정좌표의 값이 1개 이면서 국사인 경우(국사정보 표시와 동일)
								    2-1. 해당 좌표 표시(표시항목 : 국사명/주소/장비, 속성값 :  국사여부 : Y, 가상국사여부 : N) 
								    2-2. 해당 좌표 기준으로 1000M이내의 전송실/국사 검색(표시)
								*/
								var mtsoId = data.mtsoId||_app.tpu.beforeAddVtulMtsoId;
								var vtulMtsoYn = mtsoId.indexOf("VM") > -1 || mtsoId == _app.tpu.beforeAddVtulMtsoId ? "Y" : "N";
								if(vtulMtsoYn == "Y"){
									if(mtsoId != _app.tpu.beforeAddVtulMtsoId){
										param.mtsoId = mtsoId; 
										_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchvtmtsoinfo', param, 'GET', 'searchvtmtsoinfo')
										.done(function(res){
											_app.showMtso(_app.prop.customLayerNm.virtualMtso2,res.vtMtsoInfo,true);
										});
									}else{
										_app.showMtso(_app.prop.customLayerNm.virtualMtso2,$.extend({},data,{mtsoId:mtsoId,mtsoAddr:param.bldAddr,mtsoNm:data.bldNm,vtulMtsoYn:vtulMtsoYn}),true);
										_app.tpu.isExistsTempVtualMtso = true;
									}									
								};
							} else {
								_app.tpu.isExistsTempVtualMtso = false;
							};
							cflineHideProgressBody();	
							if (data == null) {
								callMsgBox('', 'I', cflineMsgArray['noBldInfoAtAddr'], function() {/* 주소에 해당하는 특정 건물이 없습니다. <br>입력한 주소를 기반으로 국사정보가 조회됩니다.*/
									cflineShowProgressBody();
									_app.searchList(_app.prop.caller.tmof,param);
				    			});
							} else {
								callMsgBox('', 'I', makeArgMsg('exitBldInfoAtAddr', data.bldNm||''), function() {/* 주소에 해당하는 [{0}]건물 기준으로 1,000M 이내의 국사정보가 조회됩니다.*/
									cflineShowProgressBody();
									_app.searchList(_app.prop.caller.tmof,param);
				    			});
							}
							
						});
					break;
				case _app.prop.caller.skbCnnBoxRing:
					if(param == null){
						$('#'+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid("dataEmpty");
						$('#'+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
						return;
					}
					var nFirstRowIndex = 1;
			    	var nLastRowIndex = 150;
			    	if(param.division == "scroll"){
			    		nFirstRowIndex = parseInt($("#tabRing #firstRowIndex").val()) + 150;
			    		$("#tabRing #firstRowIndex").val(nFirstRowIndex);
			    		nLastRowIndex = parseInt($("#tabRing #lastRowIndex").val()) + 150;
			    		$("#tabRing #lastRowIndex").val(nLastRowIndex);
			    		param.uprMtsoId = $("#tabRing #uprMtsoId").val();
			    		param.lowMtsoId = $("#tabRing #lowMtsoId").val();
			    	}else {
			    		param.division = "";
			    		$("#tabRing #uprMtsoId").val(param.uprMtsoId);
			    		$("#tabRing #lowMtsoId").val(param.lowMtsoId);
			    		$("#tabRing #firstRowIndex").val(nFirstRowIndex);
			    		$("#tabRing #lastRowIndex").val(nLastRowIndex);
			    	};
			    	param.ordType = $("#tabRing #ordType").val();
			    	param.ordValue = $("#tabRing #ordValue").val();
			    	param.firstRowIndex = nFirstRowIndex;
			    	param.lastRowIndex = nLastRowIndex;

					// 검색조건에 용량 추가
			    	param.lineCapaCdVal = _app.data.svlnInfo.lineCapaCdVal;
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchringusedcnnboxlist', param, 'GET', caller+param.division);
					break;	
			};
		},filterGridData : function(caller){
			if(_app.prop.filterFlag[caller] == true){
				return;
			}else{
				setTimeout(function(){
					_app.prop.filterFlag[caller] = false;
					_app.filterGridData(caller);
				},_app.prop.filterDelay[caller]);
			};
			_app.prop.filterFlag[caller] = true;
			
			var mgmtGrpFilter = function(data){
				return $("#tabJrdt #mgmtGrpCd").val() == "" || $("#tabJrdt #mgmtGrpCd").val() == data.mgmtGrpCd;
			};
			switch(caller){
				case _app.prop.caller.tmof:
					$("#"+_app.conf.tmofGridId).alopexGrid("setFilter",_app.conf.tmofGridId,mgmtGrpFilter);
					break;
				case _app.prop.caller.mtso:
					$("#"+_app.conf.mtsoGridId).alopexGrid("setFilter",_app.conf.mtsoGridId,function(data){
						var nmVal = $("#tabJrdt #mtsoNm").val().toUpperCase();
						return mgmtGrpFilter(data) && (nmVal == "" || (data.mtsoNm||"").toUpperCase().indexOf(nmVal) > -1); 
					});
					break;
				
				// 네트워크탭은 필터기능 사용하지 않음
				/*case _app.prop.caller.trunk:
										
					$("#"+_app.conf.trunkSchGridId).alopexGrid("setFilter",_app.conf.trunkSchGridId,function(data){
						var noVal = $("#tabTrunk #ntwkLineNo").val().toUpperCase();
						var nmVal = $("#tabTrunk #ntwkLineNm").val().toUpperCase();
						var capa = $("#tabTrunk #ntwkCapa").val().toUpperCase();
						var rate = $("#tabTrunk #ntwkIdleRate").val().toUpperCase();
						return (noVal == "" || (data.ntwkLineNo||"").toUpperCase().indexOf(noVal) > -1) 
					    && (nmVal == "" || (data.ntwkLineNm||"").toUpperCase().indexOf(nmVal) > -1)
					    && (capa == ""  || (data.ntwkCapa||"").toUpperCase().indexOf(capa) > -1)
					    && (rate == ""  || (data.ntwkIdleRate+""||"").toUpperCase().indexOf(rate) > -1)
					});
					break;
				case _app.prop.caller.wdmTrunk:
					$("#"+_app.conf.wdmTrunkSchGridId).alopexGrid("setFilter",_app.conf.wdmTrunkSchGridId,function(data){
						var noVal = $("#tabWdmTrunk #ntwkLineNo").val().toUpperCase();
						var nmVal = $("#tabWdmTrunk #ntwkLineNm").val().toUpperCase();
						var capa = $("#tabWdmTrunk #ntwkCapa").val().toUpperCase();
						//var rate = $("#tabWdmTrunk #ntwkIdleRate").val().toUpperCase();
						return (noVal == "" || (data.ntwkLineNo||"").toUpperCase().indexOf(noVal) > -1) 
						    && (nmVal == "" || (data.ntwkLineNm||"").toUpperCase().indexOf(nmVal) > -1)
						    && (capa == ""  || (data.ntwkCapa||"").toUpperCase().indexOf(capa) > -1)
						    //&& (rate == ""  || (data.ntwkIdleRate+""||"").toUpperCase().indexOf(rate) > -1)
					});
					break;
				case _app.prop.caller.ring:
					$("#"+_app.conf.ringSchGridId).alopexGrid("setFilter",_app.conf.ringSchGridId,function(data){
						var noVal = $("#tabRing #ntwkLineNo").val().toUpperCase();
						var nmVal = $("#tabRing #ntwkLineNm").val().toUpperCase();
						var capa = $("#tabRing #ntwkCapa").val().toUpperCase();
						//var rate = $("#tabRing #ntwkIdleRate").val().toUpperCase();
						return (noVal == "" || (data.ntwkLineNo||"").toUpperCase().indexOf(noVal) > -1) 
						    && (nmVal == "" || (data.ntwkLineNm||"").toUpperCase().indexOf(nmVal) > -1)
						    && (capa == ""  || (data.ntwkCapa||"").toUpperCase().indexOf(capa) > -1)
					});
					break;
				case _app.prop.caller.skbCnnBoxRing:
					$("#"+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid("setFilter",_app.conf.ringUsedCnnBoxSchGridId,function(data){
						var noVal = $("#tabRing #ntwkLineNo").val().toUpperCase();
						var nmVal = $("#tabRing #ntwkLineNm").val().toUpperCase();
						var capa = $("#tabRing #ntwkCapa").val().toUpperCase();
						//var rate = $("#tabRing #ntwkIdleRate").val().toUpperCase();
						return (noVal == "" || (data.ntwkLineNo||"").toUpperCase().indexOf(noVal) > -1) 
						    && (nmVal == "" || (data.ntwkLineNm||"").toUpperCase().indexOf(nmVal) > -1)
						    && (capa == ""  || (data.ntwkCapa||"").toUpperCase().indexOf(capa) > -1)
					});
					break;*/
			};
		},selectSvlnInfo : function(param){ //서비스 회선정보 호출
			var interval = setInterval(function(){ 
				if(_app.prop.isInit){
					clearInterval(interval);
					cflineShowProgressBody();
					param.ntwkLineNo = param.svlnNo;
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchJrdtList', param, 'GET', _app.prop.caller.jrdt)
						.done(function(res){
							var moveJrdt = function(tabIndex){

								$("#btnEdit").trigger("click");
							    $('#jrdtTabs').setTabIndex(tabIndex);
							};
							_app.tpu.init();
							cflineShowProgressBody();
							if(_app.tpu.isInit){
								_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/virtualLinePath/selectVirtualLinePath', param, 'GET', 'selectVirtualLinePath')
								.done(function(res){//응답
									var vtPath = new TeamsPath();
									if(res.PATH){
										vtPath.fromData(res.PATH);
										_app.tpu.teamsPath = vtPath;
										_app.tpu.refreshPath();
										reGenerationDiagram();
										moveJrdt(_app.prop.tabIdx.diagram);
									}else{
										moveJrdt(_app.prop.tabIdx.jrdt);
									}
									cflineHideProgressBody();
								});	
							}else{
								cflineHideProgressBody();
								moveJrdt(_app.prop.tabIdx.jrdt);	
							};
						});
				};
			} ,500);  	    	
	    }, successCallback : function(response, status, jqxhr, flag, param){ //성공 콜백
	    	if(flag == _app.prop.caller.tmof){ //전송실 조회  
	    		$('#'+_app.conf.tmofGridId).alopexGrid("dataEmpty");
        		$('#'+_app.conf.tmofGridId).alopexGrid("dataSet", response.lists);
        		$('#'+_app.conf.tmofGridId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.lists.length);}}});
        		
        		if(param!=null && param.srchType == "ADDRESS"){  //주소 검색 일 경우
        			
	        		/*for(var i = 0 ; i < response.lists.length; i++){
	    				var data = response.lists[i];
	    				
	    				// 주소 검색을 통해 특정 좌표값을 못 찾은 경우 첫번째 전송실을 중심좌표로 삼기위해
	    				var isFirst = (param.latLng == null && i == 0);
	    				if(isFirst){
	    					// 첫 전송실 좌표를 셋팅 해줌
	    					param.latLng = [data.mtsoLatVal,data.mtsoLngVal];
	    					param.selectedMtsoId = data.mtsoId;
	    				};
	    				
	    				// 좌표동일한지 여부
	    				var isSelected = (param.selectedMtsoId == data.mtsoId);
    					_app.showMtso(_app.prop.customLayerNm.virtualMtso2,data,isSelected);
	    			};*/
	    			_app.searchList(_app.prop.caller.mtso,param);
        		}
	    	} else if(flag == "mtsoListForEqp"){
	    		
				$('#tabEqp #topMtsoIdListPop').setData({ data:response.mtsoList, topMtsoIdList:_app.data["mtsoList"]});
				_app.searchList(_app.prop.caller.eqpInf,{division:"search"});
			} else if(flag == _app.prop.caller.mtso){ //국사 검색
    			$('#'+_app.conf.mtsoGridId).alopexGrid("dataSet", response.lists);	    			
	    		$('#'+_app.conf.mtsoGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
	    		
	    		/* 주소를 통한 검색의 경우
	    		 * 1. 해당 주소가 특정좌표가 있는경우 그 좌표를 기준으로 1000m이내의 전송실/국사를 검색함
	    		 * 2. 해당 주소가 특정좌표가 없는경우 주소의 Ldong값을 기준으로 해당 동에 해당하는 전송실/국사를 검색함
	    		 */ 
	    		if(param!=null && param.srchType == "ADDRESS"){ // 주소 검색 일 경우

	    			/*주소검색을 통해 조회한 경우
	    			  국사명과 같은 검색 조건이 변경되는 경우 임시 표시한 건물 및 국사등 삭제처리	    			
   				 	// 가상국사 등록가능 플러그 초기화 
	    			 */
        			//if ($('#mtsoNm').val() != '') {           			
        				// 가상국사등록 가능한 건물 정보 layer
        				var tempVitualBldLayer = null;
        				var ttCont = null;
        				
            			// 가상국사 등록 가능한 건물 정보 있는 경우 해당 정보는 레이어에 다시 추가
            			if (_app.tpu.isExistsTempVtualMtso == true 
            					|| nullToEmpty(param.selectedMtsoId).indexOf('VM') > -1) {
            				var layer = _app.getCustomLayer(_app.prop.customLayerNm.virtualMtso2);
							for(var i = 0 ; i < layer.getLayers().length; i++){
								var la = layer.getLayers()[i];
								if(L.MG.Util.objectId(la) == _app.tpu.beforeAddVtulMtsoId
										|| L.MG.Util.objectId(la) == nullToEmpty(param.selectedMtsoId) ){									
									tempVitualBldLayer = {features : []};
									tempVitualBldLayer.features.push(la.feature);
									ttCont = la._popup._content;
								}
							}
            			}

            			// 주소검색 레이어 삭제
	       				_app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);      

            			// 가상국사등록 가능한 건물 정보 레이어에 추가
	       				if (tempVitualBldLayer != null) {
	       					var layer = _app.getCustomLayer(_app.prop.customLayerNm.virtualMtso2); //가상이면 매번 새로운 레이어 생성
	       					layer.addData(tempVitualBldLayer);
	       					
	       					for(var i = 0 ; i < layer.getLayers().length; i++){
								var la = layer.getLayers()[i];
								if(L.MG.Util.objectId(la) == _app.tpu.beforeAddVtulMtsoId
										|| L.MG.Util.objectId(la) == nullToEmpty(param.selectedMtsoId) ){
									_app.map.setSelectFeatures([la]);
									la.bindPopup(ttCont,{offset:L.point([0,-(16/2+2)])});
								};
							}
							_app.onSelectedFeatures();
	       				}
	       				
            			// 전송실정보 지도에 표시
	       		    	var lists = $('#'+_app.conf.tmofGridId).alopexGrid("dataGet");	       		    	

			    		for(var i = 0 ; i < lists.length; i++){
		    				var data = lists[i];	    				

		    				// 주소 검색을 통해 특정 좌표값을 못 찾은 경우 첫번째 전송실을 중심좌표로 삼기위해
		    				var isFirst = (param.latLng == null && i == 0);
		    				if(isFirst){
		    					// 첫 전송실 좌표를 셋팅 해줌
		    					param.latLng = [data.mtsoLatVal,data.mtsoLngVal];
		    					param.selectedMtsoId = data.mtsoId;
		    				};
		    				
		    				//console.log(param.selectedMtsoId + "  " + data.mtsoId + "  "  + isSelected + "  " + data.mtsoNm);
		    				_app.showMtso(_app.prop.customLayerNm.virtualMtso2, data,  (param.selectedMtsoId == data.mtsoId));
		    			};        			
						if(param.latLng != null) _app.map.setView(param.latLng, 13);							
        			//}	    			
	    			
		    		for(var i = 0 ; i < response.lists.length; i++){
	    				var data = response.lists[i];	    				

	    				// 주소 검색을 통해 특정 좌표값을 못 찾은 경우 첫번째 전송실을 중심좌표로 삼기위해
	    				var isFirst = (param.latLng == null && i == 0);
	    				if(isFirst){
	    					// 첫 전송실 좌표를 셋팅 해줌
	    					param.latLng = [data.mtsoLatVal,data.mtsoLngVal];
	    					param.selectedMtsoId = data.mtsoId;
	    				};
	    				
	    				//console.log(param.selectedMtsoId + "  " + data.mtsoId + "  "  + isSelected + "  " + data.mtsoNm);
	    				_app.showMtso(_app.prop.customLayerNm.virtualMtso2, data,  (param.selectedMtsoId == data.mtsoId));
	    			};        			
					if(param.latLng != null) _app.map.setView(param.latLng, 13);
	    		} 
	    		// 주소검색이 아닌경우 주소검색을 통해 표시한 국사들 표시레이어 삭제  
	    		else {
	    			_app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);
        			_app.tpu.isExistsTempVtualMtso = false;
	    		}
	    		
	    		;
	    	} else if(flag == _app.prop.caller.mtso+'scroll'){
				if(response.lists != null && response.lists.length > 0){
					$('#'+_app.conf.mtsoGridId).alopexGrid("dataAdd", response.lists);
					
					// 주소검색인 경우 좌표에 표시
					if(param!=null && param.srchType == "ADDRESS"){
			    		for(var i = 0 ; i < response.lists.length; i++){
		    				var data = response.lists[i];
		    				_app.showMtso(_app.prop.customLayerNm.virtualMtso2,data);
			    		}
					}
				};
	    	}else if(flag == _app.prop.caller.jrdt){
	    		$('#'+_app.conf.jrdtGridId).alopexGrid("dataEmpty");
	    		if(response!= null) {
	    			var lists = new Array();
	    			$.each(response.lists,function(idx,data){
	    				if(data.jrdtMtsoTypCd != "03"){
		    				lists.push(data);
	    				};
	    			});
	    			
	    			$('#'+_app.conf.jrdtGridId).alopexGrid("dataSet", lists);
	    			_app.updateGridSort(flag);
	    			_app.map.clearSelectLayer();
	    		};
	    	}else if(flag == _app.prop.caller.trunk){
	    		if(response!= null) {
	    			$('#'+_app.conf.trunkSchGridId).alopexGrid("dataSet", response.lists);
	    			$('#'+_app.conf.trunkSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.lists.length);}}});
	    			_app.filterGridData(flag);
	    			_app.updateGridSort(flag);
	    		};
	    	}else if(flag == _app.prop.caller.wdmTrunk){
	    		if(response!= null) {
	    			$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid("dataSet", response.lists);
	    			$('#'+_app.conf.wdmTrunkSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.lists.length);}}});
	    			_app.filterGridData(flag);
	    			_app.updateGridSort(flag);
	    		};
	    	}else if(flag == _app.prop.caller.ring){
    			$('#'+_app.conf.ringSchGridId).alopexGrid("dataSet", response.lists);	    			
	    		$('#'+_app.conf.ringSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
	    		//_app.filterGridData(flag);
	    	} else if(flag == _app.prop.caller.ring+'scroll'){
				if(response.lists != null && response.lists.length > 0){
					$('#'+_app.conf.ringSchGridId).alopexGrid("dataAdd", response.lists);
				}
	    	} else if(flag == _app.prop.caller.svln){
    			$('#'+_app.conf.svlnSchGridId).alopexGrid("dataSet", response.lists);	    			
	    		$('#'+_app.conf.svlnSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
	    		//_app.filterGridData(flag);
	    	} else if(flag == _app.prop.caller.svln+'scroll'){
				if(response.lists != null && response.lists.length > 0){
					$('#'+_app.conf.svlnSchGridId).alopexGrid("dataAdd", response.lists);
				}
	    	}else if(flag == 'neRoleInfList'){
	    		var neRoleData = [];
	    		neRoleData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
				for(var i=0; i<response.neRoleInfList.length; i++){
					neRoleData.push({value : response.neRoleInfList[i].neRoleCd, text :response.neRoleInfList[i].neRoleNm});
	    		};
	    		$('#tabEqp #neRoleCdPop').clear();
	    		$('#tabEqp #neRoleCdPop').setData({data : neRoleData});
	    		
	    	} else if(flag == 'mdlList'){
				var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
				
				if(response != null){
					var eqpMdlList = response.eqpMdlList;
					modelIdData = modelIdData.concat(eqpMdlList);	
				};
				
				$('#tabEqp #modelIdPop').clear();
				$('#tabEqp #modelIdPop').setData({data : modelIdData});
	    	} else if(flag == 'bpList'){
				var bpIdData = [{bpId: "",bpNm: cflineCommMsgArray['all']/*전체*/}];
				
				if(response != null){
					var bpList = response.bpList;
					bpIdData = bpIdData.concat(bpList);	
				}
				$('#tabEqp #bpId').clear();
				$('#tabEqp #bpId').setData({data : bpIdData});
			} else if(flag == 'eqpBldCd') {
				if(response != null) {
					if(response.eqpBldCd.length > 0) {
						$("#eqpBldCd").val(response.eqpBldCd[0].bldCd);
						$("#eqpRoleDivCd").val(response.eqpBldCd[0].eqpRoleDivCd);
					};
				};
			} else if(flag == _app.prop.caller.eqpInf+'search'){
	    		var data = response.eqpInfList;
	    		$('#'+_app.conf.eqpInfSchGridId).alopexGrid('dataSet', data);
	    		if (data.length == 0) {
	    			$('#'+_app.conf.eqpInfSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : 0' ;}}});
	    		} else {	    			
	    			$('#'+_app.conf.eqpInfSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});

	    		}
	    	} else if(flag == _app.prop.caller.eqpInf+'scroll'){
				if(response.eqpInfList != null && response.eqpInfList.length > 0){
					$('#'+_app.conf.eqpInfSchGridId).alopexGrid("dataAdd", response.eqpInfList);
				};
	    	} else if(flag == 'saveJrdtMtso') {
	    		if (response.Result == 'Fail') {
	    			alertBox('I',  cflineMsgArray['saveFail']); /* 저장에 실패 하였습니다.*/
	    			return;
	    			
	    		} else {
	    			callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() {/* 저장을 완료 하였습니다.*/

						_app.selectSvlnInfo({svlnNo:_app.data.svlnInfo.svlnNo});
						_app.setEditMode(true);
						changeYn = "Y";
	    				return;
	    			});
	    		}
	    		//_app.doSave();
	    	} else if(flag == _app.prop.caller.mtsobyaddr) {
	    		//console.log(response);
	    	} else if (flag == _app.prop.caller.skbCnnBoxRing) {
		    	//console.log(response);
		    	var listTotCnt = 0;
		    	$('#'+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid("dataSet", response.ringUsedCnnBoxList);	    			
	    		if (response.ringUsedCnnBoxList.length > 0) {
	    			listTotCnt = response.ringUsedCnnBoxList.length;
	    		}
	    		$('#'+_app.conf.ringUsedCnnBoxSchGridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(listTotCnt);}}});
	    		_app.filterGridData(flag);
    			_app.updateGridSort(flag);
    			// 다른 탭에 영향을 주지 않기 위해
    			//_app.data.selectPath!=null;
	    	} else if (flag.flag == "searchPathMtsoInfo") { //국사의 주소,장비 정보 조회
	    		// 정보셋팅
	    		var mtsoInfo =  response.pathMtsoInfo;
				var ttCont = '<div id="<%mtid%>"><b>'+ cflineMsgArray['mtsoName'] + ':</b><%label%><br><b>' + cflineMsgArray['address'] +':</b><%mtsoAddr%><br><b>' + cflineMsgArray['model'] + ':</b><%modelNm%></div>'; /*국사명  주소 장비모델*/
				ttCont = ttCont.replace('<%mtid%>', mtsoInfo.mtsoId);
				ttCont = ttCont.replace('<%mtsoAddr%>', nullToEmpty(mtsoInfo.mtsoAddr));
				ttCont = ttCont.replace('<%modelNm%>', nullToEmpty(mtsoInfo.modelNm) || "");
				ttCont = ttCont.replace('<%label%>', mtsoInfo.mtsoNm);
				
				var layer = _app.getCustomLayer(flag.caller,false);
				
				for(var i = 0 ; i < layer.getLayers().length; i++){
					var la = layer.getLayers()[i];
					if(L.MG.Util.objectId(la) == mtsoInfo.mtsoId){
						la.bindPopup(ttCont,{offset:L.point([0,-(16/2+2)])});
						la.feature.properties.topMtsoId = mtsoInfo.topMtsoId;
						la.feature.properties.topMtsoNm = mtsoInfo.topMtsoNm;
						la.feature.properties.uprMtsoId = mtsoInfo.uprMtsoId;
						la.feature.properties.uprMtsoNm = mtsoInfo.uprMtsoNm;						

						// 가상국사의 가상링 자동등록을 위해서
						la.feature.properties.uprMtsoLatVal = mtsoInfo.uprMtsoLatVal;
						la.feature.properties.uprMtsoLngVal = mtsoInfo.uprMtsoLngVal;
						la.feature.properties.uprMgmtGrpCd = mtsoInfo.uprMgmtGrpCd;
						return;
					}
				}
	    	};
	    	if(flag != _app.prop.caller.jrdt && flag != "mtsoListForEqp"){
	    		// 프로그레스 컨트롤
	    		if (flag == "neRoleInfList" || flag == "mdlList" || flag == "bpList" || flag == "eqpBldCd") {
	    			if ($('#tabEqp #neRoleCdPop option').size() > 0
	    					&& $('#tabEqp #bpId option').size() > 0
	    					&& $('#tabEqp #modelIdPop option').size() > 0
	    					&& $('#tabEqp #topMtsoIdListPop option').size() > 0
	    					&& _app.tpu.isInit == true) {
	    				cflineHideProgressBody();	    	    		
	    			}
	    		} else {
	    			if (_app.tpu.isInit == true) {
		    			cflineHideProgressBody();	
	    			} else if (flag == _app.prop.caller.tmof || flag == _app.prop.caller.mtso || flag == _app.prop.caller.mtso+'scroll' ) {
	    				cflineHideProgressBody();
	    			}	    		
	    		}	    		
	    	};
		}, failCallback : function(response, status, jqxhr, flag){ //실패 콜백
			cflineHideProgressBody();
	    	if(flag == 'saveJrdtMtso') {
	    		alertBox('I', cflineMsgArray['saveFail']); /* 저장에 실패 하였습니다.*/
	    		return;
	    	}else{
	    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	    	};
		}, showMtso : function(caller,data,isSelected){ //국사,구간 선 지도에 표시
			switch(caller){
				case _app.prop.customLayerNm.virtualMtso:
				case _app.prop.customLayerNm.virtualMtso2:
				case _app.prop.customLayerNm.jrdt: 
				case _app.prop.customLayerNm.path:
				case _app.prop.customLayerNm.virtualPath:
				
					if(data.mtsoId == null)return;
										
					var isVirtual = caller == _app.prop.customLayerNm.virtualMtso; //가상 여부(선택해서 임시로 보여지는 국사)
					var mtsoId = (data.mtsoId || data.topMtsoId);
					var isSchVtMtso = mtsoId == _app.tpu.beforeAddVtulMtsoId;
					var isVtMtso = isSchVtMtso||data.vtulMtsoYn == "Y"; //가상 국사 여부
					var isTmof = data.mtsoTypCd == "1"; // 전송실 여부
					var isSkb = data.mgmtGrpCd == "0002"; // skb 여부
					var layer = _app.getCustomLayer(caller,isVirtual); //가상이면 매번 새로운 레이어 생성
					var result = {features : []};	

					// 국사정보
					var mtsoInfo = data;
					if (_app.data.mtsoAddr[mtsoId] != null && !isSchVtMtso) {   
						mtsoInfo = _app.data.mtsoAddr[mtsoId];
					};
					
					var mtsoInfoYn = nullToEmpty(mtsoInfo.mtsoAddr) != "" ? "Y" :"N"; //국사의 주소,장비 정보가 있는지 여부
					var ttCont = "";
					if(mtsoInfoYn == "Y"){
						
						if(isVtMtso && data.mtsoYn == "N"){
							ttCont = '<div id="<%mtid%>"><b>'+ "빌딩명"+ ':</b><%label%><br><b>' + cflineMsgArray['address'] +':</b><%mtsoAddr%><br><b>' + '</div>'; /*빌딩명 주소*/
							ttCont = ttCont.replace('<%mtid%>', mtsoInfo.mtsoId);
							ttCont = ttCont.replace('<%mtsoAddr%>', nullToEmpty(mtsoInfo.mtsoAddr));
							ttCont = ttCont.replace('<%label%>', mtsoInfo.mtsoNm);							
						}else{
							if(_app.data.mtsoAddr[mtsoId] == null){
								_app.data.mtsoAddr[mtsoId] = data;	
							};
							ttCont = '<div id="<%mtid%>"><b>'+ cflineMsgArray['mtsoName'] + ':</b><%label%><br><b>' + cflineMsgArray['address'] +':</b><%mtsoAddr%><br><b>' + cflineMsgArray['model'] + ':</b><%modelNm%></div>'; /*국사명  주소 장비모델*/
							ttCont = ttCont.replace('<%mtid%>', mtsoInfo.mtsoId);
							ttCont = ttCont.replace('<%mtsoAddr%>', nullToEmpty(mtsoInfo.mtsoAddr));
							ttCont = ttCont.replace('<%modelNm%>', nullToEmpty(mtsoInfo.modelNm) || "");
							ttCont = ttCont.replace('<%label%>', mtsoInfo.mtsoNm + (nullToEmpty(data.mtsoDistance) != "" ? "(거리 : " + data.mtsoDistance + "M)" : ""));
						}
					};
					
					
					/* 각 국사의 properties항목으로 대부분의 국사들은 이 메소드를 통해 셋팅되기 때문에
					 * 속성값은 대부분 동일하게 셋팅됨
					 * 단 ServiceLineSimulAddVtMtsoPop.do 팝업을 호출하여 가상국사의 정보를 수정하는 경우가 있어서
					 * 그렇기 때문에 여기에 속성값이 추가되면 ServiceLineSimulAddVtMtsoPop.do를 호출하는 영역에서
					 * 해당 국사의 정보가 업데이트 된 뒤에 properties를 업데이트 하는 부분에도 해당 값을 재설정 해주는 코딩이 필요함
					 */
					data.mtsoInfoYn = mtsoInfoYn;   // 국사별 장비정보 존재여부
					data.isDelete = isVirtual;
					data.customLayerNm = caller;
					data.isVtMtso = isVtMtso;  
					data.isSchVtMtso = isSchVtMtso;
					// 가상국사를 위해 전송실정보도 설정
					data.topMtsoId = mtsoInfo.topMtsoId;
					data.topMtsoNm = mtsoInfo.topMtsoNm;
					data.uprMtsoId = mtsoInfo.uprMtsoId;
					data.uprMtsoNm = mtsoInfo.uprMtsoNm;
					// 가상국사의 가상링 자동등록을 위해서
					data.uprMtsoLatVal = mtsoInfo.uprMtsoLatVal;
					data.uprMtsoLngVal = mtsoInfo.uprMtsoLngVal;
					data.uprMgmtGrpCd = mtsoInfo.uprMgmtGrpCd;
					
					var ft = {
							_$id : mtsoId,
							type : 'Feature',
							geometry : {
								type: 'Point',
								coordinates : [data.mtsoLngVal,data.mtsoLatVal]
							},
							properties : data,
							style : [ { id :_app.conf.layerNm + "_"+ (!isVtMtso?(isTmof ? 
									(isSkb?_app.prop.pointStyleNm.tmofSkb:_app.prop.pointStyleNm.tmof): 
									(isSkb?_app.prop.pointStyleNm.mtsoSkb:_app.prop.pointStyleNm.mtso)):
										_app.prop.pointStyleNm.bld	
							)} ]
					};
					
					result.features.push(ft);
					try{	
						layer.addData(result);
				    	
						if(mtsoInfoYn == "Y"){
							for(var i = 0 ; i < layer.getLayers().length; i++){
								var la = layer.getLayers()[i];
								if(L.MG.Util.objectId(la) == mtsoId){
									la.bindPopup(ttCont,{offset:L.point([0,-(16/2+2)])});
								};
							}
						}else{
							_app.searchPathMtsoInfo(data.mtsoId, caller);
						}
					}catch(e){ }
					
					// 표시되는 국사가 자동 선택되어야 하는지 여부					
					if(isSelected == true){
						_app.map.panTo([data.mtsoLatVal,data.mtsoLngVal]);
						
						for(var i = 0 ; i < layer.getLayers().length; i++){
							var la = layer.getLayers()[i];
							if(L.MG.Util.objectId(la) == mtsoId){
								_app.map.setSelectFeatures([la]);
							};
						}
						_app.onSelectedFeatures();
					};
					
					break;
				// 임시경로표시는 별도의 메소드에서 처리	
				case app.prop.customLayerNm.virtualPath:
					var result = {features : []};
					var layer = _app.getCustomLayer(_app.prop.customLayerNm.virtualPath,true);
					var ft = { _$id : data.ntwkLineNo,
								type : 'Feature',
								geometry : {
									type: 'LineString',
									coordinates : [[data.uprMtsoLngVal,data.uprMtsoLatVal],[data.lowMtsoLngVal,data.lowMtsoLatVal]]
								},
								properties :{
									uprMtsoId : data.uprMtsoId,
									lowMtsoId : data.lowMtsoId,
									isDelete : true
								},
								style : [{id: _app.prop.lineStyleNm.pathTemp}]
						};
					result.features.push(ft);
					layer.addData(result);
					break;
			}
		},hideMtso : function(caller,data){ //국사 표시 삭제
			_app.removeCustomLayer(caller);			
		}, updateGrid : function(caller,prc,data){ //그리드 수정
			switch(caller){
				case _app.prop.caller.jrdt:
					if(prc == "dataAdd"){
						if(data.jrdtMtsoTypCd == "01" && $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet",{"jrdtMtsoTypCd":"01"}).length > 0){
							alertBox('A', cflineMsgArray['alreadySelectedUprMtso']/*"상위국사가 이미 선택되어 있습니다."*/);return;
						} else if(data.jrdtMtsoTypCd == "02" && $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet",{"jrdtMtsoTypCd":"02"}).length > 0){
							alertBox('A', cflineMsgArray['alreadySelectedLowMtso']/*"하위국사가 이미 선택되어 있습니다."*/);return;
						} else if($('#'+_app.conf.jrdtGridId).alopexGrid("dataGet",{topMtsoId:data.topMtsoId,mtsoId:data.mtsoId}).length > 0){
							alertBox('A', cflineMsgArray['alreadySelectedMtso']/*"이미 지정된 국사입니다."*/);return;
						};
						if(data.topMtsoId == null){
							var tmofData = $('#'+_app.conf.tmofGridId).alopexGrid("dataGet", {_state : {focused : true}})[0];
							data.topMtsoId = tmofData.topMtsoId;
							data.topMtsoNm = tmofData.topMtsoNm;
						};
						$('#'+_app.conf.jrdtGridId).alopexGrid(prc, data);
						_app.showMtso(_app.prop.customLayerNm.jrdt,data);
						var lists = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
						if(lists.length == 2){
							var pos1 = {lat: lists[0].mtsoLatVal,lng: lists[0].mtsoLngVal};
							var pos2 = {lat: lists[1].mtsoLatVal,lng: lists[1].mtsoLngVal};
							_app.moveMapCenter(pos1,pos2);
							
							var up = null; 
							var low = null; 
							
							for (var i=0; i < lists.length; i++) {
								if (lists[i].jrdtMtsoTypCd == "01" ) {
									up = lists[i].mtsoNm||lists[i].topMtsoNm;
								} else {
									low = lists[i].mtsoNm||lists[i].topMtsoNm;
								}
							}
														
							// 호출전에 정렬
							_app.updateGridSort(caller);
							
							// 가상국사를 상/하위국으로 설정한 경우 가상 링을 직접 추가
							_app.makeAutoVirtualRingForVirtualMtso();
							
							//callMsgBox('','C', makeArgMsg('autoSearchTrunk', up, low), function(msgId, msgRst){ /*선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 트렁크선택화면으로 이동 하시겠습니까?*/
							/*callMsgBox('','C', makeArgMsg('autoSearchServiceLine', up, low), function(msgId, msgRst){ 선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 서비스회선선택화면으로 이동 하시겠습니까?
								if(msgRst == "Y"){
									//$("#"+_app.conf.trunkSchGridId).alopexGrid("dataEmpty");
									$("#"+_app.conf.svlnSchGridId).alopexGrid("dataEmpty");
									var param = {uprMtsoId: lists[0].mtsoId||lists[0].topMtsoId ,lowMtsoId:lists[1].mtsoId||lists[1].topMtsoId};
									//$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.trunk);
									$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.svln);
								}
							});*/
							
						}
					}else if(prc == "dataDelete"){
						$('#'+_app.conf.jrdtGridId).alopexGrid(prc, {_index : { data:data._index.data }});
						_app.hideMtso(_app.prop.caller.mtso,data);
					};
					if(prc != "dataDelete" && prc != "dataAdd"){
						_app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso2);
					}
					_app.updateGridSort(caller);
					_app.tpu.init();
					break;
				case _app.prop.caller.path:
					if(prc == "dataAdd"){
						var nid = _app.data.selectPath==null || _app.data.selectPath.isVirtualLowerMtsoNode? null: _app.data.selectPath.lowNodeId;
						
						switch(data.insCaller){
							case _app.prop.caller.trunk:
							case _app.prop.caller.wdmTrunk:
								if(_app.tpu.teamsPath.hasUseTopNetwork(data.ntwkLineNo)==true){
									alertBox('A', cflineMsgArray['alreadySelectedNetwork']/*"이미 지정된 회선입니다."*/);return;
								};
								var searchParam = {"ntwkLineNo":data.ntwkLineNo,"wkSprDivCd":"01","autoClctYn":"N","ringMgmtDivCd":"1", "reqPathJrdtMtsoList":"Y"}
								_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath')
								.done(function(response){
									if(_app.tpu.chkVerifyPath(response)==false){
										return;
									}else if(response.data == null){
										alertBox('A', cflineMsgArray['noExistsNetworkInfo']/*"회선정보가 존재하지 않습니다."*/);
										return;								
									}else{
										if (_app.data.selectPath.isUserRing == "Y") {
											// 가입자망 상하위 네트워크 번호 세팅
											if (_app.tpu.uprMtso.MTSO_ID == _app.data.selectPath.uprMtsoId || _app.tpu.uprMtso.MTSO_ID == _app.data.selectPath.lowMtsoId ) {
												_app.tpu.uprNetworkNo = data.ntwkLineNo;
											} else if (_app.tpu.lowMtso.MTSO_ID == _app.data.selectPath.uprMtsoId || _app.tpu.lowMtso.MTSO_ID == _app.data.selectPath.lowMtsoId) {
												_app.tpu.lowNetworkNo = data.ntwkLineNo;
											}
											_app.data.realSelectPath = null;
										}
										
										var pathData = response.data;
										_app.tpu.updateNode(prc,{nodeId:nid,nodeData:pathData,nodeType:data.insCaller});
										
									};
								});
								break;
								// 접속함체용 노드
							case _app.prop.caller.skbCnnBoxRing:
								if(_app.tpu.teamsPath.findUseNetworkPath(data.ntwkLineNo)!=null){
									alertBox('A', cflineMsgArray['alreadySelectedNetwork']/*"이미 지정된 회선입니다."*/);return;
								};
								
								//console.log(data.ntwkLineNo);
								// 상위국 
								if (_app.data.selectPath!=null && _app.data.selectPath.isRingUsedCnnBox == 'Y' && (data.uprMtsoId == _app.tpu.uprMtso.MTSO_ID || data.lowMtsoId == _app.tpu.uprMtso.MTSO_ID)) {
									if (nullToEmpty(_app.tpu.uprNetworkNo) != "") {
										alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"상위국에는 이미 가입자망이 지정되었습니다."*/);
										return;
									}									
									nid = _app.tpu.uprNodeId;
									_app.tpu.uprNetworkNo = data.ntwkLineNo;
								} else if (_app.data.selectPath!=null && _app.data.selectPath.isRingUsedCnnBox == 'Y' && (data.uprMtsoId == _app.tpu.lowMtso.MTSO_ID || data.lowMtsoId == _app.tpu.lowMtso.MTSO_ID)) {
									//nid = _app.tpu.lowNodeId;
									if (nullToEmpty(_app.tpu.lowNetworkNo) != "") {
										alertBox('I', cflineMsgArray['existsUserNetworkAtLowMtso']/*"하위국에는 이미 가입자망이 지정되었습니다."*/);
										return;
									}
									_app.tpu.lowNetworkNo = data.ntwkLineNo;
								}
								
								var params = {"ntwkLineNo" : data.ntwkLineNo, "ntwkLnoGrpSrno" : data.ntwkLnoGrpSrno, editYn : "Y" }; 
								_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath')
								.done(function(response){
									if(response.data == null){
										alertBox('A', cflineMsgArray['noExistsNetworkInfo']/*회선정보가 존재하지 않습니다.*/);
										return;								
									}else{
										var pathData = response.data;
										// 트렁크 처럼 추가
										_app.tpu.updateNode(prc,{nodeId:nid,nodeData:pathData,nodeType:_app.prop.caller.trunk});
									};
								});
								_app.data.realSelectPath = null;
								$("#tabRing #uprMtsoId").val("");
					    		$("#tabRing #lowMtsoId").val("");
								break;
							case _app.prop.caller.ring:
								cflineShowProgressBody();
								var params = {"ntwkLineNo" : data.ntwkLineNo, "ntwkLnoGrpSrno" : data.ntwkLnoGrpSrno, editYn : "Y" }; 
								
						    	$a.popup({
						        	popid: "selectAddDropTeamsPath",
						    		title: "Ring ADD DROP",
						    		url: '/tango-transmission-web/configmgmt/cfline/RingAddDropPopTeamsPath.do',
						    		data: params,
						    		iframe: true,
						    		modal: true,
						    		movable:true,
						    		windowpopup : true,
						    		width : 1200,
						    		height : 850,
						    		callback:function(ringData){
						    			cflineHideProgressBody();
						    			if(ringData==null||ringData.NODES==null) {
						    				//alertBox('I', "링 정보가 없습니다..");
						    				return;
						    			}
						    			
						    			var frstNode = ringData.NODES[0].Ne;
						    			var lastNode = ringData.NODES[ringData.NODES.length-1].Ne;
						    			
						    			// 링(가입자망)검색건의 추가인 경우 반드시 상/하위국 중 일부와 일치해야 한다. 
						    			if (_app.data.selectPath!=null && _app.data.selectPath.isUserRing == 'Y' 
						    				&& !((frstNode.ORG_ID == _app.tpu.uprMtso.MTSO_ID || lastNode.ORG_ID == _app.tpu.uprMtso.MTSO_ID) || (frstNode.ORG_ID == _app.tpu.lowMtso.MTSO_ID || lastNode.ORG_ID == _app.tpu.lowMtso.MTSO_ID))) {
						    				alertBox('I', cflineMsgArray['pleseAddDropAtMtsoInUserRing']/*"링(가입자망)을 검색하여 링을 추가하는 경우는 반드시 상위국 혹은 하위국이 ADD 혹은 DROP 된 링이어야 합니다."*/);
											return;
						    			}
						    			
						    			// 상하위국에서 링(가입자망) 추가의 경우
						    			if (_app.data.selectPath!=null && _app.data.selectPath.isUserRing == 'Y' && (frstNode.ORG_ID == _app.tpu.uprMtso.MTSO_ID || lastNode.ORG_ID == _app.tpu.uprMtso.MTSO_ID)) {
											if (nullToEmpty(_app.tpu.uprNetworkNo) != "") {
												alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"상위국에는 이미 가입자망이 지정되었습니다."*/);
												return;
											}	
											nid = _app.tpu.uprNodeId;
											_app.tpu.uprNetworkNo = ringData.NETWORK_ID;
										} else if (_app.data.selectPath!=null && _app.data.selectPath.isUserRing == 'Y' && (frstNode.ORG_ID == _app.tpu.lowMtso.MTSO_ID || lastNode.ORG_ID == _app.tpu.lowMtso.MTSO_ID)) {
											//nid = _app.tpu.lowNodeId;
											if (nullToEmpty(_app.tpu.lowNetworkNo) != "") {
												alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"하위국에는 이미 가입자망이 지정되었습니다."*/);
												return;
											}
											_app.tpu.lowNetworkNo = ringData.NETWORK_ID;
										}
						    			
						    			_app.tpu.updateNode(prc,{nodeId:nid,nodeData:ringData,nodeType:data.insCaller})
						    		}
						    	});	
								break;
							case _app.prop.caller.virtualPath :
								var virtualInfo = $.extend({},data,{nodeType:"NT",eqpUprMtsoNm:data.mtsoNm});
								
								$a.popup({
							    	popid: "simulVirtualNode",
									title: cflineMsgArray['simulationVirtualNetworkOrEquipment']/*"시뮬레이션 가상 네트워크/장비"*/,
									url: '/tango-transmission-web/configmgmt/cfline/ServiceLineSimulVirtualPop.do',
									data: virtualInfo,
									iframe: true,
									modal: true,
									movable:true,
									windowpopup : true,
									width : 800,
									height : 350,
									callback:function(res){
										if (nullToEmpty(res.nodeCtt) != '') {
											var mtsoDt = camelToUnderscoreJson(res);
											var uprMtso = new Mtso();
											var lowMtso = new Mtso();
											uprMtso.fromData(mtsoDt,"UPR_"); 
											lowMtso.fromData(mtsoDt,"LOW_");
																						
											var virtualNetwork = _app.tpu.teamsPath.createVirtualNetwork(res.nodeCtt,res.topoLclCd,res.topoSclCd ,uprMtso,lowMtso);
											_app.tpu.updateNode(prc,{nodeId:nid,nodeData:virtualNetwork,nodeType:data.insCaller});
											// 다른 팝업에 영향을 주지않기 위해
											$.alopex.popup.result = null;
										};
									}
								});
								break;
							case _app.prop.caller.skbVirtualRing :
								/*var virtualInfo = $.extend({},data,{nodeType:"NT",caller:data.insCaller,lowMtsoId:data.uprMtsoId,lowMtsoNm:data.mtsoNm
												,uprMtsoLatVal:data.mtsoLatVal,uprMtsoLngVal:data.mtsoLngVal,lowMtsoLatVal:data.mtsoLatVal,lowMtsoLngVal:data.mtsoLngVal});*/

								//var virtualInfo = $.extend({},data,{nodeType:"NT",eqpUprMtsoNm:data.mtsoNm});
								//console.log(data);
								if (data.isUprMtso == true && nullToEmpty(_app.tpu.uprNetworkNo) != "") {
									alertBox('I', cflineMsgArray['existsUserNetworkAtUprMtso']/*"상위국에는 이미 가입자망이 지정되었습니다."*/);return;
								} else if (data.isLowMtso == true && nullToEmpty(_app.tpu.lowNetworkNo) != "") {
									alertBox('I', cflineMsgArray['existsUserNetworkAtLowMtso']/*"하위국에는 이미 가입자망이 지정되었습니다."*/);return;
								}
								
								var virtualInfo = {
									nodeType:"NT",	
									caller:data.insCaller,
									uprMgmtGrpCd : data.mgmtGrpCd,	
									uprMtsoId : data.mtsoId,
									uprMtsoNm : data.mtsoNm,
									uprMtsoLngVal : data.mtsoLngVal,
									uprMtsoLatVal : data.mtsoLatVal,
									lowMgmtGrpCd : data.mgmtGrpCd,
									lowMtsoId : data.mtsoId,
									lowMtsoNm : data.mtsoNm,
									lowMtsoLngVal : data.mtsoLngVal,
									lowMtsoLatVal : data.mtsoLatVal
								};
								
								
								$a.popup({
									popid: "simulVirtualNode",
									title: "가상 가입자망 추가",
									url: '/tango-transmission-web/configmgmt/cfline/ServiceLineSimulVirtualPop.do',
									data: virtualInfo,
									iframe: true,
									modal: true,
									movable:true,
									windowpopup : true,
									width : 800,
									height : 350,
									callback:function(res){
										if (nullToEmpty(res.nodeCtt) != '') {
											_app.data.realSelectPath = null;
											var mtsoDt = camelToUnderscoreJson(res);
											var uprMtso = new Mtso();
											var lowMtso = new Mtso();
											uprMtso.fromData(mtsoDt,"UPR_"); 
											lowMtso.fromData(mtsoDt,"LOW_");
											
											var virtualNetwork = _app.tpu.teamsPath.createVirtualNetwork(res.nodeCtt,res.topoLclCd,"031" ,uprMtso,lowMtso);
											
											// 상위국 networkId
											if (uprMtso.MTSO_ID == _app.tpu.uprMtso.MTSO_ID || lowMtso.MTSO_ID == _app.tpu.uprMtso.MTSO_ID) {
												_app.tpu.uprNetworkNo = virtualNetwork.NETWORK_ID;
											} // 하위국 networkId 
											else if (uprMtso.MTSO_ID == _app.tpu.lowMtso.MTSO_ID || lowMtso.MTSO_ID == _app.tpu.lowMtso.MTSO_ID) {
												_app.tpu.lowNetworkNo = virtualNetwork.NETWORK_ID;
											}
											nid = data.isVirtualLowerMtsoNode == true ? null : _app.tpu.uprNodeId;
											_app.tpu.updateNode(prc,{nodeId:nid,nodeData:virtualNetwork,nodeType:data.insCaller});
											
											// 다른 팝업에 영향을 주지않기 위해
											$.alopex.popup.result = null;
										};
									}
								});
								break;
							case _app.prop.caller.eqpInf:
								if(_app.tpu.teamsPath.findNodeByNe(data.neId)!=null){
									alertBox('A', cflineMsgArray['alreadySelectedEquipment']/*"이미 지정된 장비입니다."*/);return;
								};								
								nid = _app.data.selectMtso.nextNodeId;
								//console.log("장비" + nid);
								_app.tpu.updateNode(prc,{nodeId:nid,nodeData:data,nodeType:data.insCaller});
								break;
							case _app.prop.caller.virtualEqpInf:
								nid = _app.data.selectMtso.nextNodeId;
								var virtualInfo = $.extend({},data,
										{nodeType:"EQ",eqpUprMtsoNm:data.mtsoNm,uprMtsoId:data.mtsoId,uprMtsoNm:data.mtsoNm,uprMtsoLatVal:data.mtsoLatVal,uprMtsoLngVal:data.mtsoLngVal,uprMgmtGrpCd:data.mgmtGrpCd});
								$a.popup({
							    	popid: "simulVirtualNode",
									title: cflineMsgArray['simulationVirtualNetworkOrEquipment']/*"시뮬레이션 가상 네트워크/장비"*/,
									url: '/tango-transmission-web/configmgmt/cfline/ServiceLineSimulVirtualPop.do',
									data: virtualInfo,
									iframe: true,
									modal: true,
									movable:true,
									windowpopup : true,
									width : 800,
									height : 350,
									callback:function(res){
										if (nullToEmpty(res.nodeCtt) != '') {
											var mtsoDt = camelToUnderscoreJson(res);
											var uprMtso = new Mtso();
											uprMtso.fromData(mtsoDt,"UPR_"); 
											var virtualNe = _app.tpu.teamsPath.createVirtualNe(res.nodeCtt,uprMtso);
											_app.tpu.updateNode(prc,{nodeId:nid,nodeData:virtualNe,nodeType:data.insCaller});

											// 다른 팝업에 영향을 주지않기 위해
											$.alopex.popup.result = null;
										};
									}
								});								
								break;
							case _app.prop.caller.skbLastRing :
								
								break;
						};
					}else if(prc == "dataDelete"){
						_app.tpu.updateNode(prc,{nodeData:data});
					}else if(prc == "dataMove"){
						_app.tpu.updateNode(prc,{nodeData:data});
					};
					_app.data.realSelectPath = null;
					break;
			};
		}, updateGridSort : function(caller,data){ //정렬 순서 업데이트
			switch(caller){
				case _app.prop.caller.jrdt:
					if ( $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet").length > 0) {
						$('#'+_app.conf.jrdtGridId).alopexGrid("dataSort", 
								[{sortingColumn:"jrdtMtsoTypCd",sortingDirection:"asc"} , {sortingColumn:"seq",sortingDirection:"asc"}]
						);
						var dataList = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
						var j = 1;
						$.each(dataList, function(idx, obj){
							$('#'+_app.conf.jrdtGridId).alopexGrid('cellEdit', idx+1, {_index: {row:obj._index.row}}, 'seq');   // 화면표시순서   
			  				$('#'+_app.conf.jrdtGridId).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'seq');
			  				
			  				if(obj.jrdtMtsoTypCd == "02"){
			  					srno = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet").length;	
			  				}else{
			  					srno = j++;
			  				}
			  				$('#'+_app.conf.jrdtGridId).alopexGrid('cellEdit', srno, {_index: {row:obj._index.row}}, 'lineJrdtMtsoLnoSrno');   
		  					$('#'+_app.conf.jrdtGridId).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'lineJrdtMtsoLnoSrno');
						});
					};
					_app.tpu.refreshPath();
					break;
				case _app.prop.caller.trunk: 
				case _app.prop.caller.wdmTrunk:
					var tabId = caller == _app.prop.caller.trunk?"#tabTrunk":"#tabWdmTrunk";
					var gridId = caller == _app.prop.caller.trunk?"#"+_app.conf.trunkSchGridId:"#"+_app.conf.wdmTrunkSchGridId;
					var ordType = $(tabId).find("#ordType").val();
					var ordValue = $(tabId).find("#ordValue").val();
					var list = $(gridId).alopexGrid("dataGet");
					list.sort(function(a,b){
						var ordNum1 = a["ordNum"];  // 상하위국일치
						var ordNum2 = b["ordNum"];
						var ordMtsoNum1 = (ordType == 'ordLowNum') ? a["lowMtsoTyp"] : a["uprMtsoTyp"];  // 상위국 일치   / 하위국 일치
						var ordMtsoNum2 = (ordType == 'ordLowNum') ? b["lowMtsoTyp"] : b["uprMtsoTyp"];
						var ntwkIdleRate1 = a["ntwkIdleRate"];  // 유용율
						var ntwkIdleRate2 = b["ntwkIdleRate"];
						var ntwkCapaVal1 = Number(a["ntwkCapaVal"]);  // 용량
						var ntwkCapaVal2 = Number(b["ntwkCapaVal"]);
						switch(ordType){
							case "ordNum":
								return ordValue == "asc" ? compareValue(ordNum2,ordNum1,ntwkCapaVal1,ntwkCapaVal2,ntwkIdleRate1,ntwkIdleRate2,ordMtsoNum2,ordMtsoNum1) : compareValue(ordNum1,ordNum2,ntwkCapaVal2,ntwkCapaVal1,ntwkIdleRate2,ntwkIdleRate1,ordMtsoNum1, ordMtsoNum2);
								break;
							case "ordUprNum":
							case "ordLowNum":
								return ordValue == "asc" ? compareValue(ordMtsoNum2, ordMtsoNum1, ordNum2,ordNum1,ntwkCapaVal1,ntwkCapaVal2,ntwkIdleRate1,ntwkIdleRate2) : compareValue(ordMtsoNum1, ordMtsoNum2, ordNum1,ordNum2,ntwkCapaVal2,ntwkCapaVal1,ntwkIdleRate2,ntwkIdleRate1);
								break;							
							case "ntwkIdleRate":
								return ordValue == "asc" ? compareValue(ntwkIdleRate1,ntwkIdleRate2,ordNum2,ordNum1,ntwkCapaVal1,ntwkCapaVal2,ordMtsoNum2,ordMtsoNum1) : compareValue(ntwkIdleRate2,ntwkIdleRate1,ordNum1,ordNum2,ntwkCapaVal2,ntwkCapaVal1,ordMtsoNum1, ordMtsoNum2);
								
								break;
							case "ntwkCapaVal":
								return ordValue == "asc" ? compareValue(ntwkCapaVal1,ntwkCapaVal2,ordNum2,ordNum1,ntwkIdleRate1,ntwkIdleRate2,ordMtsoNum2,ordMtsoNum1) : compareValue(ntwkCapaVal2,ntwkCapaVal1,ordNum1,ordNum2,ntwkIdleRate2,ntwkIdleRate1,ordMtsoNum1, ordMtsoNum2);
								break;
						};
						
					});
					$(gridId).alopexGrid("dataSet",list);
					break;
				case _app.prop.caller.ring: 
					_app.searchList(caller,_app.data.selectPath);
					break;		
				case _app.prop.caller.skbCnnBoxRing:
					var tabId = "#tabRing";
					var gridId = "#"+_app.conf.ringUsedCnnBoxSchGridId;
					var ordType = $(tabId).find("#ordType").val();
					var ordValue = $(tabId).find("#ordValue").val();
					var list = $(gridId).alopexGrid("dataGet");
					list.sort(function(a,b){
						var ordNum1 = a["ordNum"];
						var ordNum2 = b["ordNum"];
						var ntwkIdleRate1 = a["ntwkIdleRate"];
						var ntwkIdleRate2 = b["ntwkIdleRate"];
						var ntwkCapaVal1 = Number(a["ntwkCapaVal"]);
						var ntwkCapaVal2 = Number(b["ntwkCapaVal"]);
						switch(ordType){
							case "ordNum":
								return ordValue == "asc" ? compareValue(ordNum2,ordNum1,ntwkCapaVal1,ntwkCapaVal2,ntwkIdleRate1,ntwkIdleRate2) : compareValue(ordNum1,ordNum2,ntwkCapaVal2,ntwkCapaVal1,ntwkIdleRate2,ntwkIdleRate1);
								break;
							case "ntwkIdleRate":
								return ordValue == "asc" ? compareValue(ntwkIdleRate1,ntwkIdleRate2,ordNum2,ordNum1,ntwkCapaVal1,ntwkCapaVal2) : compareValue(ntwkIdleRate2,ntwkIdleRate1,ordNum1,ordNum2,ntwkCapaVal2,ntwkCapaVal1);
								
								break;
							case "ntwkCapaVal":
								return ordValue == "asc" ? compareValue(ntwkCapaVal1,ntwkCapaVal2,ordNum2,ordNum1,ntwkIdleRate1,ntwkIdleRate2) : compareValue(ntwkCapaVal2,ntwkCapaVal1,ordNum1,ordNum2,ntwkIdleRate2,ntwkIdleRate1);
								break;
						};
					});
					$(gridId).alopexGrid("dataSet",list);
					break;
			}
			_app.updateMapLine(caller);
		},updateMapLine : function(caller){ // 맵에 그리드 데이터에 따른 연결선 추가
			switch(caller){
				case _app.prop.caller.jrdt:
					if($("#jrdtTabs").getCurrentTabIndex()!=_app.prop.tabIdx.jrdt)return;
					var layerNm = _app.prop.customLayerNm.jrdt;
					_app.removeCustomLayer(layerNm);
					var dataList = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
					var dtList = new Array();
					$.each(dataList,function(idx,item){
						dtList[item.lineJrdtMtsoLnoSrno-1] = item;
					});
					if(dtList.length >= 2){
						var result = {features : []};
						var layer = _app.getCustomLayer(layerNm);
						for(var i = 1; i < dtList.length ;i++){
							var dt1 = dtList[i-1];
							var dt2 = dtList[i];
							var ft = { _$id : "jrdtLine"+i,
										type : 'Feature',
										geometry : {
											type: 'LineString',
											coordinates : [[dt1.mtsoLngVal,dt1.mtsoLatVal],[dt2.mtsoLngVal,dt2.mtsoLatVal]]
										},
										properties :{
											uprMtsoId : dt1.mtsoId||dt1.topMtsoId,
											lowMtsoId : dt2.mtsoId||dt2.topMtsoId,
											uprModelNm : dt1.modelNm,
											lowModelNm : dt2.modelNm,
										},
										style : [{id:_app.prop.lineStyleNm.jrdt}]
								};
							_app.showMtso(layerNm,$.extend({},dt1,{mtsoNm : (nullToEmpty(dt1.mtsoNm) == "" ? dt1.topMtsoNm : dt1.mtsoNm), isUprMtso : true}));
							_app.showMtso(layerNm,$.extend({},dt2,{mtsoNm : (nullToEmpty(dt2.mtsoNm) == "" ? dt2.topMtsoNm : dt2.mtsoNm),isLowMtso : true}));
							result.features.push(ft);
						};
						layer.addData(result);
					};
					
					break;
				case _app.prop.caller.path:
					_app.tpu.refreshPath();
					break;
			};
		},makeServiceLineSimul : function(){ // 맵에 구간 연결선 표시
			_app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
			_app.removeCustomLayer(_app.prop.customLayerNm.virtualMtso);
			if($("#jrdtTabs").getCurrentTabIndex()==_app.prop.tabIdx.jrdt){
				return;
			}
			var layerNm = _app.prop.customLayerNm.path;
			_app.removeCustomLayer(layerNm);
			
			var dg1t = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
			if(dg1t.length < 2)return;
			
			var virtualMapPath = _app.tpu.getVirtualMapPath();
			if(virtualMapPath.LINKS.length > 0){  
				var result = {features : []};
				var layer = _app.getCustomLayer(layerNm);
				_app.data.mapMtso = {};
				_app.tpu.uprNodeId = null;
				
				for(var i = 0; i < virtualMapPath.LINKS.length ;i++){					
					var t = virtualMapPath.LINKS[i];
					
					var ln = t.leftNode.Ne.toMtso();
					var rn = t.rightNode.Ne.toMtso();
					var isVirtual = !t.isNetworkLink();
					var lineStyleNm = _app.prop.lineStyleNm.pathVirtual;
					
					if(!isVirtual){
						if(t.isTrunkLink()){
							lineStyleNm = t.Trunk.VIRTUAL_YN == "Y"?  _app.prop.lineStyleNm.virtualNetwork : _app.prop.lineStyleNm.trunk;
						}else if(t.isRingLink()){
							lineStyleNm = t.Ring.VIRTUAL_YN == "Y" ?  _app.prop.lineStyleNm.virtualNetwork : _app.prop.lineStyleNm.ring;
						}else if(t.isWdmTrunkLink()){
							lineStyleNm = _app.prop.lineStyleNm.wdmTrunk;
						};
					};
										
					var ft = { _$id : "trunkLine"+i,
								type : 'Feature',
								geometry : {
									type: 'LineString',
									coordinates : [[ln.MTSO_LNG_VAL,ln.MTSO_LAT_VAL],[rn.MTSO_LNG_VAL,rn.MTSO_LAT_VAL]]
								},
								properties :{ 
									uprMgmtGrpCd : ln.MGMT_GRP_CD,
									uprMtsoId : ln.MTSO_ID,
									uprMtsoNm : ln.MTSO_NM,
									uprMtsoLngVal : ln.MTSO_LNG_VAL,
									uprMtsoLatVal : ln.MTSO_LAT_VAL,
									lowMgmtGrpCd : rn.MGMT_GRP_CD,
									lowMtsoId : rn.MTSO_ID,
									lowMtsoNm : rn.MTSO_NM,
									lowMtsoLngVal : rn.MTSO_LNG_VAL,
									lowMtsoLatVal : rn.MTSO_LAT_VAL,
									uprNodeId : t.leftNode.NODE_ID,
									lowNodeId : t.rightNode.NODE_ID,
									isVirtual : isVirtual,
									isVirtualUpperMtsoNode : t.leftNode.isVirtualUpperMtsoNode,
								    isVirtualLowerMtsoNode : t.rightNode.isVirtualLowerMtsoNode								    
								},
								style : [{id: ( isVirtual ? _app.prop.lineStyleNm.pathVirtual: lineStyleNm)}]
						};
					result.features.push(ft);
					
					var rNodeId = t.rightNode.isVirtualLowerMtsoNode ? null: t.rightNode.NODE_ID;
					
					if(_app.data.mapMtso[ln.MTSO_ID] == null || _app.data.mapMtso[ln.MTSO_ID].isUprMtso != true){
						tdt = {  mtsoId:ln.MTSO_ID
								,mtsoTypCd:(ln.MTSO_ID==ln.TOP_MTSO_ID?"1":"2")
							    ,mtsoLngVal:ln.MTSO_LNG_VAL,mtsoLatVal:ln.MTSO_LAT_VAL
							    ,mtsoNm : ln.MTSO_NM
							    ,topMtsoId:ln.TOP_MTSO_ID
							    ,topMtsoNm:ln.TOP_MTSO_NM
								,mgmtGrpCd:ln.MGMT_GRP_CD
								,modelNm:ln.ModelNm
								,uprNodeId:t.leftNode.isVirtualUpperMtsoNode? rNodeId : t.leftNode.NODE_ID
								,isUprMtso : t.leftNode.isVirtualUpperMtsoNode
								,nextNodeId : isVirtual ? rNodeId : t.leftNode.NODE_ID
								,vtulMtsoYn : _app.cu.isVtMtso(ln.MTSO_ID) ? "Y" : "N"
								,mtsoYn : "Y"
								};
						_app.showMtso(_app.prop.customLayerNm.path, tdt);
						_app.data.mapMtso[ln.MTSO_ID] = tdt;
					};						
					if(_app.data.mapMtso[rn.MTSO_ID] == null ){
						tdt = {  mtsoId:rn.MTSO_ID
								,mtsoTypCd:(rn.MTSO_ID==rn.TOP_MTSO_ID?"1":"2")
								,mtsoLngVal:rn.MTSO_LNG_VAL
								,mtsoLatVal:rn.MTSO_LAT_VAL
								,mtsoNm : rn.MTSO_NM
								,topMtsoId:rn.TOP_MTSO_ID
								,topMtsoNm:rn.TOP_MTSO_NM
								,isVirtualLowerMtsoNode : t.rightNode.isVirtualLowerMtsoNode
								,isLowMtso : t.rightNode.isVirtualLowerMtsoNode
								,mgmtGrpCd:rn.MGMT_GRP_CD
								,modelNm:ln.ModelNm
								,uprNodeId:rNodeId
								,vtulMtsoYn : _app.cu.isVtMtso(rn.MTSO_ID) ? "Y" : "N"
								,mtsoYn : "Y"
							}
						_app.showMtso(_app.prop.customLayerNm.path, tdt);
						_app.data.mapMtso[rn.MTSO_ID] = tdt;
					};
					// 첫구간노드 id
					if (i == 0) {
						_app.tpu.uprNodeId = t.rightNode.NODE_ID;
					} else {
						// 마지막게 마지막 노드
						_app.tpu.lowNodeId = t.rightNode.NODE_ID;
					};
				};
				
				// 상위국사 노드 id가 없는 경우
				if (_app.tpu.uprNodeId == null) {
					_app.tpu.uprNodeId = _app.tpu.lowNodeId;				
				} else if (virtualMapPath.LINKS.length == 1) {
					_app.tpu.uprNodeId = null;
				};
				layer.addData(result);
			};
		},tpu : { 
			isInit : false,
			uprMtso : null,
			lowMtso : null,
			teamsPath : null,
			uprNodeId : null,
			lowNodeId : null,
			uprNetworkNo : null,
			lowNetworkNo : null,
			isExistsTempVtualMtso : false,   // 주소검색으로 빌딩검색결과가 있는경우(가상국사로 추가되지 않은 건물)
			beforeAddVtulMtsoId : "vtMtso",   // 건물국 ID사 임시
			autoMakeVirtualRingYn : "N",  // 상하위국중 가상국사가 있어 자동 생성한 가상 링이 있는지 여부
			vtMtsoData : [],
			getVirtualMapPath : function(){
				if(_app.tpu.isInit == false){
					return null;
				};
				return _app.tpu.teamsPath.toVirtualMapPath(_app.tpu.uprMtso,_app.tpu.lowMtso); 
			},
			chkVerifyPath : function(pathData){ //회선검증
				var isRe = true;
				var pathJrdtMtsoList = new PathJrdtMtsoList();

				//console.log(pathData);;
				pathJrdtMtsoList.fromData(pathData.pathJrdtMtsoList);
				
				var chkTrunkPath = new TeamsPath();
				chkTrunkPath.fromTangoPath(pathData.data);
				//chkTrunkPath.fromTangoPath(pathData);
				chkTrunkPath.verifyTrunkPath(pathJrdtMtsoList);
				
				if(chkTrunkPath.hasVerifyError() == true){
					
					var verifyResult = chkTrunkPath.VERIFY_PATH_RESULT;
					var msg = verifyResult.detailMessage;
					if (msg != "") {
						alertBox('W', msg);
						isRe = false;
					} else {
						for (var i = 0; i < chkTrunkPath.NODES.length; i++) {
							if (chkTrunkPath.NODES[i].VERIFY_ERROR == "Y") {
								msg = chkTrunkPath.NODES[i].VERIFY_PATH_RESULT.detailMessage;
								break;
							}
						}
						
						if (msg != '장비의 A, B 포트 모두 없습니다.  최소 하나라도 입력해야 합니다.') {
							alertBox('W', msg);
							isRe = false;
						}
					}; 
				};
				return isRe;
			},
			init : function(){  // teamsPath 초기화
				var dg1t = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
				if(dg1t.length < 2){
					_app.tpu.teamsPath = null;
					_app.tpu.uprMtso = null;
					_app.tpu.lowMtso = null;
					_app.tpu.isInit = false;

					// 상하위 가입자망 네트워크 아이디 초기화
					_app.tpu.uprNetworkNo = null;
					_app.tpu.lowNetworkNo = null;
					reGenerationDiagram();
				}else{
					var dg1 = camelToUnderscoreJsonList(dg1t); 
					var uprMtsoDt = dg1[0];
					var lowMtsoDt = dg1[1];
					var uprMtso = new Mtso();
					var lowMtso = new Mtso();
					_app.tpu.vtMtsoData = []; 
					uprMtso.fromData(uprMtsoDt,""); 
					lowMtso.fromData(lowMtsoDt,"");
					uprMtso.MTSO_ID = dg1t[0].mtsoId||dg1t[0].topMtsoId;
					lowMtso.MTSO_ID = dg1t[1].mtsoId||dg1t[1].topMtsoId;
					uprMtso.MTSO_NM = dg1t[0].mtsoNm||dg1t[0].topMtsoNm;
					lowMtso.MTSO_NM = dg1t[1].mtsoNm||dg1t[1].topMtsoNm;
					uprMtso.VTUL_MYSO_YN = dg1t[0].vtulMtsoYn;
					lowMtso.VTUL_MYSO_YN = dg1t[1].vtulMtsoYn;

					//가상국사 일 경우 배열로 저장 해놓는다.
					if(dg1t[0].vtulMtsoYn == "Y"){
						_app.tpu.vtMtsoData.push(dg1t[0]);
					};
					if(dg1t[1].vtulMtsoYn == "Y"){
						_app.tpu.vtMtsoData.push(dg1t[1]);
					};
					
					_app.tpu.teamsPath = new TeamsPath();
					_app.tpu.uprMtso = uprMtso;
					_app.tpu.lowMtso = lowMtso;
					
					// 상하위 가입자망 네트워크 아이디 초기화
					_app.tpu.uprNetworkNo = null;
					_app.tpu.lowNetworkNo = null;
					
					_app.tpu.getVirtualMapPath();
					//reGenerationDiagram();
					_app.tpu.isInit = true;
				};
				return _app.tpu.isInit;
			},refreshPath : function(isNew){    // 맵정보를 새로 고친다.
				if(_app.tpu.isInit != true){
					if(_app.tpu.init() == false)return;
				};
				if(isNew == true){
					_app.data.realSelectPath = null;
				};
				_app.makeServiceLineSimul();
			},refreshTabGrid : function(){  //각 탭에서 선택된 가상 링크 변경
				
				var vtList = _app.tpu.getVirtualMapPath().LINKS;
				_app.data.selectPath = null;
				var ls = null; 
				if(_app.data.realSelectPath != null){
					_app.data.selectPath = $.extend({},_app.data.realSelectPath);
				}else{
					if(vtList.length > 0){
						for(var i = vtList.length-1; i > -1;i--){
							vt = vtList[i];
							if(!vt.isNetworkLink()){
								//(vt.leftNode.Ne.MODEL_ID != "" && vt.rightNode.Ne.MODEL_ID != "")
								if(vt.leftNode.Ne.ORG_ID == vt.rightNode.Ne.ORG_ID){
									continue;
								};
								_app.data.selectPath = { 
									uprMtsoId : vt.leftNode.Ne.ORG_ID,
									uprMtsoNm:vt.leftNode.Ne.ORG_NM,
									lowMtsoId : vt.rightNode.Ne.ORG_ID,
									lowMtsoNm: vt.rightNode.Ne.ORG_NM,
									uprNodeId : vt.leftNode.NODE_ID,
									lowNodeId : vt.rightNode.NODE_ID,
								    isVirtualUpperMtsoNode : vt.leftNode.isVirtualUpperMtsoNode,
								    isVirtualLowerMtsoNode : vt.rightNode.isVirtualLowerMtsoNode,
									isVirtual : true
								};
								ls = vtList[i];
							};
						};
						if(ls != null){
							var pos1 = {lat: ls.leftNode.Ne.EQP_INSTL_MTSO_LAT_VAL,lng: ls.leftNode.Ne.EQP_INSTL_MTSO_LNG_VAL};
							var pos2 = {lat: ls.rightNode.Ne.EQP_INSTL_MTSO_LAT_VAL,lng: ls.rightNode.Ne.EQP_INSTL_MTSO_LNG_VAL};
							if($("#jrdtTabs").getCurrentTabIndex() != _app.prop.tabIdx.svln){
								_app.moveMapCenter(pos1,pos2);
							};
						}
					};
				}
				_app.cu.setSearchMtso();
				
				switch($("#jrdtTabs").getCurrentTabIndex()){
					case _app.prop.tabIdx.svln:
						_app.searchList(_app.prop.caller.svln,_app.data.selectPath);	
						break;
					case _app.prop.tabIdx.trunk:
						_app.searchList(_app.prop.caller.trunk,_app.data.selectPath);	
						break;
					case _app.prop.tabIdx.wdmTrunk:
						_app.searchList(_app.prop.caller.wdmTrunk,_app.data.selectPath);	
						break;
					case _app.prop.tabIdx.ring:
						if (_app.data.selectPath == null || nullToEmpty(_app.data.selectPath.isRingUsedCnnBox) != 'Y') {
							// 링검색 그리드 보이기
							$('#'+_app.conf.ringSchGridId).show();
							// 접속함체 링 그리드 숨기기
							$('#'+_app.conf.ringUsedCnnBoxSchGridId).hide();
							if (_app.data.selectPath != null) {
								_app.searchList(_app.prop.caller.ring,_app.data.selectPath);
							}
							
						} else {
							// 링검색 그리드 숨기기
							$('#'+_app.conf.ringSchGridId).hide();
							// 접속함체 링 그리드 보이기
							$('#'+_app.conf.ringUsedCnnBoxSchGridId).show();
							_app.searchList(_app.prop.caller.skbCnnBoxRing,_app.data.selectPath);
						}
						
						break;
				};
			},updateNode : function(prc,opt){ //업데이트 노드
				try{
					switch(prc){
						case "dataAdd":
							switch(opt.nodeType){
								case _app.prop.caller.trunk:
								case _app.prop.caller.wdmTrunk:
									var trunkPath = new TeamsPath();
									trunkPath.fromTangoPath(opt.nodeData);
									if ( trunkPath.isReverseUpperLower(_app.tpu.uprMtso,_app.tpu.lowMtso)) {
										trunkPath.reversePath();
									};
									_app.tpu.teamsPath.insertNode(opt.nodeId, trunkPath);
									break;
								case _app.prop.caller.ring:
									var ringPath = opt.nodeData;
									
									Object.setPrototypeOf(ringPath, TeamsPath.prototype);
									ringPath.resetPrototype();
									_app.tpu.teamsPath.insertNode(opt.nodeId, ringPath); 
									break;
								case _app.prop.caller.eqpInf:
									var data = camelToUnderscoreJson(opt.nodeData);
									data.EQP_INSTL_MTSO_LAT_VAL = data.LOW_MTSO_LAT_VAL;
									data.EQP_INSTL_MTSO_LNG_VAL = data.LOW_MTSO_LNG_VAL;
									data.EQP_INSTL_MGMT_GRP_CD = data.MGMT_GRP_CD;
									var teamsNode = new TeamsNode();
									
									teamsNode.Ne.fromData(data,"");
									_app.tpu.teamsPath.insertNode(opt.nodeId, teamsNode);
									break;
								case _app.prop.caller.virtualPath:
								case _app.prop.caller.skbVirtualRing:
									_app.tpu.teamsPath.insertNode(opt.nodeId, opt.nodeData);
									break;
								case _app.prop.caller.virtualEqpInf:
									_app.tpu.teamsPath.insertNode(opt.nodeId, opt.nodeData);
									break;
							};
							// 네트워크 임시 표시선 삭제
							_app.removeCustomLayer(_app.prop.customLayerNm.virtualPath);
						break;
						case "dataDelete":
							var data = opt.nodeData;
							//상위 혹은 하위 가상 네트워크 삭제
							var nodeInfo = _app.tpu.teamsPath.findNodeById(data.uprNodeId);
							if (nodeInfo.Ring != null) {
								var delNetworkId= nodeInfo.Ring.NETWORK_ID;
								
								if (_app.tpu.uprNetworkNo == delNetworkId) {
									_app.tpu.uprNetworkNo = null;
								} else if (_app.tpu.lowNetworkNo == delNetworkId) {
									_app.tpu.lowNetworkNo = null;
								}
							}
							
							_app.tpu.teamsPath.removeNetwork(data.uprNodeId);
							break;
						case "dataMove":
							var data = opt.nodeData.alopexgrid;
							var ft = data.dragDataList[0];
							var tt = data.data||{};
							var nid = tt.uprNodeId;
							var fid = ft.uprNodeId;
							_app.tpu.teamsPath.moveNode(nid,fid);
							break;
						case "showDetailData":
							var data = opt.nodeData;
							var nodeInfo = data.uprNodeId != null ? _app.tpu.teamsPath.findNodeById(data.uprNodeId): data;

							// 트렁크
							var params = {};
							var popTitle = "";
							var popUrl = "";
							var networkNode = {};
							if (nodeInfo.Trunk != null) {			
								networkNode = nodeInfo.Trunk;
								popTitle = cflineMsgArray['trunkDetailInfo']/*"트렁크 상세"*/;
								popUrl = 'TrunkInfoDiagramPop.do';
								//popUrl = 'TrunkInfoPop.do';
							} else if (nodeInfo.Ring != null) {	
								networkNode = nodeInfo.Ring;
								popTitle = cflineMsgArray['ringDetailInfo']/*"링 상세"*/;
								popUrl = 'RingInfoDiagramPop.do';
								//popUrl = 'RingInfoPop.do';
							} else if (nodeInfo.WdmTrunk != null) {
								networkNode = nodeInfo.WdmTrunk;
								popTitle = cflineMsgArray['wdmTrunkDetailInfo']/*"WDM 트렁크 상세"*/;
								popUrl = 'WdmTrunkDetailPop.do';
								//popUrl = 'WdmTrunkInfoPop.do';
							} else {
								alertBox('W', cflineMsgArray['sectionOfEquipment']/*"장비구간 입니다."*/);
								return;
							}
							
							if (networkNode.VIRTUAL_YN == 'Y') {
								alertBox('W', cflineMsgArray['sectionOfVirtualNetwork']/*"가상네트워크 입니다."*/);
								return;
							}
							//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag, "mgmtGrpCd":dataObj.mgmtGrpCd, "topoLclCd":"002"},
							params = {"ntwkLineNo" : networkNode.NETWORK_ID, "ntwkLnoGrpSrno" : networkNode.PATH_SAME_NO
									, "topoLclCd" : networkNode.TOPOLOGY_LARGE_CD, "topoSclCd" : networkNode.TOPOLOGY_SMALL_CD, "topoCfgMeansCd" : networkNode.TOPOLOGY_CFG_MEANS_CD 
									, "mgmtGrpCd" : _app.data.svlnInfo.mgmtGrpCd, "gridId" : "dataGrid", "sFlag" : "N"//, "gridId" : "dataGridWork", "sFlag" : "Y"
									, "callFromTyp" : "SIM"	
									};
														
							//cflineShowProgressBody();
							//console.log(params);
					    	$a.popup({
					        	popid: "selectNtwDetailInfo",
					    		title: popTitle, 
					    		url: '/tango-transmission-web/configmgmt/cfline/'+popUrl, 
					    		data: params,
					    		iframe: true,
					    		modal: false,
					    		movable:true,
					    		windowpopup : true,
					    		width : (nodeInfo.WdmTrunk != null ? 1600 : 1400),
					    		height : (nodeInfo.WdmTrunk != null ? 940 : 800)//940
					    		,callback:function(ringData){
					    			
					    		}
					    	});	
							break;
					};
					if (prc != "showDetailData") {
						_app.tpu.refreshPath(true);
						
						// 가입자망 검색후 링 추가한 경우 재검색 막기
						if (prc == "dataAdd" &&  _app.prop.caller.ring == opt.nodeType) {
							_app.data.realSelectPath = null;
						}
						_app.tpu.refreshTabGrid();
						reGenerationDiagram();
					}
				}catch(e){
					//console.log("요기");
					// 가입자망 링 추가시 에러발생시 상하위국 네트워크id 초기화  
					if (prc == "dataAdd" &&  _app.prop.caller.ring == opt.nodeType) {
						if (ringPath.NETWORK_ID == _app.tpu.uprNetworkNo) {
							_app.tpu.uprNetworkNo = null;
						} else if (ringPath.NETWORK_ID == _app.tpu.lowNetworkNo) {
							_app.tpu.lowNetworkNo = null;
						}
					}
					alertBox('A',new String(e));
				};
			}
		},
		mu : {  //맵유틸
			setDefaultView : function(){
				_app.map.setView([36.5087805938127, 128.062289345605],3);
			},
			selectPathFeature : function(data){  //다이어그램에서 선택된 데이터로 맵의 구간 선택 
				var layer = _app.getCustomLayer(_app.prop.customLayerNm.path);
				var isNetworkLine = data.NETWORK_ID
				for(var i = 0,las = layer.getLayers() ; i < las.length; i++){
					var la = las[i];
					//if(la.feature.properties.uprNodeId == data.NODE_ID){ //map feature nodeId와 선택된 nodeId 가 같을경우
					
					if((data.category == "NE" && la.feature.geometry.type=="Point") && (data.Ne.ORG_ID == la._object_id) 
							||((data.category != "NE" && la.feature.geometry.type=="LineString") && (la.feature.properties.uprNodeId == data.NODE_ID))){
						var cd = la.feature.geometry.coordinates;
						_app.map.setSelectFeatures([la]);
						_app.onSelectedFeatures();
						if(data.category == "NE"){
							_app.map.setView([cd[1],cd[0]],3);
						}else{
							var pos1 = {lat: cd[0][1],lng: cd[0][0]};
							var pos2 = {lat: cd[1][1],lng: cd[1][0]};
							_app.moveMapCenter(pos1,pos2,3);
						}
						break;
					}
					//};
				};   			
			}
		},cu : { //공통유틸
	    	setSearchMtso : function(){ //검색 상하위 표시  
	    		var tab = null;
	    		var caller = null;
	    		var clearGrigId = null;
	    		switch($("#jrdtTabs").getCurrentTabIndex()){
		    		case _app.prop.tabIdx.svln:
		    			tab = $("#tabSvln");
		    			caller = _app.prop.caller.svln;
		    			clearGrigId = _app.conf.svlnSchGridId;
		    			break;
	    			case _app.prop.tabIdx.trunk:
	    				tab = $("#tabTrunk");
	    				caller = _app.prop.caller.trunk;
	    				clearGrigId = _app.conf.trunkSchGridId;
	    				break;
	    			case _app.prop.tabIdx.ring:
	    				tab = $("#tabRing");
	    				caller = _app.prop.caller.ring;
	    				clearGrigId = _app.conf.ringSchGridId;
	    				break;
	    			case _app.prop.tabIdx.wdmTrunk:
	    				tab = $("#tabWdmTrunk");
	    				caller = _app.prop.caller.wdmTrunk;
	    				clearGrigId = _app.conf.wdmTrunkSchGridId;
	    				break;
	    		};
	    		
	    		if(tab !=null ){
		    		tab.find("#uprMtsoId").val("");
		    		tab.find("#uprMtsoNm").val("");
		    		tab.find("#lowMtsoId").val("");
		    		tab.find("#lowMtsoNm").val("");
		    		$('#'+clearGrigId).alopexGrid("dataEmpty");
					$('#'+clearGrigId).alopexGrid("updateOption",{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + 0;}}});
	    		};
	    		var tPath = _app.data.selectPath;
	    		if($("#jrdtTabs").getCurrentTabIndex() == _app.prop.tabIdx.svln){
	    			var dl = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");
	    			if(dl.length < 2) return;
	    			tPath = {uprMtsoId:_app.tpu.uprMtso.MTSO_ID,uprMtsoNm:_app.tpu.uprMtso.MTSO_NM
	    					,lowMtsoId:_app.tpu.lowMtso.MTSO_ID,lowMtsoNm:_app.tpu.lowMtso.MTSO_NM};
	    		}; 
	    			
	    		if(tab!=null && tPath !=null){
	    			var isUprVtMtso = _app.cu.isVtMtso(tPath.uprMtsoId);
	    			var isLowVtMtso = _app.cu.isVtMtso(tPath.lowMtsoId);
	    			var uprMtsoId = tPath.uprMtsoId;
	    			var uprMtsoNm = tPath.uprMtsoNm;
	    			var lowMtsoId = tPath.lowMtsoId;
	    			var lowMtsoNm = tPath.lowMtsoNm;
	    			if(isUprVtMtso == true){
	    				var vtMtso = _app.cu.getVtMtsoInfo(uprMtsoId);
	    				uprMtsoId = vtMtso.uprMtsoId;
	    				uprMtsoNm = vtMtso.uprMtsoNm;
	    			};
	    			if(isLowVtMtso == true){
	    				var vtMtso = _app.cu.getVtMtsoInfo(lowMtsoId);
	    				lowMtsoId = vtMtso.uprMtsoId;
	    				lowMtsoNm = vtMtso.uprMtsoNm;
	    			};
	    			tab.find("#uprMtsoId").val(uprMtsoId);
	    			tab.find("#uprMtsoNm").val(uprMtsoNm);
	    			tab.find("#lowMtsoId").val(lowMtsoId);
	    			tab.find("#lowMtsoNm").val(lowMtsoNm);
	    			tab.find("#btnSearchPop").setEnabled(true);
	    			
	    			if (tab.find("#uprMtsoId").val() == "") {
	    				tab.find("#btnSearchPop").setEnabled(false);
	    			}
	    		} ;
	    	}, isVtMtso : function(mtsoId){  //국사번호로 가상국사 여부 확인
	    		var ret = false;
	    		for(var i = 0; i < _app.tpu.vtMtsoData.length;i++){
	    			var dt = _app.tpu.vtMtsoData[i];
	    			if(dt.mtsoId == mtsoId){
	    				ret = true;
	    				break;
	    			};
	    		};
	    		return ret;
	    	}, getVtMtsoInfo : function(mtsoId){ //국사번호에 해당하는 가상국사가 있을 경우 국사정보 리턴
	    		var ret = null;
	    		for(var i = 0; i < _app.tpu.vtMtsoData.length;i++){
	    			var dt = _app.tpu.vtMtsoData[i];
	    			if(dt.mtsoId == mtsoId){
	    				ret = dt;
	    				break;
	    			};
	    		};
	    		return ret;
	    	}, resetGrid : function(tabIdx){
				 switch(tabIdx){//임시 (탭변경시 그리드 width:100%를 다시 셋팅).. 
					 case _app.prop.tabIdx.jrdt : 
						$("#"+_app.conf.tmofGridId).alopexGrid("updateOption",{width:null}); 
						$("#"+_app.conf.mtsoGridId).alopexGrid("updateOption",{width:null}); 
						$("#"+_app.conf.jrdtGridId).alopexGrid("updateOption",{width:null}); 
				 		break;
					 case _app.prop.tabIdx.svln:
						 $("#"+_app.conf.svlnSchGridId).alopexGrid("updateOption",{width:null});
						 break;
					 case _app.prop.tabIdx.trunk:
						 $("#"+_app.conf.trunkSchGridId).alopexGrid("updateOption",{width:null});
				 		break;
					 case _app.prop.tabIdx.ring:
						 $("#"+_app.conf.ringSchGridId).alopexGrid("updateOption",{width:null});
				 		break;
					 case _app.prop.tabIdx.eqpInf:
						 $("#"+_app.conf.eqpInfSchGridId).alopexGrid("updateOption",{width:null});
						 break;
					 case _app.prop.tabIdx.wdmTrunk:
						 $("#"+_app.conf.wdmTrunkSchGridId).alopexGrid("updateOption",{width:null});
					    break;
					 case _app.prop.tabIdx.diagram:
						 var width = parseInt($("#jrdtTabs").css("width").replace("px",""))  - 2;
						 var colSize = width < 900 ? 4:7;
						 visualLinePath.layout.wrappingColumn = colSize;
						 visualLinePath.Eb = width;
						 $("#visualDiv").find("canvas").attr({width:width}).css({width:width});
						 //캔버스가 refresh 후 한번에 표시 안되서...임시 방편...
						 visualLinePath.scale = 2;
						 visualLinePath.scale = 1;
						 _app.map.invalidateSize(); //지도 갱신
						 break;
				 };
			}, openMtsoDataPop: function(e){ //국사선택 팝업으로 국사 선택 후 
				if(_app.data.selectPath == null){
					alertBox("W", cflineMsgArray['noExistsSelectionSection']/*"선택된 구간이 없습니다."*/);return;
				} ;
				var caller = "";
				var mtsoId = ""; 
				var mtsoNm = "";
				var paramValue = {};
				if(e.target.id.indexOf("UprMtsoSch") > -1){
					mtsoId = "uprMtsoId";
					mtsoNm = "uprMtsoNm";
				}else{
					mtsoId = "lowMtsoId";
					mtsoNm = "lowMtsoNm";
				};
				if(e.target.id.indexOf("btnTrunk") > -1){
					caller = _app.prop.caller.trunk;
				}else if(e.target.id.indexOf("btnWdmTrunk") > -1){
					caller = _app.prop.caller.wmdTrunk;
				}else if(e.target.id.indexOf("btnRing") > -1){
					caller = _app.prop.caller.ring;
				};
				//var tabName = "#tab"+caller.charAt(0).toUpperCase()+caller.slice(1);
				var tabName = "";
				var tabIndex = $('#jrdtTabs').getCurrentTabIndex();
				
				if(tabIndex == _app.prop.tabIdx.svln){
					tabName = "#tabSvln";
				}else if (tabIndex == _app.prop.tabIdx.trunk) {
					tabName = "#tabTrunk";
				} else if (tabIndex == _app.prop.tabIdx.ring){
					tabName = "#tabRing";
				} else if (tabIndex == _app.prop.tabIdx.wdmTrunk){
					tabName = "#tabWdmTrunk";
				}
				$a.popup({
				  	popid: "popMtsoSch",
				  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
				  	url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
					data: paramValue,
					modal: false,
					movable:true,
					windowpopup : true,
					width : 950,
					height : 750,
					callback:function(data){
						if(data != null){
							$(tabName+" #"+mtsoId).val(data.mtsoId);
							$(tabName+" #"+mtsoNm).val(data.mtsoNm);
							//_app.searchList(caller,{division:"",uprMtsoId:$(tabName +" #uprMtsoId").val(),lowMtsoId:$(tabName+" #lowMtsoId").val()});
						};
					}
				}); 
			},setSelectLinePath : function(param){ //선택한 서비스회선 정보를 복사 "reqPathJrdtMtsoList":"Y" 
				param.reqPathJrdtMtsoList = "Y"; // 관할 국사와 선번의 상하위 비교를 위해
				_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', param, 'GET', 'selectLinePath')
					.done(function(res){
						if(res.data == null){

						}else{
							if(_app.tpu.chkVerifyPath(res)==false){
								return;
							}else if(res.data == null){
								alertBox('A', cflineMsgArray['noExistsNetworkInfo']/*"회선정보가 존재하지 않습니다."*/);
								return;		
							} else {
								var tp = new TeamsPath();
								
								// 가상국사에 의한 가상링 존재여부
								if (_app.tpu.autoMakeVirtualRingYn == "Y") {
									var uprVirtualNode = [];
									var lowVirtualNode = [];
									for (var i = 0 ; i < _app.tpu.teamsPath.NODES.length; i++) {
										var nodeInfo = _app.tpu.teamsPath.NODES[i]; 
										if (nodeInfo.Ring != null && nodeInfo.Ring.VIRTUAL_YN == 'Y') {	
											if (nodeInfo.Ring.NETWORK_ID.indexOf("NEW_VIRTUAL") == 0 
													&& (nodeInfo.Ring.LOW_MTSO_ID.indexOf("VM") == 0 || nodeInfo.Ring.UPR_MTSO_ID.indexOf("VM") == 0)
													&& (nodeInfo.Ring.UPR_MTSO_ID == _app.tpu.uprMtso.MTSO_ID || nodeInfo.Ring.LOW_MTSO_ID == _app.tpu.uprMtso.MTSO_ID )) {
												uprVirtualNode.push(nodeInfo);
											}
											if (nodeInfo.Ring.NETWORK_ID.indexOf("NEW_VIRTUAL") == 0 
													&& (nodeInfo.Ring.LOW_MTSO_ID.indexOf("VM") == 0 || nodeInfo.Ring.UPR_MTSO_ID.indexOf("VM") == 0)
													&& (nodeInfo.Ring.UPR_MTSO_ID == _app.tpu.lowMtso.MTSO_ID || nodeInfo.Ring.LOW_MTSO_ID == _app.tpu.lowMtso.MTSO_ID )) {
												lowVirtualNode.push(nodeInfo);
											}
											
										} else {
											continue;
										}
									}
								} 
								
								tp.fromTangoPath(res.data);
								_app.tpu.init();
								_app.tpu.teamsPath.NODES = tp.NODES;
								_app.tpu.teamsPath.USE_NETWORK_PATHS = tp.USE_NETWORK_PATHS;
								_app.tpu.updateNode(null);
								
								
								if (_app.tpu.autoMakeVirtualRingYn == "Y") {
									if (uprVirtualNode.length == 2) {
										_app.tpu.updateNode("dataAdd", {nodeId:_app.tpu.uprNodeId, nodeData:uprVirtualNode[1], nodeType:_app.prop.caller.virtualPath});
										_app.tpu.updateNode("dataAdd", {nodeId:_app.tpu.uprNodeId, nodeData:uprVirtualNode[0], nodeType:_app.prop.caller.virtualPath});
									} 
									if (lowVirtualNode.length == 2) {
										_app.tpu.updateNode("dataAdd", {nodeId:null, nodeData:lowVirtualNode[0], nodeType:_app.prop.caller.virtualPath});
										_app.tpu.updateNode("dataAdd", {nodeId:null, nodeData:lowVirtualNode[1], nodeType:_app.prop.caller.virtualPath});
									}
								}

								$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.diagram);
							}
						}
					});				
			}
	    },
		httpRequest : function(Url, Param, Method, Flag, isProcess ) {  //ajax 공통 함수  (jquery deferred로 callback 외 추가 작업 가능)
			var deferred = $.Deferred();
			if(isProcess!=false){
				cflineShowProgressBody();
			};
	    	Tango.ajax({
	    		url : Url, data : Param, method : Method, flag : Flag
	    	}).done(function(response, status, jqxhr, flag){
	    		_app.successCallback(response, status, jqxhr, flag,Param);
	    		deferred.resolve(response);
	    	}).fail(function(response, status, jqxhr, flag){
    			_app.failCallback(response, status, jqxhr, flag,Param);
    			deferred.resolve(response);
	    	});
	    	return deferred.promise();
	    },getData : function(gridId){
	    	return $('#'+gridId).alopexGrid("dataGet");
	    },setEditMode : function(opt){
	    	if(opt == true){
	    		 workYn = 'Y';
	    		 if (workYn == 'Y') {
	    			 visualLinePath.isEnabled = true;
	    			 // 컨텍스트 메뉴 보이기 설정	    			 
	    			 nodeSelectionAdornedPath();
	    			 // 펼치기 버튼 보이기 설정
	    			 showSubGraphExpanderButtonAtEditMode();
	    		 }
	        	 $('.modi').show();
	        	 $('#btnEdit').hide();
	        	 $('#btnSave').show();
	    	}else{
	    		$('.modi').hide();
	    		$('#btnEdit').show();
	    		$('#btnSave').hide();
	    		visualLinePath.isEnabled = false;
   			 	// 컨텍스트 메뉴 보이기 설정	  
	    		nodeSelectionAdornedPath();
   			 	// 펼치기 버튼 보이기 설정
	    		showSubGraphExpanderButtonAtEditMode();
	    		$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.diagram);
	    	}
	    },doSave : function(){
	    	var result = false;
	    	var jrdtMtsoParam = AlopexGrid.trimData ($('#jrdtGridId').alopexGrid('dataGet'));
	    	if (jrdtMtsoParam.length != 2) {
	    		$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.jrdt);
	    		alertBox("W", cflineMsgArray['pleaseChooseUperLowMtso']/*"상하위국을 설정해 주세요."*/);
	    		return;
	    	};  
	    	
	    	callMsgBox('','C', cflineMsgArray['save']/*저장하시겠습니까?*/, function(msgId, msgRst){
				if(msgRst == "Y"){
					//선번저장
			    	_app.tpu.teamsPath.LINE_LARGE_CD = _app.data.svlnInfo.svlnLclCd;
			    	_app.tpu.teamsPath.LINE_SMALL_CD = _app.data.svlnInfo.svlnSclCd;
					var param = {
							 "NETWORK_ID" : _app.data.svlnInfo.svlnNo,
							 "USER_ID" : $("#sessionUserId").val(),
							 "PATH" : JSON.stringify(_app.tpu.teamsPath.toShortPath().toData())
						};
					
					//console.log(_app.tpu.teamsPath.toShortPath().toData());
					_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/virtualLinePath/saveVirtualLinePath', param, 'POST', 'saveNetworkPath')
						.done(function(response){
							if(response.PATH_RESULT) {
								_app.doSaveJrdtMtso();
							} else {
								alertBox('W', response.PATH_ERROR_MSG);
							}
						});
				}
			});
	    }
	    ,doSaveJrdtMtso: function(){
	    	var result = false;
	    	//callMsgBox('','C', "변경사항을 저장 하시겠습니까?", function(msgId, msgRst){
			//	if(msgRst == "Y"){
					// 관할국사 저장
	    			var jrdtMtsoParam = AlopexGrid.trimData ($('#jrdtGridId').alopexGrid('dataGet'));                          
			    	var updateData = [];
			    	if (jrdtMtsoParam.length > 0) {
		    			$.each(jrdtMtsoParam, function(idx, obj){
		    				obj.svlnNo = _app.data.svlnInfo.svlnNo;  // 서비스회선번호
		    				obj.lastChgUserId = $("#sessionUserId").val();
		    				updateData.push(obj);
		    			});
		        	};
			    	_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/savesimulationjrdtmtso', updateData, 'POST', 'saveJrdtMtso');
			//	};
	    	//});
	    }
	    // 접속함체 보이기 숨기기
	    ,onOffCnnBox:function(flag,key){
    		// 접속함체 표시
	    	if (!_app.isSkbB2bOrUserLine()) {
	    		return;
	    	}
	    	_.each(_app.prop.connBox, function(layer, index) { //탱고맵 기본 레이어 중 접속함체 보이기/숨기기
	    		if((key == "fdlk" && layer.id != _app.prop.connBox.bFdlk.id) || (key == "cnpt" && layer.id == _app.prop.connBox.bFdlk.id)){
	    			return;
	    		};
	    		_app.map.getLayerById(layer.id).setVisible(flag); 
	    	});
	    }
	    // 접속함체 레이어 여부
	    , chkCnnBoxYn:function(layerNm) {
	    	if (_app.prop.connBox.bFtthMa.id == layerNm
	    			|| _app.prop.connBox.bCnptGe.id == layerNm
	    			|| _app.prop.connBox.bCnptSlf.id == layerNm
	    			|| _app.prop.connBox.bCnptOhcpn.id == layerNm
	    			|| _app.prop.connBox.bVtulCnpt.id == layerNm
	    			|| _app.prop.connBox.bFdlk.id == layerNm
	    		) {
	    		return true;
	    	} else {
	    		return false;
	    	}
	    }
	    , selectRingUsedCnnBox:function(data) {

	    	var param = {
	    			cnnBoxNo : data._$id
	    	};
	    	
	    	var jrdtMtsoParam = AlopexGrid.trimData ($('#jrdtGridId').alopexGrid('dataGet'));                          
	    	var updateData = [];
	    	if (jrdtMtsoParam.length > 0) {
    			$.each(jrdtMtsoParam, function(idx, obj){
    				if (obj.jrdtMtsoTypCd == "01") {
    					param.uprMtsoId = obj.mtsoId;
    					param.uprMtsoNm = obj.mtsoNm;
    				} else {
    					param.lowMtsoId = obj.mtsoId;
    					param.lowMtsoNm = obj.mtsoNm;
    				}
    			});
        	};
        	_app.data.realSelectPath = {
					uprMgmtGrpCd : _app.data.svlnInfo.mgmtGrpCd,	
					uprMtsoId : param.uprMtsoId,
					uprMtsoNm : param.uprMtsoNm,
					uprMtsoLngVal : data.geometry.coordinates[0],
					uprMtsoLatVal : data.geometry.coordinates[1],
					lowMgmtGrpCd : _app.data.svlnInfo.mgmtGrpCd,
					lowMtsoId : param.lowMtsoId,
					lowMtsoNm : param.lowMtsoNm,
					lowMtsoLngVal : data.geometry.coordinates[0],
					lowMtsoLatVal : data.geometry.coordinates[1],
					uprNodeId : null,
					lowNodeId : null,
					isVirtual : false,
				    isVirtualLowerMtsoNode : "Y",
				    isUserRing : "Y",
				    isRingUsedCnnBox : "Y",
				    cnnBoxNo: param.cnnBoxNo
				    
				};

        		//console.log(_app.data.realSelectPath);
	        	// 링검색 그리드 숨기기
				$('#'+_app.conf.ringSchGridId).hide();
				// 접속함체 링 그리드 보이기
				$('#'+_app.conf.ringUsedCnnBoxSchGridId).show();
				
				$("#jrdtTabs").setTabIndex(_app.prop.tabIdx.ring);
	    	//_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchringusedcnnboxlist', param, 'GET', 'ringUsedCnnBox');
	    }
	    , searchPathMtsoInfo :function(mtsoId, caller)  { //국사의 장비,주소 데이터 검색
	    	var deferred = $.Deferred();
	    	var param = {mtsoId : mtsoId};
	    	
	    	var data = _app.data.mtsoAddr[mtsoId];
	    	if(data == null){
	    		var flag = {
	    				"flag" : 'searchPathMtsoInfo'
	    			  , "caller" : caller
	    		}
		    	_app.httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchpathmtsoinfo', param, 'GET', flag, false)
			    	.done(function(response){
						if(response.pathMtsoInfo != null) {
							var data = response.pathMtsoInfo;
							deferred.resolve(data);
							_app.data.mtsoAddr[data.mtsoId] = data;
							//console.log(_app.data.mtsoAddr[data.mtsoId]);
						} 
					});
	    	}else{
	    		deferred.resolve(data);
	    	}
	    	return deferred.promise();
		}
	    // SKB회선이고, B2B/가입자회선
	    , isSkbB2bOrUserLine : function(){
	    	if (_app.data.svlnInfo.mgmtGrpCd == "0002" && (_app.data.svlnInfo.svlnLclCd == "004" || _app.data.svlnInfo.svlnLclCd == "005")) {
	    		return true;
	    	} else {
	    		false;
	    	}
	    }
	    
	    // 그리드의 회선/네트워크 클릭시 지도에 선번정보 기준 상세링크를 임시로 표시
	    , tempLinkOnMap : function(layerNm, data, caller) {

	    	// 네트워크 id 클릭시는 이벤트 발생 없음
	    	var dataKey = data._key; 
    	 	if(dataKey == "ntwkLineNo"){
    	 	  return ; 
    	 	}
    	 	
    	 	// 현재 맵에 표시된 임시 네트워크인 경우 이벤트 발생 없음
    	 	var layer = _app.map.getCustomLayerByName(layerNm);
			if(nullToEmpty(layer) != "") {
				var chkLayer = false;
				for(var i = 0 ; i < layer.getLayers().length; i++){
					var la = layer.getLayers()[i];
					if(L.MG.Util.objectId(la) == data.ntwkLineNo){
						chkLayer = true;
						return false;
					};
				}
				// 레이어가 존재하면
				if (chkLayer == true) {
					return;
				}
			}
    	 	
	    	var result = {features : []};
	    	
			layer = _app.getCustomLayer(layerNm,true);

			var tp = new TeamsPath();
			var searchParam = {"ntwkLineNo":data.ntwkLineNo};
			// 호출 네트워크에 따라서 해당 정보 추출 다르게
			var callUrl = 'tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath';
			switch(caller){
	    		case _app.prop.caller.svln:
	    			callUrl = 'tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath';	    			
	    			break;
	    		case _app.prop.caller.trunk:
	    		case _app.prop.caller.ring:
	    		case _app.prop.caller.wdmTrunk:
	    			callUrl = 'tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath';
	    			searchParam.wkSprDivCd = "01";
	    			searchParam.autoClctYn = "N";
	    			searchParam.ringMgmtDivCd = "1";
	    			
			       break;
			}
			
			_app.httpRequest(callUrl, searchParam, 'GET', 'selectTempPath')
			.done(function(res){
				if(res.data != null){	
					tp.fromTangoPath(res.data);
					
					//console.log(tp);
					
					if (tp.NODES.length == 0) {
						return;
					}
					
					var tempLinkMtsoVal = _app.makeTempLinkLine(tp);
					
					var ft = { _$id : data.ntwkLineNo,
							type : 'Feature',
							geometry : {
								type: 'LineString',
								//coordinates : [[data.uprMtsoLngVal,data.uprMtsoLatVal],[data.lowMtsoLngVal,data.lowMtsoLatVal]]
								coordinates : tempLinkMtsoVal.linkInfo
							},
							properties :{
								uprMtsoId : tempLinkMtsoVal.uprMtsoId,
								lowMtsoId : tempLinkMtsoVal.lowMtsoId,
								isDelete : true
							},
							style : [{id: _app.prop.lineStyleNm.pathTemp}]
					};
					
					result.features.push(ft);
					layer.addData(result);
					
					
					// 임시 표시선 국사 표시
					if (tempLinkMtsoVal.mtsoInfo.length > 0) {
						for (var i = 0; i < tempLinkMtsoVal.mtsoInfo.length; i++) {
							_app.showMtso(layerNm, tempLinkMtsoVal.mtsoInfo[i], false);
						}
					}
				}
				
				// 링크표시
			});		
	    }
	    
	    // 임시링크 좌표 편집
	    , makeTempLinkLine : function (tempTeamsData) {
	    	
	    	var tempNodes = tempTeamsData.NODES;
	    	var tempLinkMtsoVal = {
	    			linkInfo : []
	    	      , mtsoInfo : []
	    	      , uprMtsoId :""
		    	  , lowMtsoId :""
	    	};
	    	var tempPreNode = null;
	    	var tempCurrNode = null;
	    		    	
	    	for (var i = 0 ; i < tempNodes.length; i++) {
	    		
	    		tempCurrNode = tempNodes[i];
	    		
	    		var tempMtsoInfo = {};
	    		// 이전 노드가 있으면
	    		if (tempPreNode != null) {
	    			if (  ( tempPreNode.Ne.EQP_INSTL_MTSO_LAT_VAL != tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL
	    					|| tempPreNode.Ne.EQP_INSTL_MTSO_LNG_VAL != tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL)
	    				 && (tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != "" && tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != null && tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != 0
	    					&& 	tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != "" && tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != null && tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != 0 )
	    				) {
	    				
	    				// 구간
	    				tempLinkMtsoVal.linkInfo.push([tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL, tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL]);
	    				
	    				// 하위국사
	    				tempLinkMtsoVal.lowMtsoId = tempCurrNode.Ne.ORG_ID;
	    				
	    				// 국사좌표
	    				tempMtsoInfo = {
	    						mtsoId : tempCurrNode.Ne.ORG_ID
	    					  , topMtsoId : tempCurrNode.Ne.ORG_ID_L3
	    					  , mtsoNm : tempCurrNode.Ne.ORG_NM
	    				      , mtsoLngVal : tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL
	    				      , mtsoLatVal : tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL
	    					  , mtsoNm : tempCurrNode.Ne.ORG_NM	
	    					  , vtulMtsoYn : "N"
	    				      , mtsoTypCd : (tempCurrNode.Ne.ORG_ID == tempCurrNode.Ne.ORG_ID_L3 ? "1" : "")
	    				      , mgmtGrpCd : tempCurrNode.Ne.EQP_INSTL_MGMT_GRP_CD
	    				      , topMtsoNm : tempCurrNode.Ne.ORG_NM_L3
	    				      , uprMtsoId : ""
	    				      , uprMtsoNm : ""
	    				};
	    				tempLinkMtsoVal.mtsoInfo.push(tempMtsoInfo);
	    				
	    			}
	    		} else {
	    			if (tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != "" && tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != null && tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL != 0
	    					&& 	tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != "" && tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != null && tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL != 0) {

	    				// 구간
	    				tempLinkMtsoVal.linkInfo.push([tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL, tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL]);
	    				
	    				// 상위국사
	    				if (tempLinkMtsoVal.uprMtsoId == "") {
	    					tempLinkMtsoVal.uprMtsoId = tempCurrNode.Ne.ORG_ID;
	    				}
	    				
	    				// 국사좌표
	    				tempMtsoInfo = {
	    						    mtsoId : tempCurrNode.Ne.ORG_ID
		    					  , topMtsoId : tempCurrNode.Ne.ORG_ID_L3
		    					  , mtsoNm : tempCurrNode.Ne.ORG_NM
		    				      , mtsoLngVal : tempCurrNode.Ne.EQP_INSTL_MTSO_LNG_VAL
		    				      , mtsoLatVal : tempCurrNode.Ne.EQP_INSTL_MTSO_LAT_VAL
		    					  , mtsoNm : tempCurrNode.Ne.ORG_NM	
		    					  , vtulMtsoYn : "N"
		    				      , mtsoTypCd : (tempCurrNode.Ne.ORG_ID == tempCurrNode.Ne.ORG_ID_L3 ? "1" : "")
		    				      , mgmtGrpCd : tempCurrNode.Ne.EQP_INSTL_MGMT_GRP_CD
		    				      , topMtsoNm : tempCurrNode.Ne.ORG_NM_L3
		    				      , uprMtsoId : ""
		    				      , uprMtsoNm : ""
	    				};
	    				tempLinkMtsoVal.mtsoInfo.push(tempMtsoInfo);
	    			}
	    		}
	    			    		
	    		tempPreNode = tempCurrNode;
	    		
	    	}
	    	return tempLinkMtsoVal;
	    }
	    // 가상국사 상/하위국을 위한 가상링 만들기
	    , makeAutoVirtualRingForVirtualMtso : function () {
	    	// 가상 링 존재여부
	    	_app.tpu.autoMakeVirtualRingYn = "N";  // 초기화
	    	// 관할국사 취득
	    	var lists = $('#'+_app.conf.jrdtGridId).alopexGrid("dataGet");

	    	var up = null; 
	    	var low = null; 
	    	var virtualMtsoYn = "N";
	    	for (var i=0; i < lists.length; i++) {
	    		var tempMtso = lists[i];
	    		if (tempMtso.vtulMtsoYn == "Y") {
	    			virtualMtsoYn = "Y";
	    		}
	    		
	    		if (tempMtso.jrdtMtsoTypCd == "01" ) {
					up = tempMtso.mtsoNm||tempMtso.topMtsoNm;
				} else {
					low = tempMtso.mtsoNm||tempMtso.topMtsoNm;
				}
	    	}	    	   	
	    	
	    	if (virtualMtsoYn == "Y") {	    		
	    	
	    		// 가상국사용 가상링 추가여부
		    	callMsgBox('','C', cflineMsgArray['autoMakeVirtualRing'], function(msgId, msgRst){ /*선택된 상하위국중 가상국사가 존재합니다. <br/> 가상국사를 포함한 가상 링을 추가하시겠습니까?*/
		    		var failAutoMakeVirtualRing = "";
					if(msgRst == "Y"){
						// 가상국사 추가 call
						for (var i = 0; i < lists.length; i++) {
							var tempMtso = lists[i];			
							
							if (tempMtso.vtulMtsoYn == "N") {
				    			continue;
				    		}
							
							var tempVirtualNetwork = {
									  ntwkNm : tempMtso.mtsoNm + " 가상 링"
									, topoLclCd: "001"
									, topoSclCd: "000"
									, uprMgmtGrpCd : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.mgmtGrpCd : tempMtso.uprMgmtGrpCd)
									, uprMtsoId : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.mtsoId : tempMtso.uprMtsoId)
									, uprMtsoNm : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.mtsoNm : tempMtso.uprMtsoNm)
									, uprMtsoLngVal : (tempMtso.jrdtMtsoTypCd == "01" ? nullToEmpty(tempMtso.mtsoLngVal) : nullToEmpty(tempMtso.uprMtsoLngVal))
									, uprMtsoLatVal : (tempMtso.jrdtMtsoTypCd == "01" ? nullToEmpty(tempMtso.mtsoLatVal) : nullToEmpty(tempMtso.uprMtsoLatVal))
									
									, lowMgmtGrpCd : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.uprMgmtGrpCd : tempMtso.mgmtGrpCd )
									, lowMtsoId : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.uprMtsoId : tempMtso.mtsoId)
									, lowMtsoNm : (tempMtso.jrdtMtsoTypCd == "01" ? tempMtso.uprMtsoNm : tempMtso.mtsoNm)
									, lowMtsoLngVal : (tempMtso.jrdtMtsoTypCd == "01" ? nullToEmpty(tempMtso.uprMtsoLngVal) : nullToEmpty(tempMtso.mtsoLngVal))
									, lowMtsoLatVal : (tempMtso.jrdtMtsoTypCd == "01" ? nullToEmpty(tempMtso.uprMtsoLatVal) : nullToEmpty(tempMtso.mtsoLatVal))
							}
							//tempVirtualNetwork.uprMtsoLngVal = '';
							if (tempVirtualNetwork.uprMtsoLngVal == '' 
								|| tempVirtualNetwork.uprMtsoLatVal == ''
								|| tempVirtualNetwork.lowMtsoLngVal == ''
								|| tempVirtualNetwork.lowMtsoLatVal == '' ) {
								failAutoMakeVirtualRing = makeArgMsg('failAutoMakeVirtualRing', nullToEmpty(tempMtso.mtsoNm) , nullToEmpty(tempMtso.uprMtsoNm)) + "<br><br>";//{0}의 상위국사 {1}의 좌표값이 없어 가상 링을 추가할 수 없습니다.
								continue;
							}
														
							var mtsoDt = camelToUnderscoreJson(tempVirtualNetwork);
							var uprMtso = new Mtso();
							var lowMtso = new Mtso();
							uprMtso.fromData(mtsoDt,"UPR_"); 
							lowMtso.fromData(mtsoDt,"LOW_");
																		
							var virtualNetwork = _app.tpu.teamsPath.createVirtualNetwork(tempVirtualNetwork.ntwkNm, tempVirtualNetwork.topoLclCd, tempVirtualNetwork.topoSclCd ,uprMtso,lowMtso);
							_app.tpu.updateNode("dataAdd", {nodeId:null, nodeData:virtualNetwork, nodeType:_app.prop.caller.virtualPath});
							_app.tpu.autoMakeVirtualRingYn = "Y";
						}						
					}
					
					if (failAutoMakeVirtualRing != '') {
						//alertBox("W", failAutoMakeVirtualRing);
						console.log(failAutoMakeVirtualRing);
					}
					
					
					// 가상링 자동생성 작업후 서비스회선 검색
					//callMsgBox('','C', makeArgMsg('autoSearchTrunk', up, low), function(msgId, msgRst){ /*선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 트렁크선택화면으로 이동 하시겠습니까?*/
					callMsgBox('','C', failAutoMakeVirtualRing + makeArgMsg('autoSearchServiceLine', up, low), function(msgId, msgRst){ /*선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 서비스회선선택화면으로 이동 하시겠습니까?*/
						if(msgRst == "Y"){
							$("#"+_app.conf.svlnSchGridId).alopexGrid("dataEmpty");
							var param = {uprMtsoId: lists[0].mtsoId||lists[0].topMtsoId ,lowMtsoId:lists[1].mtsoId||lists[1].topMtsoId};
							//$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.trunk);
							$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.svln);
						}
					});
				});
	    	} else {
		    	
		    	// 가상링 자동생성 작업후 서비스회선 검색
				//callMsgBox('','C', makeArgMsg('autoSearchTrunk', up, low), function(msgId, msgRst){ /*선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 트렁크선택화면으로 이동 하시겠습니까?*/
				callMsgBox('','C', makeArgMsg('autoSearchServiceLine', up, low), function(msgId, msgRst){ /*선택된 상위국은 [<b>"+up+"</b>] 선택된 하위국은 [<b>"+low+"</b>]입니다. <br/> 서비스회선선택화면으로 이동 하시겠습니까?*/
					if(msgRst == "Y"){
						$("#"+_app.conf.svlnSchGridId).alopexGrid("dataEmpty");
						var param = {uprMtsoId: lists[0].mtsoId||lists[0].topMtsoId ,lowMtsoId:lists[1].mtsoId||lists[1].topMtsoId};
						//$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.trunk);
						$('#jrdtTabs').setTabIndex(_app.prop.tabIdx.svln);
					}
				});
	    	}
	    }
	};
	_app.init();
	return _app;
};
function getCheckBoxColumn(value){
	return '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper' + (value === true ? ' checked':'') +'">'
	      +'<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" /></label>';
}
function trunkStyleCss(value, data, mapping) {
	var style = { 'white-space' : 'pre-line' };
	if(value != null && value != undefined && value != "") { style['background-color'] = '#F1EBBF'; }
	return style;
}
function ringStyleCss(value, data, mapping) {
	var style = { 'white-space' : 'pre-line' }; 
	if(value != null && value != undefined && value != "") { style['background-color'] = '#FFEAEA'; } 
	return style; 
}
function wdmStyleCss(value, data, mapping) {
	var style = { 'white-space' : 'pre-line' }; 
	if(value != null && value != undefined && value != "") { style['background-color'] = '#D6EED6'; } 
	return style;
}
/**
 * 장비 툴팁
 * @param value
 * @param data
 * @param mapping
 */
function tooltipText(value, data, mapping){
	var str = "삭제된 장비 또는 포트입니다.";
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return str;
	} else {
		if ( mapping.key == 'NE_NM' ) {
			str = '장비ID : ' + nullToEmpty(data.NE_ID) + '\n장비명 : ' + nullToEmpty(data.NE_NM) + '\n장비역할 : ' + nullToEmpty(data.NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.ORG_NM) + '\n전송실 : ' + nullToEmpty(data.ORG_NM_L3)
				 	+ '\n더미장비 : ' + nullToEmpty(data.NE_DUMMY);
		}
		else if ( mapping.key == 'A_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.A_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.A_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.A_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.A_PORT_DUMMY);
		}
		else if ( mapping.key == 'B_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.B_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.B_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.B_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.B_PORT_DUMMY);
		}
		else if( mapping.key == 'LEFT_NE_NM') {
			str = '장비ID : ' + nullToEmpty(data.LEFT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.LEFT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.LEFT_NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.LEFT_VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.LEFT_MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.LEFT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.LEFT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.LEFT_MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.LEFT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.LEFT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.LEFT_ORG_NM_L3)
				 	+ '\n더미장비 : ' + nullToEmpty(data.LEFT_NE_DUMMY);
		}
		else if ( mapping.key == 'RIGHT_NE_NM' ) {
			str = '장비ID : ' + nullToEmpty(data.RIGHT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.RIGHT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.RIGHT_NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.RIGHT_VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.RIGHT_MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.RIGHT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.RIGHT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.RIGHT_MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.RIGHT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.RIGHT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.RIGHT_ORG_NM_L3)
					+ '\n더미장비 : ' + nullToEmpty(data.RIGHT_NE_DUMMY);
		}		
		else if ( mapping.key == 'LEFT_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.LEFT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.LEFT_PORT_DUMMY);
		}
		else if ( mapping.key == 'RIGHT_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.RIGHT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.RIGHT_PORT_DUMMY);
		}
		else {
			str = value;
		}
	}
	return str;
}
function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if(mapping.key == 'LEFT_NE_NM') {
		if(data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'LEFT_PORT_DESCR' || mapping.key == 'LEFT_CHANNEL_DESCR') {
		if(data.LEFT_PORT_STATUS_CD == '0003' || data.LEFT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		} 
	}
	
	// EAST 장비
	if(mapping.key == 'RIGHT_NE_NM') {
		if(data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'RIGHT_PORT_DESCR' || mapping.key == 'RIGHT_CHANNEL_DESCR') {
		if(data.RIGHT_PORT_STATUS_CD == '0003' || data.RIGHT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		} 
	}
	return deletecheck;
}
String.prototype.camelToUnderscore = function(){
	return this.replace(/([a-z])([A-Z])/g,'$1_$2').toUpperCase();
}
function camelToUnderscoreJson(obj){
	if(obj == null){
		return null;
	};
	var rstObj = {};
	for(var key in obj){
		rstObj[key.camelToUnderscore()]=obj[key];
	};
	return rstObj;	
}
function camelToUnderscoreJsonList(objList){
	if(objList instanceof Array == false){
		return null;
	};
	var rstObjList = [];
	for(var i = 0; i < objList.length; i++){
		rstObjList.push(camelToUnderscoreJson(objList[i]));
	};
	return rstObjList;
}

// 상위국 일치/ 하위국 일치 건 제외
function compareValue(a,b,c,d,e,f,g,h){
	
	if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	} else {
		if (c < d) {
			return -1;
		} else if (c > d) {
			return 1;
		} else {
			if (e < f) {
				return -1;
			} else if (e > f) {
				return 1;
			} else {
				if (g < h) {
					return -1;
				} else if (g > h) {
					return 1;
				} else {
					return 0;
				}
			}
		}
	}
	//return a < b ? -1 : a > b ? 1 : 0;	
}

function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2){ //두 좌표의 위도 경도로 거리 계산
	function deg2rad(deg){
		return deg * (Math.PI/180)
	};
	var R = 6371; //Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);
	var dLon = deg2rad(lng2-lng1);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
	var d = R * c;
	return d;
}