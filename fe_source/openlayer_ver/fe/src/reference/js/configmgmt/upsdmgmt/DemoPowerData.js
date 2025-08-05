/*
 * 1. AlopexGrid Data : 
 * 2. 상세보기 Tag :
 */

//1. AlopexGrid Data

var dataTab1 = [
                {
                	'국사명' : 'S오산통합국',
                	'국사구분' : '통합국',
                	'층구분' : '1',
                	'계약전력_계약전력' : '125',
                	'계약전력_부하율' : '68',
                	'한전_MCCB용량' : '250',
                	'한전_부하율' : '53',
                	'MAIN_시스템명' : 'PM01-01',
                	'MAIN_MCCB용량' : '250',
                	'MAIN_부하율' : '53',
                	'MAIN_전압(RS)' : '390',
                	'MAIN_전압(ST)' : '389',
                	'MAIN_전압(TR)' : '387',
                	'MAIN_전류(R)' : '128',
                	'MAIN_전류(S)' : '132',
                	'MAIN_전류(T)' : '120',
                	'MAIN_전력' : '85.3',
                	'접속점온도' : '29',
                	'케이블온도' : '29',
                	'누설전류점검' : '0',
                	'SPD_설치여부' : '설치',
                	'SPD_전용차단기설치여부' : '설치',
                	'SPD_동작상태' : '양호',
                	'분1_시스템명' : 'PS01-01',
                	'분1_MCCB용량' : '150',
                	'분1_부하율' : '35',
                	'분1_전압(RS)' : '390',
                	'분1_전압(ST)' : '389',
                	'분1_전압(TR)' : '387',
                	'분1_전류(R)' : '49',
                	'분1_전류(S)' : '53',
                	'분1_전류(T)' : '44',
                	'분2_시스템명' : 'PS01-02',
                	'분2_MCCB용량' : '150',
                	'분2_부하율' : '17',
                	'분2_전압(RS)' : '390',
                	'분2_전압(ST)' : '389',
                	'분2_전압(TR)' : '387',
                	'분2_전류(R)' : '26',
                	'분2_전류(S)' : '26',
                	'분2_전류(T)' : '26',
                	'설치여부' : '설치',
                	'단설장_단자함설치층' : '1',
                	'단설장_상세설명' : '1층 계량기함',
                	'보안' : '양호',
                },
                {
                	'국사명' : 'S오산통합국',
                	'국사구분' : '통합국',
                	'층구분' : '2',
                	'분1_시스템명' : 'PS02-01',
                	'분1_MCCB용량' : '225',
                	'분1_부하율' : '20',
                	'분1_전압(RS)' : '390',
                	'분1_전압(ST)' : '389',
                	'분1_전압(TR)' : '387',
                	'분1_전류(R)' : '45',
                	'분1_전류(S)' : '45',
                	'분1_전류(T)' : '45'
                }
            
                ];

var dataTab2 = [
				{
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'시스템명':'RA01-01',
					'Eng기준구분':'DU집중국(3H)',
					'제조사':'동아일렉콤',
					'모델명':'CRS-',
					'대표부하명':'LTE DU',
					'제조년월':'2003-02-01',
					'시설용량':'2300',
					'입전_결선방식':'3상4선',
					'입전_전압':'380',
					'정모_용량':'100',
					'정모_수량':'23',
					'정모_입력전압':'220',
					'입전2_R':'44',
					'입전2_S':'51',
					'입전2_T':'51',
					'출전_출력전압':'27',
					'출전_출력전류':'1137',
					'부하율':'49.4',
					'소요산출':'18',
					'과부족':'5',
					'IPD용량양호':'O',
					'BR해제여부':'O',
					'RMS수용여부':'O',
					'축전지거리':'10',
					'케이블굵기':'1100',
					'전압강하':'0.5',
					'조수':'6',
					'총용량':'6000',
					'용량계수':'4.7',
					'소요용량':'5344',
					'과부족':'1089',
					'과부족조수':'1',
					'백업예상':'35'
				},
                {
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'RT02-01',
                	'Eng기준구분':'중심국(3H)',
                	'제조사':'동아일렉콤',
                	'모델명':'MR2',
                	'대표부하명':'전송장비',
                	'제조년월':'2004-08-01',
                	'시설용량':'350',
                	'입전_결선방식':'3상3선',
                	'입전_전압':'380',
                	'정모_용량':'50',
                	'정모_수량':'7',
                	'정모_입력전압':'220',
                	'입전2_R':'20',
                	'입전2_S':'20',
                	'입전2_T':'20',
                	'출전_출력전압':'53.5',
                	'출전_출력전류':'146',
                	'부하율':'41.7',
                	'소요산출':'6',
                	'과부족':'1',
                	'IPD용량양호':'O',
                	'BR해제여부':'-',
                	'RMS수용여부':'O',
                	'축전지거리':'10',
                	'케이블굵기':'555',
                	'전압강하':'0.1',
                	'조수':'3',
                	'총용량':'1800',
                	'용량계수':'4.87',
                	'소요용량':'711',
                	'과부족':'1279',
                	'과부족조수':'2',
                	'백업예상':'7.6'
                	
                },
                
                {
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'RT02-02',
                	'Eng기준구분':'중심국(3H)',
                	'제조사':'동아일렉콤',
                	'모델명':'MR1',
                	'대표부하명':'전송장비',
                	'제조년월':'2015-01-01',
                	'시설용량':'400',
                	'입전_결선방식':'3상3선',
                	'입전_전압':'380',
                	'정모_용량':'100',
                	'정모_수량':'4',
                	'정모_입력전압':'380',
                	'입전2_R':'13',
                	'입전2_S':'14',
                	'입전2_T':'13',
                	'출전_출력전압':'53.5',
                	'출전_출력전류':'148',
                	'부하율':'37',
                	'소요산출':'4',
                	'과부족':'0',
                	'IPD용량양호':'O',
                	'BR해제여부':'-',
                	'RMS수용여부':'O',
                	'축전지거리':'15',
                	'케이블굵기':'370',
                	'전압강하':'0.3',
                	'조수':'2',
                	'총용량':'2000',
                	'용량계수':'4.87',
                	'소요용량':'721',
                	'과부족':'2820',
                	'과부족조수':'1',
                	'백업예상':'6.3'
                	
                }
                
                
                
                ];

