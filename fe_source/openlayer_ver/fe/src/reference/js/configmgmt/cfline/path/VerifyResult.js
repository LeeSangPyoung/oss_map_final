var VERIFY_RESULT = {
		

   /**
     * 검증 실행 안한 상태
     */
    NONE : {code:"000", message:"", detailMessage:""},

    /**
     * 검증 성공
     */
    SUCCESS  : {code:"099", message:"검증 성공", detailMessage:""},
    
    
    /**
     * 이전 장비 국사와 불일치
     */
    FAIL_NOT_EQUAL_PREV_EQP_MTSO  : {code:"101", message:"이전 국사와 불일치", detailMessage:"국사가 이전 국사와 불일치합니다."},

    /**
     * 다음 장비 국사와 불일치
     */
    FAIL_NOT_EQUAL_NEXT_EQP_MTSO : {code:"102", message:"다음 국사와 불일치", detailMessage:"국사가 다음 국사와 불일치합니다."},

    /**
     * 첫번째 또는 마지막 장비가 상위국과 불일치
     */
    FAIL_NOT_EQUAL_UPPER_MTSO : {code:"103", message:"상위국과 불일치", detailMessage:"첫번째 또는 마지막 장비 국사가 상위국과 불일치합니다."},
    
    /**
     * 첫번째 또는 마지막 장비가 하위국과 불일치
     */
    FAIL_NOT_EQUAL_LOWER_MTSO : {code:"104", message:"하위국과 불일치", detailMessage:"첫번째 또는 마지막 장비 국사가 하위국과 불일치합니다."},
    
    /**
     * A, B 포트 모두 NULL 인 경우
     */
    FAIL_PORT_NULL : {code:"105", message:"A, B 포트 없음", detailMessage:"장비의 A, B 포트 모두 없습니다.  최소 하나라도 입력해야 합니다."},


    /**
     * 검증 대상에서 제외된 선번 노드
     */
    EXCEPT_VERIFY_PATH_NODE : {code:"901", message:"검증 대상 아님", detailMessage:"FDF, Coupler 는 검증 대상이 아닙니다."},

    /**
     * 검증 대상에서 제외된 회선 선번 ( 관리 미대상 회선 )
     */
    EXCEPT_VERIFY_LINE : {code:"902", message:"관리 미대상 회선", detailMessage:"관리 미대상 회선으로 검증 대상이 아닙니다."},
    
    /**
     * 선번이 없는 경우
     */
    NOTHING_PATH : {code:"903", message:"선번 없음", detailMessage:"FDF, Coupler 를 제외한 장비가 없습니다."},
    
    /**
     * 알 수 없는 시스템 오류로 검증 실패
     */
    FAIL_UNKNOWN_ERROR : {code:"999", message:"시스템오류", detailMessage:"시스템 오류로 관리자에게 문의하십시오."}
    
    
};
    