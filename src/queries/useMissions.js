import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import { qk } from './keys';

export function useMissions() {
  return useQuery({ queryKey: qk.missions, queryFn: api.listMissions });
}

export function useMission(id) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: qk.mission(id),
    queryFn: () => api.getMission(id),
    enabled: !!id,
    // Show the row from the list straight away while the detail loads.
    placeholderData: () => qc.getQueryData(qk.missions)?.find((m) => m.id === id),
  });
}

// Every change to an order invalidates the list, the detail and the notes de frais that depend on it.
export function useMissionMutations() {
  const qc = useQueryClient();
  const onSuccess = () => Promise.all([qc.invalidateQueries({ queryKey: qk.missions }), qc.invalidateQueries({ queryKey: qk.expenseReports })]);
  const save = useMutation({ mutationFn: (mission) => api.saveMission(mission), onSuccess });
  const submit = useMutation({ mutationFn: (id) => api.submitMission(id), onSuccess });
  const remove = useMutation({ mutationFn: (id) => api.deleteMission(id), onSuccess });
  const recall = useMutation({ mutationFn: (id) => api.recallMission(id), onSuccess });
  const cancel = useMutation({ mutationFn: ({ id, reason }) => api.cancelMission(id, reason), onSuccess });
  const addRetrocession = useMutation({ mutationFn: ({ id, currency, amount, receipt }) => api.addRetrocession(id, { currency, amount, receipt }), onSuccess });
  const declineRetrocession = useMutation({ mutationFn: (id) => api.declineRetrocession(id), onSuccess });
  const saveReport = useMutation({ mutationFn: ({ id, report }) => api.saveReport(id, report), onSuccess });
  const skipReport = useMutation({ mutationFn: (id) => api.skipReport(id), onSuccess });
  const declineExpenses = useMutation({ mutationFn: (id) => api.declineExpenses(id), onSuccess });
  const downloadPdf = useMutation({ mutationFn: (id) => api.downloadMissionPdf(id) });
  return { save, submit, remove, recall, cancel, addRetrocession, declineRetrocession, saveReport, skipReport, declineExpenses, downloadPdf };
}
