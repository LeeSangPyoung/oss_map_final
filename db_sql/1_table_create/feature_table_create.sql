-- create_tesdev_schema.sql
CREATE SCHEMA IF NOT EXISTS tesdev AUTHORIZATION tesapp;

-- Drop table

DROP TABLE tesdev.node_feature;

CREATE TABLE tesdev.node_feature (
    node_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    "type" varchar NOT NULL,
    property varchar NULL,
    geom public.geometry NOT NULL,
    CONSTRAINT node_feature_pkey PRIMARY KEY (node_id)
);

DROP TABLE tesdev.link_feature;

CREATE TABLE tesdev.link_feature (
	link_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NOT NULL,
	property varchar NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT link_feature_pkey PRIMARY KEY (link_id)
)
;

DROP TABLE tesdev.line_feature;

CREATE TABLE tesdev.line_feature (
	line_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar(30) NOT NULL,
	property varchar(30) NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT line_feature_pkey PRIMARY KEY (line_id)
)
;

DROP TABLE tesdev.polygon_feature;

CREATE TABLE tesdev.polygon_feature (
	polygon_id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"type" varchar NOT NULL,
	property varchar NULL,
	geom public.geometry NOT NULL,
	CONSTRAINT polygon_feature_pkey PRIMARY KEY (polygon_id)
)
;



-- layer 생성

-- tesdev."style" definition

-- Drop table

DROP TABLE tesdev."style";

CREATE TABLE tesdev."style" (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	style_name varchar(30) NULL,
	paint text NULL,
	layout text NULL,
	style_type varchar(20) NULL,
	"options" text NULL,
	CONSTRAINT style_pkey PRIMARY KEY (id)
)
;


-- tesdev.user_layer definition

-- Drop table

DROP TABLE tesdev.user_layer;

CREATE TABLE tesdev.user_layer (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"label" varchar(30) NOT NULL,
	value varchar(30) NOT NULL,
	"type" varchar(30) NULL,
	"object" varchar(30) NULL,
	alias varchar(30) NULL,
	editable bool NULL,
	geom_column varchar(30) NULL,
	geometry_type varchar(30) NULL,
	key_columns text NULL,
	max_zoom int4 NULL,
	min_zoom int4 NULL,
	"name" varchar(30) NULL,
	selectable bool NULL,
	table_name varchar(30) NULL,
	visible bool NULL,
	style_id int8 NULL,
	CONSTRAINT user_layer_pkey PRIMARY KEY (id)
)
;


-- tesdev.user_layer_style definition

-- Drop table

DROP TABLE tesdev.user_layer_style;

CREATE TABLE tesdev.user_layer_style (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	layer_id int8 NOT NULL,
	custom_style_id int8 NOT NULL,
	CONSTRAINT user_layer_style_pkey PRIMARY KEY (id)
)
;



-- tesdev.custom_style definition

-- Drop table

DROP TABLE tesdev.custom_style;

CREATE TABLE tesdev.custom_style (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar(30) NOT NULL,
	"options" text NULL,
	"type" varchar(20) NULL,
	configs text NULL,
	CONSTRAINT custom_style_pkey PRIMARY KEY (id)
)
;

