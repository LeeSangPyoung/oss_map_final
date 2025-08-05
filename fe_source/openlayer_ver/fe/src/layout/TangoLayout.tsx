import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '~/components/Header/Header';
import MenuSidebar from '~/components/MenuSidebar/MenuSidebar';
import SearchLonLat from '~/components/SearchLonLat/SearchLonLat';

export default function TangoLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="relative flex h-full">
        <MenuSidebar />
        <div className="absolute left-[100px] top-[60px] z-10">
          <SearchLonLat />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
