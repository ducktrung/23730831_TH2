import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {STUDENT} from '@constants/student';
import type {Product} from '@services/productApi';
import {unitPrice} from '../utils/format';

export type CartLine = {id: number; title: string; price: number; image: string; qty: number};
type CartState = {
  items: CartLine[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  // Legacy aliases keep existing screens compatible if any file was customized.
  add: (product: Product) => void;
  remove: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: product => set(state => {
        const exists = state.items.find(row => row.id === product.id);
        if (exists) {
          return {items: state.items.map(row =>
            row.id === product.id ? {...row, qty: row.qty + 1} : row)};
        }
        return {items: [...state.items, {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1,
        }]};
      }),
      removeItem: id => set(state => ({items: state.items.filter(row => row.id !== id)})),
      add: product => get().addItem(product),
      remove: id => get().removeItem(id),
      changeQty: (id, delta) => set(state => ({
        items: state.items
          .map(row => row.id === id ? {...row, qty: row.qty + delta} : row)
          .filter(row => row.qty > 0),
      })),
      totalQuantity: () => get().items.reduce((sum, row) => sum + row.qty, 0),
      totalAmount: () => get().items.reduce(
        (sum, row) => sum + unitPrice(row.price) * row.qty, 0),
      clear: () => set({items: []}),
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({items: state.items}),
    },
  ),
);