var dataTab3 = [
                {
                	//1
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-1조',
					'제조사':'성우',
					'모델명':'SLD-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2016-11-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.401',
					'최소':'0.315',
					'평균':'0.382',
					'불량':'0',
					'열화2':'0',
					'열화1':'2',
					'양호':'10',
					'1Cell':'0.317',
					'2Cell':'0.393',
					'3Cell':'0.401',
					'4Cell':'0.399',
					'5Cell':'0.394',
					'6Cell':'0.392',
					'7Cell':'0.401',
					'8Cell':'0.394',
					'9Cell':'0.393',
					'10Cell':'0.394',
					'11Cell':'0.387',
					'12Cell':'0.315',
					'시험일자':'2017-09-10',
					'심도전압':'23',
					'심도전압도달시간':'3',
					'10분후출력전압':'25',
					'10분후방전전류':'1227',
					'20분후출력전압':'25',
					'20분후방전전류':'1227',
					'30분후출력전압':'24',
					'30분후방전전류':'1279'
				},
				{
					//2
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-2조',
					'제조사':'성우',
					'모델명':'SLD-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2016-11-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.306',
					'최소':'0.211',
					'평균':'0.283',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'12',
					'1Cell':'0.221',
					'2Cell':'0.299',
					'3Cell':'0.306',
					'4Cell':'0.302',
					'5Cell':'0.299',
					'6Cell':'0.297',
					'7Cell':'0.411',
					'8Cell':'0.286',
					'9Cell':'0.291',
					'10Cell':'0.293',
					'11Cell':'0.29',
					'12Cell':'0.211',
				},
				{
					//3
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-3조',
					'제조사':'세방',
					'모델명':'ESG-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2015-11-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.544',
					'최소':'0.261',
					'평균':'0.415',
					'불량':'0',
					'열화2':'3',
					'열화1':'4',
					'양호':'5',
					'1Cell':'0.45',
					'2Cell':'0.535',
					'3Cell':'0.537',
					'4Cell':'0.544',
					'5Cell':'0.345',
					'6Cell':'0.337',
					'7Cell':'0.411',
					'8Cell':'0.334',
					'9Cell':'0.451',
					'10Cell':'0.44',
					'11Cell':'0.338',
					'12Cell':'0.261'
				},
				{
					//4
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-4조',
					'제조사':'세방',
					'모델명':'ESG-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2015-11-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.342',
					'최소':'0.230',
					'평균':'0.315',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'12',
					'1Cell':'0.244',
					'2Cell':'0.335',
					'3Cell':'0.327',
					'4Cell':'0.341',
					'5Cell':'0.342',
					'6Cell':'0.334',
					'7Cell':'0.325',
					'8Cell':'0.322',
					'9Cell':'0.33',
					'10Cell':'0.328',
					'11Cell':'0.325',
					'12Cell':'0.23'
				},
				{
					//5
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-5조',
					'제조사':'세방',
					'모델명':'ESG-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2016-08-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-06-07',
					'최대':'0.296',
					'최소':'0.221',
					'평균':'0.279',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'12',
					'1Cell':'0.222',
					'2Cell':'0.292',
					'3Cell':'0.291',
					'4Cell':'0.287',
					'5Cell':'0.29',
					'6Cell':'0.29',
					'7Cell':'0.296',
					'8Cell':'0.282',
					'9Cell':'0.285',
					'10Cell':'0.296',
					'11Cell':'0.29',
					'12Cell':'0.221'
				},
				{
					//6
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RA01-01',
					'정류기모델명':'CRS-2400',
					'조번호':'BA01-01-6조',
					'제조사':'세방',
					'모델명':'ESG-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'12',
					'제조일자':'2016-08-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-06-07',
					'최대':'0.294',
					'최소':'0.216',
					'평균':'0.279',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'12',
					'1Cell':'0.216',
					'2Cell':'0.294',
					'3Cell':'0.293',
					'4Cell':'0.289',
					'5Cell':'0.294',
					'6Cell':'0.294',
					'7Cell':'0.293',
					'8Cell':'0.288',
					'9Cell':'0.284',
					'10Cell':'0.292',
					'11Cell':'0.289',
					'12Cell':'0.22'
				},
				{
                	//7
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RT02-01',
					'정류기모델명':'MR2S',
					'조번호':'BT02-01-1조',
					'제조사':'성우',
					'모델명':'SLD-600',
					'용량':'600',
					'전압':'2',
					'Cell수':'24',
					'제조일자':'2012-03-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-08-18',
					'최대':'0.556',
					'최소':'0.260',
					'평균':'0.327',
					'불량':'1',
					'열화2':'2',
					'열화1':'3',
					'양호':'18',
					'1Cell':'0.377',
					'2Cell':'0.407',
					'3Cell':'0.301',
					'4Cell':'0.301',
					'5Cell':'0.308',
					'6Cell':'0.444',
					'7Cell':'0.299',
					'8Cell':'0.298',
					'9Cell':'0.402',
					'10Cell':'0.305',
					'11Cell':'0.309',
					'12Cell':'0.267',
					'13Cell':'0.260',
					'14Cell':'0.290',
					'15Cell':'0.391',
					'16Cell':'0.301',
					'17Cell':'0.284',
					'18Cell':'0.308',
					'19Cell':'0.301',
					'20Cell':'0.556',
					'21Cell':'0.292',
					'22Cell':'0.296',
					'23Cell':'0.290',
					'24Cell':'0.260',
					'시험일자':'2017-09-10',
					'심도전압':'50',
					'심도전압도달시간':'4',
					'10분후출력전압':'52',
					'10분후방전전류':'150',
					'20분후출력전압':'51',
					'20분후방전전류':'153',
					'30분후출력전압':'51',
					'30분후방전전류':'153'
				},
				{
                	//8
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RT02-01',
					'정류기모델명':'MR2S',
					'조번호':'BT02-01-2조',
					'제조사':'성우',
					'모델명':'SLD-600',
					'용량':'600',
					'전압':'2',
					'Cell수':'24',
					'제조일자':'2013-11-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.323',
					'최소':'0.249',
					'평균':'0.292',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'24',
					'1Cell':'0.254',
					'2Cell':'0.308',
					'3Cell':'0.309',
					'4Cell':'0.31',
					'5Cell':'0.305',
					'6Cell':'0.299',
					'7Cell':'0.294',
					'8Cell':'0.296',
					'9Cell':'0.323',
					'10Cell':'0.291',
					'11Cell':'0.288',
					'12Cell':'0.252',
					'13Cell':'0.252',
					'14Cell':'0.294',
					'15Cell':'0.298',
					'16Cell':'0.305',
					'17Cell':'0.302',
					'18Cell':'0.297',
					'19Cell':'0.299',
					'20Cell':'0.295',
					'21Cell':'0.302',
					'22Cell':'0.297',
					'23Cell':'0.295',
					'24Cell':'0.249'
				},
				{
                	//9
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RT02-01',
					'정류기모델명':'MR2S',
					'조번호':'BT02-01-3조',
					'제조사':'성우',
					'모델명':'SLD-600',
					'용량':'600',
					'전압':'2',
					'Cell수':'24',
					'제조일자':'2014-01-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.323',
					'최소':'0.254',
					'평균':'0.293',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'24',
					'1Cell':'0.254',
					'2Cell':'0.299',
					'3Cell':'0.298',
					'4Cell':'0.301',
					'5Cell':'0.324',
					'6Cell':'0.322',
					'7Cell':'0.297',
					'8Cell':'0.295',
					'9Cell':'0.297',
					'10Cell':'0.3',
					'11Cell':'0.286',
					'12Cell':'0.262',
					'13Cell':'0.256',
					'14Cell':'0.295',
					'15Cell':'0.297',
					'16Cell':'0.289',
					'17Cell':'0.296',
					'18Cell':'0.322',
					'19Cell':'0.291',
					'20Cell':'0.293',
					'21Cell':'0.292',
					'22Cell':'0.307',
					'23Cell':'0.295',
					'24Cell':'0.256'
				},
				{
                	//10
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RT02-02',
					'정류기모델명':'MR1',
					'조번호':'BT02-02-1조',
					'제조사':'성우',
					'모델명':'SLD-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'24',
					'제조일자':'2015-01-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.352',
					'최소':'0.241',
					'평균':'0.325',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'24',
					'1Cell':'0.3243',
					'2Cell':'0.326',
					'3Cell':'0.34',
					'4Cell':'0.335',
					'5Cell':'0.328',
					'6Cell':'0.347',
					'7Cell':'0.352',
					'8Cell':'0.327',
					'9Cell':'0.344',
					'10Cell':'0.346',
					'11Cell':'0.34',
					'12Cell':'0.264',
					'13Cell':'0.241',
					'14Cell':'0.340',
					'15Cell':'0.334',
					'16Cell':'0.344',
					'17Cell':'0.328',
					'18Cell':'0.335',
					'19Cell':'0.349',
					'20Cell':'0.344',
					'21Cell':'0.344',
					'22Cell':'0.350',
					'23Cell':'0.350',
					'24Cell':'0.254',
					'시험일자':'2017-09-10',
					'심도전압':'49',
					'심도전압도달시간':'2',
					'10분후출력전압':'52',
					'10분후방전전류':'152',
					'20분후출력전압':'51',
					'20분후방전전류':'155',
					'30분후출력전압':'50',
					'30분후방전전류':'158'
				},
				{
                	//11
                	
					'국사명':'S오산통합국',
					'국사구분':'통합국',
					'정류기명':'RT02-02',
					'정류기모델명':'MR1',
					'조번호':'BT02-02-2조',
					'제조사':'성우',
					'모델명':'SLD-',
					'용량':'1000',
					'전압':'2',
					'Cell수':'24',
					'제조일자':'2014-12-01',
					'케이블굵기':'185',
					'가닥수':'1',
					'굵기합계':'185',
					'표면온도':'25',
					'외관점검':'양호',
					'측저일자':'2017-07-17',
					'최대':'0.389',
					'최소':'0.253',
					'평균':'0.343',
					'불량':'0',
					'열화2':'0',
					'열화1':'0',
					'양호':'24',
					'1Cell':'0.281',
					'2Cell':'0.337',
					'3Cell':'0.349',
					'4Cell':'0.368',
					'5Cell':'0.336',
					'6Cell':'0.389',
					'7Cell':'0.36',
					'8Cell':'0.342',
					'9Cell':'0.368',
					'10Cell':'0.375',
					'11Cell':'0.35',
					'12Cell':'0.275',
					'13Cell':'0.253',
					'14Cell':'0.384',
					'15Cell':'0.383',
					'16Cell':'0.348',
					'17Cell':'0.369',
					'18Cell':'0.363',
					'19Cell':'0.339',
					'20Cell':'0.336',
					'21Cell':'0.381',
					'22Cell':'0.346',
					'23Cell':'0.338',
					'24Cell':'0.256'
				},
				
                ];


