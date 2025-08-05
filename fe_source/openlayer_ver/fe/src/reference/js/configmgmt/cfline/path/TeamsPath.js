/**
 * TeamsPath.js
 * 
 * *** 수정이력 ***
 * 2018-09-12 1.RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-11-05 2. 기간망 링 선번 고도화 : 인접링 노드 삭제처리 취소
 */

function TeamsPath() { 
	
   	this.NETWORK_ID = '';
	this.NETWORK_NM = '';

	this.NETWORK_STATUS_CD = '';
	this.NETWORK_STATUS_NM = '';
	
	
	this.TOPOLOGY_LARGE_CD = '';
	this.TOPOLOGY_LARGE_NM = '';
	this.TOPOLOGY_SMALL_CD = '';
	this.TOPOLOGY_SMALL_NM = '';        	
	this.TOPOLOGY_CFG_MEANS_CD = '';        	
	this.TOPOLOGY_CFG_MEANS_NM = '';        	

	this.LINE_STATUS_CD = '';
	this.LINE_STATUS_NM = '';
	this.LINE_LARGE_CD = '';
	this.LINE_LARGE_NM = '';
	this.LINE_SMALL_CD = '';
	this.LINE_SMALL_NM = '';        	

	this.PATH_SAME_NO = '';
	this.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH = '';
	
	this.NODES = [];
	this.USE_NETWORK_PATHS = [];
};




TeamsPath.prototype = new Object();

TeamsPath.prototype.constructor = TeamsPath;



/**
 * JSON 형태의 데이터를 읽는다.
 * @param obj
 */
TeamsPath.prototype.fromData = function( obj ) {
	
	copyAttributeAll(obj, this);	

    for (  var idx = 0; idx < obj.NODES.length; idx++ ) {
        var node = new TeamsNode();
        node.fromData( obj.NODES[idx], '' );
        this.NODES.push(node);
    }
	
   	this.resetPortDescrEditable();
    this.resetSeq();
};



/**
 * Object Type 의 이 객체를 TeamsPath Type 객체로 변환한다. 
 */
TeamsPath.prototype.resetPrototype = function() {

	if ( this.NODES != null ) {
		for (var idx = 0; idx < this.NODES.length; idx++) {
			var node = this.NODES[idx];
			Object.setPrototypeOf(node, TeamsNode.prototype);
			node.resetPrototype();
		}
	}

};



/**
 * NODE_ID 를 새로 발급한다.
 */
TeamsPath.prototype.resetNodeId = function() {
	if ( this.NODES != null ) {
		for (var idx = 0; idx < this.NODES.length; idx++) {
			var node = this.NODES[idx];
			node.resetNodeId();
		}
	}
};


/**
 * 이 선번의 네트워크 정보로 Network 를 생성한다.
 * 이 선번은 네트워크 선번이라 가정한다.
 */
TeamsPath.prototype.createNetworkInfo = function() {
	var useNetwork = new Network();
	useNetwork.NETWORK_ID = this.NETWORK_ID;
	useNetwork.NETWORK_NM = this.NETWORK_NM;
	
	useNetwork.NETWORK_STATUS_CD = this.NETWORK_STATUS_CD;
	useNetwork.NETWORK_STATUS_NM = this.NETWORK_STATUS_NM;

	useNetwork.NETWORK_TYPE_CD = this.NETWORK_TYPE_CD;
	useNetwork.NETWORK_TYPE_NM = this.NETWORK_TYPE_NM;
	
	useNetwork.PATH_SAME_NO = this.PATH_SAME_NO;
	useNetwork.PATH_DIRECTION = 'RIGHT';

	useNetwork.TOPOLOGY_LARGE_CD = this.TOPOLOGY_LARGE_CD;
	useNetwork.TOPOLOGY_LARGE_NM = this.TOPOLOGY_LARGE_NM;
	useNetwork.TOPOLOGY_SMALL_CD = this.TOPOLOGY_SMALL_CD;
	useNetwork.TOPOLOGY_SMALL_NM = this.TOPOLOGY_SMALL_NM;
	useNetwork.TOPOLOGY_CFG_MEANS_CD = this.TOPOLOGY_CFG_MEANS_CD;
	useNetwork.TOPOLOGY_CFG_MEANS_NM = this.TOPOLOGY_CFG_MEANS_NM;

	useNetwork.UPR_MTSO_ID = this.UPR_MTSO_ID;
	useNetwork.LOW_MTSO_ID = this.LOW_MTSO_ID;
	useNetwork.VIRTUAL_YN = this.VIRTUAL_YN;
	
	if (this.LINE_SMALL_CD !='') {
		useNetwork.LINE_STATUS_CD = this.LINE_STATUS_CD;
		useNetwork.LINE_STATUS_NM = this.LINE_STATUS_NM;
		useNetwork.LINE_LARGE_CD = this.LINE_LARGE_CD;
		useNetwork.LINE_LARGE_NM = this.LINE_LARGE_NM;
		useNetwork.LINE_SMALL_CD = this.LINE_SMALL_CD;
		useNetwork.LINE_SMALL_NM = this.LINE_SMALL_NM;  
		useNetwork.USE_SERVICE_YN = 'Y';
	}
	
	return useNetwork;
};




/**
 * 입력한 네트워크 정보로 이 선번의 네트워크 정보를 설정한다.
 */
TeamsPath.prototype.fromNetworkInfo = function(networkInfo) {

	this.NETWORK_ID = networkInfo.NETWORK_ID;
	this.NETWORK_NM = networkInfo.NETWORK_NM;
	
	this.NETWORK_STATUS_CD = networkInfo.NETWORK_STATUS_CD;
	this.NETWORK_STATUS_NM = networkInfo.NETWORK_STATUS_NM;

	this.NETWORK_TYPE_CD = networkInfo.NETWORK_TYPE_CD;
	this.NETWORK_TYPE_NM = networkInfo.NETWORK_TYPE_NM;
	
	this.PATH_SAME_NO = networkInfo.PATH_SAME_NO;
	this.PATH_DIRECTION = networkInfo.PATH_DIRECTION;

	this.TOPOLOGY_LARGE_CD = networkInfo.TOPOLOGY_LARGE_CD;
	this.TOPOLOGY_LARGE_NM = networkInfo.TOPOLOGY_LARGE_NM;
	this.TOPOLOGY_SMALL_CD = networkInfo.TOPOLOGY_SMALL_CD;
	this.TOPOLOGY_SMALL_NM = networkInfo.TOPOLOGY_SMALL_NM;
	this.TOPOLOGY_CFG_MEANS_CD = networkInfo.TOPOLOGY_CFG_MEANS_CD;
	this.TOPOLOGY_CFG_MEANS_NM = networkInfo.TOPOLOGY_CFG_MEANS_NM;

	this.UPR_MTSO_ID = networkInfo.UPR_MTSO_ID;
	this.LOW_MTSO_ID = networkInfo.LOW_MTSO_ID;
	
	this.VIRTUAL_YN = networkInfo.VIRTUAL_YN;
};




/**
 * 회선 선번 여부
 */
TeamsPath.prototype.isLinePath = function() {
	if ( isNullOrEmpty(this.LINE_SMALL_CD) == false ) {
		return true;
	}
	
	return false;
};

/**
 * 서비스 선번 여부
 */
TeamsPath.prototype.isServicePath = function() {
	if ( isNullOrEmpty(this.LINE_SMALL_CD) == false ) {
		return true;
	}
	
	return false;
};

/**
 * 네트워크 선번 여부
 */
TeamsPath.prototype.isNetworkPath = function() {
	if ( this.isTrunkPath() || this.isRingPath() || this.isWdmTrunkPath() ) {
		return true;
	}
	
	return false;
};

/**
 * 트렁크 선번 여부
 */
TeamsPath.prototype.isTrunkPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '002'  ) {
		return true;
	}
	
	return false;
};

/**
 * 링 선번 여부
 */
TeamsPath.prototype.isRingPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '001'  ) {
		return true;
	}
	
	return false;
};


/**
 * WDM 트렁크 선번 여부
 */
TeamsPath.prototype.isWdmTrunkPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false 
			&& this.TOPOLOGY_LARGE_CD == '003' && this.TOPOLOGY_SMALL_CD == '101' ) {
		return true;
	}
	
	return false;
};





/**
 * TANGO 선번으로 TEAMS Node 기준 선번을 만든다.
 * @param tangoPathData
 */
TeamsPath.prototype.fromTangoPath = function( tangoPathData ) {
	
    try {

    	this.createTeamsPath(tangoPathData);

    	for ( var idx = 0; idx < tangoPathData.USE_NETWORK_PATHS.length; idx++ ) {
    		var obj = tangoPathData.USE_NETWORK_PATHS[idx];
    		var path = new TeamsPath();
    		path.fromTangoPath(obj);
    		this.USE_NETWORK_PATHS.push(path);
    	}
    	
    	this.resetPortDescrEditable();
    	this.resetSeq();
    	
    } catch ( err ) {
        console.log(err);
    }	
	
};






/**
 * TEAMS 노드 기준 선번을 TANGO 구간 선번으로 만든다.
 */
