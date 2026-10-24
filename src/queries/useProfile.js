import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import { qk } from './keys';

export function useProfile() {
  return useQuery({ queryKey: qk.profile, queryFn: api.getProfile, staleTime: 5 * 60_000 });
}

export function useDelegations() {
  return useQuery({ queryKey: qk.delegations, queryFn: api.listDelegations });
}

export function useProfileMutations() {
  const qc = useQueryClient();
  return {
    update: useMutation({ mutationFn: (profile) => api.updateProfile(profile), onSuccess: () => qc.invalidateQueries({ queryKey: qk.profile }) }),
    changePassword: useMutation({ mutationFn: (data) => api.changePassword(data) }),
    saveDelegation: useMutation({ mutationFn: (d) => api.saveDelegation(d), onSuccess: () => qc.invalidateQueries({ queryKey: qk.delegations }) }),
    deleteDelegation: useMutation({ mutationFn: (id) => api.deleteDelegation(id), onSuccess: () => qc.invalidateQueries({ queryKey: qk.delegations }) }),
  };
}
