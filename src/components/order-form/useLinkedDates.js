import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { datesToFill } from '../../lib/linkedDates';

// Keeps the transport and lodging dates in step with the mission dates (see lib/linkedDates): rows
// get their dates even when they were added before the mission dates were chosen, and follow later
// changes of those dates until the user edits them.
export default function useLinkedDates(form) {
  const { control, getValues, setValue, getFieldState } = form;
  const [startDate, endDate, transports, lodgings] = useWatch({ control, name: ['startDate', 'endDate', 'transports', 'lodgings'] });
  // Re-run only when one of the dates involved changes, or rows are added or removed.
  const key = JSON.stringify([startDate, endDate, (transports || []).map((l) => [l?.departDate, l?.arriveDate]), (lodgings || []).map((l) => [l?.checkIn, l?.checkOut])]);
  const previous = useRef({});
  useEffect(() => {
    const { changes, next } = datesToFill(getValues(), previous.current);
    previous.current = next;
    for (const [path, value] of Object.entries(changes)) {
      setValue(path, value, { shouldDirty: true, shouldValidate: !!getFieldState(path).error });
    }
  }, [key, getValues, setValue, getFieldState]);
}