TeamsPath.prototype.toTangoPath = function( ) {
	
    try {
    	
    	var tangoPath = new Path();
    	copyAttributeAll( this, tangoPath );
    	
    	if ( this.isWdmTrunkPath() ) {
    		tangoPath.LINKS = this.createWdmTrunkTangoPath(this.NODES);
    	} else {
        	this.createTangoPath(tangoPath);
    	}

    	tangoPath.resetSeq();
    	
        return tangoPath;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return null;
    
};


/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번을 생성한다.
 */
TeamsPath.prototype.toShortPath = function( ) {
	
    try {
        
    	var shortPath = new TeamsPath();
    	copyAttributeAll( this, shortPath );
    	
    	shortPath.NODES = [];
    	shortPath.USE_NETWORK_PATHS = this.USE_NETWORK_PATHS;
    	var teamsNode = null;

    	var useNetworkNodes = [];
    	var topNetwork = null;
    	var prevTopNetwork = null;
       	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    		teamsNode = this.NODES[idx].clone();
    		topNetwork = teamsNode.getTopNetwork();
    		if ( topNetwork != null ) {
    			
    			if ( prevTopNetwork != null && topNetwork.NETWORK_ID != prevTopNetwork.NETWORK_ID ) {
    				if ( useNetworkNodes.length > 0 ) {
	    				if ( useNetworkNodes.length > 2 ) {
	    					useNetworkNodes.splice(1, useNetworkNodes.length - 2);
	    				}
	    				
						shortPath.NODES = shortPath.NODES.concat(useNetworkNodes);
						useNetworkNodes = [];
    				}
    			}
    			
    			useNetworkNodes.push(teamsNode);
    		} else {
    			
				if ( useNetworkNodes.length > 0 ) {
    				if ( useNetworkNodes.length > 2 ) {
    					useNetworkNodes.splice(1, useNetworkNodes.length - 2);
    				}
    				
					shortPath.NODES = shortPath.NODES.concat(useNetworkNodes);
					useNetworkNodes = [];
				}
    			
    			shortPath.NODES.push(teamsNode);
    		}
    		
    		prevTopNetwork = topNetwork;
       	}
       	
		if ( useNetworkNodes.length > 0 ) {
			if ( useNetworkNodes.length > 2 ) {
				useNetworkNodes.splice(1, useNetworkNodes.length - 2);
			}
			
			shortPath.NODES = shortPath.NODES.concat(useNetworkNodes);
			useNetworkNodes = [];
		}
       	
    	
       	shortPath.resetPortDescrEditable();
       	shortPath.resetSeq();
       	
        return shortPath;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return this;
    
};




/**
 * TEAMS 선번 중 양 끝 노드만 포함하는 선번을 생성한다.
 */
TeamsPath.prototype.toShortestPath = function( ) {
	
    try {
        
    	var shortPath = new TeamsPath();
    	copyAttributeAll( this, shortPath );
    	
    	shortPath.NODES = [];
    	shortPath.USE_NETWORK_PATHS = this.USE_NETWORK_PATHS; 

    	if ( this.NODES.length > 0 ) {
        	var firstNode = null;
        	var lastNode = null;
        	
//        	if ( this.isWdmTrunkPath() ) {
//            	firstNode = this.firstNodeExcludeFdfCoupler();
//            	lastNode = this.lastNodeExcludeFdfCoupler();
//        	} else {
//            	firstNode = this.firstOpticalNode();
//            	lastNode = this.lastOpticalNode();
//        	}

        	
        	firstNode = this.firstNodeExcludeFdfCoupler();
        	lastNode = this.lastNodeExcludeFdfCoupler();
        	
        	
        	if ( firstNode != null ) {
            	shortPath.NODES.push(firstNode.clone());
            	if ( lastNode != null && firstNode !== lastNode ) {
                	shortPath.NODES.push(lastNode.clone());
            	}
        	}
    	}

       	shortPath.resetAddDropNode();
       	shortPath.resetPortDescrEditable();
       	shortPath.resetSeq();
       	
        return shortPath;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return this;
    
};





/**
 * TEAMS 선번의 사용 네트워크 구간을 선번 목록으로 만들어 돌려준다.
 */
TeamsPath.prototype.createUseNetworkPathList = function( ) {
	
    try {
        
    	var useNetworkPathList = [];
    	var useNetworkPath = null;
    	var teamsNode = null;
    	var topNetwork = null;
    	var prevTopNetwork = null;
       	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    		teamsNode = this.NODES[idx];
    		topNetwork = teamsNode.getTopNetwork();
    		if ( topNetwork != null ) {
    			
    			if ( prevTopNetwork == null || topNetwork.NETWORK_ID != prevTopNetwork.NETWORK_ID ) {
    				useNetworkPath = new TeamsPath();
    				useNetworkPath.fromNetworkInfo(topNetwork);
    				useNetworkPathList.push(useNetworkPath);
    			}
    			
    			useNetworkPath.NODES.push(teamsNode);
    		}
    		
    		prevTopNetwork = topNetwork;
       	}
       	
       	for ( var idx = 0; idx < useNetworkPathList.length; idx++ ) {
       		useNetworkPath = useNetworkPathList[idx];
       		useNetworkPath.resetAddDropNode();
       		useNetworkPath.resetSeq();
       	}
       	
        return useNetworkPathList;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return null;
    
};



/**
 * 입력한 네트워크가 최상위 사용 네트워크로 존재하는 경우 사용 네트워크 구간을 선번으로 만들어 돌려준다.
 */
TeamsPath.prototype.createUseNetworkPath = function( networkId ) {
	
    try {
        
    	var useNetworkPath = null;
    	var teamsNode = null;
    	var topNetwork = null;
       	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    		teamsNode = this.NODES[idx];
    		topNetwork = teamsNode.getTopNetwork();
    		if ( topNetwork != null && networkId == topNetwork.NETWORK_ID ) {
    			if ( useNetworkPath == null ) {
    				useNetworkPath = new TeamsPath();
    				useNetworkPath.fromNetworkInfo(topNetwork);
    			}
    			
    			useNetworkPath.NODES.push(teamsNode);
    		}
       	}
       	
       	if ( useNetworkPath != null ) {
       		useNetworkPath.resetAddDropNode();
       		useNetworkPath.resetSeq();
       	}
       	
        return useNetworkPath;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return null;
    
};


/**
 * 사용 네트워크의 처음과 끝 노드를 Add-Drop 노드로 지정한다.
 */
TeamsPath.prototype.resetUseNetworkAddDropNode = function() {
	this.createUseNetworkPathList();
};



/**
 * 입력한 선번의 양 끝 노드를 제외하고 Through 노드를 제거한다.
 * 
 * @param teamsPath
 */
TeamsPath.prototype.removeThroughNodes = function( teamsPath ) {
	
	if ( teamsPath.NODES.length > 2 ) {
		teamsPath.NODES.splice(1, teamsPath.NODES.length - 2);
	}
    		
};




/**
 * 회선, 트렁크, 링 선번에 대해 TEAMS 노드 기준 선번을 TANGO 구간 선번으로 만든다.
 */
TeamsPath.prototype.createTangoPath = function(tangoPath ) {
	
    try {
        
    	var prevTeamsNode = null;
    	var teamsNode = null;
    	var wdmTrunkNodes = [];
    	var curWdmTrunkId = null;
    	
    	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    		teamsNode = this.NODES[idx];
    		
    		if ( teamsNode.WdmTrunk != null && teamsNode.WdmTrunk.isValid() ) {
    			//	WDM 트렁크 노드이면
				if ( isNullOrEmpty(curWdmTrunkId) || curWdmTrunkId != teamsNode.WdmTrunk.NETWORK_ID ) {
					//	새로운 WDM 트렁크이면
					
					//	기존에 생성된 WDM 트렁크 노드 처리
        			if ( wdmTrunkNodes.length > 0 ) {
        				var wdmTrunkLinks = this.createWdmTrunkTangoPath(wdmTrunkNodes);
        				tangoPath.LINKS = tangoPath.LINKS.concat(wdmTrunkLinks);
        				wdmTrunkNodes = [];
        				curWdmTrunkId = null;
        			}
        			
		   			var link = this.createTangoLink( prevTeamsNode, teamsNode );
					tangoPath.LINKS.push(link);					
        		}
        			
        		curWdmTrunkId = teamsNode.WdmTrunk.NETWORK_ID;
        		wdmTrunkNodes.push(teamsNode);
    		} else {
    			
				//	기존에 생성된 WDM 트렁크 노드 처리
    			if ( wdmTrunkNodes.length > 0 ) {
    				var wdmTrunkLinks = this.createWdmTrunkTangoPath(wdmTrunkNodes);
    				tangoPath.LINKS = tangoPath.LINKS.concat(wdmTrunkLinks);
    				wdmTrunkNodes = [];
    				curWdmTrunkId = null;
    			}
    				
    			/* 인접링 처리
    			* TeamsPaht와 TangoPath 사이의 변환시 미존재하던 구간이 임의로 생성되는 버그대응
    			* 1. TemasPath에서는 링과 링 사이에 장비가 없고 이전링의 마지막 장비와 다음링의 첫장비가 같으경우 임의의 장비를 생성해 표시해 주기 때문에 
    			*    이를 TangoPath로 수정하면 원래 존재하지 않던 장비가 DROP/ADD구간으로 추가되버림 => 추가되지 않게 처리
    			* 2. 1의 케이스시 원래 TangoPath의 구간이 있음에도 추가되지 않는 케이스가 있어 NODE의 ADJACENT_NODE값을 참조하여 처리  
    			*/
    			if (prevTeamsNode != null && teamsNode != null && prevTeamsNode.Ne.NE_ID == teamsNode.Ne.NE_ID && teamsNode.ADJACENT_NODE != null &&  teamsNode.ADJACENT_NODE == 'Y'
    					&& prevTeamsNode.Ring != null && teamsNode.Ring != null 
    					&& (prevTeamsNode.Ring.NETWORK_ID != teamsNode.Ring.NETWORK_ID   // 최상위 네트워크가 다르거나
    						|| ((prevTeamsNode.Ring.RING_LVL == "2" || prevTeamsNode.Ring.RING_LVL == "3" )  // 경유링이면서
    							&& ((nullToEmpty(prevTeamsNode.Ring.RING_ID_L2) != "" && nullToEmpty(teamsNode.Ring.RING_ID_L2) != "" && prevTeamsNode.Ring.RING_ID_L2 != teamsNode.Ring.RING_ID_L2)   // 2차 참조 링이다르거나
    								|| (nullToEmpty(prevTeamsNode.Ring.RING_ID_L3) != "" && nullToEmpty(teamsNode.Ring.RING_ID_L3) != "" && prevTeamsNode.Ring.RING_ID_L3 != teamsNode.Ring.RING_ID_L3))  // 3차 참조 링이 다른경우
    						   )
    				       )
    			   ) {
    				prevTeamsNode = teamsNode;
    				continue;
    			}
	   			var link = this.createTangoLink( prevTeamsNode, teamsNode );
				tangoPath.LINKS.push(link);
    		}
    		
    		prevTeamsNode = teamsNode;
    	}
    	
    	//	마지막 장비 B 포트 처리
		//	기존에 생성된 WDM 트렁크 노드 처리
		if ( wdmTrunkNodes.length > 0 ) {
			var wdmTrunkLinks = this.createWdmTrunkTangoPath(wdmTrunkNodes);
			tangoPath.LINKS = tangoPath.LINKS.concat(wdmTrunkLinks);
			wdmTrunkNodes = [];
			curWdmTrunkId = null;
		}
    	
		//	이전 구간이 WDM 트렁크 구간이 아니라면 이전 구간 B 포트에 대해 구간을 생성
//		if ( prevTeamsNode != null && prevTeamsNode.WdmTrunk == null ) {
		//	WDM 트렁크 구간의 마지막 장비를 다음 구간의 왼쪽 장비로 채운다. 
		if ( prevTeamsNode != null ) {
			var link = new Link();
   			link.leftNode.isVirtualUpperMtsoNode = prevTeamsNode.isVirtualUpperMtsoNode;
   			link.leftNode.isVirtualLowerMtsoNode	 = prevTeamsNode.isVirtualLowerMtsoNode;
			
			link.leftNode.NODE_ID = prevTeamsNode.NODE_ID;
			
			link.leftNode.NODE_ROLE_CD = prevTeamsNode.NODE_ROLE_CD;
			link.leftNode.NODE_ROLE_NM = prevTeamsNode.NODE_ROLE_NM;

			link.leftNode.ADD_DROP_TYPE_CD = prevTeamsNode.ADD_DROP_TYPE_CD;
			link.leftNode.ADD_DROP_TYPE_NM = prevTeamsNode.ADD_DROP_TYPE_NM;		
			
			link.leftNode.Ne = prevTeamsNode.Ne;
			link.leftNode.PortDescr = prevTeamsNode.BPortDescr;

			//	사용 네트워크는 현재 구간을 기준으로 지정하므로
			//	마지막 장비 B 포트에 대해서는 지정하지 않는다. 
//			link.Trunk = prevTeamsNode.Trunk;
//			link.Ring = prevTeamsNode.Ring;
//			link.WdmTrunk = prevTeamsNode.WdmTrunk;
//			link.rightNode.Ne = null;
//			link.rightNode.PortDescr = null;
			tangoPath.LINKS.push(link);
		}

    	
    	//	TEAMS Path 는 Add-Drop 도 트렁크, 링 노드이지만
    	//	TANGO Path 는 Add-Drop 은 트렁크, 링 구간이 아니다.
    	//	각 네트워크의 첫번째 구간에서 각 네트워크를 삭제한다.
    	//	연속된 네트워크 구간이 1개일 경우에는 삭제안함.
    	//	연속된 네트워크 구간이 2개이상일 경우에는 첫번째 구간 삭제.
		//	첫번째 장비의 A 포트, 마지막 장비의 B 포트는 트렁크, 링 구간이 아니다.
		//	구간 생성시 현재 장비를 기준으로 트렁크, 링을 지정하므로
		//	마지막 장비의 B 포트는 구간 생성시 트렁크, 링으로 지정되지 않는다.
		//	첫번째 장비의 A 포트에 대한 구간에서만 트렁크, 링을 삭제한다.
		
		// RU 고도화 서비스회선의 경우 빈 첫 노드를 삭제하지 않음
		tangoPath.setFirstLastUseNetworkNull( 'Service', false, false );
		tangoPath.setFirstLastUseNetworkNull( 'Trunk', true, false );
		tangoPath.setFirstLastUseNetworkNull( 'Ring', true, false );

		var linear = true;
		 /**
		  *  토폴로지구성방식이 PTP인 링과, 가입자망 링을 제외하고 마지막 구간과 첫번째 구간 병합
		  * 
		  * 2019-11-21
	      * 링의 경우 PTP타입의 링을 제외하고 Tango 선번을 Teams 선번 형태로 변환하기 위해 마지막 노드를 맨 앞으로 변환하는 작업을 하는데 
	      * 링의 토폴로지 구성방식 추가로 해당 링이 PTP타입인지 판별을 토폴로지 구성방식으로 처리한다.
	      * 단 토폴로지 구성방식이 없는경우 기존과 동일하게 망종류로 처리한다.
	      * PTP타입링 : 토폴로지 구성방식 PTP
	      *             단) 가입자망링(031)은 무조건 링타입
	      *             단) 토폴로지 구성방식이 없는 경우 망종류 PTP(002), SMUX(035), M/W PTP(039)
	      * */
		
		if ( tangoPath.TOPOLOGY_LARGE_CD != null && tangoPath.TOPOLOGY_LARGE_CD == '001'  && tangoPath.isPtpTypeRing() == false ) {
            if ( tangoPath.LINKS.length >= 3 ) {
            	var firstLink = tangoPath.LINKS.shift();
                var lastLink = tangoPath.LINKS.pop();
            	lastLink.rightNode = firstLink.rightNode;
                tangoPath.LINKS.push(lastLink);
                linear = false;
            }
        }		
    	
        //	점 선번 노드 2개를 구간 선번으로 변경하면 구간 3개가 나온다.
        //	왜냐하면, 첫번째 노드의 A 포트, 마지막 노드이 B 포트 때문이다.
        //	만약, 양 끝단 구간에 포트 정보가 없다면 불필요한 구간이므로 삭제한다.
        if ( linear ) {
	        if ( tangoPath.LINKS.length >= 3 ) {
	        	var firstLink = tangoPath.LINKS[0];
	            var lastLink = tangoPath.LINKS[tangoPath.LINKS.length-1];
	        	
	            if ( firstLink.isNetworkLink() == false && firstLink.leftNode.isNull() && ( firstLink.rightNode.PortDescr == null ||  firstLink.rightNode.PortDescr.isNull() ) ) {
	            	tangoPath.LINKS.shift();
	            }
	            
	            if ( lastLink.isNetworkLink() == false && lastLink.rightNode.isNull() && ( lastLink.leftNode.PortDescr == null ||  lastLink.leftNode.PortDescr.isNull() ) ) {
	            	tangoPath.LINKS.pop();
	            }            
	        } if ( tangoPath.LINKS.length >= 2 ) {
	        	//	점선번 1개를 구간으로 변경하면 구간이 2개나오는 데, 이 때는 둘 중 하나만 삭제한다.
	        	var firstLink = tangoPath.LINKS[0];
	            var lastLink = tangoPath.LINKS[tangoPath.LINKS.length-1];
	        	
	            if ( firstLink.isNetworkLink() == false && firstLink.leftNode.isNull() && ( firstLink.rightNode.PortDescr == null ||  firstLink.rightNode.PortDescr.isNull() ) ) {
	            	tangoPath.LINKS.shift();
	            } else if ( lastLink.isNetworkLink() == false && lastLink.rightNode.isNull() && ( lastLink.leftNode.PortDescr == null ||  lastLink.leftNode.PortDescr.isNull() ) ) {
	            	tangoPath.LINKS.pop();
	            }            
	        }        
        }
        
    } catch ( err ) {
        console.log(err);
    }	
	
};


TeamsPath.prototype.createTangoLink = function( prevTeamsNode, teamsNode ) {
		
	var link = new Link();
	
	if ( prevTeamsNode != null ) {
		link.leftNode.isVirtualUpperMtsoNode = prevTeamsNode.isVirtualUpperMtsoNode;
		link.leftNode.isVirtualLowerMtsoNode	 = prevTeamsNode.isVirtualLowerMtsoNode;
		
		link.leftNode.NODE_ID = prevTeamsNode.NODE_ID;
		
		link.leftNode.NODE_ROLE_CD = prevTeamsNode.NODE_ROLE_CD;
		link.leftNode.NODE_ROLE_NM = prevTeamsNode.NODE_ROLE_NM;

		link.leftNode.ADD_DROP_TYPE_CD = prevTeamsNode.ADD_DROP_TYPE_CD;
		link.leftNode.ADD_DROP_TYPE_NM = prevTeamsNode.ADD_DROP_TYPE_NM;		
		
		link.leftNode.Ne = prevTeamsNode.Ne;
		link.leftNode.PortDescr = prevTeamsNode.BPortDescr;
	}
	
	link.Service = teamsNode.Service;	
	link.Trunk = teamsNode.Trunk;
	link.Ring = teamsNode.Ring;
	link.WdmTrunk = teamsNode.WdmTrunk;

	link.rightNode.isVirtualUpperMtsoNode = teamsNode.isVirtualUpperMtsoNode;
	link.rightNode.isVirtualLowerMtsoNode	 = teamsNode.isVirtualLowerMtsoNode;
	
	link.rightNode.NODE_ID = teamsNode.NODE_ID;
	
	link.rightNode.NODE_ROLE_CD = teamsNode.NODE_ROLE_CD;
	link.rightNode.NODE_ROLE_NM = teamsNode.NODE_ROLE_NM;

	link.rightNode.ADD_DROP_TYPE_CD = teamsNode.ADD_DROP_TYPE_CD;
	link.rightNode.ADD_DROP_TYPE_NM = teamsNode.ADD_DROP_TYPE_NM;		
	
	link.rightNode.Ne = teamsNode.Ne;
	link.rightNode.PortDescr = teamsNode.APortDescr;
	
	// 2019-10-29 기간망 링 선번 고도화
	link.REFC_RONT_TRK_NTWK_LINE_NM = teamsNode.REFC_RONT_TRK_NTWK_LINE_NM;
	link.REFC_RONT_TRK_NTWK_LINE_NO = teamsNode.REFC_RONT_TRK_NTWK_LINE_NO;
	
	//	WDM 트렁크 첫 구간은 WDM 트렁크 구간이 아니다.
	if ( teamsNode.isWdmTrunkNode() ) {
		if ( prevTeamsNode == null || prevTeamsNode.isWdmTrunkNode() == false
				|| prevTeamsNode.WdmTrunk.NETWORK_ID !== teamsNode.WdmTrunk.NETWORK_ID ) {
			link.WdmTrunk = null;
			link.rightNode.PortDescr = new PortDescr();
		}
	}
	
	return link;
};


/**
 * 입력한 동일한 WDM 트렁크의 노드들을 구간으로 변경한다.
 *  
 * @param wdmTrunkNodes
 * @returns {Array}
 */
TeamsPath.prototype.createWdmTrunkTangoPath = function( wdmTrunkNodes ) {
	
	var wdmTrunkLinks = [];
	var teamsNode = null;	
	var isLeft = true;
	var link = null;
	for (  var idx = 0; idx < wdmTrunkNodes.length; idx++ ) {
    	teamsNode = wdmTrunkNodes[idx];

    	if ( isLeft ) {
        	link = new Link();
        	wdmTrunkLinks.push(link);

        	link.Service = teamsNode.Service;
        	link.Trunk = teamsNode.Trunk;
    		link.Ring = teamsNode.Ring;
    		link.WdmTrunk = teamsNode.WdmTrunk;
    		
   			link.leftNode.isVirtualUpperMtsoNode = teamsNode.isVirtualUpperMtsoNode;
   			link.leftNode.isVirtualLowerMtsoNode	 = teamsNode.isVirtualLowerMtsoNode;
    		
    		link.leftNode.NODE_ID = teamsNode.NODE_ID;
    		
    		link.leftNode.NODE_ROLE_CD = teamsNode.NODE_ROLE_CD;
    		link.leftNode.NODE_ROLE_NM = teamsNode.NODE_ROLE_NM;

    		link.leftNode.ADD_DROP_TYPE_CD = teamsNode.ADD_DROP_TYPE_CD;
    		link.leftNode.ADD_DROP_TYPE_NM = teamsNode.ADD_DROP_TYPE_NM;		
    		
    		
			link.leftNode.Ne = teamsNode.Ne;
			link.leftNode.PortDescr = teamsNode.APortDescr;
			
			isLeft = false;
    	} else {
    		
   			link.rightNode.isVirtualUpperMtsoNode = teamsNode.isVirtualUpperMtsoNode;
   			link.rightNode.isVirtualLowerMtsoNode	 = teamsNode.isVirtualLowerMtsoNode;
    		
    		link.rightNode.NODE_ID = teamsNode.NODE_ID;
    		
    		link.rightNode.NODE_ROLE_CD = teamsNode.NODE_ROLE_CD;
    		link.rightNode.NODE_ROLE_NM = teamsNode.NODE_ROLE_NM;

    		link.rightNode.ADD_DROP_TYPE_CD = teamsNode.ADD_DROP_TYPE_CD;
    		link.rightNode.ADD_DROP_TYPE_NM = teamsNode.ADD_DROP_TYPE_NM;		
    		
			link.rightNode.Ne = teamsNode.Ne;
			link.rightNode.PortDescr = teamsNode.APortDescr;
			
			isLeft = true;
    	}
    }
	
	//	짝이 안맞아 마지막 오른쪽 노드가 NULL 인 경우 왼쪽 장비로 채운다.
	if ( link != null && teamsNode != null && wdmTrunkNodes.length > 1 ) {
		if ( link.rightNode == null || link.rightNode.isNull() ) {
   			link.rightNode.isVirtualUpperMtsoNode = teamsNode.isVirtualUpperMtsoNode;
   			link.rightNode.isVirtualLowerMtsoNode	 = teamsNode.isVirtualLowerMtsoNode;
    		
    		link.rightNode.NODE_ID = teamsNode.NODE_ID;

    		link.rightNode.NODE_ROLE_CD = teamsNode.NODE_ROLE_CD;
    		link.rightNode.NODE_ROLE_NM = teamsNode.NODE_ROLE_NM;

    		link.rightNode.ADD_DROP_TYPE_CD = teamsNode.ADD_DROP_TYPE_CD;
    		link.rightNode.ADD_DROP_TYPE_NM = teamsNode.ADD_DROP_TYPE_NM;		
    		
    		link.rightNode.Ne = teamsNode.Ne;
		}
	}
	
    
	return wdmTrunkLinks;
};




/**
 * DB 에 저장할 JSON 데이터 형태로 변환한다.
 */
TeamsPath.prototype.toData = function() {
	var objPath = new Object();
	copyAttributeAll( this, objPath );
	objPath.NODES = [];
    for (  var idx = 0; idx < this.NODES.length; idx++ ) {
    	var node = this.NODES[idx];
    	var nodeObj = new Object();
    	node.toData(nodeObj, '');

    	// 2019-10-29 기간망 링 선번 고도화
    	nodeObj.REFC_RONT_TRK_NTWK_LINE_NM = node.REFC_RONT_TRK_NTWK_LINE_NM;
    	nodeObj.REFC_RONT_TRK_NTWK_LINE_NO = node.REFC_RONT_TRK_NTWK_LINE_NO;
    	objPath.NODES.push(nodeObj);
    }
    
    return objPath;
};


/**
 * 노드 순서를 설정한다.
 */
TeamsPath.prototype.resetSeq = function() {

	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    node.SEQ = idx + 1;
	}	
};



