import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import routers from './routes/routes';
import { useOptions } from '~/store/useOptions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n/i18n';
interface Props {
  mode: 'online' | 'offline';
  container?: string;
}

const queryClient = new QueryClient();
export default function App({ mode, container }: Props) {
  const { setOptions } = useOptions();
  useEffect(() => {
    setOptions({ mode });
  }, [mode]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routers} />
    </QueryClientProvider>
  );
}
