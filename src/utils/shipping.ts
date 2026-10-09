import {BASE_SHIP_FEE, VARIANT} from '@constants/student';

export type Coordinate = {latitude: number; longitude: number};
// Moc cong KTX gia lap phuc vu demo, co the thay doi khi co toa do that.
export const KTX_GATE: Coordinate = {latitude: 10.8222, longitude: 106.6871};
const degToRad = (angle: number): number => (angle * Math.PI) / 180;
export function haversineKm(a: Coordinate, b: Coordinate): number {
  const dLat = degToRad(b.latitude - a.latitude);
  const dLon = degToRad(b.longitude - a.longitude);
  const lat1 = degToRad(a.latitude);
  const lat2 = degToRad(b.latitude);
  const term =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(term)));
}
export function shipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  }
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}