/**
 * TEAMS 형식의 선번을 만든다
 * 
 * @param tangoPathData
 * 
 */
TeamsPath.prototype.createTeamsPath = function(tangoPathData) {
	
	var tangoPath = new Path();
	tangoPath.fromData(tangoPathData);
	
    if ( tangoPath.LINKS.length > 0 ) {
        
    	this.NETWORK_ID = tangoPath.NETWORK_ID;
    	this.NETWORK_NM = tangoPath.NETWORK_NM;

    	this.NETWORK_STATUS_CD = tangoPath.NETWORK_STATUS_CD;
    	this.NETWORK_STATUS_NM = tangoPath.NETWORK_STATUS_NM;
    	this.TOPOLOGY_LARGE_CD = tangoPath.TOPOLOGY_LARGE_CD;
    	this.TOPOLOGY_LARGE_NM = tangoPath.TOPOLOGY_LARGE_NM;
    	this.TOPOLOGY_SMALL_CD = tangoPath.TOPOLOGY_SMALL_CD;
    	this.TOPOLOGY_SMALL_NM = tangoPath.TOPOLOGY_SMALL_NM;        	
    	this.TOPOLOGY_CFG_MEANS_CD = tangoPath.TOPOLOGY_CFG_MEANS_CD;
    	this.TOPOLOGY_CFG_MEANS_NM = tangoPath.TOPOLOGY_CFG_MEANS_NM;        	

    	this.LINE_STATUS_CD = tangoPath.LINE_STATUS_CD;
    	this.LINE_STATUS_NM = tangoPath.LINE_STATUS_NM;
    	this.LINE_LARGE_CD = tangoPath.LINE_LARGE_CD;
    	this.LINE_LARGE_NM = tangoPath.LINE_LARGE_NM;
    	this.LINE_SMALL_CD = tangoPath.LINE_SMALL_CD;
    	this.LINE_SMALL_NM = tangoPath.LINE_SMALL_NM;        	

    	this.PATH_SAME_NO = tangoPath.PATH_SAME_NO;
    	this.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH = tangoPath.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;
    	
    	/* TODO
    	 * 기지국회선이 아닌 경우에만 인접 사용네트워크처리를 한다.
    	 * 2021-06-08
    	 */
    	// 인접 사용네트워크 처리
    	if(this.LINE_LARGE_CD != '001') {
    		this.adjustAdjacentNetworkAddDrop(tangoPath);
    	}
    	
    	var link = null;
    	var teamsNode = null;
    	
    	//	WEST -> EAST 순으로 각각을 노드로 생성
        for (  var idx = 0; idx < tangoPath.LINKS.length; idx++ ) {
            link = tangoPath.LINKS[idx];
        	
            /*2018-09-12 1.RU고도화 */
            //	좌장비
            teamsNode = this.createTeamsNode( link.Service, link.Trunk, link.Ring, link.WdmTrunk, link.leftNode, null, link.leftNode.PortDescr );
            
            /*
            * 2019-10-29 기간망 링 선번 고도화 
            * 경유 PTP링 사용에 따른 기간망 트렁크 정보
            */
            teamsNode.REFC_RONT_TRK_NTWK_LINE_NM = link.REFC_RONT_TRK_NTWK_LINE_NM;
            teamsNode.REFC_RONT_TRK_NTWK_LINE_NO = link.REFC_RONT_TRK_NTWK_LINE_NO;
            this.NODES.push(teamsNode);

            /*2018-09-12 1.RU고도화 */
            //	우장비
            teamsNode = this.createTeamsNode( link.Service, link.Trunk, link.Ring, link.WdmTrunk, link.rightNode, link.rightNode.PortDescr, null );
            teamsNode.REFC_RONT_TRK_NTWK_LINE_NM = link.REFC_RONT_TRK_NTWK_LINE_NM;
            teamsNode.REFC_RONT_TRK_NTWK_LINE_NO = link.REFC_RONT_TRK_NTWK_LINE_NO;
            this.NODES.push(teamsNode);
        }

        /**
		  *  토폴로지구성방식PTP인 링과, 가입자망 링을 제외하고 링 순서를 조정 ( TANGO 마지막 장비가 TEAMS 에서는 시작 장비 )
		  * 
		  * 2019-11-21
	      * 링의 경우 PTP타입의 링을 제외하고 Tango 선번을 Teams 선번 형태로 변환하기 위해 마지막 노드를 맨 앞으로 변환하는 작업을 하는데 
	      * 링의 토폴로지 구성방식 추가로 해당 링이 PTP타입인지 판별을 토폴로지 구성방식으로 처리한다.
	      * 단 토폴로지 구성방식이 없는경우 기존과 동일하게 망종류로 처리한다.
	      * PTP타입링 : 토폴로지 구성방식 PTP
	      *             단) 가입자망링(031)은 무조건 링타입
	      *             단) 토폴로지 구성방식이 없는 경우 망종류 PTP(002), SMUX(035), M/W PTP(039)
	      * */
        
        if (this.TOPOLOGY_LARGE_CD != null && this.TOPOLOGY_LARGE_CD == '001' && this.isPtpTypeRing() == false) {
        	if ( this.NODES.length >= 2 ) {
                var lastNode = this.NODES.pop();
                this.NODES.unshift(lastNode);
            }
        }

        
        //	EAST 장비와 다음 WEST 장비가 동일할 경우 병합
        var prevTeamsNode = null;
        for (  var idx = 0; idx < this.NODES.length; idx++ ) {
        	teamsNode = this.NODES[idx];
        	
        	if ( prevTeamsNode != null && prevTeamsNode.PREFIX == 'RIGHT_'  && teamsNode.PREFIX == 'LEFT_' ) {
        		//	이전 구간 오른쪽 장비는 현 구간 왼쪽 장비랑 같아야 한다.
        		//	만약 이전 구간 오른쪽 장비 정보가 없다면 현 구간 왼쪽 장비로 간주한다.
        		if ( prevTeamsNode.Ne.isNull() ) {
        			prevTeamsNode.Ne = teamsNode.Ne;
        		} 
        		
        		if ( teamsNode.Ne.isNull() ) {
        			teamsNode.Ne = prevTeamsNode.Ne;
        		}
        			        		
        		if ( prevTeamsNode.Ne.NE_ID == teamsNode.Ne.NE_ID  ) {
        			        			
        			prevTeamsNode.BPortDescr = teamsNode.BPortDescr;
        			/*2018-09-12 1.RU고도화 */
        			if ( prevTeamsNode.Service != null ) {
        				teamsNode.Service = prevTeamsNode.Service;
        			} else if ( teamsNode.Service != null ) {
        				prevTeamsNode.Service = teamsNode.Service;
        			}
        			
        			if ( prevTeamsNode.Trunk != null ) {
        				teamsNode.Trunk = prevTeamsNode.Trunk;
        			} else if ( teamsNode.Trunk != null ) {
        				prevTeamsNode.Trunk = teamsNode.Trunk;
        			}
        			
        			if ( prevTeamsNode.Ring != null ) {
        				teamsNode.Ring = prevTeamsNode.Ring;
        			} else if ( teamsNode.Ring != null ) {
        				prevTeamsNode.Ring = teamsNode.Ring;
        				// 2019-11-05 2. 기간망 링 선번 고도화 : 기간망 트렁크 정보 
        				if (nullToEmpty(prevTeamsNode.REFC_RONT_TRK_NTWK_LINE_NO) == "" &&  nullToEmpty(teamsNode.REFC_RONT_TRK_NTWK_LINE_NO) != "") {
        					prevTeamsNode.REFC_RONT_TRK_NTWK_LINE_NM = teamsNode.REFC_RONT_TRK_NTWK_LINE_NM;
        					prevTeamsNode.REFC_RONT_TRK_NTWK_LINE_NO = teamsNode.REFC_RONT_TRK_NTWK_LINE_NO;
        				}
        			}

        			if ( prevTeamsNode.WdmTrunk != null ) {
        				teamsNode.WdmTrunk = prevTeamsNode.WdmTrunk;
        			} else if ( teamsNode.WdmTrunk != null ) {
        				prevTeamsNode.WdmTrunk = teamsNode.WdmTrunk;
        			}
        			
        			teamsNode.DELETE = true;
        		}
        	}
        	
        	prevTeamsNode = teamsNode;
        }
        
    	//  병합된 장비 제거
    	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
    	    var node = this.NODES[idx];
    	    if ( node.DELETE != undefined && node.DELETE != null && node.DELETE ) {
    	    	this.NODES.splice( idx, 1 );
    	    }
    	}
    	
    	this.adjustWdmTrunkPort();
    	
        //  NULL 장비 제거
        this.removeNullNode();   // NULL 장비를 삭제하지 안하면 네트워크의 Short Path에 미확인 장비만 표시됨으로 인해 포트 설정이 불가능해짐 
        
        this.resetNodeId();
    }	
};



