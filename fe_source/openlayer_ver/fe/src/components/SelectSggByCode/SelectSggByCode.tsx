import { Select } from 'antd';
import React, { memo, useEffect, useMemo } from 'react';
import { useGetSggByCode } from '~/packages/Home/services/useGetSggByCode';
import { useMapbase } from '~/store/useMapbase';

interface Props {
  sidoId: string;
}
function SelectSggByCode({ sidoId }: Props) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const { data, isLoading } = useGetSggByCode(sidoId);
  const { panTo } = useMapbase();
  const options = useMemo(() => {
    return data?.data.map(item => ({
      ...item,
      label: item.sggName,
      value: item.sggCode,
    }));
  }, [data]);

  useEffect(() => {
    if (!!data) {
      setValue(data.data[0].sggCode); // Set default value to first item in options array when data is loaded
      const findItem = data?.data.find(item => item.sggCode === data.data[0].sggCode);
      if (findItem) {
        panTo([findItem.coordX, findItem.coordY]);
      }
    }
  }, [data]);
  const handleChangeValue = (val: string) => {
    setValue(val);
    const findItem = data?.data.find(item => item.sggCode === val);
    if (findItem) {
      panTo([findItem.coordX, findItem.coordY]);
    }
    // onValueChange?.(val);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <Select
        options={options}
        loading={isLoading}
        placeholder="시도 선택"
        className="w-[300px]"
        value={value}
        allowClear={true}
        onChange={handleChangeValue}
        disabled={!data}
      />
    </div>
  );
}

export default memo(SelectSggByCode);
