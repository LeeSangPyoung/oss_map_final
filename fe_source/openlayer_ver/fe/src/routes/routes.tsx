import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import Layout from '~/layout/Layout';
import { env } from '~/env';
import TangoMap from '~/pages/authentication/Tango/TangoMap';
import Login from '~/pages/un-authentication/Login/Login';
import AuthLayout from '~/layout/AuthLayout';
import TangoLayout from '~/layout/TangoLayout';
import MapboxMap from '~/pages/authentication/Mapbox/MapboxMap';
import OpenLayerMvt from '~/pages/OpenLayer/OpenLayerMvt';
import GuidePage from '~/pages/Guide/GuidePage';
import MainPage from '~/pages/Home/MainPage';
import GuidePageOrigin from '~/pages/Guide/GuidePageOrigin';
import OSSMAPPage from '~/pages/OSSMAP/OSSMAPPage';

const wrapRouter = env.envBuild === 'demo' ? createBrowserRouter : createMemoryRouter;
const routers = wrapRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/tango',
        element: <TangoLayout />,
        children: [
          {
            index: true,
            element: <TangoMap />,
          },
        ],
      },
      {
        path: '/tango-mapbox',
        element: <TangoLayout />,
        children: [
          {
            index: true,
            element: <MapboxMap />,
          },
        ],
      },
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      {
        path: 'guide',
        element: <GuidePage />,
      },
      {
        path: 'guide_origin',
        element: <GuidePageOrigin />,
      },
      {
        path: 'ossmap',
        element: <OSSMAPPage />,
      },
    ],
  },
]);

export default routers;