/**
 * 인접 네트워크간의 ADD-DROP 장비가 동일한 경우 TEAMS 에 맞게 조정한다. 
 * @param tangoPath
 */
TeamsPath.prototype.adjustAdjacentNetworkAddDrop = function( tangoPath ) {

    try {

    	// 2019-11-05 2. 기간망 링 선번 고도화 : 링에서 링을 사용함으로 인해 링에서 사용네트워크가 링인 경우 인접링 처리 해준다.
        if ( tangoPath.isLinePath() || tangoPath.isTrunkPath() || tangoPath.isRingPath()) {
            
            var prevLink = null;
            var link = null;
            
            for ( var idx = 0; idx < tangoPath.LINKS.length; idx++ ) {
                link = tangoPath.LINKS[idx];
                
                if ( prevLink != null && link.isNetworkLink() ) {
                    
                    //  사용 네트워크 구간 사이에는 회선 구간이 반드시 필요하다.
                    //  만약, 회선 구간이 없다면 인접 네트워크 간의 연결 장비가 동일하여 생략된 경우이다.
                    //  이 경우에는 빈 노드 구간을 추가해준다.
                    var prevTopUseNetwork = prevLink.getTopNetwork();
                    var useTopNetwork = link.getTopNetwork();
                    if ( prevTopUseNetwork != null && useTopNetwork != null && prevTopUseNetwork.NETWORK_ID != useTopNetwork.NETWORK_ID
                    		// 링이 아니거나 링인경우 사용네트워크가 링인 경우(인접링 처리)
                    		&& (tangoPath.isRingPath() == false || (tangoPath.isRingPath() == true && useTopNetwork.isRing() == true))
                    ) {
                        var prevRightNe = prevLink.rightNode.Ne;
                        var leftNe = link.leftNode.Ne;
                        
                        if ( prevRightNe != null && leftNe != null && prevRightNe.isNull() == false && prevRightNe.NE_ID == leftNe.NE_ID ) {
                            var newLink = new Link();
                            var newLeftNode = new Node();
                            newLeftNode.Ne = prevRightNe;
                            newLeftNode.PREFIX = 'LEFT_';
                            newLeftNode.ADJACENT_NODE = 'Y';  //인접사용네트워크의 추가노드 
                            newLink.leftNode = newLeftNode;
                            
                            var newRightNode = new Node();
                            newRightNode.Ne = prevRightNe;
                            
                            // 링에서 링을 사용한 경우
                            if (tangoPath.isRingPath() == true && useTopNetwork.isRing() == true) {
	                            newRightNode.NODE_ROLE_CD = link.leftNode.NODE_ROLE_CD;  // 상하위
	                            newRightNode.NODE_ROLE_NM = link.leftNode.NODE_ROLE_NM;
                            }
                            
                            newRightNode.PREFIX = 'RIGHT_';
                            newRightNode.ADJACENT_NODE = 'Y';   //인접사용네트워크의 추가노드 
                            newLink.rightNode = newRightNode;
                            tangoPath.LINKS.splice(idx, 0, newLink);
                        }
                    }
                    // 사용네트워크가 RING 이고 해당 링의 참조 레벨이 2 혹은 3인 경우 아래 레벨의 링들이 인접링인 경우
                    else if (prevLink.isRingLink() == true && link.isRingLink() == true && (link.Ring.RING_LVL == "2" || link.Ring.RING_LVL == "3")) {
                    	if (( nullToEmpty(prevLink.Ring.RING_ID_L2) != "" && nullToEmpty(link.Ring.RING_ID_L2) != ""  && prevLink.Ring.RING_ID_L2  != link.Ring.RING_ID_L2 )
                    	      || (nullToEmpty(prevLink.Ring.RING_ID_L3) != "" && nullToEmpty(link.Ring.RING_ID_L3) != ""  &&  prevLink.Ring.RING_ID_L3  != link.Ring.RING_ID_L3)
                    	   ) {
                    		var prevRightNe = prevLink.rightNode.Ne;
                            var leftNe = link.leftNode.Ne;
                            
                            if ( prevRightNe != null && leftNe != null && prevRightNe.isNull() == false && prevRightNe.NE_ID == leftNe.NE_ID ) {
                                var newLink = new Link();
                                var newLeftNode = new Node();
                                newLeftNode.Ne = prevRightNe;
                                newLeftNode.PREFIX = 'LEFT_';
                                newLeftNode.ADJACENT_NODE = 'Y';  //인접사용네트워크의 추가노드 
                                newLink.leftNode = newLeftNode;
                                
                                var newRightNode = new Node();
                                newRightNode.Ne = prevRightNe;
                                
                                // 링에서 링을 사용한 경우
                                if (tangoPath.isRingPath() == true && useTopNetwork.isRing() == true) {
    	                            newRightNode.NODE_ROLE_CD = link.leftNode.NODE_ROLE_CD;  // 상하위
    	                            newRightNode.NODE_ROLE_NM = link.leftNode.NODE_ROLE_NM;
                                }
                                
                                newRightNode.PREFIX = 'RIGHT_';
                                newRightNode.ADJACENT_NODE = 'Y';   //인접사용네트워크의 추가노드 
                                newLink.rightNode = newRightNode;
                                tangoPath.LINKS.splice(idx, 0, newLink);
                            }
                    	}
                    }
                }
                
                prevLink = link;
            }
            
        }
    } catch ( err ) {
    	console.log(err);
    }

};



/**
 * WDM 트렁크는 A 포트로만 입력하므로, B 포트를 새 노드의 A 포트로 조정한다.
 */
TeamsPath.prototype.adjustWdmTrunkPort = function() {
	//  WDM 트렁크 구간 장비는 A 포트만 입력
	if ( this.isWdmTrunkPath() ) {
		//	이 네트워크가 WDM 트렁크인 경우
    	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    	    var node = this.NODES[idx];
	    	if ( node.APortDescr.isNull() ) {
	    		node.APortDescr = node.BPortDescr;
	    		node.BPortDescr = new PortDescr();
	    	} else if ( node.BPortDescr.isNull() == false ) {
	    		//	만약 현재 노드가 A 포트, B 포트 모두 있다면
	    		//	B 포트는 새로운 노드로 생성한다.
	    		var newNode = node.clone();
	    		newNode.APortDescr = newNode.BPortDescr;
	    		newNode.BPortDescr = new PortDescr();
	    		node.BPortDescr = new PortDescr();
	    		idx++;
	    		this.NODES.splice(idx, 0, newNode);
	    	}
    	}        	
    	    		
	} else {
    	//	사용 네트워크 구간이 WDM 트렁크 구간인 경우
    	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    	    var node = this.NODES[idx];
    	    if ( node.isWdmTrunkNode() ) {
    	    	
    	    	if ( node.APortDescr.isNull() ) {
    	    		node.APortDescr = node.BPortDescr;
    	    		node.BPortDescr = new PortDescr();
    	    	} else if ( node.BPortDescr.isNull() == false ) {
    	    		//	만약 현재 노드가 A 포트, B 포트 모두 있다면
    	    		//	B 포트는 새로운 노드로 생성한다.
    	    		var newNode = node.clone();
    	    		newNode.APortDescr = newNode.BPortDescr;
    	    		newNode.BPortDescr = new PortDescr();
    	    		node.BPortDescr = new PortDescr();
    	    		idx++;
    	    		this.NODES.splice(idx, 0, newNode);
    	    	}
    	    }
    	}    	
	}
	

};


/**
 * 
 * TEAMS Node 를 생성한다.
 *
 * @param service              			TEAMS 선번의 서비스 정보
 * @param trunk                			TEAMS 선번의 트렁크 정보
 * @param ring                			TEAMS 선번의 링 정보
 * @param wdmTrunk               	TEAMS 선번의 WDM 트렁크 정보
 * @param tangoNode                	TEAMS 선번의 장비가 될 TANGO 장비 정보
 * @param tangoEastPortDescr     TEAMS 선번의 A 포트가 될 TANGO East 포트 정보
 * @param tangoWestPortDescr    TEAMS 선번의 B 포트가 될 TANGO West 포트 정보
  * @return TeamsNode
 */
TeamsPath.prototype.createTeamsNode = function( service, trunk, ring, wdmTrunk, tangoNode, tangoEastPortDescr, tangoWestPortDescr ) {
    
    var teamsNode = new TeamsNode();
    teamsNode.Ne = tangoNode.Ne;
    
    if ( tangoEastPortDescr != null )
    	teamsNode.APortDescr = tangoEastPortDescr;
    
    if ( tangoWestPortDescr != null )
    	teamsNode.BPortDescr = tangoWestPortDescr;
    
    teamsNode.NODE_ROLE_CD = tangoNode.NODE_ROLE_CD;
    teamsNode.NODE_ROLE_NM = tangoNode.NODE_ROLE_NM;    

    teamsNode.Service = service;
    teamsNode.Trunk = trunk;
    teamsNode.Ring = ring;
    teamsNode.WdmTrunk = wdmTrunk;
    
    teamsNode.PREFIX = tangoNode.PREFIX;
    
    // 인접네트워크로 추가된 노드 정보
    teamsNode.ADJACENT_NODE = tangoNode.ADJACENT_NODE;
    
    return teamsNode;
};



/**
 * NULL 장비를 제거한다.
 */
TeamsPath.prototype.removeNullNode = function() {
	//  NULL 장비 제거
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isNull() 
	    		//&& node.isNetworkNode() == false  // 네트워크 소속의 NULL 장비 삭제 필요한가!!!!!
	       ) {	    	
	        this.NODES.splice( idx, 1 );
	    }
	}	
};



/**
 * 첫번째 장비를 구한다.
 */
TeamsPath.prototype.firstNode = function() {
	
	if ( this.NODES.length > 0 ) {
		return this.NODES[0];
	}
	
	return null;
};



/**
 * 마지막 장비를 구한다.
 */
TeamsPath.prototype.lastNode = function() {
	if ( this.NODES.length > 0 ) {
		return this.NODES[this.NODES.length-1];
	}
	
	return null;
};



/**
 * FDF 장비, 커플러, WDM 이 아닌 첫번째 장비를 구한다.
 */
TeamsPath.prototype.firstOpticalNode = function() {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isFdfRole() == false && node.Ne.isCouplerRole() == false && node.Ne.isWdmRole() == false ) {
	        return node;
	    }
	}	
	
	return null;
};



/**
 * FDF 장비, 커플러, WDM 이 아닌 마지막 장비를 구한다.
 */
TeamsPath.prototype.lastOpticalNode = function() {
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isFdfRole() == false && node.Ne.isCouplerRole() == false && node.Ne.isWdmRole() == false ) {
	        return node;
	    }
	}	
	
	return null;
};



/**
 * FDF 장비, 커플러가 아닌 첫번째 장비를 구한다.
 */
TeamsPath.prototype.firstNodeExcludeFdfCoupler = function() {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isFdfRole() == false && node.Ne.isCouplerRole() == false ) {
	        return node;
	    }
	}	
	
	return null;
};



/**
 * FDF 장비, 커플러가 아닌 마지막 장비를 구한다.
 */
TeamsPath.prototype.lastNodeExcludeFdfCoupler = function() {
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isFdfRole() == false && node.Ne.isCouplerRole() == false ) {
	        return node;
	    }
	}	
	
	return null;
};




/**
 * FDF 장비를 제거한다.
 */
TeamsPath.prototype.removeFdfNode = function() {
	//  FDF 장비 제거
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isFdfRole() ) {
	        this.NODES.splice( idx, 1 );
	    }
	}	
};




/**
 * 커플러 장비를 제거한다.
 */
TeamsPath.prototype.removeCouplerNode = function() {
	//  커플러 장비 제거
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isCouplerRole() ) {
	        this.NODES.splice( idx, 1 );
	    }
	}	
};




/**
 * WDM 장비를 제거한다.
 */
TeamsPath.prototype.removeWdmNode = function( ) {
	//  WDM 장비 제거
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.isWdmRole() ) {
	        this.NODES.splice( idx, 1 );
	    }
	}	
};


/**
 * 입력한 장비 역할에 해당하는 장비들을 제거한다.
 * 
 * @param neRoles 삭제할 장비 역할 목록
 */
TeamsPath.prototype.removeNodeByRole = function(  neRoles ) {

	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() ) {
	    	
			var bDeleteNode = false;
			
			if ( Array.isArray(neRoles) ) {
				for ( var roleIdx = 0; roleIdx < neRoles.length; roleIdx++ ) {
					var role = neRoles[roleIdx];
					if ( node.Ne.NE_ROLE_CD == role ) {
						bDeleteNode = true;
						break;
					}
				}
			}
	    	
	    	if ( bDeleteNode ) {
		        this.NODES.splice( idx, 1 );
	    	}
	    	
	    }
	}	
};





/**
 * 입력한 장비ID 로 노드를 찾는다.
 */
TeamsPath.prototype.findNodeByNe = function(neId) {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.NE_ID === neId ) {
	        return node;
	    }
	}
	
	return null;
};


/**
 * 입력한 장비, A포트, B 포트 ID 로 노드를 찾는다.
 */
TeamsPath.prototype.findNodeByNePort = function(neId, aPortId, bPortId) {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    if ( node.isValid() && node.Ne.NE_ID === neId && node.APortDescr.PORT_ID == aPortId && node.BPortDescr.PORT_ID == bPortId ) {
	        return node;
	    }
	}	

	return null;
};



/**
 * 입력한 노드 ID 에 해당하는 노드를 구한다.   없으면 null
 * 
 * @param nodeId		NODE_ID
 */
TeamsPath.prototype.findNodeById = function( nodeId ) {
	if ( nodeId != null ) {
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
			var teamsNode = this.NODES[idx];
			if ( teamsNode.NODE_ID == nodeId ) {
				return teamsNode;
			}
		}
	}
	
	return null;
};



/**
 * 원본 SEQ 에 해당하는 노드의 INDEX 를 구한다.   없으면 -1
 * 
 * @param nodeId		NODE_ID
 */
