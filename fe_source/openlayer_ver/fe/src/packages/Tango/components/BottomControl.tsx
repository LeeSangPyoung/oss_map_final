import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  layerName?: string;
  SK?: string;
  lat?: number | null;
  lng?: number | null;
}
function BottomControl({ layerName, SK, lat, lng }: Props) {
  const { t } = useTranslation();
  return (
    <div
      id="mouse-position"
      className="absolute bottom-[16px] left-[16px] flex flex-wrap items-center rounded bg-secondary text-xs text-white shadow-shadow-primary"
    >
      <span className="bg-primary p-2">{t('latitude')}</span>
      <span className="inline-block px-3">{lat?.toFixed(4)}</span>
      <span className="bg-primary p-2">{t('longtitude')}</span>
      <span className="inline-block px-3">{lng?.toFixed(4)}</span>
      <span className="bg-primary p-2">{t('layer')}</span>
      <span className="inline-block min-w-[50px] lg:min-w-[150px]">{layerName}</span>
      <span className="bg-primary p-2">{t('SK')}</span>
      <span className="inline-block min-w-[50px] lg:min-w-[150px]">{SK}</span>
    </div>
  );
}

export default memo(BottomControl);
