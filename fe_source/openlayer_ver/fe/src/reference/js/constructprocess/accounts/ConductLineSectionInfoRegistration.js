/**
 * PrimeCostDetails.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var data = [
	        	{
	        		"name": "Vera",
	        		"phone": "138-955-8109",
	        		"email": "eu.odio@maurisblanditmattis.ca",
	        		"birthday": "2015-07-18",
	        		"zip": "467025",
	        		"salary": 1,
	        		"country": "Bahamas",
	        		"city": "Serrungarina",
	        		"company": "Suspendisse Dui Fusce PC",
	        		"type": 2
	        	}
	        ];
	
	var m = {
		gridObj : $('#dataGrid'),
		
		form    : {formObject : $('form[name=searchForm]')},
		
		button  : {
			add  : $('#btnCnstAdd'),
			del  : $('#btnDel'),
			save : $('#btnSave')
		},
		
		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/accounts/investJudgeApprovalNumber'
		},
		
		flag : {
			getList : 'getList',
			put     : 'create'
		}
	}
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
    	initGrid();
    	setGrid();
        setEventListener();
    }
    
    //초기화면
    var init = function (param) {
    	
    }
    
    //Grid 초기화
    var initGrid = function () {
    	AlopexGrid.define('defineDataGrid', {
    		rowInlineEdit: true,
    		autoColumnIndex: true,
    		columnMapping : [
    			{
    				align : 'center',
    				key : 'check',
    				width : '30px',
    				selectorColumn : true
    			}, {
    				key : 'type',
    				align: 'center',
    				title : 'type',
    				width : '50px'
    			}, {
    				key : 'name',
    				title : 'name',
    				width : '100px',
    			}, {
    				key : 'phone',
    				title : 'phone',
    				width : '100px',
    			}, {
    				key : 'email',
    				title : 'email',
    				width : '250px',
    			}, {
    				align : 'center',
    				key : 'birthday',
    				title : 'birthday',
    				width : '100px',
    			}, {
    				align : 'center',
    				key : 'zip',
    				title : 'zip',
    				width : '100px',
    				editable: true,
    				readonly: true
    			}, {
    				align : 'right',
    				key : 'salary',
    				title : 'salary',
    				width : '100px',
    				allowEdit: function(value, data, mapping) {
    					// country 정보가 있을때 편집 가능
    					if (1 == data.salary) {
    						return true;
    					}
    					return false;
    				},
    				editable: function(value, data, mapping){
    					
    				}
    			}, {
    				key : 'country',
    				title : 'country',
    				width : '200px',
    			}, {
    				key : 'city',
    				title : 'city',
    				width : '150px',
    			}, {
    				key : 'company',
    				title : 'company',
    				width : '200px',
    			} 
    		],
    		data: data
    	});
  		
        //그리드 생성
       m.gridObj.alopexGrid({
    	   extend : ['defineDataGrid']
       });
       
       gridHide();
    }
    
    // 컬럼 숨기기
    var gridHide = function () {    	
	}
    
    var setEventListener = function () {

    }
	
	//request 성공시
    var successCallback = function (response, flag){
    }
    
    //request 실패시.
    var failCallback = function (response, flag){
    	if(flag == 'search'){
    		alert('실패');
    	}
    }
    
    //그리드에 추가
    var setDataCallback = function (response) {
    }
    
    //데이터 조회
    var setGrid = function (page, rowPerPage) {
    }
    
    //ajax 호출
    var httpRequest = function(uri, Param, Method, flag) {
    	Tango.ajax({
			url : uri,
			data : Param,
			method : Method,
			flag:flag
		}).done(function(response){successCallback(response, flag);})
			.fail(function(response){failCallback(response, flag);});
    }
    
    //팝업 호출
    var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
		$a.popup({
        	popid: popupId,
        	title: title,
            url: url,
            data: data,
            width:widthSize,
            height:heightSize,
            callback: function(data) {
				callBack(data);
           	}
        });
	}
});