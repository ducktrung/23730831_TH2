import {create} from 'zustand';
import type {Coordinate} from '../utils/shipping';

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';
export type LocationSource = 'gps' | 'mock';
type LocationState = {
  coords: Coordinate | null;
  source: LocationSource | null;
  status: PermissionStatus;
  error: string | null;
  setLocation: (coords: Coordinate, source?: LocationSource) => void;
  setStatus: (status: PermissionStatus, error?: string | null) => void;
};

export const useLocationStore = create<LocationState>(set => ({
  coords: null,
  source: null,
  status: 'idle',
  error: null,
  setLocation: (coords, source = 'gps') => set({coords, source, status: 'granted', error: null}),
  setStatus: (status, error = null) => set(state => ({
    status,
    error,
    coords: status === 'granted' ? state.coords : null,
    source: status === 'granted' ? state.source : null,
  })),
}));