TeamsPath.prototype.findIndexById = function( nodeId ) {
	if ( nodeId != null ) {
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
			var teamsNode = this.NODES[idx];
			if ( teamsNode.NODE_ID == nodeId ) {
				return idx;
			}
		}
	}
	
	return -1;
};


/**
 * 입력한 노드 ID의 다음 노드를 구한다.   없으면 null
 * 
 * @param nodeId		NODE_ID
 */
TeamsPath.prototype.findNextNodeById = function( nodeId ) {
	if ( nodeId != null ) {
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
			var teamsNode = this.NODES[idx];
			if ( teamsNode.NODE_ID == nodeId ) {
				if (idx < this.NODES.length-1) {
					return this.NODES[idx+1];
				} else {
					return null;
				}
			}
		}
	}
	
	return null;
};

/**
 * 입력한 노드 ID의 이전 노드를 구한다.   없으면 null
 * 
 * @param nodeId		NODE_ID
 */
TeamsPath.prototype.findPreNodeById = function( nodeId ) {
	if ( nodeId != null ) {
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
			var teamsNode = this.NODES[idx];
			if ( teamsNode.NODE_ID == nodeId ) {
				if (idx > 0) {
					return this.NODES[idx-1];
				} else {
					return null;
				}
			}
		}
	}
	
	return null;
};


/**
 * 입력한 사용 네트워크가 최상위 네트워크로 존재하는 지 여부
 * 
 * @param networkId		사용 네트워크 ID
 */
TeamsPath.prototype.hasUseTopNetwork = function( networkId ) {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var teamsNode = this.NODES[idx];
		var topNetwork = teamsNode.getTopNetwork();
		if ( topNetwork != null && topNetwork.NETWORK_ID == networkId ) {
			return true;
		}
	}
	
	return false;
};

/**
 * 2019-11-28 링을 추가하는 경우 해당 링이 현재 선번의 트렁크, 링의 소속 링인지 체크
 * 
 * 
 * @param networkId		사용 네트워크 ID
 */
TeamsPath.prototype.hasUseRingNetwork = function( networkId ) {
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var teamsNode = this.NODES[idx];
		var ringNetwork = teamsNode.getRing();
		// 링이 있는경우
		if ( ringNetwork != null) {
			if (ringNetwork.NETWORK_ID == networkId ) {
				return true;
			}
			else if (nullToEmpty(ringNetwork.RING_ID_L2) == networkId ) {
				return true;
			}
			else if (nullToEmpty(ringNetwork.RING_ID_L3) == networkId ) {
				return true;
			}
		} 
	}
	
	return false;
};



/**
 * 입력한 사용 네트워크 ID 가 최상위 네트워크로 존재하면 해당 네트워크 선번을 구한다.
 * 
 * @param networkId		사용 네트워크 ID
 * @return TeamsPath		사용 네트워크 선번
 */
TeamsPath.prototype.getUseTopNetwork = function( networkId ) {
	var topNetworkPath = new TeamsPath();
	topNetworkPath.NETWORK_ID = networkId;
	
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var teamsNode = this.NODES[idx];
		var topNetwork = teamsNode.getTopNetwork();
		if ( topNetwork != null && topNetwork.NETWORK_ID == networkId ) {
			topNetworkPath.NODES.push(teamsNode);
			topNetworkPath.NETWORK_NM = topNetwork.NETWORK_NM;
		}
	}
	
	return topNetworkPath;
};




/**
 * 장비, 네트워크 선번을 insertAtNodeId 앞에 삽입한다.
 * @param insertAtNodeId			삽입할 위치의 노드의 NODE_ID.   NULL 이 아니면 해당 NODE 앞에 삽입한다.  NULL 이면 맨 뒤에 추가
 * @param teamsOriginalPath		삽입할 네트워크 원본 선번 ( TeamsPath ). 장비일 경우에는 TeamsNode 객체로 호출한다.
 * @return TeamsPath					새로 생성된 객체
 */
TeamsPath.prototype.insertNode = function( insertAtNodeId, teamsOriginalPath ) {
	
	var insertIdx = -1;
	if ( insertAtNodeId != null ) {
		insertIdx = this.findIndexById(insertAtNodeId);
		if ( insertIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, insertAtNodeId );
		}
		
		var insertAtNode = this.NODES[insertIdx];
		if ( insertAtNode.isNetworkNode() ) {
			var topNetwork = insertAtNode.getTopNetwork();
			var topNetworkPath = this.createUseNetworkPath(topNetwork.NETWORK_ID);
			if ( topNetworkPath != null ) {
				var firstNode = topNetworkPath.firstNode();
				if ( firstNode != null && firstNode.NODE_ID !== insertAtNodeId ) {
					throw new PathException( EnumPathException.CANT_INSERT_NODE_TO_NETWORK, insertAtNodeId );
				}
			}
		}
	} else {
		insertIdx = this.NODES.length; 
	}
	
	var newObj = null;
	if ( TeamsPath.prototype.isPrototypeOf(teamsOriginalPath) ) {
		newObj = this.insertNetwork( insertAtNodeId, teamsOriginalPath, teamsOriginalPath.PATH_DIRECTION );
	} else if ( TeamsNode.prototype.isPrototypeOf(teamsOriginalPath) ) {
		//	WDM 트렁크는 동일 장비를 계속 추가할 수 있으므로 장비 추가할 때마다 복제한 객체를 삽입한다.  
		newObj = teamsOriginalPath.clone();
		//	WDM 트렁크 선번 편집시 동일 장비를 연속으로 표시하여야 하므로
		//	장비 노드는 NODE_ID 를 새로 생성해야 한다.
		newObj.resetNodeId();
		this.NODES.splice(insertIdx,  0, newObj );
	} else {
		throw new PathException( EnumPathException.CANT_INSERT_NODE_NOT_SUPPORTED, teamsOriginalPath );
	}
	
   	this.resetPortDescrEditable();
	this.resetSeq();
	
	return newObj;
};



/**
 * 장비, 네트워크 선번을 삭제한다.
 * @param delNodeId		삭제할 노드의 NODE_ID.  네트워크 노드일 경우 네트워크 선번의 첫번째 노드의 NODE_ID
 * @returns {Array}			삭제한 노드 목록
 */
TeamsPath.prototype.removeNode = function( delNodeId ) {
	var idx = this.findIndexById(delNodeId);
	
	if ( idx < 0 ) {
		throw new PathException( EnumPathException.NOT_FOUND_NODE, delNodeId );
	}

	if ( this.NODES.length > 0 ) {
		var teamsNode = this.NODES[idx];
		if ( teamsNode.isNetworkNode() ) {
			var delNodeList = this.removeNetwork(delNodeId);
		   	this.resetPortDescrEditable();
			this.resetSeq();

			return delNodeList;
		} else {
			var delNodeList = [];
			delNodeList.push(this.NODES.splice(idx,  1)[0]);
			
		   	this.resetPortDescrEditable();
			this.resetSeq();
			
			return delNodeList;
		}
	}
	
	throw new PathException( EnumPathException.NOT_FOUND_NODE, delNodeId );
};



/**
 * 장비, 네트워크 선번을 dropAtNodeId 앞으로 이동한다.
 * @param dragNodeId			DRAG 할 노드의 NODE_ID.  네트워크일 경우 네트워크의 첫번째 노드 ID
 * @param dropAtNodeId			DROP 할 위치의 노드의 NODE_ID.  NULL 이면 맨 뒤에 이동
 */
TeamsPath.prototype.moveNode = function( dragNodeId, dropAtNodeId ) {
	
	var dragIdx = -1;
	if ( dragNodeId != null ) {
		dragIdx = this.findIndexById(dragNodeId);
		if ( dragIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, dragNodeId );
		}
	} else {
		throw new PathException( EnumPathException.CANT_MOVE_NODE_ID_IS_NULL, dragNodeId );
	}
	
	if ( dragNodeId == dropAtNodeId ) {
		throw new PathException( EnumPathException.EQUAL_DRAG_DROP_NODE_ID, dragNodeId );
	}
	
	var dropIdx = -1;
	if ( dropAtNodeId != null ) {
		dropIdx = this.findIndexById(dropAtNodeId);
		if ( dropIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, dropAtNodeId );
		}
	} else {
		dropIdx = this.NODES.length - 1; 
	}

	if ( dragIdx == dropIdx ) {
		throw new PathException( EnumPathException.EQUAL_DRAG_DROP_NODE_INDEX, dragIdx );
	}
	
	
	var dragNode = this.NODES[dragIdx];
	
	if ( dragNode.isNetworkNode() ) {
		var dropNode = this.NODES[dropIdx];
		var dragTopNetwork = dragNode.getTopNetwork();
		var dragNetworkPath = this.getUseTopNetwork(dragTopNetwork.NETWORK_ID);
		
		//	외부에서 사용 네트워크의 첫 장비로 드래그 장비를 설정하지 않는 경우를 대비해서
		//	사용 네트워크의 첫 장비로 항상 설정한다.
		dragNode = dragNetworkPath.firstNode();
		dragNodeId = dragNode.NODE_ID;
		//	네트워크 이동은 insertNetwork 에서 노드 인덱스를 새로 검색하므로 
		//	앞, 뒤 이동을 구분할 필요가 없고 insertNetwork 에서 중복 네트워크 삽입 체크를 하므로
		//	항상 삭제 먼저 하고 삽입한다.
		this.removeNetwork( dragNodeId );
		this.insertNetwork( dropAtNodeId, dragNetworkPath, dragTopNetwork.PATH_DIRECTION );
		
	} else {
		
		//	splice 는 dropIdx 앞에 삽입하므로
		//	마지막으로 이동할 경우에는 배열 길이로 dropIdx 를 지정해야 마지막에 삽입된다.
		if ( dropIdx == this.NODES.length - 1 ) {
			dropIdx = this.NODES.length;
		}
		
		if ( dragIdx < dropIdx ) {
			//	뒤로 이동하는 경우에는 삽입하고 삭제한다. 
			this.NODES.splice(dropIdx,  0, dragNode );
			this.NODES.splice(dragIdx,  1 );
		} else {
			//	앞으로 이동하는 경우에는 삭제하고 삽입한다.
			this.NODES.splice(dragIdx,  1 );
			this.NODES.splice(dropIdx,  0, dragNode );
		}
	}

   	this.resetPortDescrEditable();
	this.resetSeq();
	
};




/**
 * 네트워크 선번을 insertAtNodeId 앞에 삽입한다.
 * @param insertAtNodeId			삽입할 위치의 노드의 NODE_ID.  NULL 이면 맨 뒤에 추가
 * @param teamsOriginalPath		삽입할 네트워크 원본 선번
 * @param useNtwkDirection		네트워크 선번 사용 방향
 * @return TeamsPath					새로 생성된 객체
 * 
 * 2019-11-28 트렁크 안에 사용된 링, 링에서 경유하는 링 을 독립적으로 사용하는 경우 체크
 *            추가되는 네트워크가 링인 경우 링의 참조레벨 셋팅
 */
TeamsPath.prototype.insertNetwork = function( insertAtNodeId, teamsOriginalPath, useNtwkDirection ) {
	
	var insertIdx = -1;
	if ( insertAtNodeId != null ) {
		insertIdx = this.findIndexById(insertAtNodeId);
		if ( insertIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, insertAtNodeId );
		}
	} else {
		insertIdx = this.NODES.length; 
	}
	
	
	if ( teamsOriginalPath.NODES.length == 0 ) {
		throw new PathException( EnumPathException.CANT_INSERT_NETWORK_IS_EMPTY, teamsOriginalPath );
	}
	
	if ( teamsOriginalPath.isLinePath()) {
		// RU / L9TU회선의 경우 회선 추가가 가능함
		if (isRuCoreLine() == false /*&& isRuMatchLine() == false*/) {
			throw new PathException( EnumPathException.CANT_INSERT_LINE_PATH, teamsOriginalPath );	
		}
	}

	// 2019-11-28
	// 추가하려는 네트워크가 링인경우 해당 링이 트렁크에서 사용중인지 혹은 링에서 경유중인지 체크
	if (teamsOriginalPath.isRingPath()) {  // 추가하려는 네트워크가 링인 경우
		if ( this.hasUseRingNetwork( teamsOriginalPath.NETWORK_ID)) {
			throw new PathException( EnumPathException.CANT_INSERT_RING_NETWORK_DUPLICATE, teamsOriginalPath );
		} 
	}
	// 추가하려는 네트워크가 링이 아닌경우
	else {
		if ( this.hasUseTopNetwork( teamsOriginalPath.NETWORK_ID ) ) {
			throw new PathException( EnumPathException.CANT_INSERT_NETWORK_DUPLICATE, teamsOriginalPath );
		}
	}

	var teamsPath = teamsOriginalPath.clone();
	var useNetwork = teamsOriginalPath.createNetworkInfo();
		
	if ( useNtwkDirection == 'LEFT' ) {
		/* 2019-02-19 넘겨받은 노드 자체가 이미 방향 전환이 되어 있기때문에 그냥 사용하면됨
		 *            대신 생성된 네트워크 자체의 방향은 변경해 주어야함
		 */
		//useNetwork.reverseDirection();
		//teamsPath.reversePath();
		useNetwork.PATH_DIRECTION = useNtwkDirection;
	
	}
	
	for ( var nodeIdx = 0; nodeIdx < teamsPath.NODES.length; nodeIdx++ ) {
		var teamsNode = teamsPath.NODES[nodeIdx];
				
		if ( useNetwork.isService() ) {
			teamsNode.Service = useNetwork;
		}
		else if ( useNetwork.isTrunk() ) {
			teamsNode.Trunk = useNetwork;
		}
		else if ( useNetwork.isRing() ) {
			teamsNode.Ring = useNetwork;
		}
		else if ( useNetwork.isWdmTrunk() ) {
			teamsNode.WdmTrunk = useNetwork;
		}
		
		//	링에서 설정한 링 노드 역할을 회선 노드 역할로 초기화한다.
		teamsNode.NODE_ROLE_CD = 'NA';
		teamsNode.NODE_ROLE_NM = '해당없음';
		
		
		this.NODES.splice(insertIdx++,  0, teamsNode );
	}
	
	
	this.USE_NETWORK_PATHS.push(teamsOriginalPath);

	/* 2019-10-29 기간망 링 선번 고도화
	 * 만약 링인 경우
	 * 노드가 Ring소속이고 해당 링이 2차/3차링 정보를 가지고 있다면 useNetwork에 해당 정보를 셋팅해줌		 * 
	 */
	
	if (teamsOriginalPath.isRingPath()) {
		
		var cascadingRing = null;
		var ringLvl = "1";
		for (var i = 0; i < teamsOriginalPath.NODES.length; i++) {
			var tmpOrgNode = teamsOriginalPath.NODES[i];
			// 편집중인선번에 링 개체를 가지고 있는 회선을 추가하려고 하는 경우 
			if (tmpOrgNode != null && tmpOrgNode.Ring != null  ) {
				// 링의 2차 혹은 3차 링의 정보가 다른 경우 해당 링의 정보를 clone하고 거기에 해당 정보를 셋팅
				if (cascadingRing == null  // 첫 2차 링이라면 
					|| nullToEmpty(tmpOrgNode.Ring.NETWORK_ID) != nullToEmpty(cascadingRing.RING_ID_L2)  // 이전 2차링 정보와 다른 링이라면 
					|| nullToEmpty(tmpOrgNode.Ring.RING_ID_L2) != nullToEmpty(cascadingRing.RING_ID_L3)  // 이전 3차링 정보와 다른 링이라면 
				    ) {
	
					cascadingRing = teamsPath.NODES[i].Ring.clone();
	
					// 해당 링에 필요한 정보를 셋팅
					cascadingRing.RING_ID_L2 = tmpOrgNode.Ring.NETWORK_ID;
					cascadingRing.RING_NM_L2 = tmpOrgNode.Ring.NETWORK_NM;
					cascadingRing.RING_ID_L3 = tmpOrgNode.Ring.RING_ID_L2;
					cascadingRing.RING_NM_L3 = tmpOrgNode.Ring.RING_NM_L2;
					// 링의레벨
					if (nullToEmpty(cascadingRing.RING_ID_L2) != "" && ringLvl == "1") {
						ringLvl = "2";
					}
					if (nullToEmpty(cascadingRing.RING_ID_L3) != "" && ringLvl == "2") {
						ringLvl = "3";
					}
	
					teamsPath.NODES[i].Ring = cascadingRing; 
				}
				// 만약 같다면 클론한 링을 해당 링에 셋팅
				else if (nullToEmpty(tmpOrgNode.Ring.NETWORK_ID) == nullToEmpty(cascadingRing.RING_ID_L2)) {
					teamsPath.NODES[i].Ring = cascadingRing; 
				}
			}
		}
		
		// 추가되는 링 네트워크에 대해 레벨 셋팅
		for (var i = 0; i < teamsPath.NODES.length; i++) {
			var tmpOrgNode = teamsPath.NODES[i];
			if (tmpOrgNode.Ring != null) {
				tmpOrgNode.Ring.RING_LVL = ringLvl;
			}
		}
	}
	return teamsPath;
};



