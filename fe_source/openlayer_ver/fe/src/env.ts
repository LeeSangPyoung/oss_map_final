/// <reference types="vite/client" />
export const env = {
  mapboxToken: import.meta.env.VITE_APP_MAPBOX_TOKEN,
  backendUrl: import.meta.env.VITE_APP_BACKEND,
  geoServer: import.meta.env.VITE_APP_LAYER_SERVER,
  dawulHost: import.meta.env.VITE_DAWUL_HOST,
  envBuild: import.meta.env.VITE_ENV,
  backend3dMapUrl: import.meta.env.VITE_APP_3D_MAP_URL,
};
