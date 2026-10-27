// Dates that the « Transports » and « Hébergement » rows take from the steps before them, so the user
// does not type the same dates three times:
// - the outbound leg (the first) leaves and arrives on the mission's start date;
// - the return leg (the last one, when there are two or more) leaves and arrives on its end date;
// - the stay runs from the outbound arrival to the return departure, or over the mission dates when
//   those legs are missing. With several lodgings, the first check-in and the last check-out.
// Every date stays editable: a field follows its source only while the user has not changed it.

// Check-in and check-out a new lodging starts with.
export function stayDates(values) {
  const legs = values.transports || [];
  const back = legs.length > 1 ? legs[legs.length - 1] : null;
  return { checkIn: legs[0]?.arriveDate || values.startDate || '', checkOut: back?.departDate || values.endDate || '' };
}

// The linked fields, by form path, with the value each one takes from its source.
export function linkedDates(values) {
  const legs = values.transports || [];
  const lodgings = values.lodgings || [];
  const out = {};
  if (legs.length) {
    out['transports.0.departDate'] = values.startDate || '';
    out['transports.0.arriveDate'] = values.startDate || '';
  }
  if (legs.length > 1) {
    const last = legs.length - 1;
    out[`transports.${last}.departDate`] = values.endDate || '';
    out[`transports.${last}.arriveDate`] = values.endDate || '';
  }
  if (lodgings.length) {
    const stay = stayDates(values);
    out['lodgings.0.checkIn'] = stay.checkIn;
    out[`lodgings.${lodgings.length - 1}.checkOut`] = stay.checkOut;
  }
  return out;
}

const read = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const write = (obj, path, value) => {
  const [head, ...rest] = path.split('.');
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = rest.length ? write(obj[head] ?? {}, rest.join('.'), value) : value;
  return copy;
};

// What to fill in now. A linked field is updated when it is empty, or when it still holds the value it
// was given last time (`previous`, the result of the previous call): then the user has not touched it.
// A source left empty never clears a field. Returns the fields to set and the new `previous`.
export function datesToFill(values, previous = {}) {
  let current = values;
  const changes = {};
  let next = linkedDates(current);
  // A second pass carries a leg date just filled on to the lodging that follows it.
  for (let pass = 0; pass < 3; pass += 1) {
    let changed = false;
    for (const [path, value] of Object.entries(next)) {
      const now = read(current, path) || '';
      if (value && now !== value && (!now || now === previous[path])) {
        changes[path] = value;
        current = write(current, path, value);
        changed = true;
      }
    }
    if (!changed) break;
    next = linkedDates(current);
  }
  return { changes, next };
}
