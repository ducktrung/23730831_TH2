import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '@constants/theme';
import type {Product} from '@services/productApi';
import {money, unitPrice} from '../utils/format';

export function ProductCard({product, onOpen, onAdd}: {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return <View style={styles.card}>
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Chi tiết ${product.title}`}>
      <View style={styles.imageBox}>
        <Image source={{uri: product.image}} resizeMode="contain" style={styles.image} />
      </View>
      <Text numberOfLines={2} style={styles.title}>{product.title}</Text>
    </Pressable>
    <View style={styles.foot}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.price}>
        {money(unitPrice(product.price))}
      </Text>
      <Pressable onPress={onAdd} style={styles.add} accessibilityRole="button" accessibilityLabel={`Thêm ${product.title}`}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  card: {flex: 1, backgroundColor: COLORS.surface, borderRadius: 15, padding: 11,
    marginHorizontal: 5, marginVertical: 6, borderColor: COLORS.border, borderWidth: 1,
    minHeight: 218, elevation: 1},
  imageBox: {height: 121, borderRadius: 12, backgroundColor: COLORS.background, overflow: 'hidden', marginBottom: 9},
  image: {width: '100%', height: '100%'},
  title: {fontSize: 13, fontWeight: '700', color: COLORS.text, lineHeight: 18, minHeight: 37},
  foot: {flexDirection: 'row', alignItems: 'center', marginTop: 7},
  price: {color: COLORS.primary, fontSize: 13, fontWeight: '800', flex: 1},
  add: {width: 31, height: 31, backgroundColor: COLORS.primary, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', marginLeft: 5},
  plus: {color: COLORS.surface, fontSize: 21, fontWeight: '700', marginTop: -2},
});