var dataTab4 = [
                {
                	//1
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'A01-01',
                	'용량':'5.0',
                	'제조사':'Airtech',
                	'제조일자':'2015-08',
                	'고온Solution':'고정형발전기',
                	'배풍기차단기위치':'-',
                	'RMS수용':'O',
                	'적정용량':'13',
                	'부족용량':'-3',
                },
                {
                	//2
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'A01-02',
                	'용량':'5.0',
                	'제조사':'Airtech',
                	'제조일자':'2015-08',
                	'고온Solution':'고정형발전기',
                	'배풍기차단기위치':'-',
                	'RMS수용':'O'
                },
                {
                	//3
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'A02-01',
                	'용량':'5.0',
                	'제조사':'Century',
                	'제조일자':'2005-07',
                	'고온Solution':'고정형발전기',
                	'배풍기차단기위치':'-',
                	'RMS수용':'O',
                	'적정용량':'6',
                	'부족용량':'9',
                },
                {
                	//4
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'A02-02',
                	'용량':'5.0',
                	'제조사':'Century',
                	'제조일자':'2005-11',
                	'고온Solution':'고정형발전기',
                	'배풍기차단기위치':'-',
                	'RMS수용':'O'
                },
                {
                	//5
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'A02-03',
                	'용량':'5.0',
                	'제조사':'Century',
                	'제조일자':'2014-10',
                	'고온Solution':'고정형발전기',
                	'배풍기차단기위치':'-',
                	'RMS수용':'O'
                }
                
                
                ];

