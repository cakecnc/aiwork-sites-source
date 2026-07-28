import Image from "next/image";

export default function CompanyLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`company-logo ${className}`.trim()}
      aria-hidden="true"
    >
      <Image
        className="company-logo-image"
        src="/images/cnc-company-logo.png"
        alt=""
        width="1206"
        height="623"
        unoptimized
      />
    </span>
  );
}
