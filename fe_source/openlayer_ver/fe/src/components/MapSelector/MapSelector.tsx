import React, { useState } from 'react';
import { env } from '~/env';

interface MapSelectorProps {
  onMapChange: (mapType: string, tileUrl: string) => void;
  currentMapType: string;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ onMapChange, currentMapType }) => {
  const [isOpen, setIsOpen] = useState(false);

  // OSM 로드밸런싱을 위한 서버 목록
  const osmServers = [
    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  ];

  // 랜덤하게 OSM 서버 선택 (로드밸런싱)
  const getRandomOsmUrl = () => {
    const randomIndex = Math.floor(Math.random() * osmServers.length);
    return osmServers[randomIndex];
  };

  const mapOptions = [
    {
      id: 'osm',
      name: 'OpenStreetMap',
      description: 'OpenStreetMap (로드밸런싱)',
      url: getRandomOsmUrl()
    },
    {
      id: 'custom',
      name: 'Custom Tile',
      description: '커스텀 타일 서버',
      url: env.customTileUrl || ''
    }
  ];

  const currentMap = mapOptions.find(option => option.id === currentMapType) || mapOptions[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{currentMap.name}</span>
        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {mapOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onMapChange(option.id, option.url);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  currentMapType === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 