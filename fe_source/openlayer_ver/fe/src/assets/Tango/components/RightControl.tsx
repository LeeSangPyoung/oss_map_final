import { Popover } from 'antd';
import React from 'react';
import distancePng from '/images/efdg/measure_distance.png';
import areaPng from '/images/efdg/measure_area.png';
import printPng from '/images/efdg/print.png';
import downloadPng from '/images/efdg/download.png';
import indexMap from '/images/efdg/indexmap.png';
import { useBoolean } from 'usehooks-ts';

interface Props {}
export default function RightControl({}: Props) {
  const { value, toggle, setValue } = useBoolean();
  return (
    <div className="absolute right-[8px] top-[45%] -translate-y-1/2">
      <div className="flex flex-col gap-y-2">
        <Popover
          trigger={'hover'}
          open={value}
          placement="left"
          overlayInnerStyle={{
            padding: 0,
            boxShadow: 'none',
            height: '26px',
            borderRight: '1px solid #f1f1f1',
          }}
          onOpenChange={setValue}
          style={{
            border: '1px solid green',
          }}
          arrow={false}
          content={
            <button className="relative size-[26px] rounded bg-white" onClick={toggle}>
              <img src={areaPng} className="size-full rounded object-cover" />
            </button>
          }
        >
          <button className="size-[26px] rounded bg-white">
            <img src={distancePng} className="size-full rounded object-cover" />
          </button>
        </Popover>
        <div className="flex flex-col divide-y divide-gray-400">
          <button className="size-[26px]  bg-white">
            <img src={printPng} className="size-full  object-cover" />
          </button>
          <button className="size-[26px]  bg-white">
            <img src={downloadPng} className="size-full  object-cover" />
          </button>
          <button className="size-[26px]  bg-white">
            <img src={indexMap} className="size-full  object-cover" />
          </button>
        </div>
      </div>
    </div>
  );
}
