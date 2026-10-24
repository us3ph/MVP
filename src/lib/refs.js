// Lookups in the referentials (labels for the codes stored on missions, profiles, delegations).
export const countryName = (ref, code) => ref?.countries?.find((c) => c.code === code)?.label || code || '';
export const entityLabel = (ref, code) => ref?.entities?.find((e) => e.code === code)?.label || code || '';
export const controllerOf = (ref, code) => ref?.entities?.find((e) => e.code === code)?.controller?.name || '';
export const person = (ref, id) => ref?.people?.find((p) => p.id === id);
export const personName = (ref, id) => {
  const p = person(ref, id);
  return p ? `${p.firstName} ${p.lastName}` : id || '';
};
export const peopleOptions = (ref) => (ref?.people || []).map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName}`, sub: p.email }));
export const delegationActionLabel = (ref, code) => ref?.delegationActions?.find((a) => a.code === code)?.label || code;
export const cityOptions = (cities, countryLabel) => (cities || []).map((c) => ({ value: c.name, label: countryLabel ? `${c.name} - ${countryLabel.toUpperCase()}` : c.name }));