var dataTab5 = [
                {
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'H01-01',
                	'용량':'50',
                	'대수':'2',
                	'제조사':'마스테코',
                	'제조일자':'2005-08',
                	'축전지제조년월':'2016-09',
                	'RMS연동':'O',
                	'동작상태':'양호'
                },
                {
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'H02-01',
                	'용량':'50',
                	'대수':'2',
                	'제조사':'동양미네르바',
                	'제조일자':'1996-02',
                	'축전지제조년월':'2016-09',
                	'RMS연동':'O',
                	'동작상태':'양호'
                }
                ];

var dataTab6 = [
                {
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'발전기설치유무':'설치',
                	'기부_제조사':'현대',
                	'기부_모델명':'-',
                	'기부_상용출력':'55',
                	'기부_비상출력':'-',
                	'기부_제조년월':'2002-12',
                	'엔진부_제조사':'Cummins',
                	'엔진부_모델명':'4BT3.9-G2',
                	'탱크_탱크용량':'400',
                	'탱크_보유량':'260',
                	'탱크_보유율':'65',
                	'축전지_제조사':'세방',
                	'축전지_모델명':'RP-200',
                	'축전지_제조년월':'2015-08',
                	'축전지_운용상태':'-',
                	'ATS_제조사':'-',
                	'ATS_모델명':'-',
                	'ATS_용량':'-',
                	'ATS_제조년월':'-',
                	'엔진오일점검':'양호',
                	'냉각수점검':'양호',
                	'예열히터상태':'양호',
                	'배관호스':'양호',
                	'제어반상태':'양호',
                	'시운전_시운전점검여부':'2017-09-23',
                	'시운전_부하무부하':'무부하',
                	'시운전_시운전결과':'양호',
                	'시운전_ATS절체시험':'-',
                }
                
                ];

