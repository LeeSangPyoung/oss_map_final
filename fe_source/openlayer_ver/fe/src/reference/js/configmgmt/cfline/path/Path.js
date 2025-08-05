 
function Path() {
   	this.NETWORK_ID = '';
	this.NETWORK_NM = '';

	this.NETWORK_STATUS_CD = '';
	this.NETWORK_STATUS_NM = '';
	
	this.NETWORK_TYPE_CD = '';
	this.NETWORK_TYPE_NM = '';
	
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
	
	this.LINKS = [];	
};



Path.prototype = new Object();

Path.prototype.constructor = Path;


/**
 * Object Type 의 이 객체를 TeamsPath Type 객체로 변환한다. 
 */
Path.prototype.resetPrototype = function() {

	if ( this.LINKS != null ) {
		for (var idx = 0; idx < this.LINKS.length; idx++) {
			var link = this.LINKS[idx];
			Object.setPrototypeOf(link, Link.prototype);
			link.resetPrototype();
		}
	}

};


/**
 * 
 * @param obj
 */
Path.prototype.fromData = function( obj ) {
	
	copyAttributeAll(obj, this);	

//	this.NETWORK_ID = obj.NETWORK_ID;
//	this.NETWORK_NM = obj.NETWORK_NM;
//
//	this.NETWORK_STATUS_CD = obj.NETWORK_STATUS_CD;
//	this.NETWORK_STATUS_NM = obj.NETWORK_STATUS_NM;
//	this.TOPOLOGY_LARGE_CD = obj.TOPOLOGY_LARGE_CD;
//	this.TOPOLOGY_LARGE_NM = obj.TOPOLOGY_LARGE_NM;
//	this.TOPOLOGY_SMALL_CD = obj.TOPOLOGY_SMALL_CD;
//	this.TOPOLOGY_SMALL_NM = obj.TOPOLOGY_SMALL_NM;        	
//
//	this.LINE_STATUS_CD = obj.LINE_STATUS_CD;
//	this.LINE_STATUS_NM = obj.LINE_STATUS_NM;
//	this.LINE_LARGE_CD = obj.LINE_LARGE_CD;
//	this.LINE_LARGE_NM = obj.LINE_LARGE_NM;
//	this.LINE_SMALL_CD = obj.LINE_SMALL_CD;
//	this.LINE_SMALL_NM = obj.LINE_SMALL_NM;        	
//
//	this.PATH_SAME_NO = obj.PATH_SAME_NO;
//	this.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH = obj.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;	
	
    for (  var idx = 0; idx < obj.LINKS.length; idx++ ) {
        link = new Link();
        link.fromData( obj.LINKS[idx] );
        this.LINKS.push(link);
    }
	
    this.resetSeq();
};



Path.prototype.toData = function() {
	var objPath = new Object();
	copyAttributeAll( this, objPath );
	objPath.LINKS = [];
    for (  var idx = 0; idx < this.LINKS.length; idx++ ) {
    	var link = this.LINKS[idx];
    	var linkObj = new Object();
    	link.toData(linkObj, '');
    	objPath.LINKS.push(linkObj);
    }
    
    return objPath;
};




/**
 * 회선 선번 여부
 */
Path.prototype.isLinePath = function() {
	if ( isNullOrEmpty(this.LINE_SMALL_CD) == false ) {
		return true;
	}
	
	return false;
};

/**
 * 네트워크 선번 여부
 */
Path.prototype.isNetworkPath = function() {
	if ( this.isTrunkPath() || this.isRingPath() || this.isWdmTrunkPath() ) {
		return true;
	}
	
	return false;
};

/**
 * 서비스 선번 여부
 */
Path.prototype.isServicePath = function() {
	if ( isNullOrEmpty(this.LINE_SMALL_CD) == false ) {
		return true;
	}
	
	return false;
};

/**
 * 트렁크 선번 여부
 */
Path.prototype.isTrunkPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '002'  ) {
		return true;
	}
	
	return false;
};

/**
 * 링 선번 여부
 */
Path.prototype.isRingPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && this.TOPOLOGY_LARGE_CD == '001'  ) {
		return true;
	}
	
	return false;
};


/**
 * WDM 트렁크 선번 여부
 */
Path.prototype.isWdmTrunkPath = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false 
			&& this.TOPOLOGY_LARGE_CD == '003' && this.TOPOLOGY_SMALL_CD == '101' ) {
		return true;
	}
	
	return false;
};




/**
 * 구간 순서를 설정한다.
 */
Path.prototype.resetSeq = function() {

	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	    var link = this.LINKS[idx];
	    link.LINK_SEQ = idx + 1;
	}	
};




/**
 * 구간 순서를 역순으로 뒤집고 노드 WEST, EAST 를 서로 맞바꾼다.
 */
Path.prototype.reverseLinks = function( swapNode ) {

	this.LINKS.reverse();
	if ( swapNode ) {
		
	    for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	        var link = this.LINKS[idx];
	        
	        if ( swapNode ) {
	            link.swapNode();
	            link.reverseDirection();
	        }
	    }		
	}
    
};




