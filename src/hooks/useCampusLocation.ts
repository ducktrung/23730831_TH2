import {useCallback, useRef, useState} from 'react';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useLocationStore} from '@stores/locationStore';
import {haversineKm, KTX_GATE, shipFee, type Coordinate} from '../utils/shipping';

// Only for an explicitly selected emulator demonstration; never report this as real GPS.
const EMULATOR_DEMO_COORDS: Coordinate = {
  latitude: 10.8221589,
  longitude: 106.6868454,
};

type Provider = 'playServices' | 'android';

/** Native location callbacks may not return on some emulators. Enforce our own deadline. */
function readNativePosition(provider: Provider, timeoutMs: number): Promise<Coordinate> {
  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (coords: Coordinate | null, error?: Error) => {
      if (finished) {
        return;
      }
      finished = true;
      clearTimeout(watchdog);
      if (coords) {
        resolve(coords);
      } else {
        reject(error ?? new Error('Không nhận được vị trí từ Android.'));
      }
    };
    const watchdog = setTimeout(() => {
      finish(null, new Error(`${provider}: hết thời gian chờ ${timeoutMs + 1000} ms`));
    }, timeoutMs + 1000);

    try {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        locationProvider: provider,
      });
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
              Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
            finish(null, new Error(`${provider}: tọa độ không hợp lệ`));
            return;
          }
          finish({latitude, longitude});
        },
        error => finish(null, new Error(`${provider} (${error.code}): ${error.message}`)),
        {
          enableHighAccuracy: provider === 'android',
          timeout: timeoutMs,
          maximumAge: 3_600_000,
        },
      );
    } catch (error) {
      finish(null, new Error(`${provider}: ${String(error)}`));
    }
  });
}

export function useCampusLocation() {
  const {coords, source, status, error, setLocation, setStatus} = useLocationStore();
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);
  const requestVersion = useRef(0);
  const distanceKm = coords ? haversineKm(KTX_GATE, coords) : null;
  const shippingFee = distanceKm === null ? null : shipFee(distanceKm);

  const requestLocation = useCallback(async () => {
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;
    const version = ++requestVersion.current;
    let permissionGranted = Platform.OS !== 'android';
    setLoading(true);
    try {
      if (Platform.OS === 'android') {
        const fine = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
        const coarse = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
        let permitted = (await PermissionsAndroid.check(fine)) ||
          (await PermissionsAndroid.check(coarse));
        if (!permitted) {
          const answer = await PermissionsAndroid.request(fine);
          if (version !== requestVersion.current) {
            return;
          }
          if (answer === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            setStatus('blocked', 'Quyền vị trí đã bị chặn. Hãy mở Cài đặt để cấp lại.');
            return;
          }
          permitted = answer === PermissionsAndroid.RESULTS.GRANTED ||
            (await PermissionsAndroid.check(coarse));
          if (!permitted) {
            setStatus('denied', 'Bạn chưa cấp quyền vị trí. Hãy bấm thử lại để xin quyền.');
            return;
          }
        }
        permissionGranted = permitted;
      }
      if (version !== requestVersion.current) {
        return;
      }
      setStatus('granted');
      const attempts: ReadonlyArray<{provider: Provider; timeoutMs: number}> =
        Platform.OS === 'android'
          ? [{provider: 'playServices', timeoutMs: 8000}, {provider: 'android', timeoutMs: 6000}]
          : [{provider: 'android', timeoutMs: 8000}];
      const errors: string[] = [];
      for (const attempt of attempts) {
        try {
          console.log('[KTXGo Location] requesting', attempt.provider);
          const position = await readNativePosition(attempt.provider, attempt.timeoutMs);
          if (version !== requestVersion.current) {
            return;
          }
          console.log('[KTXGo Location] success', attempt.provider, position);
          setLocation(position, 'gps');
          return;
        } catch (locationError) {
          if (version !== requestVersion.current) {
            return;
          }
          const message = String(locationError);
          console.warn('[KTXGo Location] provider failed:', message);
          errors.push(message);
        }
      }
      setStatus(
        'granted',
        'Đã cấp quyền nhưng Android chưa trả tọa độ. Hãy bật Location trên Emulator, thử lại hoặc chọn vị trí mô phỏng. ' +
          errors.join('; '),
      );
    } catch (unexpected) {
      if (version === requestVersion.current) {
        // Do not label permission 'granted' if the permission check itself failed.
        setStatus(permissionGranted ? 'granted' : 'denied',
          `Lỗi khi lấy vị trí hoặc kiểm tra quyền: ${String(unexpected)}`);
      }
    } finally {
      if (version === requestVersion.current) {
        inFlight.current = false;
        setLoading(false);
      }
    }
  }, [setLocation, setStatus]);

  // Explicit mock is acceptable for the emulator demonstration in the TH2 instructions.
  const useMockLocation = useCallback(() => {
    requestVersion.current += 1; // Ignore any late native callbacks from previous attempts.
    inFlight.current = false;
    setLoading(false);
    setLocation(EMULATOR_DEMO_COORDS, 'mock');
  }, [setLocation]);

  const openSettings = useCallback(() => Linking.openSettings(), []);
  return {
    coords, source, status, error, loading, distanceKm, shippingFee,
    requestLocation, useMockLocation, openSettings,
  };
}
