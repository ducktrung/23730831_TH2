import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {STUDENT, VARIANT, examStamp} from '@constants/student';
import {COLORS} from '@constants/theme';

export function Watermark() {
  return <View style={styles.container}>
    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
      {`TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`}
    </Text>
  </View>;
}
export function ExamScreen({children}: {children: React.ReactNode}) {
  return <View style={styles.fill}>
    {VARIANT.watermarkAtTop && <Watermark />}
    <View style={styles.fill}>{children}</View>
    {!VARIANT.watermarkAtTop && <Watermark />}
  </View>;
}
const styles = StyleSheet.create({
  fill: {flex: 1},
  container: {backgroundColor: COLORS.pale, borderColor: COLORS.border,
    borderTopWidth: 1, borderBottomWidth: 1, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8},
  label: {color: COLORS.text, fontSize: 10, fontWeight: '700', letterSpacing: 0.05},
});
