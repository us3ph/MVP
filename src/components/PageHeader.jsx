export default function PageHeader({ title, subtitle }) {
  return (
    <div className="hdr">
      <div>
        <h1>{title}</h1>
        <div className="hsub">{subtitle}</div>
      </div>
      <div className="brand" aria-label="UM6P" title="UM6P">
        {['U', 'M', '6', 'P'].map((ch) => (
          <span key={ch} className="brand-ch" aria-hidden="true">
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
