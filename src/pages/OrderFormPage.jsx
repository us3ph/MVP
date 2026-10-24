import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading';
import OrderWizard from '../components/order-form/OrderWizard';
import { WIZARD_TITLES } from '../components/order-form/defaults';
import { useHeader } from '../app/header';
import { useMission, useMissions, useProfile, useReferentials } from '../queries';
import { KIND_LABEL } from '../domain/constants';
import { isSameYear } from 'date-fns';
import { parseISO } from '../lib/format';
import { estimatedCost } from '../lib/costing';

// /ordre/new/:kind — /ordre/edit/:id — /ordre/extend/:id — /ordre/reduce/:id
export default function OrderFormPage() {
  const { kind: kindParam, mode: modeParam, id } = useParams();
  const mode = modeParam || 'new';
  const { data: ref } = useReferentials();
  const { data: profile } = useProfile();
  const { data: source } = useMission(id);
  const { data: missions = [] } = useMissions();
  const kind = source?.kind || kindParam;
  useHeader(WIZARD_TITLES[mode] || WIZARD_TITLES.new, KIND_LABEL[kind] || '');
  if (!ref || !profile || (id && !source)) return <Loading />;
  // « Total des missions antérieures »: validated or archived orders of the current year.
  const previousTotal = missions.filter((m) => ['validated', 'archived'].includes(m.status) && m.startDate && isSameYear(parseISO(m.startDate), new Date())).reduce((s, m) => s + estimatedCost(m, ref), 0);
  return <OrderWizard key={`${mode}-${source?.id || kind}`} mode={mode} kind={kind} source={source} referentials={ref} profile={profile} previousTotal={previousTotal} />;
}