var dataTab7 = [
                {
                	'건강도':'Green',
                	'국소명':'S오산통합국',
                	'국사구분':'통합국',
                	'CMS국소명':'S오산통합국',
                	'운용Cell수':'1098',
                	'수전_계약전력':'5',
                	'수전_Main차단기용량':'10',
                	'수전_차단기':'5',
                	'수전_SPD설치':'5',
                	'정류기_모듈적정수량':'5',
                	'정류기_IPD차단기용량':'5',
                	'정류기_BR해제':'5',
                	'축전지_축전지적정용량':'15',
                	'축전지_축전지상태':'5',
                	'축전지_축전지내부저항':'5',
                	'축전지_전압강하':'5',
                	'비상전원_발전기':'5',
                	'비상전원_이동용':'5',
                	'부대설비_냉방기':'5',
                	'부대설비_소화설비관리':'5',
                	'환경_환경감시장치':'5',
                	'환경_보안':'5',
                	'점수_만점':'100',
                	'점수_취득':'100'                	
                }
                
                
                ];

var dataTab8 = [
                {
                	
                	// 1 
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'년':'2017',
                	'월':'9',
                	'일':'25',
                	'발생시간':'0:00',
                	'복구시간':'3:00',
                	'이장시간':'3',
                	'서비스중단':'무',
                	'서비스중단시간':'-',
                	'발전차출발시간':'0:05',
                	'발전차도착시간':'1:05',
                	'장애시설내역':'-',
                	'고장유형1':'한전정전',
                	'고장유형2':'한전변압기불량',
                	'발생원인':'한전 변압기 소손',
                	'조치내역':'한전 변압기 교체',
                	'시스템명':'RA01-01',
                	'정류기제조사':'동아일렉콤',
                	'정류기모델':'CRS-2400',
                	'축전지용량':'6000',
                	'예상백업시간':'3.4',
                	'실제백업시간':'1'
                	
                },
                {
                	
                	// 2 
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'RT02-01',
                	'정류기제조사':'동아일렉콤',
                	'정류기모델':'MR2',
                	'축전지용량':'1800',
                	'예상백업시간':'7.6',
                	'실제백업시간':'1'
                	
                },
                {
                	
                	// 3 
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'시스템명':'RT02-02',
                	'정류기제조사':'동아일렉콤',
                	'정류기모델':'MR1',
                	'축전지용량':'2000',
                	'예상백업시간':'6.3',
                	'실제백업시간':'1'
                	
                }
                
                
                
                
                ];

var dataTab9 = [
                {
                	// 1
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국',
                	'년':'2017',
                	'월':'9',
                	'일':'25',
                	'고장구분':'냉방기',
                	'시스템명':'A01-01',
                	'세부구분':'Comp 알람',
                	'업체':'일신',
                	'수리내역':'Comp 교체',
                	'교체부품':'Compressure',
                	'제조사':'-',
                	'제조일':'2017-09',
                },
                {
                	// 2
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국'
                },
                {
                	// 3
                	
                	'국사명':'S오산통합국',
                	'국사구분':'통합국'
                }
                
                
                ];



//2. DetailedCondition Tag

var tagToTab1 = '<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">수전방식</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>한전수전</option>'
				+'<option>건물전기</option>'								
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'


+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">인입차단기</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>50 / 60</option>'
			+'<option>75 / 100</option>'
			+'<option>125 / 150</option>'
			+'<option>225 / 250</option>'
			+'<option>300 / 350</option>'
			+'<option>400 / 500</option>'
			+'<option>600 / 630</option>'
			+'<option>800 / 1000</option>'
			+'<option>1200 / 1250</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">TVSS설치</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>설치</option>'
			+'<option>미설치</option>'
			
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'


+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">TVSS 양호</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>양호</option>'
			+'<option>불량</option>'
			
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">사용전력</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>0~50</option>'
			+'<option>50~100</option>'
			+'<option>100~150</option>'
			+'<option>150~200</option>'
			+'<option>200~250</option>'
			+'<option>250~300</option>'
			+'<option>300 이상</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'


+'</div>'

+'<div class="more_condition" style="display:none;">'

+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">계약전력</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'
		+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>0~50</option>'
			+'<option>50~100</option>'
			+'<option>100~150</option>'
			+'<option>150~200</option>'
			+'<option>200~250</option>'
			+'<option>250~300</option>'
			+'<option>300 이상</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'


