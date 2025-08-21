1. be_source/be : 레이어 목록(기준)을 조회 및 스타일 정보를 조회하는 spring-boot jar 파일
2. db_sql : postgresql의 레이어 샘플 정보(점/선/폴리곤) 테이블을 생성 및 데이터 일괄 생성하는 sql 쿼리 정보
3. fe : 맵 서비스 (가이드/서비스)에 대한 화면 서비스 소스 파일
4. geoserver : geoserver의 conf 정보(sample 이므로 커스터마이징 필수)




(windows)
mkdir D:\rocky_wsl2
cd D:\rocky_wsl2

Invoke-WebRequest `
   -Uri "https://dl.rockylinux.org/pub/rocky/9/images/x86_64/Rocky-9-WSL-Base.latest.x86_64.wsl" `
   -OutFile "D:\rocky_wsl\Rocky-9-WSL-Base.latest.x86_64.wsl"

wsl --import Rocky9-1 D:\rocky_wsl\1 D:\rocky_wsl\Rocky-9-WSL-Base.latest.x86_64.wsl --version 2


wsl -d Rocky9-1


(Linux)
# 최신화
sudo dnf -y update
sudo dnf -y upgrade

# 필수 툴
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


(yml 설치 대상 폴더)
mkdir -p /workspace/yml
cd /workspace/yml
(해당 폴더에 yml 파일 받기)

(postgresql 사전 필요 lib 설치)
ansible-galaxy collection install community.postgresql

(hosts 설정 : 일단 로컬)
sudo tee ./hosts >/dev/null <<EOF
localhost ansible_connection=local
EOF

ansible-playbook -i hosts ./install_postgresql16.yml   --extra-vars '{"db_port":"5433","db_user":"tesapp","db_password":"experdb12#","db_name":"tesd"}'
ansible-playbook -i hosts ./create_db_data.yml   --extra-vars '{"db_host":"127.0.0.1", "db_port":"5433","db_user":"tesapp","db_password":"experdb12#","db_name":"tesd"}'
ansible-playbook -i hosts ./install_geoserver.yml   --extra-vars '{"geoserver_version":"2.24.2","geoserver_user":"geoserver","geoserver_home":"/workspace/geo/geoserver", "geoserver_port" : "8089"}'
ansible-playbook -i hosts ./install_ossmap_fe.yml   --extra-vars '{ "install_dir": "/workspace/ossmap_fe", "geoserver_url": "http://localhost:8089", "be_url": "http://localhost:8082", "db_host": "127.0.0.1",  "db_port": "5433","db_name": "tesd", "db_user": "tesapp", "db_password": "experdb12#"}'
ansible-playbook -i hosts ./install_osm_map.yml   --extra-vars '{  "map_kind": "osm",  "map_dir": "/workspace/ossmap",  "map_port": 8090,  "min_zoom": 12,  "max_zoom": 15,  "region": ["서울특별시","부산광역시"]}'

[레이어 목록 백엔드 조회 프로세스 가동]
java -jar /workspace/ossmap_fe/be/be-artifact-0.0.1-SNAPSHOT.jar > /workspace/ossmap_fe/be/be.log 2>&1 &
