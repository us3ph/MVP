import { useWatch } from 'react-hook-form';
import ValidatorsChain from '../missions/ValidatorsChain';
import CostBreakdown from '../missions/CostBreakdown';
import { estimateLines, sumMAD } from '../../lib/costing';

// Last card « Aperçu »: validators of the circuit and the live estimated cost of what is typed above.
export default function StepValidation({ referentials: ref }) {
  const m = useWatch();
  const lines = estimateLines(m, ref);
  return (
    <div className="stack">
      <div>
        <div className="fsec-title">Validateurs</div>
        <ValidatorsChain steps={ref.validatorChains[m.kind] || []} validators={m.validators || []} />
      </div>
      <CostBreakdown title="Coût global estimé de la mission" total={sumMAD(lines, ref.rates)} lines={lines} defaultOpen />
    </div>
  );
}