+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">메인차단기</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'	
			+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>50 / 60</option>'
			+'<option>75 / 100</option>'
			+'<option>125 / 150</option>'
			+'<option>225 / 250</option>'
			+'<option>300 / 350</option>'
			+'<option>400 / 500</option>'
			+'<option>600 / 630</option>'
			+'<option>800 / 1000</option>'
			+'<option>1200 / 1250</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">TVSS차단기설치</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'
		+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>설치</option>'
			+'<option>미설치</option>'
		+'</select>'
		+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">계약전력초과</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'
		+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>양호</option>'
			+'<option>초과</option>'
		+'</select>'
		+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'<div class="condition ty2" style="width:20%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">이동발전단자함</span>'
		+'<div class="Divselect divselect" style="width:120px !important;">'
		+'<select>'
			+'<option>= 선택 =</option>'
			+'<option>설치</option>'
			+'<option>미설치</option>'
		+'</select>'
		+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'</div>'

+'</div>';
	
	
var tagToTab2 = 

	'<div class="more_condition" style="display:none;">'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">제조사별</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>동아</option>'
					+'<option>이화</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">모델별</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>CS-1200</option>'
					+'<option>CRS-1800</option>'
					+'<option>CRS-2400</option>'
					+'<option>MR1</option>'
					+'<option>MR2</option>'
					+'<option>MR2S</option>'
					+'<option>MBRS-1200</option>'
					+'<option>MR-200</option>'
					+'<option>MCSU-1200</option>'
					+'<option>BISCSU-1200</option>'
					+'<option>HFCR</option>'
					+'<option>SR</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">모듈과부족</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>부족</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">백업시간</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>0.5H 부족</option>'
					+'<option>1H 부족</option>'
					+'<option>1.5H 부족</option>'		
					+'<option>2H 부족</option>'					
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">BR해제</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>완료</option>'
					+'<option>미완료</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">전압강하초과</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>0.5V 초과</option>'	
					+'<option>1V 초과</option>'
					+'<option>1.5V 초과</option>'							
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'


	+'</div>'


	+'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">전압별</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>24V</option>'
					+'<option>48V</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">Eng별</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>기지국</option>'
					+'<option>3G집중국</option>'	
					+'<option>DU집중국</option>'
					+'<option>중심국</option>'							
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">축전지과부족</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>부족</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">RMS수용</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>수용</option>'
					+'<option>미수용</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'

	+'<div class="condition ty2" style="width:16%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:110px;">IPD용량</span>'
			+'<div class="Divselect divselect" style="width:100px !important;">'	
			
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>부족</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'


	+'</div>';
			
var tagToTab3 =
	
'<div class="more_condition" style="display:none;">'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">모델별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>4TM</option>'
				+'<option>ES</option>'
				+'<option>ESS</option>'
				+'<option>ESH</option>'
				+'<option>ESG</option>'
				+'<option>GFM</option>'
				+'<option>SLD</option>'
				+'<option>SMG</option>'
				+'<option>VGS</option>'
				+'<option>LiPo</option>'		
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">년도별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>2004</option>'
				+'<option>2005</option>'
				+'<option>2006</option>'
				+'<option>2007</option>'
				+'<option>2008</option>'
				+'<option>2009</option>'
				+'<option>2010</option>'
				+'<option>2011</option>'
				+'<option>2012</option>'
				+'<option>2013</option>'
				+'<option>2014</option>'
				+'<option>2015</option>'
				+'<option>2016</option>'
				+'<option>2017</option>'							
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">축전지 불량별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>양호</option>'
				+'<option>열화1</option>'	
				+'<option>열화2</option>'
				+'<option>불량</option>'								
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'</div>'

