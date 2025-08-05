
GRANT USAGE ON SCHEMA tesdev TO tesapp;
GRANT SELECT ON ALL TABLES IN SCHEMA tesdev TO tesapp;
ALTER ROLE tesapp SET search_path = tesdev, public;


-- 💣 테이블 전체 삭제 (존재할 경우만)
DROP TABLE IF EXISTS
  tesdev.node_business_plan,
  tesdev.node_excavation_site,
  tesdev.node_green_belt,
  tesdev.node_public_toilet,
  tesdev.node_road_node,
  tesdev.node_roadside_trees,
  tesdev.link_safeway_home,
  tesdev.link_ds_way,
  tesdev.polygon_hump;


-- ✅ node_* 테이블 생성
CREATE TABLE tesdev.node_business_plan (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodeBusinessPlan'
);

CREATE TABLE tesdev.node_excavation_site (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodeExcavationSite'
);

CREATE TABLE tesdev.node_green_belt (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodeGreenBelt'
);

CREATE TABLE tesdev.node_public_toilet (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodePublicToilet'
);

CREATE TABLE tesdev.node_road_node (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodeRoadNode'
);

CREATE TABLE tesdev.node_roadside_trees (
  id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Point, 4326),
  type VARCHAR DEFAULT 'nodeRoadsideTrees'
);

-- ✅ link_* 테이블 생성
CREATE TABLE tesdev.link_safeway_home (
  link_id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(MultiLineString, 4326),
  type VARCHAR DEFAULT 'linkSafeWayHome'
);

CREATE TABLE tesdev.link_ds_way (
  link_id SERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(MultiLineString, 4326),
  type VARCHAR DEFAULT 'linkDsWay'
);

-- ✅ polygon_* 테이블 생성
CREATE TABLE tesdev.polygon_hump (
  polygon_id BIGSERIAL PRIMARY KEY,
  property VARCHAR,
  geom geometry(Polygon, 4326),
  type VARCHAR DEFAULT 'polygonHump'
);



-- ✅ node_feature → 분할 테이블
INSERT INTO tesdev.node_business_plan (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodeBusinessPlan';

INSERT INTO tesdev.node_excavation_site (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodeExcavationSite';

INSERT INTO tesdev.node_green_belt (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodeGreenBelt';

INSERT INTO tesdev.node_public_toilet (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodePublicToilet';

INSERT INTO tesdev.node_road_node (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodeRoadNode';

INSERT INTO tesdev.node_roadside_trees (property, geom)
SELECT property, geom FROM tesdev.node_feature WHERE type = 'nodeRoadsideTrees';

-- ✅ link_feature → 분할 테이블
INSERT INTO tesdev.link_safeway_home (property, geom)
SELECT property, 
       CASE 
         WHEN GeometryType(geom) = 'MULTILINESTRING' THEN geom
         WHEN GeometryType(geom) = 'LINESTRING' THEN ST_Multi(geom)
         ELSE NULL 
       END
FROM tesdev.link_feature
WHERE type = 'linkSafeWayHome';

INSERT INTO tesdev.link_ds_way (property, geom)
SELECT property, 
       CASE 
         WHEN GeometryType(geom) = 'MULTILINESTRING' THEN geom
         WHEN GeometryType(geom) = 'LINESTRING' THEN ST_Multi(geom)
         ELSE NULL 
       END
FROM tesdev.link_feature
WHERE type = 'linkDsWay';

-- ✅ polygon_feature → polygon_hump
INSERT INTO tesdev.polygon_hump (property, geom)
SELECT property, geom
FROM tesdev.polygon_feature
WHERE type = 'polygonHump';