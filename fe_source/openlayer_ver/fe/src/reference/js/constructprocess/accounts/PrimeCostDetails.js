/**
 * PrimeCostDetails.js
 *
 * @author Administrator
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
	        	},
	        	{
	        		"name": "Autumn",
	        		"phone": "369-405-2973",
	        		"email": "Quisque@loremsemper.com",
	        		"birthday": "2014-05-03",
	        		"zip": "370659",
	        		"salary": 2,
	        		"country": "Suriname",
	        		"city": "Eigenbrakel",
	        		"company": "Nibh Dolor Nonummy LLC",
	        		"type": 9
	        	},
	        	{
	        		"name": "Amy",
	        		"phone": "693-6192",
	        		"email": "sit@egetmagnaSuspendisse.ca",
	        		"birthday": "2015-08-06",
	        		"zip": "2794",
	        		"salary": 1,
	        		"country": "Cocos (Keeling) Islands",
	        		"city": "Chartres",
	        		"company": "Tincidunt Consulting",
	        		"type": 1
	        	},
	        	{
	        		"name": "Thor",
	        		"phone": "569-6512",
	        		"email": "parturient.montes.nascetur@imperdietnon.edu",
	        		"birthday": "2014-01-17",
	        		"zip": "26962",
	        		"salary": 2,
	        		"country": "Spain",
	        		"city": "Beho",
	        		"company": "Nulla LLC",
	        		"type": 10
	        	},
	        	{
	        		"name": "Dakota",
	        		"phone": "270-477-0444",
	        		"email": "sed.pede@tortordictumeu.edu",
	        		"birthday": "2015-06-17",
	        		"zip": "7374PU",
	        		"salary": 2,
	        		"country": "Bonaire, Sint Eustatius and Saba",
	        		"city": "Yahyalı",
	        		"company": "Parturient Montes Nascetur Inc.",
	        		"type": 1
	        	},
	        	{
	        		"name": "Cooper",
	        		"phone": "610-9420",
	        		"email": "placerat.Cras.dictum@eratVivamus.net",
	        		"birthday": "2015-07-20",
	        		"zip": "73706",
	        		"salary": 2,
	        		"country": "New Caledonia",
	        		"city": "Deline",
	        		"company": "Nulla Tincidunt Neque Ltd",
	        		"type": 2
	        	},
	        	{
	        		"name": "Bethany",
	        		"phone": "949-378-7845",
	        		"email": "erat@Morbiaccumsanlaoreet.edu",
	        		"birthday": "2014-12-16",
	        		"zip": "83245-257",
	        		"salary": 2,
	        		"country": "Poland",
	        		"city": "Milwaukee",
	        		"company": "Vel Sapien Company",
	        		"type": 1
	        	},
	        	{
	        		"name": "Ronan",
	        		"phone": "503-6165",
	        		"email": "pellentesque@egestasDuisac.co.uk",
	        		"birthday": "2015-03-23",
	        		"zip": "1124",
	        		"salary": 1,
	        		"country": "Aruba",
	        		"city": "Calgary",
	        		"company": "Donec PC",
	        		"type": 7
	        	},
	        	{
	        		"name": "Lamar",
	        		"phone": "244-4542",
	        		"email": "enim.sit@nonarcu.com",
	        		"birthday": "2015-07-29",
	        		"zip": "18214",
	        		"salary": 1,
	        		"country": "Palau",
	        		"city": "Portland",
	        		"company": "Tristique Pharetra Quisque Corp.",
	        		"type": 4
	        	},
	        	{
	        		"name": "Gisela",
	        		"phone": "203-196-7156",
	        		"email": "porttitor.tellus@Sed.org",
	        		"birthday": "2014-03-20",
	        		"zip": "587048",
	        		"salary": 1,
	        		"country": "Italy",
	        		"city": "Aberystwyth",
	        		"company": "Augue Eu Tempor Associates",
	        		"type": 6
	        	},
	        	{
	        		"name": "Nolan",
	        		"phone": "694-889-2611",
	        		"email": "Etiam.laoreet.libero@Aliquamadipiscing.ca",
	        		"birthday": "2014-07-10",
	        		"zip": "74-869",
	        		"salary": 1,
	        		"country": "Gambia",
	        		"city": "Coldstream",
	        		"company": "Ac Fermentum Vel PC",
	        		"type": 7
	        	}
	        ];
	
	var numberList = [{value: 1, text: 1},{value: 2, text: 2},{value: 3, text: 3}]
	var m = {
		gridObj : $('#dataGrid'),
		
		form    : {formObject : $('form[name=searchForm]')},
		
		button  : {
			add : $('#btnCnstAdd'), //투자심사승인번호 추가
			del : $('#btnDel'),     //행삭제
			save : $('#btnSave')    //저장
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
    		rowSingleSelect: false,
    		rowClickSelect: false,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
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
    					if (1 == data.salary) {
    						return true;
    					}
    					return false;
    				},
    				editable: {
						type: 'select',
						rule: numberList
					},
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