+'<div class="more_condition" style="display:none;">'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">제조사별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>세방</option>'
				+'<option>성우</option>'
				+'<option>ENERSYS</option>'
				+'<option>FIAAM</option>'
				+'<option>SHOTO</option>'
				+'<option>SKME</option>'
				+'<option>신고베</option>'		
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">용량별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>150</option>'
				+'<option>200</option>'
				+'<option>220</option>'
				+'<option>300</option>'
				+'<option>600</option>'
				+'<option>800</option>'
				+'<option>1000</option>'
				+'<option>1200</option>'
				+'<option>1500</option>'
				+'<option>1600</option>'
				+'<option>1800</option>'
				+'<option>2000</option>'
				+'<option>2200</option>'
				+'<option>2400</option>'
				+'<option>3000</option>'			
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:30%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">방전시험 불량별</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>양호</option>'
				+'<option>불량</option>'								
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'</div>';
var tagToTab4 = 
	'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">제조사별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>A&H Tech</option>'
					+'<option>AAF</option>'
					+'<option>LG공조</option>'
					+'<option>Century</option>'
					+'<option>SAGE+</option>'
					+'<option>Airtech</option>'
					+'<option>범양</option>'
					+'<option>창조21</option>'
					+'<option>Solid</option>'
					+'<option>기타</option>'		
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">용량별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>3</option>'
					+'<option>5</option>'
					+'<option>5.5</option>'
					+'<option>7.5</option>'
					+'<option>10</option>'
					+'<option>15</option>'
					+'<option>20</option>'		
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">적정용량</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>부족</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
+'</div>' 

 
+'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">년도별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>1998</option>'
					+'<option>1999</option>'
					+'<option>2000</option>'
					+'<option>2001</option>'
					+'<option>2002</option>'
					+'<option>2003</option>'
					+'<option>2004</option>'
					+'<option>2005</option>'
					+'<option>2006</option>'
					+'<option>2007</option>'
					+'<option>2008</option>'
					+'<option>2009</option>'
					+'<option>2010</option>'
					+'<option>2011</option>'
					+'<option>2012</option>'
					+'<option>2013</option>'
					+'<option>2014</option>'
					+'<option>2015</option>'
					+'<option>2016</option>'
					+'<option>2017</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">고온 Solution</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>강제배기 Sys</option>'
					+'<option>고정형 배풍기</option>'
					+'<option>이동형 배풍기</option>'
					+'<option>인버터 냉방기</option>'
					+'<option>고정형 발전기</option>'			
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:30%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">RMS수용</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>수용</option>'
					+'<option>미수용</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	
+'</div>';
var tagToTab5 = 
	'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">제조사별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>동방미네르바</option>'
					+'<option>동신</option>'
					+'<option>마스테코</option>'
					+'<option>세진</option>'
					+'<option>필코리아</option>'
					+'<option>한국하론</option>'
					+'<option>기타</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">용량별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>40/80</option>'
					+'<option>50/100</option>'
					+'<option>60/120</option>'
					+'<option>70/140</option>'
					+'<option>75/150</option>'
					+'<option>100/200</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">년도별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>1994</option>'
					+'<option>1995</option>'
					+'<option>1996</option>'
					+'<option>1997</option>'
					+'<option>1998</option>'
					+'<option>1999</option>'
					+'<option>2000</option>'	
					+'<option>2001</option>'
					+'<option>2002</option>'
					+'<option>2003</option>'
					+'<option>2004</option>'
					+'<option>2005</option>'
					+'<option>2006</option>'
					+'<option>2007</option>'
					+'<option>2008</option>'
					+'<option>2009</option>'
					+'<option>2010</option>'
					+'<option>2011</option>'
					+'<option>2012</option>'
					+'<option>2013</option>'
					+'<option>2014</option>'
					+'<option>2015</option>'
					+'<option>2016</option>'
					+'<option>2017</option>'						
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">동작상태</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>불량</option>'								
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
+'</div>';
var tagToTab6 = 
	'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">제조사별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>보국</option>'
					+'<option>대흥</option>'
					+'<option>동영</option>'
					+'<option>두산</option>'
					+'<option>쌍용</option>'
					+'<option>성지</option>'
					+'<option>현대</option>'
					+'<option>CATERPILLAR</option>'
					+'<option>CUMMINS</option>'
					+'<option>MARATHON</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">축전지 년도별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>2014</option>'
					+'<option>2015</option>'
					+'<option>2016</option>'
					+'<option>2017</option>'
					
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">발전기 상태</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>불량</option>'			
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">축전지 불량별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>불량</option>'
											
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
+'</div>' 