/**
 * 네트워크 선번을 삭제한다.
 * @param delNodeId		삭제할 네트워크 선번의 첫번째 노드의 NODE_ID
 * @returns {Array}		삭제한 노드 목록
 */
TeamsPath.prototype.removeNetwork = function( delNodeId ) {
	var idx = this.findIndexById(delNodeId);
	
	if ( idx < 0 ) {
		throw new PathException( EnumPathException.NOT_FOUND_NODE, delNodeId );
	}
	
	if ( this.NODES.length > 0 ) {
		var delNode = this.NODES[idx];
		if ( delNode.isNetworkNode() == false ) {
			throw new PathException( EnumPathException.CANT_DELETE_EQUIP_NODE, delNode );
		}
		
		//	삭제할 네트워크 선번의 노드 인덱스를 구한다.
		var delNetwork = delNode.getTopNetwork();
		var delNodeIndexList = [];
		for ( var nodeIdx = idx; nodeIdx < this.NODES.length; nodeIdx++ ) {
			var teamsNode = this.NODES[nodeIdx];
			var topNetwork = teamsNode.getTopNetwork();

			if ( topNetwork != null && delNetwork.NETWORK_ID === topNetwork.NETWORK_ID ) {
				delNodeIndexList.push(nodeIdx);
			} else {
				break;
			}
		}

		var delNodeList = [];
		
		//	삭제
		for ( var delIdx = delNodeIndexList.length - 1;  delIdx >= 0; delIdx-- ) {
			var delNodeIdx = delNodeIndexList[delIdx];
			delNodeList.unshift( this.NODES.splice(delNodeIdx,  1)[0] );
		}
		
		
		for ( var idx = 0; idx < this.USE_NETWORK_PATHS.length; idx++ ) {
			var obj = this.USE_NETWORK_PATHS[idx];
			if ( obj.NETWORK_ID === delNetwork.NETWORK_ID ) {
				this.USE_NETWORK_PATHS.splice(idx, 1);
				break;
			}
		}
		
		return delNodeList;
	}
	
	throw new PathException( EnumPathException.NOT_FOUND_NODE, delNodeId );
};





/**
 * 사용 네트워크를 뒤집는다.
  * @param nodeId		네트워크 선번의 첫번째 노드의 NODE_ID
  */
TeamsPath.prototype.reverseUseNetwork = function( nodeId ) {
	try {
		
		var nodeIdx = this.findIndexById(nodeId);
		
		if ( nodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, nodeId );
		}
		
		if ( this.NODES.length > 0 ) {
			
			//	기존 네트워크 선번을 삭제하고
			var deletedNodes = this.removeNetwork(nodeId);

			//	뒤집고
			this.reverseNodes(deletedNodes);

			//	사용 네트워크 선번 삽입
			for ( var delIdx = 0; delIdx < deletedNodes.length; delIdx++ ) {
				this.NODES.splice(nodeIdx + delIdx, 0, deletedNodes[delIdx]);
			}		

		}
		
	} catch ( err ) {
		console.log(err);
	}
};




/**
 * 선번 노드 순서를 뒤집는다.
 */
TeamsPath.prototype.reversePath = function( ) {
	try {
		this.NODES.reverse();
		
		//	사용 네트워크 방향 뒤집기
		for ( var nodeIdx = 0; nodeIdx < this.NODES.length; nodeIdx++ ) {
			var teamsNode = this.NODES[nodeIdx];
			teamsNode.reverseUseNetworkDirection();
			
			if ( teamsNode.isWdmTrunkNode() == false ) {
				teamsNode.swapPort();
			}
			teamsNode.SEQ = nodeIdx + 1;
		}
		
	} catch ( err ) {
		console.log(err);
	}
};




/**
 * 선번 노드 순서를 뒤집고 사용 네트워크 방향을 변경하고 포트를 서로 맞바꾼다.
 * @param teamsNodes	TeamsNode 목록
 */
TeamsPath.prototype.reverseNodes = function( teamsNodes ) {
	try {
		teamsNodes.reverse();
		
		//	사용 네트워크 방향 뒤집기
		for ( var nodeIdx = 0; nodeIdx < teamsNodes.length; nodeIdx++ ) {
			var teamsNode = teamsNodes[nodeIdx];
			teamsNode.reverseUseNetworkDirection();
			if ( teamsNode.isWdmTrunkNode() == false ) {
				teamsNode.swapPort();
			}
		}
		
	} catch ( err ) {
		console.log(err);
	}
};



/**
 * FDF 구간을 뒤집는다.
  * @param nodeId		FDF 구간 NODE_ID
  */
TeamsPath.prototype.reverseFdfPath = function( nodeId ) {
	try {
		
		var nodeIdx = this.findIndexById(nodeId);
		
		if ( nodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_NODE, nodeId );
		}

		var node = this.findNodeById(nodeId);
		if ( node.Ne.isFdfRole() == false ) {
			throw new PathException( EnumPathException.CANT_REVERSE_NOT_FDF, node );
		}
		
		if ( this.NODES.length > 0 ) {

			var fdfStartIdx = nodeIdx;
			var fdfEndIdx = nodeIdx;
			var fdfNodeList = [];
			for ( var idx = nodeIdx; idx >= 0; idx-- ) {
				var node = this.NODES[idx];
				if ( node.Ne.isFdfRole() == false ) {
					break;
				}
				
				fdfStartIdx = idx;
				fdfNodeList.unshift(node); 
			}
			
			for ( var idx = nodeIdx + 1; idx < this.NODES.length; idx++ ) {
				var node = this.NODES[idx];
				if ( node.Ne.isFdfRole() == false ) {
					break;
				}
				
				fdfEndIdx = idx;
				fdfNodeList.push(node); 
			}			
			
			if ( fdfNodeList.length > 0 ) {
				//	기존 선번을 삭제하고
				for ( var delIdx = fdfEndIdx; delIdx >= fdfStartIdx; delIdx-- ) {
					this.NODES.splice(delIdx,  1);
				}
				
				//	뒤집고
				this.reverseNodes(fdfNodeList);

				//	선번 삽입
				for ( var insIdx = 0; insIdx < fdfNodeList.length; insIdx++ ) {
					this.NODES.splice(fdfStartIdx + insIdx, 0, fdfNodeList[insIdx]);
				}
			}
		}
		
	} catch ( err ) {
		console.log(err);
	}
};



/**
 * FDF, Coupler, WDM 노드를 제외한 링 구성도용 선번을 만든다.
 */
TeamsPath.prototype.createRingPath = function( ) {
	
    try {
        //	clone 메서드는 노드ID 를 신규로 생성하기 때문에 clone 메서드를 사용하면 안된다.
    	var ringPath = new TeamsPath();
    	copyAttributeAll( this, ringPath );

    	ringPath.NODES = [];
    	Array.prototype.push.apply( ringPath.NODES, this.NODES );
    	
    	ringPath.removeFdfNode();
    	ringPath.removeCouplerNode();
    	
	 	// WDM_Ring의 경우 FDF, 커플러 장비만 제거한다.
    	if (ringPath.TOPOLOGY_SMALL_CD != '013') {
    		ringPath.removeWdmNode();
    	}
		
    	ringPath.resetAddDropNode();
    	ringPath.resetPortDescrEditable();
    	ringPath.resetSeq();
       	
        return ringPath;
        
    } catch ( err ) {
        console.log(err);
    }	
	
    return this;
    
};



/**
 * 이 선번이 링 선번일 때, Add-Drop 을 지정받아 Add-Drop, Through 로만 구성된 사용 링 선번을 만든다.
 * 
 * @param addNodeId			ADD 노드ID
 * @param addPortDescr		ADD 포트Descr
 * @param dropNodeId		DROP 노드ID
 * @param dropPortDescr		DROP 포트Descr
 * @param direction			방향
 * @param checkValidate		참이면 링 Add-Drop 선번 유효성을 체크하고 거짓이면 체크하지 않는다.
 */
TeamsPath.prototype.createRingPathAddDrop = function(addNodeId, addPortDescr, dropNodeId, dropPortDescr, direction, checkValidate) {
	
	var addNodeIdx = -1;
	if ( addNodeId != null ) {
		addNodeIdx = this.findIndexById(addNodeId);
		if ( addNodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_ADD_NODE, addNodeId );
		}
	} else {
		throw new PathException( EnumPathException.NOT_FOUND_ADD_NODE, addNodeId );
	}

	
	var dropNodeIdx = -1;
	if ( dropNodeId != null ) {
		dropNodeIdx = this.findIndexById(dropNodeId);
		if ( dropNodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_DROP_NODE, dropNodeId );
		}
	} else {
		throw new PathException( EnumPathException.NOT_FOUND_DROP_NODE, dropNodeId );
	}	

	if ( addNodeId == dropNodeId ) {
		throw new PathException( EnumPathException.EQUAL_ADD_DROP_NODE, dropNodeId );
	}
	
	var useRingPath = this.clone();
	useRingPath.PATH_DIRECTION = direction;
	
	var addNode = useRingPath.NODES[addNodeIdx];
	var dropNode = useRingPath.NODES[dropNodeIdx];
	
	var reverseDirection = false;
	if ( direction == 'LEFT' ) {
		reverseDirection = true;
		useRingPath.reversePath();
		
		//	역방향으로 변경했으므로 ADD-DROP 인덱스를 새로 구한다.
		addNodeIdx = useRingPath.findIndexById(addNode.NODE_ID);
		if ( addNodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_ADD_NODE, addNodeId );
		}
		
		dropNodeIdx = useRingPath.findIndexById(dropNode.NODE_ID);
		if ( dropNodeIdx < 0 ) {
			throw new PathException( EnumPathException.NOT_FOUND_DROP_NODE, dropNodeId );
		}
	}


	
	
	//	ADD, DROP 구간 장비를 구한다.
	var useRingNodes = [];
	
    if ( addNodeIdx <= dropNodeIdx ) {
        var startIdx = addNodeIdx;
        var endIdx = Math.min( dropNodeIdx, useRingPath.NODES.length  - 1 );
        for ( var idx = startIdx; idx <= endIdx; idx++ ) {
        	useRingNodes.push(useRingPath.NODES[idx]);
        }
    } else {
    
        var startIdx = addNodeIdx;
        var endIdx = useRingPath.NODES.length - 1;
        
        for ( var idx = startIdx; idx <= endIdx; idx++ ) {
        	useRingNodes.push(useRingPath.NODES[idx]);
        }
        
        startIdx = 0;
        endIdx = Math.min( dropNodeIdx, useRingPath.NODES.length  - 1 );
        for ( var idx = startIdx; idx <= endIdx; idx++ ) {
        	useRingNodes.push(useRingPath.NODES[idx]);
        }
    }
    
    if ( checkValidate ) {
	    //	THROUGH 구간 포트가 모두 존재하는 지 확인
	    var prevNodeData = null;
	    var curNodeData = null;
	    for ( var idx = 0; idx < useRingNodes.length; idx++) {
	    	curNodeData = useRingNodes[idx];
	
	    	var breakLink = false;
	    	//	포트가 유효하지 않다는 것은 다음 장비와 연결되지 않는다는 것이다.
	    	if ( prevNodeData != null ) {
		    	if ( (prevNodeData.BPortDescr.isValid() == false || curNodeData.APortDescr.isValid() == false)
		    		 && curNodeData.ADJACENT_NODE != 'Y') {
		    		breakLink = true;
		    	}
	    	}
	    	
	    	if ( breakLink ) {
	    		throw new PathException( EnumPathException.BREAK_BETWEEN_ADD_DROP_NODE, curNodeData );
	    	}
	    	
	    	prevNodeData = curNodeData;
	    }
    }
    
    useRingPath.NODES = useRingNodes;
	
    
	if ( addPortDescr != null ) {
		addNode.APortDescr = addPortDescr;
	} else {
		addNode.APortDescr = new PortDescr();
	}
	 
	if ( dropPortDescr != null ) {
		dropNode.BPortDescr = dropPortDescr;
	} else {
		dropNode.BPortDescr = new PortDescr();
	}

	for ( var idx = 0; idx < useRingPath.NODES.length; idx++ ) {
		var node = useRingPath.NODES[idx];
		if ( node != addNode && node != dropNode ) {
			node.ADD_DROP_TYPE_CD = 'T';
			node.ADD_DROP_TYPE_NM = 'THROUGH';
		}
	}
	
	addNode.ADD_DROP_TYPE_CD = 'A';
	addNode.ADD_DROP_TYPE_NM = 'ADD';

	dropNode.ADD_DROP_TYPE_CD = 'D';
	dropNode.ADD_DROP_TYPE_NM = 'DROP';    
    
	return useRingPath;
	
};



