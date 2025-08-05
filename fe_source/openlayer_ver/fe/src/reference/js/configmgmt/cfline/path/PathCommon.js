 
function nullToEmpty(obj) {
	if (obj == null || obj == "null" || typeof obj == "undefined") {
		obj = "";
	}	
	return obj;
}


function isNullOrEmpty(obj) {
	if (obj == null || obj == 'null' || obj == '' || typeof obj == "undefined") {
		return true;
	}
	
	return false;
}

   
function omitLongText(str, lenWanted) {
	var text = '';
	var length = 0;
	
	if(lenWanted == null || isNaN(lenWanted)) {
		length = 28;
	} else {
		length = lenWanted;
	}
	
	if(nullToEmpty(str) == '') {
		text = '';
	} else if(str.length <= length) {
		text = str;
	} else {
		text = str.substring(0, length) + '...';
	}
	
	return text;
}


function shallowCopy( obj ) {
	if ( obj === null || typeof(obj) !== 'object' ) {
		return obj;
	}
	
	var copy = obj.constructor();
	for ( var attr in obj ) {
		if ( obj.hasOwnProperty(attr) && Array.isArray(obj[attr]) == false ) {
			copy[attr] = obj[attr];
		}
	}
	
	return copy;
};




function setAttributeAll( obj, value ) {
	for ( var attr in obj ) {
		if ( obj.hasOwnProperty(attr) ) {
			obj[attr] = value;
		}
	}
};




/**
 * 입력한 소스의 프로퍼티를 대상에 복사한다. 
 * @param src
 * @param dest
 */
function copyAttributeAll( src, dest ) {
	for ( var attr in src ) {
		if ( src.hasOwnProperty(attr) && Array.isArray(src[attr]) == false ) {
			dest[attr] = src[attr];
		}
	}
};





/**
 * 입력한 소스의 prefix 로 시작하는 프로퍼티를 대상에 복사한다. 
 * @param src
 * @param dest
 * @param prefix
 */
function copyAttributeWithIncludePrefix( src, dest, prefix ) {
	for ( var attr in src ) {
		if ( attr.indexOf(prefix) == 0) {
			if ( src.hasOwnProperty(attr) ) {
				dest[attr] = src[attr];
			}
		}
	}
};



/**
 * 입력한 소스의 oldPrefix 로 시작하는 프로퍼티를 newPrefix 으로 시작하는 명으로 변경하여 대상에 복사한다.
 * oldPrefix 가 Empty 이거나 oldPrefix 로 시작하지 않는 프로퍼티는 newPrefix 를 덧붙여서 대상에 복사한다.
 * 
 * @param src
 * @param dest
 * @param oldPrefix
 * @param newPrefix
 */
function copyAttributeWithReplacingPrefix( src, dest, oldPrefix, newPrefix ) {
	for ( var attr in src ) {
		if ( src.hasOwnProperty(attr) ) {
			var newAttr = attr;
			if ( isNullOrEmpty(oldPrefix) ) {
				newAttr = newPrefix + newAttr;
			} else {
				if ( attr.indexOf(oldPrefix) == 0) {
					newAttr = newAttr.replace( oldPrefix, newPrefix );
				} else {
					
					// 기간망 링 선번 고도화로 2차 3차 링 정보와 관련된 항목에는 RING_이 붙지 않도록 처리
					if (attr != "RING_ID_L2" && attr != "RING_ID_L3" && attr != "RING_NM_L2" && attr != "RING_NM_L3" && attr != "RING_LVL" ) {
					newAttr = newPrefix + newAttr;
				}
					// 최상위 사용네트워크 정보 복사하면서 경유링 정보를 삭제해버리는 버그가 있음
					else {
						if ((newPrefix == "SERVICE_" || newPrefix == "TRUNK_" || newPrefix == "WDM_TRUNK_" || newPrefix == "USE_NETWORK_")
							&& (attr == "RING_ID_L2" || attr == "RING_ID_L3" || attr == "RING_NM_L2" || attr == "RING_NM_L3" || attr == "RING_LVL" )) {
							continue;
			}
					} 
						
				}
			}
			
			dest[newAttr] = src[attr];
		}			
	}
};


/**
 * 입력한 소스의 excludePrefixs 로 시작하는 속성을 제외한 다른 속성들만 대상에 복사한다. 
 * @param src
 * @param dest
 * @param excludePrefixs		제외할 prefix 목록
 */
function copyAttributeWithoutExcludePrefix( src, dest, excludePrefixs ) {
	for ( var attr in src ) {
		var exclude = false;
		
		if ( Array.isArray(excludePrefixs) ) {
			for ( var idx = 0; idx < excludePrefixs.length; idx++ ) {
				var prefix = excludePrefixs[idx];
				if ( attr.indexOf(prefix) == 0) {
					exclude = true;
					break;
				}
			}
		}
		
		if ( exclude == false && src.hasOwnProperty(attr) ) {
			dest[attr] = src[attr];
		}
		
	}
};


/**
 * GUID
 * 
 * @returns {String}
 */
function guid() {
	function s4() {
		return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}
	
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};


function equalsAttr(src1, src2) {

	if ( src1 == null || src2 == null ) {
		return false;
	}
	
	if ( typeof(src1) !== typeof(src2) ) {
		return false;
	}
	
	for ( var attr in src1 ) {
		if ( src1.hasOwnProperty(attr) ) {
			if ( src2.hasOwnProperty(attr) ) {
				if ( src1[attr] !== src2[attr] ) {
					return false;
				}
			} else {
				return false;
			}
		}
	}	
	
};



function sleep(milliseconds) {
	var now = new Date();
	var stop = now.getTime() + milliseconds;
	while(true) {
		now = new Date();
		if ( now.getTime() > stop ) {
			return;
		}
	}
};


/*
 * 2018-09-12 1.RU고도화
 * 수용네트워크 자동수정 기능 추가로 originalPath 선번과 수정후 선번이 같은지 비교하기 위해 
 * 비교작업에서 사용하는 equalsAttr 가 같은 경우 return이 없어 모두 에러처리되어 리턴포함 함수를 추가함....
 * 기존 equalsAttr를 사용하는 영역이 많아 별도로 추가하는 것임
 * 
 * return : 같은경우 - true, 같지 않은 경우 - false
 * */
function equalsAttrWithReturn(src1, src2) {

	if ( src1 == null || src2 == null ) {
		return false;
	}
	
	if ( typeof(src1) !== typeof(src2) ) {
		return false;
	}
	
	for ( var attr in src1 ) {
		if ( src1.hasOwnProperty(attr) ) {
			if ( src2.hasOwnProperty(attr) ) {
				// CHANNEL_IDS 이 originalPath는 array타입이고 작업 후에는 값이 없는 경우 "" 타입이됨
				if (attr == "CHANNEL_IDS") {
					if ( src1[attr] !== src2[attr] ) {
						if (src1[attr].length == 0 && nullToEmpty(src2[attr]) == "") {
							continue;
						} else {
							return false;
						}
					}
				}
				else if ( src1[attr] !== src2[attr] ) {
					return false;
				}
			} else {
				return false;
			}
		}
	}
	
	return true;
	
};
