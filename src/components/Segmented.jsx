/** Segmented control (the original `.segmented` buttons), with aria-pressed. */
export default function Segmented({ id, ariaLabel, options, value, onChange }) {
  return (
    <div className="segmented" id={id} role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={o.value === value ? 'active' : ''}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
