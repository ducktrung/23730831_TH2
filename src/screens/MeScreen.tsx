import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '@constants/theme';
import {BASE_SHIP_FEE, ROOM_LABEL, STUDENT, VARIANT, examStamp} from '@constants/student';
import {ExamScreen} from '@components/Watermark';
import {useAuthStore} from '@stores/authStore';
import {useCampusLocation} from '@hooks/useCampusLocation';
import {money} from '../utils/format';

export default function MeScreen() {
  const logout = useAuthStore(state => state.logout);
  const token = useAuthStore(state => state.token);
  const shortToken = token ? `${token.slice(0, 14)}…${token.slice(-6)}` : 'Chưa đăng nhập';
  const {coords, source, status, error, loading, distanceKm, shippingFee, requestLocation, useMockLocation, openSettings} = useCampusLocation();
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ExamScreen>
      <View style={styles.header}><Text style={styles.headerTitle}>TÔI · LOCATION</Text></View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.avatar}><Text style={styles.avatarIcon}>●</Text></View>
        <Text style={styles.name}>{STUDENT.hoTen}</Text>
        <Text style={styles.id}>{STUDENT.mssv} · #{examStamp()}</Text>
        <Text style={styles.room}>Giao tận phòng {ROOM_LABEL}</Text>
        <Text style={styles.token}>Token: {shortToken}</Text>
        <View style={styles.card}>
          <Text style={styles.section}>VỊ TRÍ & PHÍ GIAO HÀNG</Text>
          <Text style={[styles.status, status === 'granted' ? styles.granted :
            status === 'blocked' ? styles.blocked : styles.denied]}>
            Quyền: {status}
          </Text>
          {coords ? <>
            <Text style={styles.detail}>Vĩ độ: {coords.latitude.toFixed(6)}</Text>
            <Text style={styles.detail}>Nguồn: {source === 'mock' ? 'Tọa độ mô phỏng (kiểm thử)' : 'Android Location'}</Text>
            <Text style={styles.detail}>Kinh độ: {coords.longitude.toFixed(6)}</Text>
            <Text style={styles.detail}>≈ {distanceKm?.toFixed(2)} km tới cổng KTX</Text>
            <Text style={styles.price}>{shippingFee !== null ? money(shippingFee) : 'Chưa có phí'}</Text>
          </> : <Text style={styles.detail}>Chưa có vị trí. Bấm nút bên dưới để xin quyền GPS.</Text>}
          {!!error && <Text style={styles.error}>{error}</Text>}
          {status === 'denied' && <Text style={styles.detail}>Bạn có thể bấm lấy vị trí lần nữa để xin lại quyền.</Text>}
          <Text style={styles.formula}>Công thức {VARIANT.shipFormula} · Phí gốc {money(BASE_SHIP_FEE)}</Text>
        </View>
        <Pressable style={styles.button} disabled={loading} onPress={() => {void requestLocation();}}>
          <Text style={styles.buttonText}>{loading ? 'Đang lấy tọa độ...' : 'Lấy vị trí ước tính ship'}</Text>
        </Pressable>
        {status === 'granted' && !coords && !loading && <Pressable
          accessibilityRole="button" style={styles.outline} onPress={useMockLocation}>
          <Text style={styles.outlineText}>Dùng vị trí mô phỏng (Emulator)</Text>
        </Pressable>}
        {status === 'blocked' && <Pressable style={styles.outline} onPress={() => {void openSettings();}}>
          <Text style={styles.outlineText}>Mở Cài đặt (blocked)</Text>
        </Pressable>}
        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </Pressable>
        <Text style={styles.tip}>GPS máy ảo có thể đặt vị trí giả trong Extended Controls. Không dùng thanh toán online.</Text>
      </ScrollView>
    </ExamScreen>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},
  header: {backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', height: 52},
  headerTitle: {color: COLORS.surface, fontSize: 15, fontWeight: '900'},
  body: {padding: 20, paddingBottom: 30, alignItems: 'stretch'},
  avatar: {backgroundColor: COLORS.pale, borderRadius: 45, width: 70, height: 70,
    justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 8},
  avatarIcon: {color: COLORS.primary, fontSize: 45, marginTop: -10},
  name: {textAlign: 'center', fontSize: 17, fontWeight: '900', color: COLORS.text, marginTop: 11},
  id: {textAlign: 'center', color: COLORS.textLight, fontSize: 12, marginTop: 6},
  room: {textAlign: 'center', color: COLORS.primary, fontSize: 12, fontWeight: '700', marginTop: 8},
  token: {textAlign: 'center', color: COLORS.textLight, fontSize: 11, marginTop: 5},
  card: {marginTop: 22, backgroundColor: COLORS.surface, padding: 17, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border},
  section: {fontSize: 12, fontWeight: '800', color: COLORS.text, marginBottom: 10},
  status: {fontWeight: '800', fontSize: 13, marginVertical: 5},
  granted: {color: COLORS.success}, denied: {color: COLORS.textLight}, blocked: {color: COLORS.error},
  detail: {fontSize: 12, lineHeight: 20, color: COLORS.textLight, marginTop: 2},
  price: {fontSize: 23, color: COLORS.secondary, fontWeight: '900', marginTop: 9},
  formula: {fontSize: 10, color: COLORS.textLight, marginTop: 10},
  error: {color: COLORS.error, fontSize: 11, marginTop: 8},
  button: {backgroundColor: COLORS.primary, borderRadius: 11, paddingVertical: 14, marginTop: 17,
    alignItems: 'center'},
  buttonText: {color: COLORS.surface, fontSize: 14, fontWeight: '800'},
  outline: {borderColor: COLORS.primary, borderWidth: 1, borderRadius: 11,
    paddingVertical: 13, marginTop: 10, alignItems: 'center'},
  outlineText: {color: COLORS.primary, fontSize: 14, fontWeight: '800'},
  logout: {backgroundColor: COLORS.error, borderRadius: 11, paddingVertical: 14, marginTop: 16,
    alignItems: 'center'},
  tip: {marginTop: 17, fontSize: 11, color: COLORS.textLight, textAlign: 'center', lineHeight: 17},
});
