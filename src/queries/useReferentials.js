import { useQuery } from '@tanstack/react-query';
import * as api from '../api';
import { qk } from './keys';

export function useReferentials() {
  return useQuery({ queryKey: qk.referentials, queryFn: api.getReferentials, staleTime: Infinity });
}

export function useCities(countryCode) {
  return useQuery({ queryKey: qk.cities(countryCode), queryFn: () => api.listCities(countryCode), enabled: !!countryCode, staleTime: Infinity });
}
