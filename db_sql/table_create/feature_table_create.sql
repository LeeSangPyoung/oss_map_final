-- create_tesdev_schema.sql
CREATE SCHEMA IF NOT EXISTS tesdev AUTHORIZATION tesapp;

-- Drop table

-- DROP TABLE tesdev.node_feature;

CREATE TABLE tesdev.node_feature (
    node_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    "type" varchar NOT NULL,
    property varchar NULL,
    geom public.geometry NOT NULL,
    CONSTRAINT node_feature_pkey PRIMARY KEY (node_id)
);

-- DROP TABLE tesdev.link_feature;

CREATE TABLE tesdev.link_feature (
	link_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NOT NULL,
	property varchar NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT link_feature_pkey PRIMARY KEY (link_id)
)
;

-- DROP TABLE tesdev.line_feature;

CREATE TABLE tesdev.line_feature (
	line_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar(30) NOT NULL,
	property varchar(30) NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT line_feature_pkey PRIMARY KEY (line_id)
)
;

-- DROP TABLE tesdev.polygon_feature;

CREATE TABLE tesdev.polygon_feature (
	polygon_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NOT NULL,
	property varchar NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT polygon_feature_pkey PRIMARY KEY (polygon_id)
)
;
