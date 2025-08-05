import React from 'react';
import SKT_image from '/images/SKT_Bundang_Building.jpg';
import { useFeatureInfoStore } from '~/store/useFeatureInfoStore';
import { Link } from 'react-router-dom';
import { env } from '~/env';

const map3dUrl = env.backend3dMapUrl;

const PlaceInfoPanel = () => {
  const { featureInfo } = useFeatureInfoStore();
  const { bflr, bldAddr, bldCd, bldNm } = featureInfo || {};
  const infoList = [
    { label: 'Address', value: bldAddr },
    { label: '건물층 수', value: `${bflr} 층` },
  ];

  if (!featureInfo) {
    return <div className="text-center">No selected feature</div>;
  }

  return (
    <div className="flex h-full flex-col bg-white shadow-lg">
      <div className="relative h-[300] w-full shrink-0">
        <img src={SKT_image} alt="Place Image" className="size-full object-cover" />
      </div>

      <div className="flex grow flex-col p-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{bldNm}</h2>
        </div>

        <div className="ga-2 mt-4 flex-col">
          {infoList?.map((info, index) => {
            const { label, value } = info;
            return (
              <div key={index} className="mt-2">
                <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
                <p className="text-gray-600">{value}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <button className="mt-8 rounded-md bg-blue-500 px-6 py-3 font-bold text-white shadow transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
            <Link to={`${map3dUrl}/${bldCd}`} target="_blank" rel="noopener noreferrer" className="inline-block ">
              Go to 3d Building
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceInfoPanel;
