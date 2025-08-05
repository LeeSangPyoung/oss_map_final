import { Coords } from '~/models/Coords';
import { env } from '../env';
function fillzero(value: number | string, length: number) {
  return value.toString().padStart(length, '0');
}
export function getTileUrl(coords: Coords) {
  const { x, y, z } = coords;

  // 타일 좌표 변환 (16진수로 변환)
  const tileX = 'C' + fillzero(Math.abs(x).toString(16), 8);
  const tileY = 'R' + fillzero(Math.abs(y).toString(16), 8);
  const zoomLevel = 'L' + fillzero(z - 1, 2); // 줌 레벨 변환
  return `https://${env.dawulHost}/dawulmap/${zoomLevel}/${tileY}/${tileX}.png`;
}