/**
 * Add 장비를 구한다.  만약, Add-Drop 구분이 ADD 인 노드가 없는 경우 첫번째 노드를 Add 로 간주한다.
 */
TeamsPath.prototype.getAddNode = function() {
	
	if ( this.NODES.length < 2 ) {
		throw new PathException( EnumPathException.CANT_ADD_DROP_INSUFFICIENT, this );
	}
	
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    if ( node.isAddNode() ) {
	        return node;
	    }
	}	
	
	return this.NODES[0];
};




/**
 * Drop 장비를 구한다.  만약, Add-Drop 구분이 DROP 인 노드가 없는 경우 마지막 노드를 Drop 로 간주한다.
 */
TeamsPath.prototype.getDropNode = function() {
	
	if ( this.NODES.length < 2 ) {
		throw new PathException( EnumPathException.CANT_ADD_DROP_INSUFFICIENT, this );
	}
	
	for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
	    var node = this.NODES[idx];
	    if ( node.isDropNode() ) {
	        return node;
	    }
	}	
	
	return this.NODES[this.NODES.length-1];
};


/**
 * 처음과 끝 노드를 Add-Drop 노드로 지정한다.
 */
TeamsPath.prototype.resetAddDropNode = function() {

	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    
	    if ( idx == 0 ) {
	    	node.ADD_DROP_TYPE_CD = 'A';
	    	node.ADD_DROP_TYPE_NM = 'ADD';
	    } else if ( idx == this.NODES.length -1 ) {
	    	node.ADD_DROP_TYPE_CD = 'D';
	    	node.ADD_DROP_TYPE_NM = 'DROP';
	    } else {
	    	node.ADD_DROP_TYPE_CD = 'T';
	    	node.ADD_DROP_TYPE_NM = 'THROUGH';
	    }
	}		
	
};






/**
 * 입력한 시작, 종료 장비 사이의 목록을 구한다.
 * 
 * @param beginNeId	시작 장비 ( 포함 )
 * @param endNeId		종료 장비 ( 포함 )
 * @param reverse		역방향으로 순회할 지 여부
 */
TeamsPath.prototype.getBetweenNodes = function(beginNeId, endNeId, reverse) {
	
	var queue = new Queue();
	
	if ( reverse ) {
		for ( var idx = this.NODES.length - 1; idx >= 0; idx-- ) {
			queue.enqueue(this.NODES[idx]);
		}
	} else {
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
			queue.enqueue(this.NODES[idx]);
		}
	}

	//	시작 장비가 처음에 오도록 조정
	var count = queue.length();
	while ( queue.isEmpty() == false && count-- > 0 ) {
		var node = queue.peek();
		
	    if ( node.isValid() ) {
	    	if ( node.Ne.NE_ID === beginNeId  ) {
	    		break;
	    	}
	    } 
	    
	    queue.enqueue(node);
	    queue.dequeue();
	}
	

	var list = [];
	var includeNode = false;
	while ( queue.isEmpty() == false ) {
		var node = queue.dequeue();
		
	    if ( node.isValid() && node.Ne.NE_ID === endNeId ) {
    		list.push(node);
    		break;
	    } 
	    	
    	list.push(node);
	}

	return list;
};





TeamsPath.prototype.clone = function() {
	var obj = new TeamsPath();
	copyAttributeAll(this, obj);	
	
	obj.NODES = [];
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var srcNode = this.NODES[idx];
		var destNode = srcNode.clone();
		obj.NODES.push(destNode);
	}
	
	return obj;
};


TeamsPath.prototype.toDebugString = function() {
	var str = '';
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    str += '\n------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------';
	    str += '\n[SEQ:' + node.SEQ + ']' + node.toDebugString();
	}

	return str;
};





TeamsPath.prototype.exportCVS = function() {
	var str = '\nSEQ|트렁크명|링명|WDM트렁크명|장비|A포트|A채널|A_T1|B포트|B채널|B_T1\n';
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
	    var node = this.NODES[idx];
	    str += node.SEQ + '|' + node.getTrunkNm() + '|' + node.getRingNm() + '|' + node.getWdmTrunkNm() 
	    			+ '|' + node.Ne.NE_NM  
	    			+ '|' + node.APortDescr.PORT_NM  + '|' + node.APortDescr.CHANNEL_DESCR  + '|' + node.APortDescr.IS_CHANNEL_T1
	    			+ '|' + node.BPortDescr.PORT_NM  + '|' + node.BPortDescr.CHANNEL_DESCR  + '|' + node.BPortDescr.IS_CHANNEL_T1
	    			+ '\n';
	}

	return str;
};



/**
 * 입력한 네트워크ID 에 해당하는 사용 네트워크 선번을 찾는다.  없으면 NULL
 * @param networkId
 * @returns
 */
TeamsPath.prototype.findUseNetworkPath = function(networkId) {
	
	for ( var idx = 0; idx < this.USE_NETWORK_PATHS.length; idx++ ) {
		var obj = this.USE_NETWORK_PATHS[idx];
		if ( obj.NETWORK_ID == networkId ) {
			return obj;
		}
	}
	
	return null;
	
};



/**
 * 가상 장비 노드를 생성하여 돌려준다.
 * 
 * @param neName				장비명
 * @param instalMtsoInfo	설치 국사 정보 ( Mtso 객체 )
 * @returns	생성된 가상 장비 노드
 */
TeamsPath.prototype.createVirtualNe = function(neName, installMtsoInfo) {

	var vtNode = new TeamsNode();
	vtNode.Ne.NE_ID = 'NEW_VIRTUAL__' + guid();
	vtNode.Ne.NE_NM = neName;
	vtNode.Ne.fromMtso(installMtsoInfo);
	vtNode.Ne.VIRTUAL_YN = 'Y';
	
	return vtNode;
};



/**
 * 가상 네트워크를 생성하여 돌려준다.
 * 
 * @param networkName		네트워크명
 * @param topologyLargeCd		토폴로지 유형(대) 코드
 * @param topologySmallCd		토폴로지 유형(소) 코드
 * @param upperMtsoInfo	상위국사 정보
 * @param lowerMtsoInfo	하위국사 정보
 * @returns	생성된 가상 네트워크 선번 ( TeamsPath )
 */
TeamsPath.prototype.createVirtualNetwork = function(networkName, topologyLargeCd, topologySmallCd,  upperMtsoInfo, lowerMtsoInfo, topologyCfgMeansCd) {
	
	var vtNetwork = new Network();
	vtNetwork.NETWORK_ID = 'NEW_VIRTUAL__' + guid();
	vtNetwork.NETWORK_NM = networkName;

	vtNetwork.TOPOLOGY_LARGE_CD = topologyLargeCd;
	vtNetwork.TOPOLOGY_LARGE_NM = '';

	vtNetwork.TOPOLOGY_SMALL_CD = topologySmallCd;
	vtNetwork.TOPOLOGY_SMALL_NM = '';
	
	vtNetwork.TOPOLOGY_CFG_MEANS_CD = nullToEmpty(topologyCfgMeansCd);
	vtNetwork.TOPOLOGY_CFG_MEANS_NM = '';
	
	vtNetwork.VIRTUAL_YN = 'Y';
	
	vtNetwork.UPR_MTSO_ID = upperMtsoInfo.MTSO_ID;
	vtNetwork.LOW_MTSO_ID = lowerMtsoInfo.MTSO_ID;
	
	var upperNode = this.createVirtualNe(upperMtsoInfo.MTSO_NM, upperMtsoInfo);
	var lowerNode = this.createVirtualNe(lowerMtsoInfo.MTSO_NM, lowerMtsoInfo);
	
	if ( vtNetwork.isTrunk() ) {
		upperNode.Trunk = vtNetwork;
		lowerNode.Trunk = vtNetwork;
	}
	else if ( vtNetwork.isRing() ) {
		upperNode.Ring = vtNetwork;
		lowerNode.Ring = vtNetwork;
	}
	else if ( vtNetwork.isWdmTrunk() ) {
		upperNode.WdmTrunk = vtNetwork;
		lowerNode.WdmTrunk = vtNetwork;
	}
	
	var vtPath = new TeamsPath();
	vtPath.fromNetworkInfo(vtNetwork);
	vtPath.NODES.push(upperNode);
	vtPath.NODES.push(lowerNode);
	
	return vtPath;
};



/**
 * 가상 네트워크 지도를 위한 구간 선번을 생성하여 돌려준다.
 * 
 * @param		upperMtsoInfo	가상 회선 상위국 정보
 * @param		lowerMtsoInfo		가상 회선 하위국 정보
 * @returns	가상 네트워크 지도 구간 선번 ( Path )
 */
TeamsPath.prototype.toVirtualMapPath = function( upperMtsoInfo, lowerMtsoInfo ) {
	
	var vtShortPath = this.toShortPath();

	if ( vtShortPath.isReverseUpperLower(upperMtsoInfo, lowerMtsoInfo) ) {
		vtShortPath.reversePath();
	}
	
	var upperNode = vtShortPath.createVirtualNe(upperMtsoInfo.MTSO_NM, upperMtsoInfo);
	upperNode.isVirtualUpperMtsoNode = true;
	vtShortPath.NODES.unshift(upperNode);
	
	var lowerNode = vtShortPath.createVirtualNe(lowerMtsoInfo.MTSO_NM, lowerMtsoInfo);
	lowerNode.isVirtualLowerMtsoNode = true;
	vtShortPath.NODES.push(lowerNode);

	var tangoPath = vtShortPath.toTangoPath();
	//	트렁크 안에 링이 처음부터 있는 경우, 상위국 구간이 링 구간으로 생성된다. 
	//	상, 하위국 구간은 사용 네트워크를 없애야 한다.
	for ( var linkIdx = 0; linkIdx < tangoPath.LINKS.length; linkIdx++ ) {
		var link = tangoPath.LINKS[linkIdx];
		if ( link.leftNode.isVirtualUpperMtsoNode || link.rightNode.isVirtualUpperMtsoNode 
			|| link.leftNode.isVirtualLowerMtsoNode || link.rightNode.isVirtualLowerMtsoNode ) {
			link.Trunk = null;
			link.Ring = null;
			link.WdmTrunk = null;
		}
	}
	
	return tangoPath;
	
};




/**
 * 가상 회선에서 초기 가상 구간을 위해 상, 하위국 가상 노드를 기본적으로 추가한다.
 * <br/>트렁크(링, 장비)를 추가한 후에 가상 상, 하위국 노드와 동일한 국사인 경우
 * <br/>가상 상, 하위국 노드를 삭제한다. 
 * 
 * @param		upperMtsoInfo	가상 회선 상위국 정보
 * @param		lowerMtsoInfo		가상 회선 하위국 정보
 */
TeamsPath.prototype.mergeVirtualMapUpperLowerMtso = function( upperMtsoInfo, lowerMtsoInfo ) {

	if ( this.NODES.length > 2 ) {
		var firstNode = this.firstNode();
		var lastNode = this.lastNode();
	
		if ( firstNode.isVirtualUpperMtsoNode && firstNode.Ne.ORG_ID == upperMtsoInfo.MTSO_ID ) {
			var secondNode = this.NODES[1]; 
			if ( firstNode.Ne.ORG_ID == secondNode.Ne.ORG_ID ) {
				this.NODES.shift();
			}
		}

		if ( lastNode.isVirtualLowerMtsoNode && lastNode.Ne.ORG_ID == lowerMtsoInfo.MTSO_ID ) {
			var prevLastNodeIdx = this.NODES.length - 2;
			var prevLastNode = this.NODES[prevLastNodeIdx]; 
			if ( lastNode.Ne.ORG_ID == prevLastNode.Ne.ORG_ID ) {
				this.NODES.pop();
			}
		}
	}
	
};



/**
 * 입력한 상,하위국 정보와 선번상 첫번째, 마지막 장비의 국사 정보가 뒤집혀졌는 지를 검사한다.
 * @param		upperMtsoInfo	상위국 정보
 * @param		lowerMtsoInfo		하위국 정보
 * @returns {Booleans}
 */
TeamsPath.prototype.isReverseUpperLower = function(upperMtsoInfo, lowerMtsoInfo) {
	
	var firstNode = this.firstNode();
	var lastNode = this.lastNode();
	
	if ( firstNode != null && lastNode != null && upperMtsoInfo.TOP_MTSO_ID != lowerMtsoInfo.TOP_MTSO_ID ) {
		//	전송실 비교
		if ( firstNode.Ne.ORG_ID_L3 == lowerMtsoInfo.TOP_MTSO_ID && lastNode.Ne.ORG_ID_L3 == upperMtsoInfo.TOP_MTSO_ID ) {
			return true;
		}
	}
	
	return false;
	
};



/**
 * 회선 선번을 검증한다.
 */