/**
 * 입력한 사용 네트워크 필드( 트렁크, 링, WDM 트렁크 ) 에 대해 
 * 연속된 동일 사용 네트워크 구간들에 대해 첫번째 구간, 마지막 구간에 대해 NULL 로 설정한다.  
 * 
 * 각 사용 네트워크의 첫번째, 마지막 구간에서 각 네트워크를 삭제한다.
 * 네트워크 구간이 1개일 경우에는 삭제안함.
 * 네트워크 구간이 2개일 경우에는 첫번째 구간 삭제.
 * 네트워크 구간이 3개일 경우에는 첫번째, 마지막 구간 삭제.
 * 
 * 2019-11-06 기간망 링 고도화 : 인접링에 대해 첫노드 네트워크 정보 null 처리 재외함
 * 
 * @param useNetworkAttrName
 */
Path.prototype.setFirstLastUseNetworkNull = function( useNetworkAttrName, removeFirst, removeLast ) {

	var link = null;
	var prevLink = null;
	var useNetworkLinks = [];
	var adjacentRing = false;   // 인접노드인지 체크
	var removedRingInfoLink = false;
	
	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
		
		link = this.LINKS[idx];
		
		if ( link[useNetworkAttrName] != null ) {
			if ( prevLink != null && prevLink[useNetworkAttrName] != null && prevLink[useNetworkAttrName].NETWORK_ID != link[useNetworkAttrName].NETWORK_ID ) {
				if ( useNetworkLinks.length > 0 ) {
					if ( useNetworkLinks.length > 1 ) {
						if ( removeFirst ) {
							// 인접링이 아니면서 링이 아니거나 링이면서 트렁크첫노드삭제로 삭제된 링이 아닌경우 네트워크 정보 삭제하지 않는다.
							if (adjacentRing == false
								 && 	(useNetworkAttrName != "Ring" || (useNetworkAttrName == "Ring" && removedRingInfoLink == false))		
							   ) {								
							    useNetworkLinks[0].removeUseNetworkDescendants(useNetworkAttrName);
								// 기간망 트렁크 정보도 삭제
								if (useNetworkAttrName == "Ring" ) {
									useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NO = "";
									useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NM = "";
								}
							}
							
							removedRingInfoLink = false;
						}
						
						if ( removeLast && useNetworkLinks.length > 2 ) {
							useNetworkLinks[useNetworkLinks.length-1].removeUseNetworkDescendants(useNetworkAttrName);
						}
					}
					adjacentRing = false;
					useNetworkLinks = [];
				}
			}
			
			/*
			 * 2019-11-06 기간망 링 고도화 
			 * NULL 처리할 사용네트워크가 Ring인 경우 이전 링의 마지만 장비와 신규링의 장비가 같은경우  
			 * 인접링으로 시작 네트워크의 사용링 장비의 링정보를 Null 처리 하지 못하도록 플레그 adjacentRing=true를  
			 */  
			if (useNetworkAttrName == "Ring" && useNetworkLinks.length == 0) {
				if (prevLink != null && link != null && prevLink.rightNode != null && link.leftNode != null
						&& prevLink.rightNode.Ne.NE_ID == link.leftNode.Ne.NE_ID
						&& prevLink.rightNode.ADD_DROP_TYPE_CD != link.leftNode.ADD_DROP_TYPE_CD
						&& prevLink.Ring != null && link.Ring != null && prevLink.Ring.NETWORK_ID != link.Ring.NETWORK_ID) {
					adjacentRing = true;
				}
			}
			// RING인경우 
			if (useNetworkAttrName == "Ring") {
				// Ring의 첫링크인 경우이면서 최초링크가 아니고
				if (useNetworkLinks.length == 0 && idx > 0 ) {
					var tmpRingInfo = this.LINKS[idx-1].Ring;
					// 링정보가 없는 경우이면서 트렁크에의해 지워진 링의 첫 링크
					if (tmpRingInfo == null && this.LINKS[idx-1].REMOVED_RING_INFO_LINK == "Y" && removeFirst == true) {
						removedRingInfoLink = true;  // 이중으로 링정보가 삭제되는 것을 방지
					}
				}
			}
			useNetworkLinks.push(link);
		} else {
			if ( useNetworkLinks.length > 0 ) {
				if ( useNetworkLinks.length > 1 ) {
					if ( removeFirst ) {
						
						// 인접링이 아니면서 링이 아니거나 링이면서 트렁크첫노드삭제로 삭제된 링이 아닌경우 네트워크 정보 삭제하지 않는다.
						if (adjacentRing == false 
							  && 	(useNetworkAttrName != "Ring" || (useNetworkAttrName == "Ring" && removedRingInfoLink == false))							
							) {	
						    useNetworkLinks[0].removeUseNetworkDescendants(useNetworkAttrName);
							// 기간망 트렁크 정보도 삭제
							if (useNetworkAttrName == "Ring" ) {
								useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NO = "";
								useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NM = "";
							}
						}
						
						removedRingInfoLink = false;
					}

					if ( removeLast && useNetworkLinks.length > 2 ) {
						useNetworkLinks[useNetworkLinks.length-1].removeUseNetworkDescendants(useNetworkAttrName);
					}
				}
				
				adjacentRing = false;
				useNetworkLinks = [];
			}
		}

		prevLink = link;
	}

	// 마지막 그룹건 처리
	if ( useNetworkLinks.length > 0 ) {
		if ( useNetworkLinks.length > 1 ) {
			if ( removeFirst ) {
				// 인접링이 아니면서 링이 아니거나 링이면서 트렁크첫노드삭제로 삭제된 링이 아닌경우 네트워크 정보 삭제하지 않는다.
				if (adjacentRing == false
                     && (useNetworkAttrName != "Ring" || (useNetworkAttrName == "Ring" && removedRingInfoLink == false))
				   ) {	
				    useNetworkLinks[0].removeUseNetworkDescendants(useNetworkAttrName);
					// 기간망 트렁크 정보도 삭제
					if (useNetworkAttrName == "Ring" ) {
						useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NO = "";
						useNetworkLinks[0].REFC_RONT_TRK_NTWK_LINE_NM = "";
					}
				}
				
				removedRingInfoLink = false;
			}

			if ( removeLast && useNetworkLinks.length > 2 ) {
				useNetworkLinks[useNetworkLinks.length-1].removeUseNetworkDescendants(useNetworkAttrName);
			}
		}
		
		adjacentRing = false;
		useNetworkLinks = [];
	}
};




