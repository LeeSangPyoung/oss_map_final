# OSS Map Installation Guide
본 문서는 **Rocky Linux WSL2 환경**에서 OSS Map 서비스를 설치하고 실행하는 과정을 정리한 가이드입니다.  

## 구성 요소
1. **ansible** : 오픈소스 설치 및 맵서비스 관련 설치 자동화  
2. **be_source/be** : 레이어 목록(기준) 및 스타일 조회를 위한 Spring Boot 기반 백엔드 (jar 파일)  
3. **db_sql** : PostgreSQL 레이어 샘플 데이터 (점/선/폴리곤) 테이블 생성 및 데이터 일괄 삽입 SQL  
4. **fe** : 맵 서비스(가이드/서비스) 화면 소스 파일  
5. **geoserver** : GeoServer 설정 정보 (sample → 커스터마이징 필요)

## 1. Rocky Linux WSL2 설치 (Windows)
```powershell
wsl --install
wsl --version
wsl --set-default-version 2

mkdir D:\rocky_wsl3
cd D:\rocky_wsl3
Invoke-WebRequest `
   -Uri "https://dl.rockylinux.org/pub/rocky/9/images/x86_64/Rocky-9-WSL-Base.latest.x86_64.wsl" `
   -OutFile "D:\rocky_wsl\Rocky-9-WSL-Base.latest.x86_64.wsl"
wsl --import Rocky9-1 D:\rocky_wsl3\1 D:\rocky_wsl3\Rocky-9-WSL-Base.latest.x86_64.wsl --version 2
wsl -d Rocky9-1
```
## 2. Rocky Linux 환경 준비 (Linux 내부)
```powershell
sudo dnf -y update
sudo dnf -y upgrade
sudo dnf -y install vim curl wget unzip git net-tools which tar
sudo dnf -y install openssh-server
sudo systemctl enable sshd
sudo systemctl start sshd
sudo dnf -y install epel-release
sudo dnf -y install ansible-core
ansible --version
sudo dnf -y install python3 python3-pip
pip3 install --upgrade pip
sudo dnf -y install java-17-openjdk java-17-openjdk-devel
java -version
javac -version
```
## 3. Ansible Playbook 실행 준비
```powershell
mkdir -p /workspace/yml
cd /workspace/yml
ansible-galaxy collection install community.postgresql
sudo tee ./hosts >/dev/null <<EOF
localhost ansible_connection=local
EOF
```
## 4. 서비스 설치 (Ansible Playbook 실행)
```powershell

yml 파일 다운로드 방법

/workspace/yml 등...특정폴더에서 진행할것
1. 저장소 초기화
mkdir -p /workspace/yml
cd /workspace/yml
git init oss_map_final
cd oss_map_final
git remote add origin https://github.com/LeeSangPyoung/oss_map_final.git

2. sparse-checkout 활성화
git config core.sparseCheckout true

3. 필요한 경로 지정
echo "ansible/ansible_install_yml/*" >> .git/info/sparse-checkout

4. 특정 브랜치(예: main)에서 가져오기
git pull origin main

5. yml 파일 실행 (하나씩 순차적으로..)
ansible-playbook -i hosts ./install_postgresql16.yml   --extra-vars '{"db_port":"5433","db_user":"tesapp","db_password":"experdb12#","db_name":"tesd"}'
ansible-playbook -i hosts ./create_db_data.yml   --extra-vars '{"db_host":"127.0.0.1","db_port":"5433","db_user":"tesapp","db_password":"experdb12#","db_name":"tesd"}'
ansible-playbook -i hosts ./install_geoserver.yml   --extra-vars '{"geoserver_version":"2.24.2","geoserver_user":"geoserver","geoserver_home":"/workspace/geo/geoserver","geoserver_port":"8089"}'
ansible-playbook -i hosts ./install_ossmap_fe.yml   --extra-vars '{"install_dir":"/workspace/ossmap_fe","geoserver_url":"http://localhost:8089","be_url":"http://localhost:8082","db_host":"127.0.0.1","db_port":"5433","db_name":"tesd","db_user":"tesapp","db_password":"experdb12#"}'

ansible-playbook -i hosts ./install_osm_map.yml   --extra-vars '{"map_kind":"osm","map_dir":"/workspace/ossmap","map_port":8090,"min_zoom":12,"max_zoom":15,"region":["서울특별시","부산광역시"]}'
- min_zoom : 디폴트 zoom을 설정하며, 클수록 다운용량 및 다운시간이 크게 증가한다. (5~17)
- max_zoom : 설정한 resion의 zoom을 설정하며, 지역이 많을 수록 zoom이 높을 수록 다운용량 및 다운시간이 크게 증가한다. (5~17)
- resion 목록 
	- 강원특별자치도
	- 경기도
	- 경상남도
	- 경상북도
	- 광주광역시
	- 대구광역시
	- 부산광역시
	- 서울특별시
	- 세종특별자치시
	- 울산광역시
	- 인천광역시
	- 전라남도
	- 전북특별자치도
	- 제주특별자치도
	- 충청남도
	- 충청북도

```
## 5. 레이어 목록 백엔드 서비스 실행
```powershell
java -jar /workspace/ossmap_fe/be/be-artifact-0.0.1-SNAPSHOT.jar > /workspace/ossmap_fe/be/be.log 2>&1 &
```
## 6. geoserver 점검
```powershell
localhost:8089/geoserver 접속
http://localhost:8089/geoserver/web/wicket/bookmarkable/org.geoserver.web.data.store.DataAccessEditPage?8&storeName=SKCC_REST_STORE&wsName=ne 이동하여,
Connection Parameters 점검 (port, password 등)
