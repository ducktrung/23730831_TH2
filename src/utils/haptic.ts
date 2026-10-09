import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {VARIANT} from '@constants/student';

// TH2 variant uses the abstract value "impact"; map it to the library API.
// MSSV 23730831 resolves to "selection".
export function hapticOnAdd(): void {
  const kind = VARIANT.hapticOnAdd === 'impact' ? 'impactLight' : 'selection';
  try {
    ReactNativeHapticFeedback.trigger(kind, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch (error) {
    console.warn('[KTXGo] Haptic unavailable on this device:', error);
  }
}