TeamsPath.prototype.verifyLinePath = function(pathJrdtMtsoList) {
	
    try {
    	var verifyPath = this.clone();
        
    	verifyPath.removeFdfNode();
    	verifyPath.removeCouplerNode();
    	//verifyPath.removeWdmNode();
    	verifyPath.removeNullNode();
        
    	this.resetVerifyResult();
    	
        if ( verifyPath.NODES.length == 0 ) {
        	this.VERIFY_ERROR = 'Y';
        	this.VERIFY_PATH_RESULT = VERIFY_RESULT.NOTHING_PATH;
        } else {
        	
            //	검증 결과 기록
            for ( var idx = 0; idx < verifyPath.NODES.length; idx++ ) {
            	var thisNode = verifyPath.NODES[idx];
            	thisNode.VERIFY_ERROR = 'N';
            	thisNode.VERIFY_PATH_RESULT = VERIFY_RESULT.SUCCESS;
            }
        	
        	
        	verifyPath.verifyPathNodePortAny();
        	verifyPath.verifyPathEqualFirstLastEqpMtsoWithUpperLowerMtso(pathJrdtMtsoList);
        	verifyPath.verifyPathEqualPrevMtso();
        }


        //	검증 결과 기록
        for ( var idx = 0; idx < this.NODES.length; idx++ ) {
        	var thisNode = this.NODES[idx];
        	thisNode.VERIFY_ERROR = 'N';
        	thisNode.VERIFY_PATH_RESULT = VERIFY_RESULT.EXCEPT_VERIFY_PATH_NODE;
        }

        
        for ( var idx = 0; idx < verifyPath.NODES.length; idx++ ) {
        	var verifyNode = verifyPath.NODES[idx];
        	var thisNode = this.findNodeById(verifyNode.NODE_ID);
        	if ( thisNode != null ) {
            	thisNode.VERIFY_ERROR = verifyNode.VERIFY_ERROR;
            	thisNode.VERIFY_PATH_RESULT = verifyNode.VERIFY_PATH_RESULT;
        	}
        }
        
    } catch ( err ) {
    	this.VERIFY_ERROR = 'Y';
    	this.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_UNKNOWN_ERROR;
    	console.log(err);
    }

};




/**
 * 트렁크 선번을 검증한다.
 */
TeamsPath.prototype.verifyTrunkPath = function(pathJrdtMtsoList) {
	
    try {
    	
    	var verifyPath = this.clone();
        
    	verifyPath.removeFdfNode();
    	verifyPath.removeCouplerNode();
//    	verifyPath.removeWdmNode();
    	verifyPath.removeNullNode();

    	this.resetVerifyResult();
    	
        if ( verifyPath.NODES.length == 0 ) {
        	this.VERIFY_ERROR = 'Y';
        	this.VERIFY_PATH_RESULT = VERIFY_RESULT.NOTHING_PATH;
        } else {
        	verifyPath.verifyPathNodePortAny();
        	verifyPath.verifyPathEqualFirstLastEqpMtsoWithUpperLowerMtso(pathJrdtMtsoList);
//        	verifyPath.verifyPathEqualPrevMtso();
        }


        //	검증 결과 기록
        for ( var idx = 0; idx < this.NODES.length; idx++ ) {
        	var thisNode = this.NODES[idx];
        	thisNode.VERIFY_ERROR = 'N';
        	thisNode.VERIFY_PATH_RESULT = VERIFY_RESULT.EXCEPT_VERIFY_PATH_NODE;
        }

        
        for ( var idx = 0; idx < verifyPath.NODES.length; idx++ ) {
        	var verifyNode = verifyPath.NODES[idx];
        	var thisNode = this.findNodeById(verifyNode.NODE_ID);
        	if ( thisNode != null ) {
            	thisNode.VERIFY_ERROR = verifyNode.VERIFY_ERROR;
            	thisNode.VERIFY_PATH_RESULT = verifyNode.VERIFY_PATH_RESULT;
        	}
        }
        
    } catch ( err ) {
    	this.VERIFY_ERROR = 'Y';
    	this.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_UNKNOWN_ERROR;
    	console.log(err);
    }

};



/**
 * 
 * 노드의 A, B 포트 중 하나라도 존재하는 지 검증한다.<br/>
 * 이 선번은 단자반 등이 검증대상이 아닌 노드는 제외됐음을 전제한다.
 */
TeamsPath.prototype.verifyPathNodePortAny = function() {

    for ( var idx = 0; idx < this.NODES.length; idx++ ) {
    	var node = this.NODES[idx];
        if ( node.isValid() ) {
            if ( node.isNullAPort() && node.isNullBPort() ) {
            	node.VERIFY_ERROR = 'Y';
                node.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_PORT_NULL;
            }
        }
    }

};
    

/**
 * 
 * 첫번째, 마지막 장비 국사가 상.하위국사와 일치하는 지 검증한다.<br/>
 * 이 선번은 단자반 등이 검증대상이 아닌 노드는 제외됐음을 전제한다.
 * 
 * @throws NoExistPathMtsoException 
 */
TeamsPath.prototype.verifyPathEqualFirstLastEqpMtsoWithUpperLowerMtso = function(pathJrdtMtsoList) {
	
    try {
        
        if ( pathJrdtMtsoList == null ) {
            throw new PathException( EnumPathException.NOT_EXIST_JRDT_MTSO, this );
        }
        
        //  상, 하위국은 필수이다.
        var upperMtso = pathJrdtMtsoList.getUpperMtso();
        var lowerMtso = pathJrdtMtsoList.getLowerMtso();
        
        var firstNode = this.firstNodeExcludeFdfCoupler();
        var lastNode = this.lastNodeExcludeFdfCoupler();
        
        var firstNe = firstNode.Ne;
        var lastNe = lastNode.Ne;
        
        var firstTopMtsoId = nullToEmpty(firstNe.ORG_ID_L3);
        var lastTopMtsoId = nullToEmpty(lastNe.ORG_ID_L3);

        if ( firstTopMtsoId == upperMtso.TOP_MTSO_ID ) {
            if ( lastTopMtsoId == lowerMtso.TOP_MTSO_ID ) {
                //  상.하위국 모두 일치
            } else {
                //  첫번째 장비 국사와 상위국은 일치, 마지막 장비 국사와 하위국은 불일치
            	lastNode.VERIFY_ERROR = 'Y';
                lastNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_LOWER_MTSO;
            }
        } else if ( lastTopMtsoId == upperMtso.TOP_MTSO_ID ) {
            if ( firstTopMtsoId == lowerMtso.TOP_MTSO_ID ) {
                //  상.하위국 모두 일치
            } else {
                //  마지막 장비 국사와 상위국은 일치, 첫번째 장비 국사와 하위국은 불일치
            	firstNode.VERIFY_ERROR = 'Y';
                firstNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_LOWER_MTSO;
            }
        } else {
            //  첫번째, 마지막 장비 국사와 상위국 모두 불일치
            //  
            if ( firstTopMtsoId == lowerMtso.TOP_MTSO_ID ) {
                //  첫번째 장비 국사와 하위국이 일치하면 마지막 장비 국사는 상위국과 일치해야 하는 데
                //  위에서 일치하지 않았으므로 상위국 불일치로 처리한다.
            	lastNode.VERIFY_ERROR = 'Y';
                lastNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_UPPER_MTSO;
            } else if ( lastTopMtsoId == lowerMtso.TOP_MTSO_ID ) {
                //  마지막 장비 국사와 하위국이 일치하면 첫번째 장비 국사는 상위국과 일치해야 하는 데
                //  위에서 일치하지 않았으므로 상위국 불일치로 처리한다.
            	firstNode.VERIFY_ERROR = 'Y';
                firstNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_UPPER_MTSO;
            } else {
                //  첫번째, 마지막 장비 국사와 상.하위국 모두 불일치
            	firstNode.VERIFY_ERROR = 'Y';
                firstNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_UPPER_MTSO;
            	lastNode.VERIFY_ERROR = 'Y';
                lastNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_LOWER_MTSO;
            }
        }
    } catch ( err ) {
        var firstNode = this.firstNodeExcludeFdfCoupler();
        var lastNode = this.lastNodeExcludeFdfCoupler();
        if ( firstNode != null ) {
        	firstNode.VERIFY_ERROR = 'Y';
            firstNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_UPPER_MTSO;
        }

        if ( lastNode != null ) {
        	lastNode.VERIFY_ERROR = 'Y';
            lastNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_LOWER_MTSO;
        }
        
        throw err;
    }
};


/**
 * 
 * 장비 국사가 이전 장비 국사와 일치하는 지 검증한다.<br/>
 * 이 선번은 단자반 등이 검증대상이 아닌 노드는 제외됐음을 전제한다.
 * 
 * @throws NoExistPathMtsoException 
 */
TeamsPath.prototype.verifyPathEqualPrevMtso = function() {

    try {
        
        var prevNode = null;
        var prevMtsoId = null;
        for ( var idx = 0; idx < this.NODES.length; idx++ ) {
        	var node = this.NODES[idx];
            var curMtsoId = nullToEmpty(node.Ne.ORG_ID);
            
            if ( prevNode != null  ) {
                
                //  동일 네트워크가 아닌한 이전 국사와 일치해야 한다.
                var matchMtso = false;
                if ( isNullOrEmpty(prevMtsoId) == false ) {
                	if ( prevMtsoId == curMtsoId ) {
                		matchMtso = true;
	                } else {
	                    if ( prevNode.isNetworkNode() && node.isNetworkNode() ) {
	                        var prevNetwork = prevNode.getTopNetwork();
	                        var curNetwork = node.getTopNetwork();
	                        if ( prevNetwork.NETWORK_ID == curNetwork.NETWORK_ID ) {
	                            matchMtso = true;
	                        }
	                    }
	                }
                }
                
                if ( matchMtso == false ) {
                	node.VERIFY_ERROR = 'Y';
                    node.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_PREV_EQP_MTSO;
                    prevNode.VERIFY_ERROR = 'Y';
                    prevNode.VERIFY_PATH_RESULT = VERIFY_RESULT.FAIL_NOT_EQUAL_NEXT_EQP_MTSO;
                }
            }
            
            prevNode = node;
            prevMtsoId = curMtsoId;
        }

    } catch ( err ) {
        throw err;
    }
};

/**
 * 검증 결과를 리셋한다.
 */
TeamsPath.prototype.resetVerifyResult = function() {
	this.VERIFY_ERROR = 'N';
	this.VERIFY_PATH_RESULT = VERIFY_RESULT.NONE;
	
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var node = this.NODES[idx];
		node.VERIFY_ERROR = 'N';
		node.VERIFY_PATH_RESULT = VERIFY_RESULT.NONE;
	}
};


/**
 * 검증 결과 에러가 있는 지 조회한다.
 */
TeamsPath.prototype.hasVerifyError = function() {
	if ( this.VERIFY_ERROR === 'Y' ) {
		return true;
	}
	
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var node = this.NODES[idx];
		if ( node.VERIFY_ERROR === 'Y' ) {
			return true;
		}
	}
	
	return false;	
};






TeamsPath.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {

		if ( this.NODES.length != other.NODES.length ) {
			return false;
		}
		
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		    var node = this.NODES[idx];
		    
		    if ( node.equals(other.NODES[idx]) == false ) {
		    	return false
		    }
		}
		
		return true;
		
	} else {
		return false;
	}

};


/**
 * 각 포트의 편집 가능 여부를 재설정한다. 
 */
TeamsPath.prototype.resetPortDescrEditable = function() {

    try {

    	//	초기화
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		    var node = this.NODES[idx];
		    node.resetPortDescrEditable();
		}
		
		this.resetUseNetworkAddDropNode();
		
		var prevNode = null; 
		for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		    var node = this.NODES[idx];
		
		    /* 2018-09-12  RU고도화*/
		    if ( node.isServiceNode() || node.isTrunkNode() || node.isRingNode() ) {
		    	if ( node.isAddNode() ) {

		    		//	인접 네트워크간의 동일 장비는 편집을 막는다.
		    		if ( prevNode != null && (node.isServiceNode() || prevNode.isTrunkNode() || prevNode.isRingNode() )
		    				&& prevNode.equalTopNetwork(node) == false
		    				&& prevNode.isDropNode()
		    				&& prevNode.Ne.NE_ID == node.Ne.NE_ID ) {
				    	node.APortDescr.EDITABLE_PORT = false;
				    	node.APortDescr.EDITABLE_CHANNEL = false;
				    	
				    	prevNode.BPortDescr.EDITABLE_PORT = false;
				    	prevNode.BPortDescr.EDITABLE_CHANNEL = false;
		    		}
		    		
			    	node.BPortDescr.EDITABLE_PORT = false;
			    	node.BPortDescr.EDITABLE_CHANNEL = false;
		    	} else if ( node.isDropNode() ) {
			    	node.APortDescr.EDITABLE_PORT = false;
			    	node.APortDescr.EDITABLE_CHANNEL = false;
		    	} else {
			    	node.APortDescr.EDITABLE_PORT = false;
			    	node.APortDescr.EDITABLE_CHANNEL = false;
			    	node.BPortDescr.EDITABLE_PORT = false;
			    	node.BPortDescr.EDITABLE_CHANNEL = false;
		    	}
		    } else if ( node.isWdmTrunkNode() ) {
		    	//	WDM 트렁크는 모든 포트, 채널에 대해 편집 불가하다.
		    	node.APortDescr.EDITABLE_PORT = false;
		    	node.APortDescr.EDITABLE_CHANNEL = false;
		    	node.BPortDescr.EDITABLE_PORT = false;
		    	node.BPortDescr.EDITABLE_CHANNEL = false;
		    }
		    
		    prevNode = node;
		}
   	
    } catch ( err ) {
    	console.log(err);
    }

};

/**
 * 2018-09-12 1.RU고도화
 * 사용서비스회선 건수
 * 자기자신의 번호는 무시한다.
 * @param useNetworkId			체크할 사용네트워크 id
 */
TeamsPath.prototype.checkUseLineCnt = function( useNetworkId ) {
	
	if (this.hasUseTopNetwork(useNetworkId)) {
		return 0;
	}
	
	var useLineCnt = 0;
	for ( var idx = 0; idx < this.NODES.length; idx++ ) {
		var teamsNode = this.NODES[idx];
		var topNetwork = teamsNode.getTopNetwork();
		if ( topNetwork !=null && topNetwork.isService() == true ) {
			useLineCnt++;
		}
	}
	
	return useLineCnt;
};

/**
 * 2019-11-21 PTP타입 링여부 여부
 */
TeamsPath.prototype.isPtpTypeRing = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false && this.TOPOLOGY_LARGE_CD == '001') {
		// 가입자망 링
	    if (this.TOPOLOGY_SMALL_CD == '031') {
	    	return true;
	    }
	    // 토폴로지가 있는 경우  PTP이면
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == false && this.TOPOLOGY_CFG_MEANS_CD == '002') {
	    	return true;
	    }
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == true || this.TOPOLOGY_CFG_MEANS_CD == '000') {
	    	if (this.TOPOLOGY_SMALL_CD == '002' || this.TOPOLOGY_SMALL_CD == '035' || this.TOPOLOGY_SMALL_CD == '039') {
	    	    return true;
	    	}
	    }		
	}
	
	return false;
};


