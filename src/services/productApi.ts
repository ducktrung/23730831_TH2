import {useQuery} from '@tanstack/react-query';
import {STALE_TIME_MS, STUDENT} from '@constants/student';
import {apiClient} from './apiClient';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export async function getProducts(): Promise<Product[]> {
  const {data} = await apiClient.get<Product[]>('/products?limit=12');
  if (!Array.isArray(data)) {
    throw new Error('API không trả về danh sách sản phẩm hợp lệ');
  }
  const products = data.filter((item): item is Product =>
    item !== null && typeof item === 'object' &&
    Number.isFinite(item.id) &&
    typeof item.title === 'string' &&
    Number.isFinite(item.price) && item.price >= 0 &&
    typeof item.image === 'string' &&
    typeof item.description === 'string' &&
    typeof item.category === 'string',
  ).slice(0, 12);
  if (products.length === 0) {
    throw new Error('API chưa trả về sản phẩm nào');
  }
  return products;
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find(product => String(product.id) === id);
}

export function useProductsQuery() {
  return useQuery<Product[]>({
    queryKey: ['ktxgo-products', STUDENT.mssv],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });
}
