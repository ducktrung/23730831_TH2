import {PRICE_MULTIPLIER} from '@constants/student';

export const unitPrice = (price: number): number =>
  Math.round(price * PRICE_MULTIPLIER);

export const money = (amount: number): string =>
  `${Math.round(amount).toLocaleString('vi-VN')} đ`;
