import { Input, message } from 'antd';
import React, { useState } from 'react';
import { useSearchAddress } from '~/assets/OpenLayer/services/useSearchAddress';
import { useMapbase } from '~/store/useMapbase';

export default function SearchAddress() {
  const [messageApi, contextHolder] = message.useMessage();
  const { panTo } = useMapbase();
  const [valueSearch, setValueSearch] = useState('');

  const { mutateAsync } = useSearchAddress();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await mutateAsync(valueSearch);
      if (!!response) {
        const lat = parseFloat(response.lat);
        const lon = parseFloat(response.lon);
        panTo([lon, lat]);
      }
    } catch (err) {
      console.log(err);
      messageApi.error('Failed to search address');
    }
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="self-end">
      <Input
        placeholder="Search address"
        className="h-[42px] w-[300px]"
        value={valueSearch}
        onChange={handleChangeValue}
      />
      {contextHolder}
    </form>
  );
}
