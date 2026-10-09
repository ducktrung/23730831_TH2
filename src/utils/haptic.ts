import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {VARIANT} from '@constants/student';

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
