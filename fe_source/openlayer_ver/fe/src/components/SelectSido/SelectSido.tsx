import { Select } from 'antd';
import React, { memo, useMemo } from 'react';
import { useGetSidoByCode } from '~/packages/Home/services/useGetSidoByCode';

interface Props {
  onSelectSido?: (value: string | undefined) => void;
}
function SelectSido({ onSelectSido }: Props) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const { data, isLoading } = useGetSidoByCode();
  const options = useMemo(() => {
    return data?.data.map(item => ({
      ...item,
      label: item.sidoName,
      value: item.sidoCode,
    }));
  }, [data]);
  const handleChangeValue = (val: string) => {
    setValue(val);
    onSelectSido?.(val);
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
      />
    </div>
  );
}

export default memo(SelectSido);
