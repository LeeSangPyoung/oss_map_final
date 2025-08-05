function PathException( codeInfo, errorInfo ) {
	//	에러 코드
	this.code = codeInfo.code;
	
	//	에러 메세지
	this.message = codeInfo.message;

	//	에러 정보. 에러를 발생시킨 NODE_ID 등...
	this.errorInfo = errorInfo;
};



PathException.prototype.toString = function() {
	return "[CODE:" + this.code + "] " + this.message; 
};





var EnumPathException = {
		

   /**
     * DRAG 노드와 DROP 노드 ID 가 동일하여 이동할 수 없습니다.
     */
	EQUAL_DRAG_DROP_NODE_ID : {code:"001", message:"Drag & Drop 위치가 동일하여 이동할 수 없습니다."},
	
	/**
	 * DRAG 노드와 DROP 노드 Index 가 동일하여 이동할 수 없습니다.
	 */
	EQUAL_DRAG_DROP_NODE_INDEX : {code:"002", message:"Drag & Drop 위치가 동일하여 이동할 수 없습니다."},

	/** 
	 * 노드를 찾을 수 없습니다.
	 */ 
	NOT_FOUND_NODE : {code:"003", message:"장비를 찾을 수 없습니다."},

	/** 
	 * ADD 장비를 찾을 수 없습니다.
	 */ 
	NOT_FOUND_ADD_NODE : {code:"011", message:"ADD 장비를 찾을 수 없습니다."},

	/** 
	 * DROP 장비를 찾을 수 없습니다.
	 */ 
	NOT_FOUND_DROP_NODE : {code:"012", message:"DROP 장비를 찾을 수 없습니다."},

	/**
	 * 동일 장비를 ADD-DROP 장비로 지정할 수 없습니다.
	 */
	EQUAL_ADD_DROP_NODE : {code:"013", message:"동일 장비를 ADD-DROP 장비로 지정할 수 없습니다."},
	
	/**
	 * 링 사용시 Add-Drop 사이가 끊겨서 등록할 수 없습니다.
	 */
	BREAK_BETWEEN_ADD_DROP_NODE : {code:"014", message:"Add-Drop 사이가 끊겨서 등록할 수 없습니다."},

	/**
	 * 링 사용시 최소 2개의 노드가 있어야 Add-Drop 노드를 구할 수 있습니다.
	 */
	CANT_ADD_DROP_INSUFFICIENT : {code:"015", message:"최소 2개의 노드가 있어야 Add-Drop 노드를 구할 수 있습니다."},
	
	/**
	 * 지원하지 않는 유형이라 삽입할 수 없습니다.
	 */
	CANT_INSERT_NODE_NOT_SUPPORTED : {code:"021", message:"시스템 에러입니다."},
	
	/**
	 * 네트워크 노드라 삭제할 수 없습니다.
	 */
	CANT_DELETE_NETWORK_NODE : {code:"022", message:"사용 네트워크 장비는 삭제할 수 없습니다."},
	
	/**
	 * 네트워크 노드를 삭제하려고 하는 데, 장비 노드인 경우
	 */
	CANT_DELETE_EQUIP_NODE : {code:"023", message:"장비를 삭제할 수 없습니다."},
	
	/**
	 * 노드 ID 가 NULL 이라 이동할 수 없습니다.
	 */
	CANT_MOVE_NODE_ID_IS_NULL : {code:"024", message:"장비를 찾을 수 없어 이동할 수 없습니다."},

	
	/**
	 * 회선에 회선을 삽입(사용)할 수 없습니다.
	 */
	CANT_INSERT_LINE_PATH : {code:"031", message:"회선에 회선 선번을 사용할 수 없습니다."},

	
	/**
	 * 이미 회선에 등록된 네트워크로 사용할 수 없습니다.
	 */
	CANT_INSERT_NETWORK_DUPLICATE : {code:"032", message:"이미 등록된 네트워크로 사용할 수 없습니다."},
	
	/**
	 * 사용 네트워크 선번에 장비를 추가할 수 없습니다.
	 */
	CANT_INSERT_NODE_TO_NETWORK : {code:"033", message:"사용 네트워크 선번에 장비를 추가할 수 없습니다."},
	
	/**
	 * 삽입하려는 네트워크 선번이 없는 경우
	 */
	CANT_INSERT_NETWORK_IS_EMPTY : {code:"034", message:"사용 네트워크 선번에 장비가 없어 삽입할 수 없습니다."},
		
	/**
	 * FDF 장비가 아니라서 FDF 구간 뒤집기 할 수 없습니다.
	 */
	CANT_REVERSE_NOT_FDF : {code:"041", message:"FDF 장비가 아니라서 FDF 구간 뒤집기 할 수 없습니다."},
	
	/**
	 * 관할 국사가 없습니다.
	 */
	NOT_EXIST_JRDT_MTSO : {code:"051", message:"관할 국사가 없습니다."},
	
	/**
	 * 상위국이 없습니다.
	 */
	NOT_EXIST_UPPER_MTSO : {code:"052", message:"상위국이 없습니다."},
	
	/**
	 * 하위국이 없습니다.
	 */
	NOT_EXIST_LOWER_MTSO : {code:"053", message:"하위국이 없습니다."},	
	
	/**
	 * 155M, 45M 채널 유닛 정보가 없습니다.
	 */
	NOT_EXIST_UPPER_CHANNEL_UNIT : {code:"061", message:"155M, 45M 채널 유닛 정보가 없습니다."},
	
	/**
	 * 동일한 계위의 채널들로만 그룹핑할 수 있습니다.
	 */
	CANT_GROUPING_NOT_EQUAL_CHANNEL_CAPA : {code:"062", message:"동일한 계위의 채널들로만 그룹핑할 수 있습니다."},	
	
	/**
	 * 이미 서비스회선 혹은 트렁크 혹은 링에서 사용중인 링으로 재 사용할 수 없습니다.
	 */
	CANT_INSERT_RING_NETWORK_DUPLICATE : {code:"063", message:"이미 서비스회선 혹은 트렁크 혹은 링에서 사용중인 링으로 중복 사용할 수 없습니다."},
	
	
};
    		    