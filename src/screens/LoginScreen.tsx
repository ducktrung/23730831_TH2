import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BANNER_IMAGE_ID, ROOM_LABEL, STUDENT, VARIANT} from '@constants/student';
import {COLORS} from '@constants/theme';
import {ExamScreen} from '@components/Watermark';
import {useAuthStore} from '@stores/authStore';

export default function LoginScreen() {
  const [identity, setIdentity] = useState('');
  const login = useAuthStore(state => state.login);
  const isPhone = VARIANT.authField === 'phone';
  const submit = () => {
    const value = identity.trim();
    if (!value) {
      Alert.alert('Thông tin chưa hợp lệ', isPhone ? 'Vui lòng nhập số điện thoại.' : 'Vui lòng nhập email.');
      return;
    }
    login();
  };
  return <SafeAreaView style={styles.safe}>
    <ExamScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <View style={styles.icon}><Text style={styles.bag}>▣</Text></View>
        <Text style={styles.brand}>KTXGO</Text>
        <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>
        <Text style={styles.caption}>Đặt hàng nhanh · Giao tận {ROOM_LABEL}</Text>
        <View style={styles.form}>
          <Text style={styles.label}>{isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên'}</Text>
          <TextInput
            style={styles.input}
            value={identity}
            onChangeText={setIdentity}
            placeholder={isPhone ? `Số điện thoại · MSSV ${STUDENT.mssv}` : `Email sinh viên · MSSV ${STUDENT.mssv}`}
            placeholderTextColor={COLORS.textLight}
            keyboardType={isPhone ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            accessibilityLabel={isPhone ? 'Số điện thoại' : 'Email'}
          />
          <Pressable onPress={submit} style={styles.button} accessibilityRole="button">
            <Text style={styles.buttonText}>Vào cửa hàng  →</Text>
          </Pressable>
          <Text style={styles.note}>Auth Stack · chưa có token · Mã ảnh {BANNER_IMAGE_ID}</Text>
        </View>
        <Text style={styles.student}>{STUDENT.mssv} · KTXGo TH2</Text>
      </KeyboardAvoidingView>
    </ExamScreen>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 26},
  icon: {width: 75, height: 75, backgroundColor: COLORS.pale, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center', marginBottom: 13},
  bag: {color: COLORS.primary, fontSize: 40, fontWeight: '900'},
  brand: {fontSize: 35, fontWeight: '900', letterSpacing: 1.5, color: COLORS.primary},
  subtitle: {fontSize: 16, color: COLORS.text, fontWeight: '600', marginTop: 7},
  caption: {fontSize: 12, color: COLORS.textLight, marginTop: 6},
  form: {width: '100%', marginTop: 35},
  label: {fontSize: 13, color: COLORS.text, fontWeight: '800', marginBottom: 9},
  input: {height: 51, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, paddingHorizontal: 15, fontSize: 14, color: COLORS.text},
  button: {height: 52, backgroundColor: COLORS.primary, borderRadius: 12, marginTop: 14,
    justifyContent: 'center', alignItems: 'center', elevation: 2},
  buttonText: {color: COLORS.surface, fontSize: 15, fontWeight: '800'},
  note: {textAlign: 'center', fontSize: 11, color: COLORS.textLight, marginTop: 15},
  student: {color: COLORS.textLight, fontSize: 11, marginTop: 38},
});
