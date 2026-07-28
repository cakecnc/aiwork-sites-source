export default function ProductMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`product-mark ${className}`.trim()}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" focusable="false">
        <rect className="product-mark-field" x="4" y="4" width="56" height="56" />
        <path className="product-mark-a" d="M15 45 27 18h5l12 27M20 35h19" />
        <rect className="product-mark-node" x="46" y="17" width="7" height="7" />
        <rect className="product-mark-node" x="46" y="31" width="7" height="7" />
      </svg>
    </span>
  );
}
