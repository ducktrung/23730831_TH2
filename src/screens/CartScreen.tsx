import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '@constants/theme';
import {ROOM_LABEL, STUDENT, VARIANT} from '@constants/student';
import {ExamScreen} from '@components/Watermark';
import {useCartStore, type CartLine} from '@stores/cartStore';
import {useLocationStore} from '@stores/locationStore';
import {haversineKm, KTX_GATE, shipFee} from '../utils/shipping';
import {money, unitPrice} from '../utils/format';

export default function CartScreen() {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const changeQty = useCartStore(state => state.changeQty);
  const coords = useLocationStore(state => state.coords);
  const subTotal = items.reduce((sum, row) => sum + unitPrice(row.price) * row.qty, 0);
  const distanceKm = coords ? haversineKm(KTX_GATE, coords) : null;
  const shippingFee = items.length === 0 || distanceKm === null ? null : shipFee(distanceKm);
  const itemView = ({item}: {item: CartLine}) => <View style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.sub}>{money(unitPrice(item.price))} / món</Text>
      <Text style={styles.lineTotal}>{money(unitPrice(item.price) * item.qty)}</Text>
    </View>
    <View style={styles.actions}>
      <View style={styles.qtyControls}>
        <Pressable accessibilityLabel="Giảm số lượng" onPress={() => changeQty(item.id, -1)} style={styles.qtyButton}>
          <Text style={styles.qtyText}>−</Text>
        </Pressable>
        <Text style={styles.qty}>{item.qty}</Text>
        <Pressable accessibilityLabel="Tăng số lượng" onPress={() => changeQty(item.id, 1)} style={styles.qtyButton}>
          <Text style={styles.qtyText}>+</Text>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => removeItem(item.id)} style={styles.remove}>
        <Text style={styles.removeText}>Xoá</Text>
      </Pressable>
    </View>
  </View>;
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ExamScreen>
      <View style={styles.header}><Text style={styles.headerTitle}>GIỎ HÀNG</Text></View>
      <View style={styles.delivery}>
        <Text style={styles.deliveryTitle}>Giao đến {ROOM_LABEL}</Text>
        <Text style={styles.deliverySub}>Đơn hàng của MSSV {STUDENT.mssv}</Text>
      </View>
      <FlatList data={items} keyExtractor={row => `${STUDENT.mssv}-${row.id}`}
        contentContainerStyle={styles.list} renderItem={itemView}
        ListEmptyComponent={<View style={styles.empty}>
          <Text style={styles.emptyIcon}>▣</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.deliverySub}>Chọn món ở tab Cửa hàng để bắt đầu.</Text>
        </View>}/>
      <View style={styles.totals}>
        <View style={styles.row}><Text style={styles.muted}>Tạm tính</Text><Text style={styles.value}>{money(subTotal)}</Text></View>
        <View style={styles.row}>
          <Text style={styles.muted}>Phí ship ({VARIANT.shipFormula})</Text>
          <Text style={styles.ship}>{items.length === 0 ? 'Chưa có hàng' : shippingFee === null ? 'Chưa ước tính phí — mở tab Tôi' : money(shippingFee)}</Text>
        </View>
        {distanceKm !== null && <Text style={styles.distance}>Khoảng cách tới cổng KTX: {distanceKm.toFixed(2)} km</Text>}
        <View style={styles.divider} />
        <View style={styles.row}><Text style={styles.totalTitle}>Tổng đơn</Text>
          <Text style={styles.total}>{money(subTotal + (shippingFee ?? 0))}</Text>
        </View>
        <Text style={styles.noPay}>Không thanh toán online trong bài thi · phí chỉ tính khi có GPS</Text>
      </View>
    </ExamScreen>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},
  header: {height: 52, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'},
  headerTitle: {color: COLORS.surface, fontSize: 16, fontWeight: '900'},
  delivery: {padding: 16, backgroundColor: COLORS.surface, margin: 12, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border},
  deliveryTitle: {fontSize: 14, color: COLORS.text, fontWeight: '800'},
  deliverySub: {fontSize: 12, color: COLORS.textLight, marginTop: 5},
  list: {paddingHorizontal: 12, paddingBottom: 10, flexGrow: 1},
  item: {borderRadius: 12, padding: 13, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface, marginBottom: 10, flexDirection: 'row'},
  itemInfo: {flex: 1, paddingRight: 8},
  title: {fontSize: 13, fontWeight: '800', color: COLORS.text},
  sub: {color: COLORS.textLight, fontSize: 11, marginTop: 6},
  lineTotal: {color: COLORS.primary, fontSize: 13, fontWeight: '800', marginTop: 7},
  actions: {alignItems: 'flex-end', justifyContent: 'space-between'},
  qtyControls: {flexDirection: 'row', alignItems: 'center', gap: 7},
  qtyButton: {backgroundColor: COLORS.pale, borderRadius: 7, width: 27, height: 27,
    justifyContent: 'center', alignItems: 'center'},
  qtyText: {fontSize: 18, color: COLORS.primary, fontWeight: '800'},
  qty: {fontSize: 12, fontWeight: '800', color: COLORS.text},
  remove: {backgroundColor: COLORS.error, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 6},
  removeText: {fontSize: 11, color: COLORS.surface, fontWeight: '800'},
  empty: {flex: 1, minHeight: 170, justifyContent: 'center', alignItems: 'center'},
  emptyIcon: {fontSize: 35, color: COLORS.primary},
  emptyTitle: {color: COLORS.text, fontSize: 15, fontWeight: '800', marginTop: 9},
  totals: {backgroundColor: COLORS.surface, padding: 16, borderTopColor: COLORS.border, borderTopWidth: 1},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6},
  muted: {fontSize: 12, color: COLORS.textLight},
  value: {fontSize: 13, fontWeight: '700', color: COLORS.text},
  ship: {fontSize: 12, fontWeight: '800', color: COLORS.secondary},
  distance: {fontSize: 11, color: COLORS.textLight, marginTop: 2},
  divider: {height: 1, backgroundColor: COLORS.border, marginVertical: 7},
  totalTitle: {fontSize: 16, color: COLORS.text, fontWeight: '800'},
  total: {fontSize: 19, color: COLORS.primary, fontWeight: '900'},
  noPay: {fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 10},
});
