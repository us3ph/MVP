import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import { qk } from './keys';

export function useExpenseReports() {
  return useQuery({ queryKey: qk.expenseReports, queryFn: api.listExpenseReports });
}

export function useExpenseReportMutations() {
  const qc = useQueryClient();
  const done = () => Promise.all([qc.invalidateQueries({ queryKey: qk.expenseReports }), qc.invalidateQueries({ queryKey: qk.missions })]);
  return {
    save: useMutation({ mutationFn: (report) => api.saveExpenseReport(report), onSuccess: done }),
    submit: useMutation({ mutationFn: (id) => api.submitExpenseReport(id), onSuccess: done }),
    downloadPdf: useMutation({ mutationFn: (id) => api.downloadExpenseReportPdf(id) }),
  };
}
