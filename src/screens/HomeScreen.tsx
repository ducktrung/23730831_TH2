import React, {useMemo, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {COLORS} from '@constants/theme';
import {DEBOUNCE_MS, ROOM_LABEL, STUDENT} from '@constants/student';
import {useDebouncedValue} from '@hooks/useDebouncedValue';
import {useProductsQuery} from '@services/productApi';
import type {Product} from '@services/productApi';
import {useCartStore} from '@stores/cartStore';
import {ProductCard} from '@components/ProductCard';
import {ExamScreen} from '@components/Watermark';
import {hapticOnAdd} from '../utils/haptic';
import type {ShopStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<ShopStackParamList, 'Home'>;
export default function HomeScreen({navigation}: Props) {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, DEBOUNCE_MS);
  const addItem = useCartStore(state => state.addItem);
  const {data = [], isPending, isError, error, refetch, isRefetching} = useProductsQuery();
  const products = useMemo(() => data.filter(product =>
    `${product.title} ${product.category}`.toLowerCase().includes(debounced.trim().toLowerCase())
  ), [data, debounced]);
  const onAdd = (product: Product) => {addItem(product); hapticOnAdd();};
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ExamScreen>
      <View style={styles.header}>
        <View><Text style={styles.brand}>KTXGO</Text><Text style={styles.subtitle}>Giao tận {ROOM_LABEL}</Text></View>
        <View style={styles.tag}><Text style={styles.tagText}>TH2 · {STUDENT.mssv}</Text></View>
      </View>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput style={styles.input} value={search} onChangeText={setSearch}
          placeholder="Tìm sản phẩm..." placeholderTextColor={COLORS.textLight}
          accessibilityLabel="Tìm sản phẩm" />
        {!!search && <Pressable onPress={() => setSearch('')}><Text style={styles.clear}>×</Text></Pressable>}
      </View>
      <View style={styles.filterLine}>
        <Text style={styles.filterText}>Gợi ý cho phòng {ROOM_LABEL}</Text>
        <Text style={styles.filterText}>{products.length} sản phẩm</Text>
      </View>
      {isPending ? <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.helpText}>Đang tải sản phẩm...</Text>
      </View> : isError ? <View style={styles.center}>
        <Text style={styles.errorId}>{STUDENT.mssv}</Text>
        <Text style={styles.helpText}>Không tải được danh sách sản phẩm.</Text>
        <Text style={styles.errorSmall}>{String(error?.message || 'Lỗi kết nối')}</Text>
        <Pressable onPress={() => {void refetch();}} style={styles.retry}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View> : <FlashList<Product>
        data={products}
        numColumns={2}
        estimatedItemSize={238}
        keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
        renderItem={({item}) => <ProductCard product={item}
          onOpen={() => navigation.navigate('Detail', {id: String(item.id)})}
          onAdd={() => onAdd(item)} />}
        refreshControl={<RefreshControl refreshing={isRefetching}
          onRefresh={() => {void refetch();}} tintColor={COLORS.primary} />}
        ListEmptyComponent={<View style={styles.center}><Text style={styles.helpText}>Không tìm thấy sản phẩm.</Text></View>}
        contentContainerStyle={styles.grid}
      />}
    </ExamScreen>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},
  header: {backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  brand: {fontSize: 23, fontWeight: '900', color: COLORS.surface, letterSpacing: 1},
  subtitle: {fontSize: 12, color: '#DBEAFE', marginTop: 4},
  tag: {backgroundColor: '#1E40AF', padding: 8, borderRadius: 8},
  tagText: {color: '#FFFFFF', fontSize: 10, fontWeight: '600'},
  searchBox: {marginHorizontal: 14, marginTop: 13, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 11, paddingHorizontal: 12, height: 48},
  searchIcon: {color: COLORS.primary, fontSize: 25, marginRight: 7},
  input: {flex: 1, fontSize: 14, color: COLORS.text, padding: 0},
  clear: {color: COLORS.textLight, fontSize: 22, paddingHorizontal: 6},
  filterLine: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18,
    paddingVertical: 11},
  filterText: {color: COLORS.textLight, fontSize: 11, fontWeight: '600'},
  grid: {paddingHorizontal: 9, paddingBottom: 12},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28},
  helpText: {marginTop: 13, color: COLORS.text, fontSize: 15, textAlign: 'center', fontWeight: '700'},
  errorId: {fontSize: 18, color: COLORS.error, fontWeight: '800'},
  errorSmall: {marginTop: 10, color: COLORS.textLight, fontSize: 11, textAlign: 'center'},
  retry: {backgroundColor: COLORS.error, marginTop: 18, paddingHorizontal: 42, paddingVertical: 12, borderRadius: 10},
  retryText: {color: COLORS.surface, fontSize: 14, fontWeight: '800'},
});