+'<div class="more_condition" style="display:none;">'
+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">용량별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>18</option>'
					+'<option>55</option>'
					+'<option>60</option>'
					+'<option>120</option>'
					+'<option>150</option>'
					+'<option>155</option>'
					+'<option>180</option>'
					+'<option>200</option>'
					+'<option>225</option>'
					+'<option>250</option>'
					+'<option>300</option>'
					+'<option>350</option>'
					+'<option>400</option>'
					+'<option>450</option>'
					+'<option>500</option>'
					+'<option>550</option>'
					+'<option>600</option>'
					+'<option>750</option>'
					+'<option>900</option>'
					+'<option>1000</option>'
					+'<option>1100+</option>'
					+'<option>1200</option>'
					+'<option>1250</option>'
					+'<option>1600</option>'
					+'<option>1750</option>'
					+'<option>2800</option>'
					+'<option>3600</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">발전기 년도별</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>1998</option>'
					+'<option>1999</option>'
					+'<option>2000</option>'
					+'<option>2001</option>'
					+'<option>2002</option>'
					+'<option>2003</option>'
					+'<option>2004</option>'
					+'<option>2005</option>'
					+'<option>2006</option>'
					+'<option>2007</option>'
					+'<option>2008</option>'
					+'<option>2009</option>'
					+'<option>2010</option>'
					+'<option>2011</option>'
					+'<option>2012</option>'
					+'<option>2013</option>'
					+'<option>2014</option>'
					+'<option>2015</option>'
					+'<option>2016</option>'
					+'<option>2017</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:25%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">시운전 상태</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>불량</option>'	
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'</div>' 
+'</div>';
var tagToTab7 = ' ';
var tagToTab8 = 
	'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:33%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">고장일자</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>2017~</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:33%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">고장세부유형</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>한전예고작업</option>'
					+'<option>한전미통보작업</option>'
					+'<option>한전변압기불량</option>'
					+'<option>한전Fuse불량</option>'
					+'<option>한전케이블단선</option>'
					+'<option>한전주도괴</option>'
					+'<option>건물예고작업</option>'
					+'<option>건물미통보작업</option>'
					+'<option>건물변압기불량</option>'
					+'<option>건물차단기불량</option>'
					+'<option>건물차단기용량부족</option>'
					+'<option>건물케이블불량</option>'
					+'<option>누전</option>'
					+'<option>용량부족</option>'
					+'<option>작업부주의</option>'
					+'<option>차단기불량</option>'
					+'<option>케이블불량</option>'
					+'<option>모듈불량</option>'
					+'<option>제어반불량</option>'
					+'<option>낙뢰</option>'
					+'<option>폭우</option>'
					+'<option>폭설</option>'
					+'<option>지진</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:33%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">장비Down여부</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>양호</option>'
					+'<option>불량</option>'			
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	
+'</div>' 

 
+'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:33%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">고장유형</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>한전정전</option>'
					+'<option>건물정전</option>'
					+'<option>차단기Trip</option>'
					+'<option>정류기불량</option>'
					+'<option>자연재해</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
	+'<div class="condition ty2" style="width:33%;">'
		+'<label for="">'
			+'<span class="Label label" style="width:130px;">고장시간</span>'
			+'<div class="Divselect divselect" style="width:150px !important;">'	
				+'<select>'
					+'<option>= 선택 =</option>'
					+'<option>10분 이내</option>'
					+'<option>30분 이내</option>'
					+'<option>1시간 이내</option>'
					+'<option>1시간30분 이내</option>'
					+'<option>2시간 이내</option>'
					+'<option>2시간 초과</option>'
				+'</select>'
				+'<span></span>'
			+'</div>'
		+'</label>'
	+'</div>'
+'</div>';
var tagToTab9 = 
	'<div class="more_condition" style="display:none;">'
	+'<div class="condition ty2" style="width:33%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">고장일자</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>2017~</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:33%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">고장구분</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>수배전</option>'
				+'<option>정류기</option>'
				+'<option>축전지</option>'
				+'<option>냉방기</option>'
				+'<option>소화설비</option>'
				+'<option>감시장치</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'
+'<div class="condition ty2" style="width:33%;">'
	+'<label for="">'
		+'<span class="Label label" style="width:130px;">교체 부품</span>'
		+'<div class="Divselect divselect" style="width:150px !important;">'	
			+'<select>'
				+'<option>= 선택 =</option>'
				+'<option>정리필요</option>'
			+'</select>'
			+'<span></span>'
		+'</div>'
	+'</label>'
+'</div>'

+'</div>';
	






/////////////////////////////////////////////////////////////////////////////////////////////////////////
var initTag = 
	'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell" style="border:none; margin-left:100px;"></div>'
		+'<div class="alignedCell grey" href="#">가능여부</div>'	
		+'<div class="alignedCell grey">증설 후 현황</div>'
	+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">계약전력</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select1">70[%]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">인입차단기</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select2">51[%]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">메인차단기</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select3">51[%]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">분기차단기</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select4">33[%]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">정류기차단기</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select5">40[%]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">정류기 모듈</div>'
		+'<div class="alignedCell empty">NOK</div>'	
		+'<div class="alignedCell empty" id="modal2Select6">2[EA]</div>'
		+'</div>'
	
	+'<div style="height:45px; margin-top:30px;">'
		+'<div class="alignedCell grey" style="margin-left:100px;">백업 시간</div>'
		+'<div class="alignedCell empty">OK</div>'	
		+'<div class="alignedCell empty" id="modal2Select7">4.97[H]</div>'
		+'</div>'
	
		+'</br>'
		+'<hr width="90%" color="#dbdbdb" noshade/>';
	



var resultTag = 
'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell" style="border:none; margin-left:100px;"></div>'
+'<div class="alignedCell grey" href="#">가능여부</div>'	
+'<div class="alignedCell grey">증설 후 현황</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">계약전력</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select1">70[%]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">인입차단기</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select2">51[%]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">메인차단기</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select3">51[%]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">분기차단기</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select4">33[%]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">정류기차단기</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select5">40[%]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">정류기 모듈</div>'
+'<div class="alignedCell red">NOK</div>'	
+'<div class="alignedCell red" id="modal2Select6">2[EA]</div>'
+'</div>'

+'<div style="height:45px; margin-top:30px;">'
+'<div class="alignedCell grey" style="margin-left:100px;">백업 시간</div>'
+'<div class="alignedCell green">OK</div>'	
+'<div class="alignedCell green" id="modal2Select7">4.97[H]</div>'
+'</div>'
+'</br>'
+'<hr width="90%" color="#dbdbdb" noshade/>';