Path.prototype.toDebugString = function() {
	var str = '';
	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	    var link = this.LINKS[idx];
	    str += '\n------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------';
	    str += '\n[SEQ:' + link.LINK_SEQ + ']' + link.toDebugString();
	}

	return str;
};





Path.prototype.exportCVS = function() {
	var str = '\nSEQ|서비스회선명||트렁크명|링명|WDM트렁크명|WEST장비|WEST포트|WEST채널|WEST_T1|EAST장비|EAST포트|EAST채널|EAST_T1\n';
	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	    var link = this.LINKS[idx];
	    str += link.LINK_SEQ + '|' + link.getServiceNm() + '|' + link.getTrunkNm() + '|' + link.getRingNm() + '|' + link.getWdmTrunkNm() 
	    			+ '|' + link.leftNode.Ne.NE_NM 
	    			+ '|' + link.leftNode.PortDescr.PORT_NM  + '|' + link.leftNode.PortDescr.CHANNEL_DESCR  + '|' + link.leftNode.PortDescr.IS_CHANNEL_T1
	    			+ '|' + link.rightNode.Ne.NE_NM
	    			+ '|' + link.rightNode.PortDescr.PORT_NM  + '|' + link.rightNode.PortDescr.CHANNEL_DESCR  + '|' + link.rightNode.PortDescr.IS_CHANNEL_T1
	    			+ '\n';
	}

	return str;
};




Path.prototype.equals = function(other) {
	
	if ( equalsAttr(this, other) ) {

		if ( this.LINKS.length != other.LINKS.length ) {
			return false;
		}
		
		for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
		    var link = this.LINKS[idx];
		    
		    if ( link.equals(other.LINKS[idx]) == false ) {
		    	return false
		    }
		}
		
		return true;
		
	} else {
		return false;
	}

};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 작업후 TeamsPath isChange 함수 추가함...
 * 기존 Path.prototype.equals 가 다른 요소값의 비교 오류로 함수를 추가함
 * 
 * return : 변경된경우 - true, 변경되지 않은 경우 - false
 * */
Path.prototype.isChange = function(other) {	

	if ( this.LINKS.length != other.LINKS.length ) {
		return true;
	}
	
	for ( var idx = 0; idx < this.LINKS.length; idx++ ) {
	    var link = this.LINKS[idx];
	    
	    if ( link.isChange(other.LINKS[idx]) == true ) {
	    	return true
	    }
	}
	
	return false;

};

/**
 * 2019-11-21 PTP타입 링여부 여부
 */
Path.prototype.isPtpTypeRing = function() {
	if ( isNullOrEmpty(this.TOPOLOGY_LARGE_CD) == false  && isNullOrEmpty(this.TOPOLOGY_SMALL_CD) == false && this.TOPOLOGY_LARGE_CD == '001') {
		// 가입자망 링
	    if (this.TOPOLOGY_SMALL_CD == '031') {
	    	return true;
	    }
	    // 토폴로지가 있는 경우  PTP이면
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == false && this.TOPOLOGY_CFG_MEANS_CD == '002') {
	    	return true;
	    }
	    if (isNullOrEmpty(this.TOPOLOGY_CFG_MEANS_CD) == true  || this.TOPOLOGY_CFG_MEANS_CD == '000') {
	    	if (this.TOPOLOGY_SMALL_CD == '002' || this.TOPOLOGY_SMALL_CD == '035' || this.TOPOLOGY_SMALL_CD == '039') {
	    	    return true;
	    	}
	    }		
	}
	
	return false;
};


