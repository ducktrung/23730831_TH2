import React from 'react';
import {ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {COLORS} from '@constants/theme';
import {ROOM_LABEL, STUDENT} from '@constants/student';
import {ExamScreen} from '@components/Watermark';
import {getProductById, useProductsQuery} from '@services/productApi';
import {useCartStore} from '@stores/cartStore';
import {money, unitPrice} from '../utils/format';
import {hapticOnAdd} from '../utils/haptic';
import type {ShopStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<ShopStackParamList, 'Detail'>;
export default function DetailScreen({navigation, route}: Props) {
  const addItem = useCartStore(state => state.addItem);
  const {data, isPending, isError, refetch} = useProductsQuery();
  const product = getProductById(data ?? [], route.params.id);
  const addToCart = () => {
    if (!product) {return;}
    addItem(product);
    hapticOnAdd();
    Alert.alert('KTXGo · thêm vào giỏ', `${STUDENT.mssv} · Đã thêm ${product.title} vào giỏ.`);
  };
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ExamScreen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.back}>‹  Quay lại</Text></Pressable>
        <Text style={styles.headerTitle}>CHI TIẾT SẢN PHẨM</Text>
      </View>
      {isPending ? <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View> :
        isError || !product ? <View style={styles.center}>
          <Text style={styles.error}>Không tải được sản phẩm #{route.params.id}.</Text>
          <Pressable onPress={() => {void refetch();}} style={styles.button}><Text style={styles.buttonText}>Thử lại</Text></Pressable>
        </View> : <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.imageBox}><Image source={{uri: product.image}} resizeMode="contain" style={styles.image} /></View>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{money(unitPrice(product.price))}</Text>
          <View style={styles.chip}><Text style={styles.chipText}>Giao nội khu · {ROOM_LABEL}</Text></View>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.footNote}>ID: {route.params.id} · {STUDENT.mssv}</Text>
          <Pressable onPress={addToCart} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>+  Thêm vào giỏ</Text>
          </Pressable>
        </ScrollView>}
    </ExamScreen>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},
  header: {backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 17, height: 52, borderBottomColor: COLORS.border, borderBottomWidth: 1},
  back: {fontSize: 14, color: COLORS.primary, fontWeight: '700'},
  headerTitle: {color: COLORS.text, fontSize: 13, fontWeight: '800', marginLeft: 22},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30},
  body: {padding: 20, paddingBottom: 35, alignItems: 'center'},
  imageBox: {height: 220, width: '100%', backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, padding: 18, overflow: 'hidden'},
  image: {height: '100%', width: '100%'},
  title: {textAlign: 'center', color: COLORS.text, fontSize: 18, fontWeight: '800', marginTop: 22},
  price: {fontSize: 23, fontWeight: '900', color: COLORS.primary, marginTop: 10},
  chip: {backgroundColor: COLORS.pale, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 18, marginTop: 12},
  chipText: {color: COLORS.text, fontSize: 12, fontWeight: '700'},
  description: {alignSelf: 'stretch', marginTop: 22, color: COLORS.textLight,
    fontSize: 13, lineHeight: 21},
  footNote: {marginTop: 12, color: COLORS.textLight, fontSize: 11},
  button: {backgroundColor: COLORS.primary, borderRadius: 11, minHeight: 49,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', marginTop: 24, paddingHorizontal: 12},
  buttonText: {color: COLORS.surface, fontSize: 14, fontWeight: '800'},
  error: {color: COLORS.error, fontWeight: '700', textAlign: 'center'},
});
