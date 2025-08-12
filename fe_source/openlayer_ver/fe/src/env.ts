/// <reference types="vite/client" />
export const env = {
  mapboxToken: import.meta.env.VITE_APP_MAPBOX_TOKEN,
  backendUrl: import.meta.env.VITE_APP_BACKEND,
  geoServer: import.meta.env.VITE_APP_LAYER_SERVER,
  dawulHost: import.meta.env.VITE_DAWUL_HOST,
  envBuild: import.meta.env.VITE_ENV,
  backend3dMapUrl: import.meta.env.VITE_APP_3D_MAP_URL,
  // Map Tile URLs
  osmTileUrl: import.meta.env.VITE_OSM_TILE_URL,
  customTileUrl: 'http://127.0.0.1:8090/tiles/korea/{z}/{x}/{y}.png',
};
